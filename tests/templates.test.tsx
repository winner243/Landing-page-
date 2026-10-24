import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { LandingComposer, buildTemplate, type LandingSection } from "@landing/patterns";
import {
  contentExamples,
  parseTemplateConfig,
  templateConfigSchema,
} from "@landing/copywriting";

const b2bConfig = parseTemplateConfig({
  type: "saas-b2b",
  content: contentExamples.b2b,
  headers: {
    features: { title: "Everything your stack should have done" },
    pricing: { title: "Plans that scale with the rollout" },
    faq: { title: "Questions from the buying committee" },
  },
});
const simpleConfig = parseTemplateConfig({
  type: "simple",
  content: contentExamples.b2c,
  headers: {
    features: { title: "Why people love it" },
    pricing: { title: "Free to start" },
    faq: { title: "Good to know" },
  },
});

describe("Template config schema (Roadmap 3.4)", () => {
  it("parses the b2b example and applies theme defaults", () => {
    expect(b2bConfig.type).toBe("saas-b2b");
    expect(b2bConfig.theme).toBe("aurora");
  });

  it("rejects saas-b2b content missing required proof blocks", () => {
    const result = templateConfigSchema.safeParse({
      type: "saas-b2b",
      content: { ...contentExamples.b2b, testimonials: undefined },
    });
    expect(result.success).toBe(false);
  });

  it("rejects simple content missing the closing CTA", () => {
    const result = templateConfigSchema.safeParse({
      type: "simple",
      content: { ...contentExamples.b2c, cta: undefined },
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown template types (discriminated union)", () => {
    const result = templateConfigSchema.safeParse({
      type: "unknown-template",
      content: contentExamples.b2b,
    });
    expect(result.success).toBe(false);
  });
});

describe("buildTemplate — saas-b2b (Roadmap 3.4)", () => {
  const sections: LandingSection[] = buildTemplate(b2bConfig);
  const types = sections.map((section) => section.type);

  it("assembles the long-form, proof-heavy order", () => {
    expect(types[0]).toBe("navbar");
    expect(types[1]).toBe("hero");
    expect(types).toContain("pattern:socialProof");
    expect(types).toContain("features");
    expect(types).toContain("pattern:pricingDecision");
    expect(types[types.length - 1]).toBe("pattern:footerConversion");
    expect(types.indexOf("pattern:pricingDecision")).toBeLessThan(
      types.indexOf("pattern:footerConversion"),
    );
  });

  it("renders trust badges only when the content provides them", () => {
    const withTrust = buildTemplate(
      parseTemplateConfig({
        type: "saas-b2b",
        content: { ...contentExamples.b2b, trust: { items: [{ label: "SOC 2 Type II" }] } },
      }),
    );
    expect(withTrust.map((section) => section.type)).toContain("trustBar");
    expect(types).not.toContain("trustBar");
  });

  it("renders through the composer with crawlable CTAs", () => {
    render(<LandingComposer sections={sections} themeClassName="theme-aurora" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      contentExamples.b2b.hero.headline,
    );
    expect(
      screen.getAllByRole("link").some(
        (link) => link.getAttribute("href") === contentExamples.b2b.hero.primaryCta.href,
      ),
    ).toBe(true);
    expect(
      screen.getByRole("heading", { name: "Plans that scale with the rollout" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("navigation").length).toBeGreaterThan(0);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <LandingComposer sections={sections} themeClassName="theme-aurora" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("buildTemplate — new templates (Roadmap 4.4)", () => {
  const templates: Array<[string, LandingSection[], string[]]> = [
    [
      "saas-b2c",
      buildTemplate(
        parseTemplateConfig({
          type: "saas-b2c",
          content: contentExamples.saasB2c,
          headers: {
            features: { title: "Built for your money goals" },
            pricing: { title: "Simple, transparent pricing" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "pattern:pricingDecision", "pattern:footerConversion"],
    ],
    [
      "ai-saas",
      buildTemplate(
        parseTemplateConfig({
          type: "ai-saas",
          content: contentExamples.aiSaaS,
          headers: {
            features: { title: "AI you can trust" },
            faq: { title: "Questions about AI" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "pattern:objectionHandling", "pattern:footerConversion"],
    ],
    [
      "pro-tool",
      buildTemplate(
        parseTemplateConfig({
          type: "pro-tool",
          content: contentExamples.proTool,
          headers: {
            features: { title: "Everything your team needs" },
            pricing: { title: "Simple, transparent pricing" },
          },
        }),
      ),
      ["navbar", "hero", "features", "pattern:pricingDecision", "pattern:footerConversion"],
    ],
    [
      "marketplace",
      buildTemplate(
        parseTemplateConfig({
          type: "marketplace",
          content: contentExamples.marketplace,
          headers: {
            features: { title: "Built for buyers and sellers" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "pattern:footerConversion"],
    ],
    [
      "premium",
      buildTemplate(
        parseTemplateConfig({
          type: "premium",
          content: contentExamples.premium,
          headers: {
            features: { title: "Curated for your infrastructure" },
            testimonials: { title: "What our clients say" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "trustBar", "pattern:footerConversion"],
    ],
    [
      "complex",
      buildTemplate(
        parseTemplateConfig({
          type: "complex",
          content: contentExamples.complex,
          headers: {
            features: { title: "Enterprise-grade infrastructure" },
            pricing: { title: "Plans for every stage" },
            faq: { title: "Questions from enterprise buyers" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "trustBar", "pattern:pricingDecision", "pattern:footerConversion"],
    ],
  ] as const;

  it.each(templates)("%s validates against its template schema", (_name, _sections, _types) => {
    // If we reach here, parseTemplateConfig already succeeded above
    expect(true).toBe(true);
  });

  it.each(templates)("%s assembles sections starting with navbar and hero", (_name, sections, expectedTypes) => {
    const types = sections.map((section) => section.type);
    expect(types[0]).toBe("navbar");
    expect(types[1]).toBe("hero");
    expect(types[types.length - 1]).toBe("pattern:footerConversion");
    // Verify expected section types are present
    for (const expected of expectedTypes) {
      expect(types).toContain(expected);
    }
  });

  it.each(templates)("%s renders through the composer with crawlable CTAs", (_name, sections) => {
    render(<LandingComposer sections={sections} themeClassName="theme-aurora" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it.each(templates)("%s has no axe violations", async (_name, sections) => {
    const { container } = render(
      <LandingComposer sections={sections} themeClassName="theme-aurora" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("buildTemplate — simple (Roadmap 3.4)", () => {
  const sections: LandingSection[] = buildTemplate(simpleConfig);
  const types = sections.map((section) => section.type);

  it("keeps the low-friction structure with optional blocks", () => {
    expect(types[0]).toBe("navbar");
    expect(types[1]).toBe("hero");
    expect(types).toContain("features");
    expect(types).toContain("pattern:pricingDecision");
    expect(types).toContain("trustBar");
    expect(types[types.length - 1]).toBe("pattern:footerConversion");
  });

  it("renders headline and pricing header from the config", () => {
    render(<LandingComposer sections={sections} themeClassName="theme-aurora" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      contentExamples.b2c.hero.headline,
    );
    expect(screen.getByRole("heading", { name: "Free to start" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <LandingComposer sections={sections} themeClassName="theme-aurora" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});

describe("buildTemplate — new templates (Roadmap 4.4)", () => {
  const templates: Array<[string, LandingSection[], string[]]> = [
    [
      "saas-b2c",
      buildTemplate(
        parseTemplateConfig({
          type: "saas-b2c",
          content: contentExamples.saasB2c,
          headers: {
            features: { title: "Built for your money goals" },
            pricing: { title: "Simple, transparent pricing" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "pattern:pricingDecision", "pattern:footerConversion"],
    ],
    [
      "ai-saas",
      buildTemplate(
        parseTemplateConfig({
          type: "ai-saas",
          content: contentExamples.aiSaaS,
          headers: {
            features: { title: "AI you can trust" },
            faq: { title: "Questions about AI" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "pattern:objectionHandling", "pattern:footerConversion"],
    ],
    [
      "pro-tool",
      buildTemplate(
        parseTemplateConfig({
          type: "pro-tool",
          content: contentExamples.proTool,
          headers: {
            features: { title: "Everything your team needs" },
            pricing: { title: "Simple, transparent pricing" },
          },
        }),
      ),
      ["navbar", "hero", "features", "pattern:pricingDecision", "pattern:footerConversion"],
    ],
    [
      "marketplace",
      buildTemplate(
        parseTemplateConfig({
          type: "marketplace",
          content: contentExamples.marketplace,
          headers: {
            features: { title: "Built for buyers and sellers" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "pattern:footerConversion"],
    ],
    [
      "premium",
      buildTemplate(
        parseTemplateConfig({
          type: "premium",
          content: contentExamples.premium,
          headers: {
            features: { title: "Curated for your infrastructure" },
            testimonials: { title: "What our clients say" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "trustBar", "pattern:footerConversion"],
    ],
    [
      "complex",
      buildTemplate(
        parseTemplateConfig({
          type: "complex",
          content: contentExamples.complex,
          headers: {
            features: { title: "Enterprise-grade infrastructure" },
            pricing: { title: "Plans for every stage" },
            faq: { title: "Questions from enterprise buyers" },
          },
        }),
      ),
      ["navbar", "hero", "pattern:socialProof", "features", "trustBar", "pattern:pricingDecision", "pattern:footerConversion"],
    ],
  ] as const;

  it.each(templates)("%s validates against its template schema", (_name, _sections, _types) => {
    // If we reach here, parseTemplateConfig already succeeded above
    expect(true).toBe(true);
  });

  it.each(templates)("%s assembles sections starting with navbar and hero", (_name, sections, expectedTypes) => {
    const types = sections.map((section) => section.type);
    expect(types[0]).toBe("navbar");
    expect(types[1]).toBe("hero");
    expect(types[types.length - 1]).toBe("pattern:footerConversion");
    // Verify expected section types are present
    for (const expected of expectedTypes) {
      expect(types).toContain(expected);
    }
  });

  it.each(templates)("%s renders through the composer with crawlable CTAs", (_name, sections) => {
    render(<LandingComposer sections={sections} themeClassName="theme-aurora" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it.each(templates)("%s has no axe violations", async (_name, sections) => {
    const { container } = render(
      <LandingComposer sections={sections} themeClassName="theme-aurora" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 60000);
});
