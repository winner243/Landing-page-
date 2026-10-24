import { z } from "zod";

/**
 * Landing marketing event taxonomy (Roadmap 4.1) — typed + validated.
 *
 * Events describe CONVERSION behaviour, never personal data. The schemas
 * deliberately declare no email, name, IP, user id, raw form contents or
 * full URLs with secrets. Integrating apps must strip secrets/tokens from
 * any string before calling `track()` (see docs/ANALYTICS.md).
 *
 * Naming convention: `snake_case`, verb-first, ≤ 3 words (PRINCIPLES.md §9).
 */

const nonEmpty = (max: number) => z.string().min(1).max(max);

const ctaLocation = z.enum([
  "header",
  "hero",
  "section",
  "footer",
  "sticky",
  "inline",
]);

/* ------------------------------------------------------------------ */
/* Navigation / visibility                                             */
/* ------------------------------------------------------------------ */

export const pageViewEventSchema = z.object({
  type: z.literal("page_view"),
  /** Pathname only — no query string (may carry secrets). */
  path: nonEmpty(2048),
  title: z.string().max(200).optional(),
});

export const sectionViewEventSchema = z.object({
  type: z.literal("section_view"),
  section: nonEmpty(120),
  variant: nonEmpty(80).optional(),
});

export const scrollDepthEventSchema = z.object({
  type: z.literal("scroll_depth"),
  depth: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),
});

/* ------------------------------------------------------------------ */
/* Conversion actions                                                  */
/* ------------------------------------------------------------------ */

export const ctaClickEventSchema = z.object({
  type: z.literal("cta_click"),
  /** Stable CTA instance id (e.g. "hero_primary"). */
  trackId: nonEmpty(120),
  label: nonEmpty(120),
  /** Relative or sanitized href — never include query secrets. */
  href: z.string().max(2048).optional(),
  location: ctaLocation,
  variant: nonEmpty(80).optional(),
});

export const formStartEventSchema = z.object({
  type: z.literal("form_start"),
  form: nonEmpty(120),
});

export const formSubmitEventSchema = z.object({
  type: z.literal("form_submit"),
  form: nonEmpty(120),
  success: z.boolean(),
});

export const signupStartEventSchema = z.object({
  type: z.literal("signup_start"),
  source: nonEmpty(80).optional(),
});

export const signupCompleteEventSchema = z.object({
  type: z.literal("signup_complete"),
  plan: nonEmpty(80).optional(),
  source: nonEmpty(80).optional(),
  trial: z.boolean().optional(),
});

/* ------------------------------------------------------------------ */
/* Pricing + experimentation                                           */
/* ------------------------------------------------------------------ */

export const pricingViewEventSchema = z.object({
  type: z.literal("pricing_view"),
  plan: nonEmpty(80).optional(),
  interval: z.enum(["month", "year"]).optional(),
});

export const experimentExposureEventSchema = z.object({
  type: z.literal("experiment_exposure"),
  experimentId: nonEmpty(120),
  variant: nonEmpty(80),
});

/* ------------------------------------------------------------------ */
/* Union + helpers                                                     */
/* ------------------------------------------------------------------ */

export const landingEventSchema = z.discriminatedUnion("type", [
  pageViewEventSchema,
  sectionViewEventSchema,
  scrollDepthEventSchema,
  ctaClickEventSchema,
  formStartEventSchema,
  formSubmitEventSchema,
  signupStartEventSchema,
  signupCompleteEventSchema,
  pricingViewEventSchema,
  experimentExposureEventSchema,
]);

export type LandingEvent = z.infer<typeof landingEventSchema>;
export type LandingEventType = LandingEvent["type"];
export type CtaEvent = z.infer<typeof ctaClickEventSchema>;
export type PageViewEvent = z.infer<typeof pageViewEventSchema>;
export type SectionViewEvent = z.infer<typeof sectionViewEventSchema>;
export type ScrollDepthEvent = z.infer<typeof scrollDepthEventSchema>;
export type FormStartEvent = z.infer<typeof formStartEventSchema>;
export type FormSubmitEvent = z.infer<typeof formSubmitEventSchema>;
export type SignupStartEvent = z.infer<typeof signupStartEventSchema>;
export type SignupCompleteEvent = z.infer<typeof signupCompleteEventSchema>;
export type PricingViewEvent = z.infer<typeof pricingViewEventSchema>;
export type ExperimentExposureEvent = z.infer<typeof experimentExposureEventSchema>;

/**
 * Boundary parser for UNTRUSTED input (server beacons, HTTP ingestion).
 * Throws a ZodError on invalid events — use with a format helper for logs.
 */
export function parseLandingEvent(input: unknown): LandingEvent {
  return landingEventSchema.parse(input);
}

/** Non-throwing variant for pipeline/CMS-style validation. */
export function safeParseLandingEvent(input: unknown) {
  return landingEventSchema.safeParse(input);
}

/**
 * Strips `type`, returning the event's remaining fields as a plain
 * `Record<string, unknown>` — the vendor-neutral payload passed to
 * adapter globals (`gtag`, `plausible`, `posthog.capture`, …).
 */
export function eventPayload(event: LandingEvent): Record<string, unknown> {
  const { type: _type, ...rest } = event;
  return rest;
}