import type { AnalyticsAdapter } from "../client.ts";
import { eventPayload, type LandingEvent } from "../events.ts";
import { getPlausible } from "../browser.ts";

export interface PlausibleAdapterOptions {
  /** Restrict delivery to these event types (default: all). */
  eventTypes?: ReadonlySet<LandingEvent["type"]>;
}

/**
 * Plausible adapter — forwards to the official `window.plausible` snippet.
 *
 * Plausible auto-tracks pageviews; custom events go through
 * `plausible(eventName, { props })`. When the global is absent (server, or
 * script not loaded), events are silently dropped.
 */
export function createPlausibleAdapter(
  options: PlausibleAdapterOptions = {},
): AnalyticsAdapter {
  return {
    id: "plausible",
    eventTypes: options.eventTypes,
    send(event) {
      const plausible = getPlausible();
      if (!plausible) return;
      plausible(event.type, { props: eventPayload(event) });
    },
  };
}