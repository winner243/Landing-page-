import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  contentExamples,
  formatZodIssues,
  getContentGuidance,
  heroContentSchema,
  landingContentSchema,
  logoCloudSchema,
  navbarSchema,
  parseLandingContent,
  parseOrThrow,
  renderGuidanceMarkdown,
  sectionHeaderSchema,
  validateContent,
} from "@landing/copywriting";
import type { ContentExampleKey } from "@landing/copywriting";

const GUIDANCE_PATH = path.join(process.cwd(), "docs/CONTENT-GUIDANCE.md");

describe("Example content sets (Roadmap 3.1.4)", () => {
  it.each(Object.keys(contentExamples) as ContentExampleKey[])(
    "%s example validates against the page schema",
    (key) => {
      expect(() => parseLandingContent(contentExamples[key])).not.toThrow();
    },
  );

  it("covers every optional page section across the four sets", () => {
    const sections = [
      "nav",
      "logoCloud",
      "trust",
      "benefits",
      "cta",
      "footer",
      "testimonials",
      "plans",
      "faq",
      "stats",
    ] as const;
    for (const section of sections) {
      const covered = Object.values(contentExamples).some(
        (example) => example[section] !== undefined,
      );
      expect(covered, `section "${section}" is never exercised`).toBe(true);
    }
  });

  it("rejects copy that violates the word limits", () => {
    const result = validateContent({
      ...contentExamples.b2b,
      hero: {
        ...contentExamples.b2b.hero,
        headline: "this headline is far far far too long to be understood by anyone reading it",
      },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join("\n")).toContain("hero.headline");
    }
  });
});

describe("Validation utilities (Roadmap 3.1.2)", () => {
  it("formatZodIssues returns path: message lines", () => {
    const parsed = heroContentSchema.safeParse({
      headline: "way way way way way way way way too many words here",
      primaryCta: { label: "ok", href: "/x", trackId: "t" },
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const lines = formatZodIssues(parsed.error);
      expect(lines.length).toBeGreaterThan(0);
      expect(lines[0]).toMatch(/^hero|^headline|^/);
      expect(lines[0]).toContain(":");
    }
  });

  it("parseOrThrow labels the failing content", () => {
    expect(() => parseOrThrow(logoCloudSchema, { logos: [] }, "logo cloud")).toThrow(
      /Invalid logo cloud/,
    );
  });

  it("validateContent returns data on success", () => {
    const result = validateContent(contentExamples.ai);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.hero.headline.length).toBeGreaterThan(0);
  });
});

describe("Content guidance (Roadmap 3.1.3)", () => {
  const guidance = getContentGuidance();

  it("documents every registered schema", () => {
    const names = guidance.map((entry) => entry.schema);
    for (const expected of [
      "heroContentSchema",
      "testimonialSchema",
      "pricingPlanSchema",
      "footerSchema",
      "landingContentSchema",
    ]) {
      expect(names).toContain(expected);
    }
  });

  it("reads the word limit straight from the schema", () => {
    const hero = guidance.find((entry) => entry.schema === "heroContentSchema");
    const headline = hero?.fields.find((field) => field.path === "headline");
    expect(headline?.maxWords).toBe(12);
    expect(headline?.required).toBe(true);
    const badge = hero?.fields.find((field) => field.path === "badge");
    expect(badge?.required).toBe(false);
    expect(badge?.maxLength).toBe(60);
  });

  it("flattens nested objects and arrays with stable paths", () => {
    const nav = guidance.find((entry) => entry.schema === "navbarSchema");
    const paths = nav?.fields.map((field) => field.path) ?? [];
    expect(paths).toContain("links[].label");
    expect(paths).toContain("brandName");
  });

  it("keeps docs/CONTENT-GUIDANCE.md in sync with the schemas", () => {
    expect(fs.existsSync(GUIDANCE_PATH)).toBe(true);
    expect(fs.readFileSync(GUIDANCE_PATH, "utf8")).toBe(
      renderGuidanceMarkdown(guidance),
    );
  });
});

describe("New content schemas (Roadmap 3.1.1)", () => {
  it("sectionHeaderSchema enforces eyebrow/title/description limits", () => {
    expect(
      sectionHeaderSchema.safeParse({ eyebrow: "Why teams switch", title: "Reporting without drama" })
        .success,
    ).toBe(true);
    expect(
      sectionHeaderSchema.safeParse({
        title: "this title is definitely far longer than the ten words we allow",
      }).success,
    ).toBe(false);
  });

  it("navbarSchema caps navigation links at 7", () => {
    const links = Array.from({ length: 8 }, (_, index) => ({
      label: `Link ${index}`,
      href: `/${index}`,
    }));
    expect(navbarSchema.safeParse({ brandName: "Acme", links }).success).toBe(false);
    expect(
      navbarSchema.safeParse({ brandName: "Acme", links: links.slice(0, 7) }).success,
    ).toBe(true);
  });

  it("logoCloudSchema requires at least 3 logos (no empty social proof)", () => {
    expect(
      logoCloudSchema.safeParse({ logos: [{ name: "Solo" }] }).success,
    ).toBe(false);
  });

  it("landingContentSchema still requires hero + features", () => {
    expect(landingContentSchema.safeParse({}).success).toBe(false);
  });
});
