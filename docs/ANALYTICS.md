# Analytics — Landing Marketing Kit

> Provider-agnostic event tracking for landing pages. Emits typed events,
> routes them to optional adapters, and gates delivery on user consent.
> Privacy-first by default: nothing is tracked until consent is granted.

---

## 1. What it provides

| Piece | Responsibility |
|-------|----------------|
| **Taxonomy** (`events.ts`) | Typed, Zod-validated marketing events (page views, CTA clicks, forms, signups, pricing, experiments). |
| **Client** (`client.ts`) | Provider-neutral engine: validate → consent-check → route to adapters. Never throws. |
| **Consent** (`consent.ts`) | Consent state (`granted` / `denied` / `not_decided`) per category; default = nothing granted. |
| **Adapters** (`adapters/`) | GA4, Plausible, PostHog, Segment — forward to official browser globals; no-op when absent. |
| **Entry point** (`index.ts`) | `track()`, `setAnalyticsHandler()`, `getAnalytics()`, `resetAnalytics()`. |

---

## 2. Installation

`@landing/analytics` is a workspace package. It depends on `zod` (already in the lockfile). No vendor SDK is bundled:

```bash
# From the workspace root (pnpm)
pnpm install   # zod is already a dependency of @landing/analytics
```

Consumers install whatever vendor snippet they want to use (GA4 gtag.js, Plausible, PostHog, Segment) — the kit never imports it.

---

## 3. Quick start

```ts
import { createAnalytics, createGa4Adapter, createPlausibleAdapter } from "@landing/analytics";

// 1. Create the client — privacy-first: consent is not_decided by default.
const analytics = createAnalytics({
  adapters: [
    createGa4Adapter(),
    createPlausibleAdapter(),
  ],
});

// 2. Grant consent when the user accepts (your cookie banner owns this).
analytics.setConsent({ analytics: "granted", marketing: "denied" });

// 3. Track.
analytics.track({
  type: "cta_click",
  trackId: "hero_primary",
  label: "Start free trial",
  href: "/signup",
  location: "hero",
});
```

Legacy module-level API (pre-4.1, kept for compatibility):

```ts
import { track, setAnalyticsHandler, resetAnalytics } from "@landing/analytics";

setAnalyticsHandler((event) => myVendor.send(event));
track({ type: "cta_click", trackId: "hero_primary", label: "...", location: "hero" });
```

---

## 4. Event taxonomy

Every event is validated against a Zod schema before delivery. Invalid events are dropped and reported via `onError` (never crash the UI).

| Event | `type` | Key properties | Consent category |
|-------|--------|----------------|------------------|
| Page view | `page_view` | `path`, `title?` | analytics |
| Section view | `section_view` | `section`, `variant?` | analytics |
| Scroll depth | `scroll_depth` | `depth` (25\|50\|75\|100) | analytics |
| CTA click | `cta_click` | `trackId`, `label`, `href?`, `location`, `variant?` | analytics |
| Form start | `form_start` | `form` | analytics |
| Form submit | `form_submit` | `form`, `success` | analytics |
| Signup start | `signup_start` | `source?` | analytics |
| Signup complete | `signup_complete` | `plan?`, `source?`, `trial?` | analytics |
| Pricing view | `pricing_view` | `plan?`, `interval?` | analytics |
| Experiment exposure | `experiment_exposure` | `experimentId`, `variant` | analytics |

**Privacy**: no event shape declares email, name, IP, user id, password, or full URLs with secrets. Integrating apps must strip secrets/tokens from `href` and other strings before calling `track()`.

---

## 5. Consent & privacy (read before shipping)

- **Default: disabled.** `consent.analytics` and `consent.marketing` start at `"not_decided"`. No event leaves the process until explicitly granted.
- **Withdrawal works.** Calling `setConsent({ analytics: "denied" })` stops delivery immediately.
- **The kit provides the mechanism, not legal compliance.** The integrating application owns:
  - Collecting consent (cookie banner, settings UI).
  - Re-checking consent against the applicable law (GDPR, ePrivacy, CCPA, CNIL…).
  - Documenting what is tracked and why.
- **No automatic legal conformance.** Use this kit as a technical enforcement layer; obtain legal review for your jurisdiction.

---

## 6. Adapters (vendor-neutral, optional)

Adapters forward validated events to official browser globals. They **no-op silently** when the global is absent (server-side rendering, or vendor script not yet loaded) — so the kit works without any vendor dependency.

| Adapter | Global | Notes |
|---------|--------|-------|
| `createGa4Adapter()` | `window.gtag` | GA4 measurement id configured by your snippet (`gtag("config", "G-…")`). |
| `createPlausibleAdapter()` | `window.plausible` | `plausible(eventName, { props })`. |
| `createPostHogAdapter()` | `window.posthog.capture` | API key configured by your snippet (`posthog.init("…")`). |
| `createSegmentAdapter()` | `window.analytics.track` | Write key configured by your snippet. |

No adapter SDK is a dependency of `@landing/analytics`. Load the vendor script yourself.

Example with consent-gated adapter selection:

```ts
const analytics = createAnalytics({
  consent: { analytics: "not_decided", marketing: "not_decided" },
  adapters: [createGa4Adapter(), createPlausibleAdapter()],
});

// After cookie banner "accept analytics":
analytics.setConsent({ analytics: "granted" });
```

---

## 7. Integration with marketing components

`@landing/marketing` components already emit `cta_click` through `track()`:

- `Cta`, `CtaGroup`, `CtaBanner`, `CtaWithProof`, `FinalCta` call `track({ type: "cta_click", … })` on click.
- Each CTA carries `trackId`, `label`, `href?`, `location`, `variant?`.

No double events: each component emits once per click, keyed by its `trackId`. Do not wrap the same `<Cta>` in an additional `onClick` that calls `track()` again.

Server-side rendering: `track()` is safe on the server — `window` globals are absent, adapters no-op, no event is delivered.

---

## 8. API reference

### `createAnalytics(options?) → AnalyticsClient`

Options:
- `consent?: ConsentState` — initial consent (default: all `not_decided`).
- `enabled?: boolean` — global kill switch (default: `true`).
- `adapters?: AnalyticsAdapter[]` — adapters to register.
- `onError?(error, context)` — error sink for invalid events / adapter failures (default: silent).

Client methods: `track(event)`, `registerAdapter(adapter)`, `removeAdapter(id)`, `setConsent(partial)`, `getConsent()`, `setEnabled(bool)`, `isEnabled()`, `adapterCount()`.

### `AnalyticsAdapter`

```ts
interface AnalyticsAdapter {
  id: string;
  eventTypes?: ReadonlySet<LandingEvent["type"]>;
  send(event: LandingEvent): void; // MUST NOT throw
}
```

### `track(event)` / `setAnalyticsHandler(handler)` / `resetAnalytics()`

Module-level defaults backed by a lazily-created client. `setAnalyticsHandler(null)` removes the legacy handler. Prefer `getAnalytics().registerAdapter(...)` for new code.

---

## 9. Tests

Run the analytics suite:

```bash
# Fast logic tests (node environment, no jsdom worker)
npx vitest run -c vitest.node.config.ts tests/analytics.test.tsx

# Full suite including vendor-adapter + CTA integration (jsdom)
npx vitest run -c vitest.local.config.ts tests/analytics.test.tsx
```

38 tests cover: event validation, adapter routing, `eventTypes` filtering, add/remove/re-register adapters, adapter error isolation, consent grant/withdraw/merge, enable/disable, vendor globals (present / absent), legacy singleton API, and `Cta` integration.

---

## 10. Roadmap status

| Item | Status |
|------|--------|
| 4.1.1 Event taxonomy (typed + validated) | ✅ Done |
| 4.1.2 Provider-independent API | ✅ Done |
| 4.1.3 Adapters (GA4, Plausible, PostHog, Segment) | ✅ Interfaces + tests (no SDK bundled) |
| 4.1.4 Consent & privacy | ✅ Done (denied by default) |
| 4.1.5 Integration with marketing components | ✅ `Cta` already emits `cta_click` |
| 4.1.6 Tests + documentation | ✅ Done |

---

## 11. Responsibilities & limits

- The kit never collects PII. It is the integrating app's responsibility to avoid sending secrets.
- No SDK is bundled; adapter delivery depends on the vendor global being present.
- `onError` receives adapter failures but delivery to other adapters continues.
- Legal compliance (GDPR, ePrivacy, CCPA…) remains the integrating app's responsibility.