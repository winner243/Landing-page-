/**
 * Experimentation / A/B Testing types (Roadmap 4.2).
 *
 * Stable, privacy-aware variant attribution for landing pages.
 * The kit never assigns variants by itself — assignment comes from
 * server-side middleware / cookies / URL params and flows in through
 * the ExperimentClient. Components render deterministically from the
 * resolved variant (no client-side flicker).
 */

export type VariantName = string;

export interface ExperimentDefinition {
  /** Stable experiment id (e.g. "hero_headline", "cta_color"). */
  id: string;
  /** All possible variants. First is the control by convention. */
  variants: readonly VariantName[];
  /** Variant shown when no assignment exists (default: variants[0]). */
  fallback?: VariantName;
  /** Traffic slice: 0 = no one, 1 = everyone (default: 1). */
  traffic?: number;
  /** Consent category required to track exposure (default: "analytics"). */
  consentCategory?: "analytics" | "marketing";
}

export interface ExperimentAssignment {
  experimentId: string;
  variant: VariantName;
  /** true when the variant came from fallback (no real assignment). */
  isFallback: boolean;
}

export interface ExperimentEvent {
  type: "experiment_exposure";
  experimentId: string;
  variant: VariantName;
}

/**
 * Resolves the variant for an experiment from an assignment record.
 * Assignments come from server-side middleware/cookies — no client
 * flicker, no provider dependency.
 */
export function resolveVariant(
  assignments: Readonly<Record<string, VariantName>>,
  experimentId: string,
  fallback: VariantName = "control",
): VariantName {
  return assignments[experimentId] ?? fallback;
}

/**
 * Deterministic bucketing — stable assignment for a given visitorId.
 * Useful for server-side assignment before a cookie exists.
 * NOT cryptographically random: fine for UX experiments, not for
 * security-sensitive decisions.
 */
export function hashBucket(
  experimentId: string,
  visitorId: string,
  variants: readonly VariantName[],
): VariantName {
  if (variants.length === 0) return "control";
  let hash = 0;
  const key = `${experimentId}:${visitorId}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % variants.length;
  return variants[index] ?? variants[0] ?? "control";
}

/**
 * Assigns a variant for an experiment, respecting traffic slice.
 * Returns { variant, isFallback }.
 *
 * - If an explicit assignment exists for the experiment, use it.
 * - Otherwise, if traffic < 1, bucket by visitorId: only visitors whose
 *   hash falls within [0, traffic) get a real variant; others get fallback.
 * - Otherwise bucket by visitorId across all variants.
 */
export function assignVariant(
  experiment: ExperimentDefinition,
  assignments: Readonly<Record<string, VariantName>>,
  visitorId: string,
): ExperimentAssignment {
  const explicit = assignments[experiment.id];
  if (explicit) {
    return { experimentId: experiment.id, variant: explicit, isFallback: false };
  }

  const traffic = experiment.traffic ?? 1;
  if (traffic <= 0) {
    return {
      experimentId: experiment.id,
      variant: experiment.fallback ?? experiment.variants[0]!,
      isFallback: true,
    };
  }

  const variants = experiment.variants;
  if (traffic >= 1 || variants.length <= 1) {
    return {
      experimentId: experiment.id,
      variant: hashBucket(experiment.id, visitorId, variants),
      isFallback: false,
    };
  }

  // Traffic slice: bucket into [0, 1) and compare with traffic.
  let hash = 0;
  const key = `${experiment.id}:${visitorId}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  const bucket = Math.abs(hash) / 0x7fffffff; // [0, 1)

  if (bucket >= traffic) {
    return {
      experimentId: experiment.id,
      variant: experiment.fallback ?? variants[0]!,
      isFallback: true,
    };
  }

  // Within traffic: map bucket to a variant index proportionally.
  const index = Math.floor(bucket / traffic * variants.length);
  return {
    experimentId: experiment.id,
    variant: variants[Math.min(index, variants.length - 1)]!,
    isFallback: false,
  };
}