import { describe, it, expect } from "vitest";
import {
  heroContentSchema,
  testimonialSchema,
  pricingPlanSchema,
  parseLandingContent,
  safeParseLandingContent,
} from "@landing/copywriting";
import { themeToCss, aurora, ember, builtInThemes } from "@landing/themes";

describe("Copywriting schemas", () => {
  it("accepts a valid hero", () => {
    const result = heroContentSchema.safeParse({
      headline: "Ship landing pages in hours",
      description: "The marketing kit your SaaS deserves.",
      primaryCta: { label: "Start free trial", href: "/signup", trackId: "hero_primary" },
      proofCount: 2000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects headlines over 12 words (cognitive load guard)", () => {
    const result = heroContentSchema.safeParse({
      headline: "one two three four five six seven eight nine ten eleven twelve thirteen",
      primaryCta: { label: "Start free", href: "/x", trackId: "h" },
    });
    expect(result.success).toBe(false);
  });

  it("requires CTA label + trackId", () => {
    const result = heroContentSchema.safeParse({
      headline: "Short headline",
      primaryCta: { label: "Go", href: "/x" },
    });
    expect(result.success).toBe(false);
  });

  it("testimonial enforces quote limits and rating literals", () => {
    expect(
      testimonialSchema.safeParse({
        quote: "Great product, truly.",
        author: { name: "Jane Doe", verified: true },
        rating: 5,
      }).success,
    ).toBe(true);

    expect(
      testimonialSchema.safeParse({
        quote: "Great product, truly.",
        author: { name: "J" },
      }).success,
    ).toBe(false);
  });

  it("pricing plan requires features and non-negative amounts", () => {
    expect(
      pricingPlanSchema.safeParse({
        name: "Pro",
        price: { amount: -5 },
        features: ["A"],
        cta: { label: "Choose Pro", trackId: "p" },
      }).success,
    ).toBe(false);

    expect(
      pricingPlanSchema.safeParse({
        name: "Pro",
        price: { amount: 29 },
        features: ["Unlimited projects"],
        cta: { label: "Choose Pro", trackId: "p" },
      }).success,
    ).toBe(true);
  });

  it("parseLandingContent throws with path details on invalid input", () => {
    expect(() => parseLandingContent({})).toThrow();
  });

  it("safeParseLandingContent returns error object without throwing", () => {
    const result = safeParseLandingContent({ hero: {} });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.length).toBeGreaterThan(0);
  });
});

describe("Theme system", () => {
  it("serializes brand overrides to CSS custom properties", () => {
    const css = themeToCss(aurora);
    expect(css).toContain(".theme-aurora");
    expect(css).toContain("--lmk-brand-primary: oklch(0.55 0.2 265)");
  });

  it("auto-points accent + focus-ring to brand-primary", () => {
    const css = themeToCss(aurora);
    expect(css).toContain("--lmk-accent: oklch(0.55 0.2 265)");
    expect(css).toContain("--lmk-focus-ring: oklch(0.55 0.2 265)");
  });

  it("supports radius overrides", () => {
    const css = themeToCss(ember);
    expect(css).toContain("--lmk-radius-md: 10px");
    expect(css).toContain("--lmk-radius-lg: 16px");
  });

  it("returns empty string for empty theme", () => {
    expect(themeToCss({ name: "empty", label: "Empty" })).toBe("");
  });

  it("exposes built-in themes with unique names", () => {
    const names = builtInThemes.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toContain("aurora");
    expect(names).toContain("emerald");
    expect(names).toContain("ember");
  });
});
