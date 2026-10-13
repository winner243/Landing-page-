import { z } from "zod";

/**
 * Runtime content schemas — the enforcement layer of the copywriting
 * system (docs/COPYWRITING.md). Length limits, required fields and
 * ethical constraints (real proof only) live here, so invalid content
 * fails fast at the boundary instead of rendering misleading UI.
 *
 * Limits are the single source of truth for docs/CONTENT-GUIDANCE.md,
 * which is generated from these schemas (`pnpm guidance`).
 */

/**
 * Word-count guard. The limit is mirrored into `.describe()` so the
 * guidance generator can read it back without evaluating the refinement.
 */
const MaxWords = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .refine(
      (s) => s.split(/\s+/).filter(Boolean).length <= max,
      { message: `Must be ≤ ${max} words` },
    )
    .describe(`≤ ${max} words`);

const ctaShape = {
  label: z.string().min(3).max(40),
  href: z.string().min(1),
  trackId: z.string().min(1),
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
export const heroContentSchema = z.object({
  badge: z.string().max(60).optional(),
  headline: MaxWords(12),
  description: MaxWords(25).optional(),
  primaryCta: z.object(ctaShape),
  secondaryCta: z.object(ctaShape).optional(),
  proofText: z.string().max(80).optional(),
  proofCount: z.number().int().nonnegative().optional(),
});

/* ------------------------------------------------------------------ */
/* Testimonial — ethics: verbatim must be real (documented process)    */
/* ------------------------------------------------------------------ */
export const testimonialSchema = z.object({
  quote: MaxWords(60),
  author: z.object({
    name: z.string().min(2).max(60),
    role: z.string().max(80).optional(),
    company: z.string().max(80).optional(),
    avatarSrc: z.string().url().optional(),
    verified: z.boolean().optional(),
  }),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  metric: z
    .object({ value: z.string().max(12), label: z.string().max(40) })
    .optional(),
});

/* ------------------------------------------------------------------ */
/* Feature                                                             */
/* ------------------------------------------------------------------ */
export const featureSchema = z.object({
  title: MaxWords(8),
  description: MaxWords(30),
  link: z.object({ label: z.string().max(30), href: z.string() }).optional(),
});

/* ------------------------------------------------------------------ */
/* Pricing — ethics: no hidden fees, no fake anchors                    */
/* ------------------------------------------------------------------ */
export const pricingPlanSchema = z.object({
  name: z.string().min(1).max(40),
  price: z.object({
    amount: z.number().nonnegative(),
    currency: z.string().length(1).optional(),
    interval: z.enum(["month", "year"]).optional(),
  }),
  originalAmount: z.number().nonnegative().optional(),
  description: z.string().max(120).optional(),
  features: z.array(z.string().max(80)).min(1).max(20),
  cta: z.object({
    label: z.string().min(3).max(40),
    href: z.string().optional(),
    trackId: z.string().min(1),
  }),
  highlighted: z.boolean().optional(),
  badge: z.string().max(30).optional(),
});

/* ------------------------------------------------------------------ */
/* FAQ — questions from real objections                                 */
/* ------------------------------------------------------------------ */
export const faqItemSchema = z.object({
  question: z.string().min(5).max(140),
  answer: z.string().min(10).max(600),
  category: z.string().max(30).optional(),
});

/* ------------------------------------------------------------------ */
/* Stats — verifiable numbers only                                      */
/* ------------------------------------------------------------------ */
export const statsItemSchema = z.object({
  value: z.string().min(1).max(16),
  label: z.string().min(2).max(50),
  source: z.string().max(120).optional(),
});

/* ------------------------------------------------------------------ */
/* Section header                                                       */
/* ------------------------------------------------------------------ */
export const sectionHeaderSchema = z.object({
  eyebrow: MaxWords(5).optional(),
  title: MaxWords(10),
  description: MaxWords(30).optional(),
});

/* ------------------------------------------------------------------ */
/* CTA action — mirrors marketing CtaAction (label + trackId required)  */
/* ------------------------------------------------------------------ */
export const ctaActionSchema = z.object({
  label: z.string().min(3).max(40),
  href: z.string().min(1).optional(),
  trackId: z.string().min(1),
});

/* ------------------------------------------------------------------ */
/* Navigation                                                           */
/* ------------------------------------------------------------------ */
export const navLinkSchema = z.object({
  label: z.string().min(1).max(30),
  href: z.string().min(1),
});

export const navbarSchema = z.object({
  brandName: z.string().min(1).max(40),
  links: z.array(navLinkSchema).min(1).max(7),
  cta: ctaActionSchema.optional(),
});

/* ------------------------------------------------------------------ */
/* Social proof                                                         */
/* ------------------------------------------------------------------ */
export const logoCloudSchema = z.object({
  title: z.string().max(60).optional(),
  logos: z
    .array(
      z.object({
        name: z.string().min(1).max(40),
        src: z.string().url().optional(),
      }),
    )
    .min(3)
    .max(12),
});

export const trustBarSchema = z.object({
  items: z.array(z.object({ label: z.string().min(1).max(60) })).min(1).max(6),
});

/* ------------------------------------------------------------------ */
/* Benefits (BenefitList rows)                                          */
/* ------------------------------------------------------------------ */
export const benefitSchema = z.object({
  title: MaxWords(8),
  description: MaxWords(20).optional(),
});

/* ------------------------------------------------------------------ */
/* Footer — legal links required (consent flows)                        */
/* ------------------------------------------------------------------ */
export const footerColumnSchema = z.object({
  title: z.string().min(1).max(30),
  links: z.array(navLinkSchema).min(1).max(8),
});

export const footerSchema = z.object({
  brandName: z.string().min(1).max(40),
  tagline: MaxWords(16).optional(),
  columns: z.array(footerColumnSchema).min(1).max(4).optional(),
  legalLinks: z.array(navLinkSchema).min(1).max(4),
  copyright: z.string().max(100).optional(),
});

/* ------------------------------------------------------------------ */
/* Page-level content bundle                                            */
/* ------------------------------------------------------------------ */
export const landingContentSchema = z.object({
  hero: heroContentSchema,
  features: z.array(featureSchema).min(1).max(12),
  testimonials: z.array(testimonialSchema).min(1).max(9).optional(),
  plans: z.array(pricingPlanSchema).min(1).max(4).optional(),
  faq: z.array(faqItemSchema).min(1).max(20).optional(),
  stats: z.array(statsItemSchema).min(2).max(6).optional(),
  nav: navbarSchema.optional(),
  logoCloud: logoCloudSchema.optional(),
  trust: trustBarSchema.optional(),
  benefits: z.array(benefitSchema).min(1).max(8).optional(),
  cta: ctaActionSchema.optional(),
  footer: footerSchema.optional(),
});

export type HeroContent = z.infer<typeof heroContentSchema>;
export type TestimonialContent = z.infer<typeof testimonialSchema>;
export type FeatureContent = z.infer<typeof featureSchema>;
export type PricingPlanContent = z.infer<typeof pricingPlanSchema>;
export type FaqContent = z.infer<typeof faqItemSchema>;
export type StatsContent = z.infer<typeof statsItemSchema>;
export type SectionHeaderContent = z.infer<typeof sectionHeaderSchema>;
export type CtaActionContent = z.infer<typeof ctaActionSchema>;
export type NavLinkContent = z.infer<typeof navLinkSchema>;
export type NavbarContent = z.infer<typeof navbarSchema>;
export type LogoCloudContent = z.infer<typeof logoCloudSchema>;
export type TrustBarContent = z.infer<typeof trustBarSchema>;
export type BenefitContent = z.infer<typeof benefitSchema>;
export type FooterColumnContent = z.infer<typeof footerColumnSchema>;
export type FooterContent = z.infer<typeof footerSchema>;
export type LandingContent = z.infer<typeof landingContentSchema>;
