/**
 * Safe access to vendor globals installed by the integrating app.
 *
 * Vendor SDKs are NOT bundled with the kit (decision: no mandatory vendor
 * dependency). Each adapter calls its official global — `window.gtag`
 * (GA4), `window.plausible`, `window.posthog`, `window.analytics`
 * (Segment) — and NO-OPS when the global is absent. That absence is the
 * normal case both on the server (no `window`) and before the vendor
 * script has loaded in the browser.
 */

export type GtagFn = (command: string, ...args: unknown[]) => void;

export type PlausibleFn = (
  event: string,
  options?: { props?: Record<string, unknown> },
) => void;

export interface PostHogClient {
  capture(event: string, properties?: Record<string, unknown>): void;
}

export interface SegmentClient {
  track(event: string, properties?: Record<string, unknown>): void;
}

declare global {
  interface Window {
    /** GA4 globalTag loader. */
    gtag?: GtagFn;
    /** Plausible snippet's `plausible` function. */
    plausible?: PlausibleFn;
    /** PostHog snippet's `posthog` object. */
    posthog?: PostHogClient;
    /** Segment snippet's `analytics` object. */
    analytics?: SegmentClient;
  }
}

function globalWindow(): Window | undefined {
  return typeof window === "undefined" ? undefined : window;
}

export function getGtag(): GtagFn | undefined {
  return globalWindow()?.gtag;
}

export function getPlausible(): PlausibleFn | undefined {
  return globalWindow()?.plausible;
}

export function getPostHog(): PostHogClient | undefined {
  return globalWindow()?.posthog;
}

export function getSegment(): SegmentClient | undefined {
  return globalWindow()?.analytics;
}