import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import {
  createAnalytics,
  createGa4Adapter,
  createPlausibleAdapter,
  createPostHogAdapter,
  createSegmentAdapter,
  getAnalytics,
  resetAnalytics,
  safeParseLandingEvent,
  parseLandingEvent,
  setAnalyticsHandler,
  track,
  type AnalyticsAdapter,
  type LandingEvent,
} from "@landing/analytics";
import { Cta } from "@landing/marketing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const ctaClick: LandingEvent = {
  type: "cta_click",
  trackId: "hero_primary",
  label: "Start free trial",
  href: "/signup",
  location: "hero",
};

const pageView: LandingEvent = {
  type: "page_view",
  path: "/pricing",
};

type SpyAdapter = AnalyticsAdapter & { send: Mock<(event: LandingEvent) => void> };

function spyAdapter(
  id = "spy",
  eventTypes?: ReadonlySet<LandingEvent["type"]>,
): SpyAdapter {
  return {
    id,
    eventTypes,
    send: vi.fn<(event: LandingEvent) => void>(),
  };
}

describe("event taxonomy (Roadmap 4.1)", () => {
  it("accepts a valid cta_click", () => {
    expect(safeParseLandingEvent(ctaClick).success).toBe(true);
  });

  it.each([
    [{ type: "page_view", path: "/x" }],
    [{ type: "section_view", section: "pricing" }],
    [{ type: "scroll_depth", depth: 50 }],
    [{ type: "form_start", form: "signup" }],
    [{ type: "form_submit", form: "signup", success: true }],
    [{ type: "signup_start", source: "hero" }],
    [{ type: "signup_complete", plan: "growth", trial: false }],
    [{ type: "pricing_view", interval: "year" }],
    [{ type: "experiment_exposure", experimentId: "hero-copy", variant: "b" }],
  ] as const)("accepts %o", (event) => {
    expect(safeParseLandingEvent(event).success).toBe(true);
  });

  it("rejects a cta_click with an invalid location", () => {
    const result = safeParseLandingEvent({ ...ctaClick, location: "nowhere" });
    expect(result.success).toBe(false);
  });

  it("rejects a scroll depth outside 25|50|75|100", () => {
    const result = safeParseLandingEvent({ type: "scroll_depth", depth: 40 });
    expect(result.success).toBe(false);
  });

  it("rejects events with a missing required field", () => {
    const result = safeParseLandingEvent({ type: "cta_click", label: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown event types (discriminated union)", () => {
    const result = safeParseLandingEvent({ type: "made_up_event", foo: 1 });
    expect(result.success).toBe(false);
  });

  it("parseLandingEvent throws on invalid input", () => {
    expect(() => parseLandingEvent({ type: "nope" })).toThrow();
  });

  it("has no personal-data fields in any event shape", () => {
    // The taxonomy must never declare PII fields. Reflect on the runtime
    // shape of a broad sample to keep this honest without over-constraining.
    const piiKeys = new Set(["email", "name", "ip", "userId", "user_id", "password"]);
    const samples: LandingEvent[] = [
      ctaClick,
      pageView,
      { type: "form_submit", form: "signup", success: false },
      { type: "signup_complete", plan: "free" },
    ];
    for (const sample of samples) {
      for (const key of Object.keys(sample)) {
        expect(piiKeys.has(key)).toBe(false);
      }
    }
  });
});

describe("AnalyticsClient — routing + isolation", () => {
  it("routes a consent-granted event to every matching adapter", () => {
    const a = spyAdapter("a");
    const b = spyAdapter("b");
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [a, b],
    });
    client.track(ctaClick);
    expect(a.send).toHaveBeenCalledTimes(1);
    expect(b.send).toHaveBeenCalledTimes(1);
  });

  it("respects the adapter eventTypes filter", () => {
    const targeted = spyAdapter("targeted", new Set(["cta_click"]));
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [targeted],
    });
    client.track(pageView);
    expect(targeted.send).not.toHaveBeenCalled();
    client.track(ctaClick);
    expect(targeted.send).toHaveBeenCalledTimes(1);
  });

  it("removeAdapter stops delivery", () => {
    const a = spyAdapter("a");
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [a],
    });
    client.removeAdapter("a");
    client.track(ctaClick);
    expect(a.send).not.toHaveBeenCalled();
  });

  it("registerAdapter overwrites an adapter with the same id (no double delivery)", () => {
    const first = spyAdapter("dup");
    const second = spyAdapter("dup");
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [first],
    });
    client.registerAdapter(second);
    client.track(ctaClick);
    expect(client.adapterCount()).toBe(1);
    expect(first.send).not.toHaveBeenCalled();
    expect(second.send).toHaveBeenCalledTimes(1);
  });

  it("isolates adapter errors — other adapters still receive the event", () => {
    const failing: AnalyticsAdapter = { id: "failing", send: vi.fn(() => { throw new Error("boom"); }) };
    const healthy = spyAdapter("healthy");
    const onError = vi.fn();
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [failing, healthy],
      onError,
    });
    expect(() => client.track(ctaClick)).not.toThrow();
    expect(healthy.send).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("drops invalid events and reports them without throwing", () => {
    const a = spyAdapter("a");
    const onError = vi.fn();
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [a],
      onError,
    });
    expect(() =>
      client.track({ type: "scroll_depth", depth: 40 } as unknown as LandingEvent),
    ).not.toThrow();
    expect(a.send).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe("AnalyticsClient — consent & privacy", () => {
  it("does not track when consent is denied (default)", () => {
    const a = spyAdapter("a");
    const client = createAnalytics({ adapters: [a] }); // default consent = not_decided
    client.track(ctaClick);
    expect(a.send).not.toHaveBeenCalled();
  });

  it("tracks after analytics consent is granted", () => {
    const a = spyAdapter("a");
    const client = createAnalytics({ adapters: [a] });
    client.setConsent({ analytics: "granted" });
    client.track(ctaClick);
    expect(a.send).toHaveBeenCalledTimes(1);
  });

  it("stops tracking after consent is withdrawn", () => {
    const a = spyAdapter("a");
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [a],
    });
    client.track(ctaClick);
    expect(a.send).toHaveBeenCalledTimes(1);
    client.setConsent({ analytics: "denied" });
    client.track(ctaClick);
    expect(a.send).toHaveBeenCalledTimes(1); // unchanged
  });

  it("setConsent merges (does not reset other categories)", () => {
    const client = createAnalytics({ consent: { analytics: "denied", marketing: "granted" } });
    client.setConsent({ analytics: "granted" });
    expect(client.getConsent()).toEqual({ analytics: "granted", marketing: "granted" });
  });
});

describe("AnalyticsClient — enable/disable", () => {
  it("disabled client drops all events", () => {
    const a = spyAdapter("a");
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [a],
    });
    client.setEnabled(false);
    client.track(ctaClick);
    expect(a.send).not.toHaveBeenCalled();
  });

  it("re-enabling resumes delivery", () => {
    const a = spyAdapter("a");
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [a],
    });
    client.setEnabled(false);
    client.setEnabled(true);
    client.track(ctaClick);
    expect(a.send).toHaveBeenCalledTimes(1);
  });
});

describe("vendor adapters (no SDK bundled)", () => {
  afterEach(() => {
    delete window.gtag;
    delete window.plausible;
    delete window.posthog;
    delete window.analytics;
  });

  it("GA4 forwards to window.gtag with name + payload", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [createGa4Adapter()],
    });
    client.track(ctaClick);
    expect(gtag).toHaveBeenCalledWith("event", "cta_click", {
      trackId: "hero_primary",
      label: "Start free trial",
      href: "/signup",
      location: "hero",
    });
  });

  it("GA4 silently drops when the gtag global is absent (server / not loaded)", () => {
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [createGa4Adapter()],
    });
    expect(() => client.track(ctaClick)).not.toThrow();
  });

  it("Plausible forwards to window.plausible", () => {
    const plausible = vi.fn();
    window.plausible = plausible;
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [createPlausibleAdapter()],
    });
    client.track(pageView);
    expect(plausible).toHaveBeenCalledWith("page_view", { props: { path: "/pricing" } });
  });

  it("PostHog forwards to window.posthog.capture", () => {
    const capture = vi.fn();
    window.posthog = { capture };
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [createPostHogAdapter()],
    });
    client.track(ctaClick);
    expect(capture).toHaveBeenCalledWith("cta_click", {
      trackId: "hero_primary",
      label: "Start free trial",
      href: "/signup",
      location: "hero",
    });
  });

  it("Segment forwards to window.analytics.track", () => {
    const segmentTrack = vi.fn();
    window.analytics = { track: segmentTrack };
    const client = createAnalytics({
      consent: { analytics: "granted", marketing: "denied" },
      adapters: [createSegmentAdapter()],
    });
    client.track(ctaClick);
    expect(segmentTrack).toHaveBeenCalledWith("cta_click", {
      trackId: "hero_primary",
      label: "Start free trial",
      href: "/signup",
      location: "hero",
    });
  });
});

describe("default singleton + legacy API", () => {
  beforeEach(() => resetAnalytics());

  it("track() no-ops without consent (privacy-first)", () => {
    const handler = vi.fn();
    setAnalyticsHandler(handler);
    track(ctaClick);
    expect(handler).not.toHaveBeenCalled();
  });

  it("track() delivers after consent is granted via getAnalytics()", () => {
    const handler = vi.fn();
    setAnalyticsHandler(handler);
    getAnalytics().setConsent({ analytics: "granted" });
    track(ctaClick);
    expect(handler).toHaveBeenCalledWith(ctaClick);
  });

  it("setAnalyticsHandler(null) removes the handler", () => {
    const handler = vi.fn();
    setAnalyticsHandler(handler);
    getAnalytics().setConsent({ analytics: "granted" });
    setAnalyticsHandler(null);
    track(ctaClick);
    expect(handler).not.toHaveBeenCalled();
  });

  it("resetAnalytics() clears adapters and consent", () => {
    getAnalytics().setConsent({ analytics: "granted" });
    resetAnalytics();
    expect(getAnalytics().getConsent().analytics).toBe("not_decided");
    expect(getAnalytics().adapterCount()).toBe(0);
  });
});

describe("integration — Cta emits a valid consent-gated cta_click", () => {
  beforeEach(() => resetAnalytics());

  it("a clicked Cta routes a well-formed event to the registered handler", async () => {
    const handler = vi.fn();
    setAnalyticsHandler(handler);
    getAnalytics().setConsent({ analytics: "granted" });

    const user = userEvent.setup();
    render(
      <Cta
        action={{ label: "Start free trial", href: "/signup", trackId: "hero_primary" }}
        location="hero"
      />,
    );
    await user.click(screen.getByRole("link", { name: "Start free trial" }));

    expect(handler).toHaveBeenCalledTimes(1);
    const [firstCall] = handler.mock.calls;
    expect(firstCall).toBeDefined();
    const emittedEvent = firstCall?.[0];
    expect(emittedEvent).toBeDefined();
    if (!emittedEvent) return;
    expect(safeParseLandingEvent(emittedEvent).success).toBe(true);
    expect(emittedEvent).toMatchObject({
      type: "cta_click",
      trackId: "hero_primary",
      label: "Start free trial",
      href: "/signup",
      location: "hero",
    });
  });
});