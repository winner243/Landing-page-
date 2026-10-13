/**
 * A/B testing foundations — provider-agnostic.
 *
 * Phase 2 provides the CONVENTION: components accept a `variantName`
 * string; assignment happens outside (middleware/cookie) and flows in
 * via `resolveVariant`. Full ExperimentProvider + logging arrives Phase 4.
 */

export type VariantName = string;

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
 * Deterministic bucketing — stable assignment for a given visitorId
 * (useful for server-side assignment before cookie exists).
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
