"use client";

import * as React from "react";
import {
  createExperiment,
  type ExperimentClient,
  type ExperimentClientOptions,
  type VariantName,
} from "./client.ts";

/**
 * Experiment context — holds the ExperimentClient for the subtree.
 * Created once per provider instance; stable across renders.
 */
const ExperimentContext =
  React.createContext<ExperimentClient | null>(null);

/**
 * ExperimentProvider — wraps a subtree with experiment attribution.
 *
 * Props:
 *   assignments — variant assignments (from middleware / cookie / URL).
 *   visitorId — stable visitor identifier.
 *   analytics — optional @landing/analytics client.
 *   consent — current consent state.
 *   children — subtree that can call useVariant / <Experiment>.
 *
 * SSR-safe: same assignments on server and client → no hydration mismatch,
 * no client-side flicker.
 */
export function ExperimentProvider({
  assignments,
  visitorId,
  analytics,
  consent,
  children,
}: ExperimentClientOptions & { children: React.ReactNode }) {
  const ctx = React.useMemo(
    () => createExperiment({ assignments, visitorId, analytics, consent }),
    [visitorId, JSON.stringify(assignments), consent?.analytics],
  );

  return (
    <ExperimentContext.Provider value={ctx}>
      {children}
    </ExperimentContext.Provider>
  );
}

/**
 * useVariant — hook to read the resolved variant for an experiment.
 *
 * Returns the variant name (or fallback). Never throws.
 */
export function useVariant(
  experimentId: string,
  variants: readonly VariantName[],
  fallback?: VariantName,
): VariantName {
  const ctx = React.useContext(ExperimentContext);
  if (!ctx) {
    console.warn(
      `[landing/experimentation] useVariant("${experimentId}") used outside ExperimentProvider. Returning fallback.`,
    );
    return fallback ?? variants[0] ?? "control";
  }
  return ctx.variant(experimentId, variants, fallback);
}

/**
 * useAssignment — hook to read the full assignment metadata.
 */
export function useAssignment(
  experimentId: string,
  variants: readonly VariantName[],
  fallback?: VariantName,
) {
  const ctx = React.useContext(ExperimentContext);
  if (!ctx) {
    return {
      experimentId,
      variant: fallback ?? variants[0] ?? "control",
      isFallback: true,
    };
  }
  return ctx.assignment(experimentId, variants, fallback);
}

/**
 * Experiment — render different content per variant.
 *
 * Renders children only when the experiment's resolved variant matches
 * one of the given `variants` (or renders `fallback` content otherwise).
 * Consent-aware: exposure is tracked when the variant is not the control
 * fallback and analytics consent is granted.
 *
 * Props:
 *   id — experiment id.
 *   variants — variants that should render `children`.
 *   children — content for matching variants.
 *   fallback — content for non-matching / control variants.
 *   controlVariant — name of the control variant (default: "control").
 */
export function Experiment({
  id,
  variants,
  children,
  fallback,
  controlVariant = "control",
}: {
  id: string;
  variants: readonly VariantName[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  controlVariant?: VariantName;
}) {
  const ctx = React.useContext(ExperimentContext);
  const resolved = ctx
    ? ctx.assignment(id, variants, controlVariant)
    : {
        id,
        variant: controlVariant,
        isFallback: true,
      };

  const isTreatment = variants.includes(resolved.variant);
  const showChildren = isTreatment && resolved.variant !== controlVariant;

  // Track exposure for treatment variants (deduplicated by client).
  React.useEffect(() => {
    if (ctx && showChildren) {
      ctx.trackExposure(id, resolved.variant);
    }
  }, [ctx, id, resolved.variant, showChildren]);

  return showChildren ? children : fallback ?? null;
}

/** Re-export types for consumers. */
export type { ExperimentClient, ExperimentClientOptions, VariantName };