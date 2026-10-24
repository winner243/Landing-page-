/**
 * A/B testing foundations (Roadmap 4.2).
 *
 * Provider-agnostic variant attribution. Components accept a `variantName`
 * string; assignment happens outside (middleware/cookie) and flows in
 * via ExperimentClient / ExperimentProvider. Full ExperimentProvider +
 * logging arrives here.
 */

export {
  assignVariant,
  hashBucket,
  resolveVariant,
  type ExperimentDefinition,
  type ExperimentAssignment,
  type VariantName,
} from "./types.ts";

export {
  createExperiment,
  type ExperimentClient,
  type ExperimentClientOptions,
  type ExperimentConsent,
} from "./client.ts";

export {
  ExperimentProvider,
  useVariant,
  useAssignment,
  Experiment,
  type ExperimentClient as ReactExperimentClient,
} from "./react.tsx";