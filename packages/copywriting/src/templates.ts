import { z } from "zod";
import {
  ctaActionSchema,
  faqItemSchema,
  footerSchema,
  landingContentSchema,
  pricingPlanSchema,
  sectionHeaderSchema,
  statsItemSchema,
  testimonialSchema,
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

export const templateConfigSchema = z.discriminatedUnion("type", [
  saasB2bTemplateSchema,
  simpleTemplateSchema,
]);

export type TemplateConfig = z.infer<typeof templateConfigSchema>;
export type TemplateType = TemplateConfig["type"];
export type TemplateHeaders = z.infer<typeof templateHeadersSchema>;
export type SaasB2bTemplateConfig = z.infer<typeof saasB2bTemplateSchema>;
export type SimpleTemplateConfig = z.infer<typeof simpleTemplateSchema>;

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
