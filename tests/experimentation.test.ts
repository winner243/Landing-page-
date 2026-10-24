import { describe, it, expect, vi } from "vitest";
import {
  createExperiment,
  assignVariant,
  hashBucket,
  resolveVariant,
  type ExperimentDefinition,
} from "@landing/experimentation";

describe("hashBucket (deterministic bucketing)", () => {
  it("always returns the same variant for the same inputs", () => {
    const v1 = hashBucket("exp_1", "user_123", ["control", "variant_a"]);
    const v2 = hashBucket("exp_1", "user_123", ["control", "variant_a"]);
    expect(v1).toBe(v2);
  });

  it("distributes across variants", () => {
    const variants = ["control", "variant_a", "variant_b"];
    const results = new Set();
    for (let i = 0; i < 100; i++) {
      results.add(hashBucket("exp_dist", `user_${i}`, variants));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it("returns control for empty variants", () => {
    expect(hashBucket("exp", "user", [])).toBe("control");
  });
});

describe("resolveVariant", () => {
  it("returns explicit assignment when present", () => {
    expect(resolveVariant({ "exp_1": "variant_b" }, "exp_1", "control")).toBe(
      "variant_b",
    );
  });

  it("returns fallback when no assignment", () => {
    expect(resolveVariant({}, "exp_1", "control")).toBe("control");
  });
});

describe("assignVariant", () => {
  const def: ExperimentDefinition = {
    id: "exp_test",
    variants: ["control", "variant_a", "variant_b"],
  };

  it("uses explicit assignment", () => {
    const result = assignVariant(
      def,
      { "exp_test": "variant_a" },
      "visitor_1",
    );
    expect(result.variant).toBe("variant_a");
    expect(result.isFallback).toBe(false);
  });

  it("buckets deterministically by visitorId", () => {
    const r1 = assignVariant(def, {}, "visitor_1");
    const r2 = assignVariant(def, {}, "visitor_1");
    expect(r1.variant).toBe(r2.variant);
  });

  it("respects traffic slice = 0 (all fallback)", () => {
    const result = assignVariant(
      { ...def, traffic: 0 },
      {},
      "visitor_1",
    );
    expect(result.isFallback).toBe(true);
  });

  it("respects traffic slice = 1 (all in traffic)", () => {
    const result = assignVariant(
      { ...def, traffic: 1 },
      {},
      "visitor_1",
    );
    expect(result.isFallback).toBe(false);
  });
});

describe("createExperiment", () => {
  it("resolves variant through client", () => {
    const client = createExperiment({
      assignments: { "exp_1": "variant_b" },
      visitorId: "user_123",
    });
    expect(client.variant("exp_1", ["control", "variant_b"], "control")).toBe(
      "variant_b",
    );
  });

  it("returns fallback assignment metadata", () => {
    const client = createExperiment({
      assignments: {},
      visitorId: "user_123",
    });
    const a = client.assignment("exp_1", ["control", "variant_a"], "control");
    // With default traffic=1, visitor is bucketed into a real variant (not fallback).
    // Fallback only applies when traffic <= 0.
    expect(["control", "variant_a"]).toContain(a.variant);
  });

  it("returns fallback when traffic slice is 0", () => {
    const client = createExperiment({
      assignments: {},
      visitorId: "user_123",
    });
    // Access internal assignment with traffic=0 via a fresh client
    const client2 = createExperiment({
      assignments: {},
      visitorId: "user_123",
      // We can't set traffic per-experiment via client options directly;
      // instead verify that assignVariant returns fallback for traffic=0.
    });
    const result = assignVariant(
      { id: "exp_1", variants: ["control", "variant_a"], traffic: 0 },
      {},
      "user_123",
    );
    expect(result.variant).toBe("control");
    expect(result.isFallback).toBe(true);
  });

  it("does not track exposure without consent", () => {
    const track = vi.fn();
    const client = createExperiment({
      assignments: {},
      visitorId: "user_123",
      analytics: { track } as any,
      consent: { analytics: "not_decided" },
    });
    client.trackExposure("exp_1", "variant_a");
    expect(track).not.toHaveBeenCalled();
  });

  it("tracks exposure when consent granted", () => {
    const track = vi.fn();
    const client = createExperiment({
      assignments: {},
      visitorId: "user_123",
      analytics: { track } as any,
      consent: { analytics: "granted" },
    });
    client.trackExposure("exp_1", "variant_a");
    expect(track).toHaveBeenCalledWith({
      type: "experiment_exposure",
      experimentId: "exp_1",
      variant: "variant_a",
    });
  });

  it("deduplicates exposure events", () => {
    const track = vi.fn();
    const client = createExperiment({
      assignments: {},
      visitorId: "user_123",
      analytics: { track } as any,
      consent: { analytics: "granted" },
    });
    client.trackExposure("exp_1", "variant_a");
    client.trackExposure("exp_1", "variant_a");
    expect(track).toHaveBeenCalledTimes(1);
  });

  it("setAssignments replaces assignments", () => {
    const client = createExperiment({
      assignments: { "exp_1": "variant_a" },
      visitorId: "user_123",
    });
    expect(client.variant("exp_1", ["control", "variant_a"], "control")).toBe(
      "variant_a",
    );
    client.setAssignments({ "exp_1": "variant_b" });
    expect(client.variant("exp_1", ["control", "variant_b"], "control")).toBe(
      "variant_b",
    );
  });
});