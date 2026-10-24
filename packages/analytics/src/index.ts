/**
 * @landing/analytics — provider-agnostic analytics for the Landing
 * Marketing Kit (Roadmap 4.1).
 *
 * Components emit typed events through `track()`; destinations plug in as
 * optional adapters. Nothing here imports a vendor SDK. Tracking is
 * consent-gated and disabled by default.
 */

export * from "./events.ts";
export * from "./consent.ts";
export * from "./client.ts";
export * from "./adapters/index.ts";

import {
  createAnalytics,
  type AnalyticsAdapter,
  type AnalyticsClient,
} from "./client.ts";
import type { LandingEvent } from "./events.ts";

/** Legacy handler signature (pre-4.1) — a raw `(event) => void`. */
export type AnalyticsHandler = (event: LandingEvent) => void;

/** Internal adapter id used by `setAnalyticsHandler`. */
const LEGACY_HANDLER_ID = "@landing/legacy-handler";

let defaultClient: AnalyticsClient | null = null;

/**
 * The default (lazily-created) client used by the module-level `track()`
 * and `setAnalyticsHandler()`. Call `resetAnalytics()` to restore a fresh
 * instance (tests / init boundaries).
 */
export function getAnalytics(): AnalyticsClient {
  if (!defaultClient) defaultClient = createAnalytics();
  return defaultClient;
}

/** Discards the default client — next access creates a fresh one. */
export function resetAnalytics(): void {
  defaultClient = null;
}

/**
 * Emits a typed event through the default client. No-ops when tracking is
 * disabled or the required consent is not granted — privacy-first by
 * default and never throws.
 */
export function track(event: LandingEvent): void {
  getAnalytics().track(event);
}

/**
 * Legacy registration — wraps a raw handler in an adapter on the default
 * client. Passing `null` removes it. Kept for the pre-4.1 contract;
 * prefer `getAnalytics().registerAdapter(...)` for new code.
 */
export function setAnalyticsHandler(next: AnalyticsHandler | null): void {
  const client = getAnalytics();
  client.removeAdapter(LEGACY_HANDLER_ID);
  if (next) {
    const adapter: AnalyticsAdapter = { id: LEGACY_HANDLER_ID, send: next };
    client.registerAdapter(adapter);
  }
}