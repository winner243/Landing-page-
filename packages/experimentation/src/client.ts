/**
 * ExperimentClient (Roadmap 4.2).
 *
 * Server-safe variant attribution with consent-aware exposure tracking.
 * Integrates with @landing/analytics: every non-fallback assignment
 * emits an `experiment_exposure` event once (deduplicated per experiment).
 *
 * Usage:
 *   const exp = createExperiment({
 *     assignments: { "hero_headline": "variant_b" },
 *     visitorId: "user_123",
 *     analytics,        // @landing/analytics client
 *     consent,          // consent state from @landing/analytics
 *   });
 *
 *   const variant = exp.variant("hero_headline", ["control", "variant_b"]);
 */

import {
  createAnalytics,
  type AnalyticsClient,
  type LandingEvent,
} from "@landing/analytics";
import {
  assignVariant,
  type ExperimentAssignment,
  type ExperimentDefinition,
} from "./types.ts";

/**
 * Minimal consent shape expected by the experiment client.
 */
export interface ExperimentConsent {
  analytics: "granted" | "denied" | "not_decided";
  marketing?: "granted" | "denied" | "not_decided";
}

/**
 * Options for createExperiment.
 */
export interface ExperimentClientOptions {
  /** Current variant assignments (from middleware / cookie / URL). */
  assignments: Readonly<Record<string, VariantName>>;
  /** Stable visitor identifier (cookie, user id, …). */
  visitorId: string;
  /** Optional analytics client (default: module-level @landing/analytics). */
  analytics?: AnalyticsClient;
  /** Consent state — exposure events only sent when analytics granted. */
  consent?: ExperimentConsent;
  /** Dedup exposure events per experiment (default: true). */
  dedupeExposure?: boolean;
}

export interface ExperimentClient {
  /** Resolve the variant for an experiment definition. */
  variant(
    experimentId: string,
    variants: readonly VariantName[],
    fallback?: VariantName,
  ): VariantName;

  /** Resolve with full assignment metadata. */
  assignment(
    experimentId: string,
    variants: readonly VariantName[],
    fallback?: VariantName,
  ): ExperimentAssignment;

  /** Check whether a visitor is inside the traffic slice for an experiment. */
  isInTraffic(experimentId: string): boolean;

  /** Record exposure for an experiment (idempotent when dedupe enabled). */
  trackExposure(experimentId: string, variant: VariantName): void;

  /** Current assignments snapshot. */
  getAssignments(): Readonly<Record<string, VariantName>>;

  /** Replace assignments (e.g. after cookie update). */
  setAssignments(assignments: Readonly<Record<string, VariantName>>): void;
}

export type VariantName = string;

/** Exposure events already sent (in-memory dedup). */
let exposedExperiments = new Set<string>();

/**
 * Build an experiment_exposure analytics event.
 */
function exposureEvent(
  experimentId: string,
  variant: VariantName,
): LandingEvent {
  return {
    type: "experiment_exposure",
    experimentId,
    variant,
  };
}

export function createExperiment(
  options: ExperimentClientOptions,
): ExperimentClient {
  const {
    assignments,
    visitorId,
    analytics,
    consent,
    dedupeExposure = true,
  } = options;

  const clientAnalytics = analytics ?? createAnalytics();
  let currentAssignments = { ...assignments };
  let currentConsent = consent ?? {
    analytics: "not_decided",
  };
  let exposed = dedupeExposure ? new Set<string>(exposedExperiments) : new Set();

  return {
    variant(experimentId, variants, fallback) {
      const def: ExperimentDefinition = {
        id: experimentId,
        variants,
        fallback,
      };
      const a = assignVariant(def, currentAssignments, visitorId);
      return a.variant;
    },

    assignment(experimentId, variants, fallback) {
      const def: ExperimentDefinition = {
        id: experimentId,
        variants,
        fallback,
      };
      return assignVariant(def, currentAssignments, visitorId);
    },

    isInTraffic(experimentId) {
      const def: ExperimentDefinition = {
        id: experimentId,
        variants: ["control"],
      };
      // Re-derive with full definition if known; without it we can only
      // check whether an explicit assignment exists.
      return experimentId in currentAssignments;
    },

    trackExposure(experimentId, variant) {
      const granted =
        currentConsent.analytics === "granted";
      if (!granted) return;

      if (dedupeExposure && exposed.has(experimentId)) return;

      clientAnalytics.track(exposureEvent(experimentId, variant));
      if (dedupeExposure) exposed.add(experimentId);
    },

    getAssignments() {
      return { ...currentAssignments };
    },

    setAssignments(next) {
      currentAssignments = { ...next };
    },
  };
}