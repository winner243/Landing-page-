import { z } from "zod";
import {
  benefitSchema,
  ctaActionSchema,
  faqItemSchema,
  footerSchema,
  landingContentSchema,
  logoCloudSchema,
  pricingPlanSchema,
  sectionHeaderSchema,
  statsItemSchema,
  testimonialSchema,
  trustBarSchema,
} from "./schemas.ts";

/**
 * Page/template configs (ARCHITECTURE: "Page configs — Zod schema per
 * template type"). A template config is the discriminated union of the
 * kit's page types: same content bundle, different REQUIRED blocks —
 * the schema encodes what each template needs to work.
 */

/** Optional section headers — copy positions LandingContent does not cover. */
export const templateHeadersSchema = z.object({
  features: sectionHeaderSchema.optional(),
  testimonials: sectionHeaderSchema.optional(),
  pricing: sectionHeaderSchema.optional(),
  faq: sectionHeaderSchema.optional(),
});

/**
 * `saas-b2b` — long-form, proof-heavy, multi-stakeholder (CONVERSION.md).
 * Testimonials, stats, pricing and FAQ are REQUIRED: this audience
 * decides with evidence, and a page without proof must fail validation.
 */
export const saasB2bTemplateSchema = z.object({
  type: z.literal("saas-b2b"),
  content: landingContentSchema.extend({
    testimonials: z.array(testimonialSchema).min(1).max(9),
    stats: z.array(statsItemSchema).min(2).max(6),
    plans: z.array(pricingPlanSchema).min(1).max(4),
    faq: z.array(faqItemSchema).min(1).max(20),
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  /** Brand theme name — rendered with themeToCss()/themeToStyleTag(). */
  theme: z.string().min(1).default("aurora"),
});

/**
 * `simple` — single value prop, low friction, fast signup: only hero,
 * features, closing CTA and footer are required; every other block stays
 * optional (each extra section must earn its place).
 */
export const simpleTemplateSchema = z.object({
  type: z.literal("simple"),
  content: landingContentSchema.extend({
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  theme: z.string().min(1).default("aurora"),
});

/**
 * `saas-b2c` — single value prop, benefit-led, fast signup (CONVERSION.md).
 * Only hero, features, closing CTA and footer are required; proof and
 * pricing stay optional — every extra section must earn its place.
 */
export const saasB2cTemplateSchema = z.object({
  type: z.literal("saas-b2c"),
  content: landingContentSchema.extend({
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  theme: z.string().min(1).default("aurora"),
});

/**
 * `ai-saas` — trust-first, transparency about capabilities and data
 * handling (CONVERSION.md). Testimonials, trust and FAQ are required:
 * AI buyers evaluate credibility before committing.
 */
export const aiSaasTemplateSchema = z.object({
  type: z.literal("ai-saas"),
  content: landingContentSchema.extend({
    testimonials: z.array(testimonialSchema).min(1).max(9),
    trust: trustBarSchema,
    faq: z.array(faqItemSchema).min(1).max(20),
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  theme: z.string().min(1).default("aurora"),
});

/**
 * `pro-tool` — feature-oriented, workflow-focused (CONVERSION.md).
 * Hero, features, closing CTA and footer are required; pricing and
 * comparison stay optional for practitioner audiences.
 */
export const proToolTemplateSchema = z.object({
  type: z.literal("pro-tool"),
  content: landingContentSchema.extend({
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  theme: z.string().min(1).default("aurora"),
});

/**
 * `marketplace` — two-sided, liquidity signals critical (CONVERSION.md).
 * Hero (dual value prop) and closing CTA are required; trust signals
 * (logos, stats, testimonials) stay optional until liquidity exists.
 */
export const marketplaceTemplateSchema = z.object({
  type: z.literal("marketplace"),
  content: landingContentSchema.extend({
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  theme: z.string().min(1).default("aurora"),
});

/**
 * `premium` — high-ticket, exclusivity without fake scarcity
 * (CONVERSION.md). Testimonials are required (curated, real proof);
 * pricing stays optional for concierge engagement models.
 */
export const premiumTemplateSchema = z.object({
  type: z.literal("premium"),
  content: landingContentSchema.extend({
    testimonials: z.array(testimonialSchema).min(1).max(9),
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  theme: z.string().min(1).default("aurora"),
});

/**
 * `complex` — multi-feature, enterprise, long evaluation
 * (CONVERSION.md). Testimonials, trust, FAQ, pricing and footer are
 * required: diverse personas decide with comprehensive evidence.
 */
export const complexTemplateSchema = z.object({
  type: z.literal("complex"),
  content: landingContentSchema.extend({
    testimonials: z.array(testimonialSchema).min(1).max(9),
    trust: trustBarSchema,
    faq: z.array(faqItemSchema).min(1).max(20),
    plans: z.array(pricingPlanSchema).min(1).max(4),
    cta: ctaActionSchema,
    footer: footerSchema,
  }),
  headers: templateHeadersSchema.optional(),
  theme: z.string().min(1).default("aurora"),
});

export const templateConfigSchema = z.discriminatedUnion("type", [
  saasB2bTemplateSchema,
  simpleTemplateSchema,
  saasB2cTemplateSchema,
  aiSaasTemplateSchema,
  proToolTemplateSchema,
  marketplaceTemplateSchema,
  premiumTemplateSchema,
  complexTemplateSchema,
]);

export type TemplateConfig = z.infer<typeof templateConfigSchema>;
export type TemplateType = TemplateConfig["type"];
export type TemplateHeaders = z.infer<typeof templateHeadersSchema>;
export type SaasB2bTemplateConfig = z.infer<typeof saasB2bTemplateSchema>;
export type SimpleTemplateConfig = z.infer<typeof simpleTemplateSchema>;
export type SaasB2cTemplateConfig = z.infer<typeof saasB2cTemplateSchema>;
export type AiSaasTemplateConfig = z.infer<typeof aiSaasTemplateSchema>;
export type ProToolTemplateConfig = z.infer<typeof proToolTemplateSchema>;
export type MarketplaceTemplateConfig = z.infer<typeof marketplaceTemplateSchema>;
export type PremiumTemplateConfig = z.infer<typeof premiumTemplateSchema>;
export type ComplexTemplateConfig = z.infer<typeof complexTemplateSchema>;

/**
 * Boundary validation — throws a ZodError with precise paths (catch and
 * pass to `formatZodIssues` for logs/UI). Call at build/assembly time.
 */
export function parseTemplateConfig(input: unknown): TemplateConfig {
  return templateConfigSchema.parse(input);
}

/** Non-throwing variant for CMS previews and forms. */
export function safeParseTemplateConfig(input: unknown) {
  return templateConfigSchema.safeParse(input);
}
