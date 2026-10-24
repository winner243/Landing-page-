import type { AnalyticsAdapter } from "../client.ts";
import { eventPayload, type LandingEvent } from "../events.ts";
import { getGtag } from "../browser.ts";

export interface Ga4AdapterOptions {
  /** Restrict delivery to these event types (default: all). */
  eventTypes?: ReadonlySet<LandingEvent["type"]>;
}

/**
 * GA4 adapter — forwards to the official `window.gtag` loader.
 *
 * The integrating app is responsible for loading gtag.js and calling
 * `gtag("config", "<MEASUREMENT_ID>")`. No measurement id is required (or
 * accepted) here: the kit never stores credentials. When `gtag` is absent
 * (server, or script not loaded), events are silently dropped.
 */
export function createGa4Adapter(options: Ga4AdapterOptions = {}): AnalyticsAdapter {
  return {
    id: "ga4",
    eventTypes: options.eventTypes,
    send(event) {
      const gtag = getGtag();
      if (!gtag) return;
      gtag("event", event.type, eventPayload(event));
    },
  };
}