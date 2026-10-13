/**
 * Provider-agnostic event taxonomy for the Landing Marketing Kit.
 *
 * Components emit typed events through `track()`; consumers plug a
 * destination (GA4, Plausible, PostHog…) in Phase 4. Nothing here
 * imports a vendor SDK — the kit stays analytics-neutral.
 */

export interface CtaEvent {
  type: "cta_click";
  /** Stable identifier for the CTA instance (e.g. "hero_primary"). */
  trackId: string;
  /** CTA label as rendered. */
  label: string;
  /** Destination href (no query secrets). */
  href?: string;
  /** Location group: where the CTA appears. */
  location: "header" | "hero" | "section" | "footer" | "sticky" | "inline";
  /** Experiment variant in force, if any. */
  variant?: string;
}

export interface SectionViewEvent {
  type: "section_view";
  section: string;
  variant?: string;
}

export interface ScrollDepthEvent {
  type: "scroll_depth";
  /** Milestone: 25 | 50 | 75 | 100. */
  depth: 25 | 50 | 75 | 100;
}

export type LandingEvent =
  | CtaEvent
  | SectionViewEvent
  | ScrollDepthEvent;

export type AnalyticsHandler = (event: LandingEvent) => void;

let handler: AnalyticsHandler | null = null;

/**
 * Registers the destination handler (consent must be checked by caller).
 * Passing null disables tracking.
 */
export function setAnalyticsHandler(next: AnalyticsHandler | null): void {
  handler = next;
}

/**
 * Emits an event to the registered handler. Silently no-ops when no
 * handler is set — components never crash on missing analytics.
 */
export function track(event: LandingEvent): void {
  if (!handler) return;
  try {
    handler(event);
  } catch {
    // Analytics must never break the UI.
  }
}
