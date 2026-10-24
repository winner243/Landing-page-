import type { LandingEvent } from "./events.ts";

/**
 * Consent model for the analytics package (Roadmap 4.1).
 *
 * Tracking is DISABLED by default: an event only leaves the process when
 * the consent category it requires has been explicitly granted. The kit
 * provides the mechanism, not legal compliance — the integrating app owns
 * collecting consent and re-checking it against the applicable law
 * (GDPR, ePrivacy, CCPA, …). See docs/ANALYTICS.md.
 */

export type ConsentCategory = "analytics" | "marketing";

export type ConsentValue = "granted" | "denied" | "not_decided";

export type ConsentState = Readonly<Record<ConsentCategory, ConsentValue>>;

/** Privacy-first default: nothing is granted until the app decides. */
export const CONSENT_DENIED_DEFAULT: ConsentState = {
  analytics: "not_decided",
  marketing: "not_decided",
};

/**
 * The consent category an event needs before it may be delivered.
 * Every event in the current taxonomy is a behavioural/analytics event.
 * Advertising or personalisation events (none exist yet) would require
 * `"marketing"`.
 */
export function requiredConsent(_eventType: LandingEvent["type"]): ConsentCategory {
  return "analytics";
}

/** True only when the category has been explicitly granted. */
export function isConsentGranted(
  consent: ConsentState,
  category: ConsentCategory,
): boolean {
  return consent[category] === "granted";
}