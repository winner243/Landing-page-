import { safeParseLandingEvent, type LandingEvent } from "./events.ts";
import {
  CONSENT_DENIED_DEFAULT,
  isConsentGranted,
  requiredConsent,
  type ConsentState,
} from "./consent.ts";

/**
 * Provider-neutral analytics engine (Roadmap 4.1).
 *
 * An `AnalyticsClient` owns: adapter registry, consent state, a global
 * enable flag, and event validation. It is a plain factory (closure
 * state), never a React context — the kit stays framework-agnostic.
 */

/** A destination for validated, consent-approved events. */
export interface AnalyticsAdapter {
  /** Unique id (e.g. "ga4", "plausible"). Re-registering overwrites. */
  id: string;
  /** Restrict delivery to these event types (default: all). */
  eventTypes?: ReadonlySet<LandingEvent["type"]>;
  /** Deliver one event. MUST NOT throw — errors are caught anyway. */
  send(event: LandingEvent): void;
}

export interface AnalyticsClientOptions {
  /** Initial consent — defaults to denied (privacy-first). */
  consent?: ConsentState;
  /** Global kill switch — defaults to enabled. */
  enabled?: boolean;
  /** Adapters to register at creation. */
  adapters?: readonly AnalyticsAdapter[];
  /** Error sink for invalid events / adapter failures (default: silent). */
  onError?: (error: unknown, context: string) => void;
}

export interface AnalyticsClient {
  /** Validate → consent-check → route to matching adapters. Never throws. */
  track(event: LandingEvent): void;
  registerAdapter(adapter: AnalyticsAdapter): void;
  removeAdapter(id: string): void;
  /** Merges the given decisions over the current consent state. */
  setConsent(consent: Partial<ConsentState>): void;
  getConsent(): ConsentState;
  setEnabled(enabled: boolean): void;
  isEnabled(): boolean;
  /** Number of registered adapters (diagnostics/tests). */
  adapterCount(): number;
}

export function createAnalytics(
  options: AnalyticsClientOptions = {},
): AnalyticsClient {
  const adapters = new Map<string, AnalyticsAdapter>();
  let consent: ConsentState = options.consent ?? CONSENT_DENIED_DEFAULT;
  let enabled = options.enabled ?? true;
  const onError = options.onError ?? (() => {});

  for (const adapter of options.adapters ?? []) {
    adapters.set(adapter.id, adapter);
  }

  return {
    track(event) {
      if (!enabled) return;

      // Validate first so consent gating always sees a well-formed event.
      const parsed = safeParseLandingEvent(event);
      if (!parsed.success) {
        onError(parsed.error, "analytics event validation");
        return;
      }
      const data = parsed.data;

      if (!isConsentGranted(consent, requiredConsent(data.type))) return;

      for (const adapter of adapters.values()) {
        if (adapter.eventTypes && !adapter.eventTypes.has(data.type)) continue;
        try {
          adapter.send(data);
        } catch (error) {
          // One failing adapter must never break others or the UI.
          onError(error, `adapter "${adapter.id}"`);
        }
      }
    },

    registerAdapter(adapter) {
      adapters.set(adapter.id, adapter);
    },

    removeAdapter(id) {
      adapters.delete(id);
    },

    setConsent(next) {
      consent = { ...consent, ...next };
    },

    getConsent() {
      return { ...consent };
    },

    setEnabled(next) {
      enabled = next;
    },

    isEnabled() {
      return enabled;
    },

    adapterCount() {
      return adapters.size;
    },
  };
}