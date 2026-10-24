import type { AnalyticsAdapter } from "../client.ts";
import { eventPayload, type LandingEvent } from "../events.ts";
import { getPostHog } from "../browser.ts";

export interface PostHogAdapterOptions {
  /** Restrict delivery to these event types (default: all). */
  eventTypes?: ReadonlySet<LandingEvent["type"]>;
}

/**
 * PostHog adapter — forwards to the official `window.posthog.capture`.
 *
 * The integrating app loads the PostHog snippet and calls
 * `posthog.init("<API_KEY>")`. No key is stored by the kit. When `posthog`
 * is absent (server, or script not loaded), events are silently dropped.
 */
export function createPostHogAdapter(
  options: PostHogAdapterOptions = {},
): AnalyticsAdapter {
  return {
    id: "posthog",
    eventTypes: options.eventTypes,
    send(event) {
      const posthog = getPostHog();
      if (!posthog) return;
      posthog.capture(event.type, eventPayload(event));
    },
  };
}