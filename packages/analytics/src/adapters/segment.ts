import type { AnalyticsAdapter } from "../client.ts";
import { eventPayload, type LandingEvent } from "../events.ts";
import { getSegment } from "../browser.ts";

export interface SegmentAdapterOptions {
  /** Restrict delivery to these event types (default: all). */
  eventTypes?: ReadonlySet<LandingEvent["type"]>;
}

/**
 * Segment adapter — forwards to the official `window.analytics.track`.
 *
 * The integrating app loads the Segment snippet and configures its write
 * key. No key is stored by the kit. When `analytics` is absent (server, or
 * snippet not loaded), events are silently dropped.
 */
export function createSegmentAdapter(
  options: SegmentAdapterOptions = {},
): AnalyticsAdapter {
  return {
    id: "segment",
    eventTypes: options.eventTypes,
    send(event) {
      const segment = getSegment();
      if (!segment) return;
      segment.track(event.type, eventPayload(event));
    },
  };
}