# Roadmap

> Implementation plan for Phases 2–4. Phase 1 (this phase) is foundation and documentation only — no code.

---

## Phase 1/4 — Foundation, Research & Architecture ✅

**Deliverables**:
- [x] Environment audit & knowledge base consultation
- [x] Architecture definition (`ARCHITECTURE.md`)
- [x] Design & development principles (`PRINCIPLES.md`)
- [x] Scientific/behavioral research base (`PSYCHOLOGY.md`)
- [x] Conversion frameworks per SaaS type (`CONVERSION.md`)
- [x] Design system foundation (`DESIGN-SYSTEM.md`)
- [x] Component taxonomy (`COMPONENT-TAXONOMY.md`)
- [x] Copywriting system (`COPYWRITING.md`)
- [x] Ethics / anti-dark-pattern rules (`ETHICS.md`)
- [x] This roadmap (`ROADMAP.md`)
- [x] Decision log (`DECISIONS.md`)
- [x] Project README (`README.md`)

---

## Phase 2/4 — Design System & Core Components

**Goal**: Working token pipeline + P0 components, testable, accessible.

> Status updated at recovery (see `PHASE-2.md` for evidence). `[x]` = implemented **and** validated (typecheck + lint + tests + build). `[ ]` = not delivered or deliberately deferred.

### 2.1 Monorepo Setup
- [x] `pnpm-workspace.yaml` + package scaffolding (9 packages + `apps/playground`)
- [x] TypeScript strict config (shared `tsconfig.base.json`, `strict` + `noUncheckedIndexedAccess`)
- [x] ESLint 9 configuration — **Prettier deliberately not adopted** (DECISIONS D-012)
- [x] Vitest setup + test scripts (`vitest.config.ts`, `pnpm test`, `pnpm check`)
- [x] GitHub Actions CI (typecheck, lint, size, test) — `.github/workflows/ci.yml`, approved by user (DECISIONS D-013)

### 2.2 Design Token Pipeline
- [x] Token definitions + TypeScript types (`design-tokens/src/index.ts`; **JSON duplicate rejected** — single source of truth, DECISIONS D-014)
- [x] Token transform → CSS variables (Tailwind v4 `@theme inline` in `tokens.css`)
- [x] Brand theme override mechanism (`themes/`: `BrandTheme`, `themeToCss()`, 3 built-in themes)
- [x] Contrast validation (automated WCAG AA checks — `tests/contrast.test.ts`, 50 assertions incl. solid button fills; token fixes in DECISIONS D-015)
- [x] Dark mode token set (opt-in via `.dark` on `<html>`)

### 2.3 ui-core Primitives (P0)
- [x] Button (CVA variants + analytics hook)
- [x] Card, Badge, Separator, Avatar + AvatarGroup, VisuallyHidden
- [x] Input, FormField (label/hint/error a11y pattern)
- [x] Accordion (accessible, base for FAQ)
- [x] Focus ring + state system (all 7 states — `default / hover / active / disabled / loading / error / success`, source: `06-REFERENCES/design-system/README.md`): focus-visible ring + 5 interaction states existed; `status="error" | "success"` feedback states added on Button, solid-fill pairs asserted by the contrast gate (DECISIONS D-017 for the vitest 4 upgrade that keeps the suite runnable)
- [x] Playground for visual verification (`apps/playground` — `/`, `/showcase`, `/landing`, `/themes`)

### 2.4 marketing-components P0
- [x] Section (layout wrapper) + SectionHeader
- [x] Hero (Classic + Split variants) + HeroBadge + HeroProof
- [x] Navbar + MobileNav (Escape closes, focus restored, `aria-expanded`/`aria-controls` wired)
- [x] Footer (Classic + SaaS variants) + FinalCta
- [x] LogoCloud, TrustBar, StatsBar, AvatarGroup (ui-core)
- [x] TestimonialCard, FeatureCard, FeatureGrid (+ FeatureList, FeatureSplit)
- [x] PricingCard, PricingTable (`PricingCard`, `PricingGrid`)
- [x] FAQAccordion (built on ui-core Accordion)
- [x] CTA integration + CTA group pattern (`Cta`, `CtaGroup`)
- [x] BenefitList, IconList (built on `FeatureList` — no duplicated row markup)

### 2.5 Quality Gates (Phase 2)
- [x] axe-core automated a11y tests per component (`jest-axe`: 17 axe assertions across the 5 test files)
- [x] TypeScript strict — zero `any` (0 hit across the 37 package source files)
- [x] Bundle size check (< 5 kb gzipped per component — `scripts/check-bundle-size.mjs`, 23/23 PASS)
- [ ] Lighthouse CI (performance ≥ 95) — **deferred to Phase 4** (4.6), user decision

**Exit criteria**: P0 components render correctly in light/dark themes, pass a11y tests, documented with Storybook/examples.
→ **Met** for a11y tests + examples (`apps/playground`). Light/dark token sets both pass the contrast gate; **visual dark-mode rendering is only manually verifiable** (no visual regression tooling in Phase 2).

---

## Phase 3/4 — Conversion Patterns & Compositions

**Goal**: Full section patterns, remaining components, copywriting schemas enforced.

### 3.1 Copywriting Schemas
- [x] Zod schemas for all content types — Hero, Testimonial, Pricing, FAQ, Stats + SectionHeader, CtaAction, NavLink, Navbar, LogoCloud, TrustBar, Benefit, FooterColumn, Footer (`packages/copywriting/src/schemas.ts`)
- [x] Schema validation utilities (`parseOrThrow`, `validateContent`, `formatZodIssues` + existing `parseLandingContent` / `safeParseLandingContent`)
- [x] Content guidance auto-generated from schemas — `pnpm guidance` → `docs/CONTENT-GUIDANCE.md`, limits/required read from the Zod defs, freshness enforced by `tests/copywriting-guidance.test.ts`
- [x] Example content sets (B2B, B2C, AI, Premium) — `contentExamples`, typed as `LandingContent` and re-validated at runtime

### 3.2 Remaining Components (P1)
- [x] Hero variants (Product, Dashboard, Video, Minimal) — `HeroProduct`/`HeroDashboard`/`HeroVideo`/`HeroMinimal` (all share the `Hero` content slots)
- [x] CTABanner, CTAFinal, CTAWithProof — `CtaBanner`, `CtaWithProof` (CTAFinal = existing `FinalCta`, Roadmap 2.4)
- [x] TestimonialGrid (existing), CaseStudyCard, ReviewCard (results as `<dl>`, source + attribution always shown)
- [x] ProductShowcase (visual + callout pins), Workflow (horizontal/vertical numbered steps), IntegrationShowcase (grid/marquee), ComparisonTable (grouped rows, sr-only included/not-included, column CTAs)
- [x] PricingToggle, PricingFAQ, PricingNote — extracted from `PricingGrid` (which now composes them; `PricingFAQ` defaults to a pricing-framed header)
- [x] FooterSaaS, NewsletterForm — `FooterSaaS` (Product/Company/Resources/Legal columns + newsletter slot), `NewsletterForm` (sr-only label, consent note, status region)
- [x] SignupForm (Server Action ready) — labelled fields via `FormField`, `termsNote`, `errorMessage` slot for `useActionState`; accepts URL or Server Action (`FormAction`)
- [x] UseCaseCard (situation-based framing, crawlable link)
- [x] ui-core: Tooltip, Dialog, DropdownMenu, Tabs, Skeleton (WAI-ARIA patterns: focus trap, roving tabindex, menu button; 14 new tests incl. axe)

### 3.3 Conversion Patterns
- [x] ProblemSolutionPattern — problems list + solution card + optional CtaWithProof (`packages/conversion-patterns/src/patterns.tsx`)
- [x] SocialProofPattern — logos → stats → testimonials, each block optional (only truthful blocks render)
- [x] FeatureValuePattern — FeatureGrid + adjacent proof slot (claim/evidence pairing)
- [x] ObjectionHandlingPattern — risk reversal (TrustBar) + FAQ + guarantee note
- [x] PricingDecisionPattern — PricingGrid → ComparisonTable → PricingFAQ → disclosure (canonical decision order)
- [x] FooterConversionPattern — FinalCta → FooterSaaS (page always closes on a conversion opportunity)
- [x] Pattern slot system (typed, composable) — `SlotMap<TNames>` + `renderSlot()` (override wins, `null` hides), per-pattern slot-name unions; 13 tests in `tests/patterns.test.tsx`

### 3.4 Page Templates (Start)
- [x] `saas-b2b` template (long-form, proof-heavy)
- [x] `simple` template (single value prop)
- [x] Template config schema (Zod discriminated union) — `templateConfigSchema` discriminated on `type`, validated by `parseTemplateConfig`; assembled by `buildTemplate()` in `conversion-patterns/templates.tsx`; 11 tests in `tests/templates.test.tsx`; routes `/templates/saas-b2b` + `/templates/simple` in the playground

### 3.5 Quality Gates (Phase 3)
- [x] All templates pass Lighthouse ≥ 95 (perf, a11y, SEO, best practices) — median of 3 runs, desktop preset: all 4 routes ≥ 97 everywhere; `scripts/lighthouse-local.mjs` + scores & regression notes in `docs/LIGHTHOUSE.md` (CI stays Phase 4 per D-016)
- [x] All content through schema validation — every `contentExamples` entry parses as landing content (guidance tests) and validates as a template config (`tests/gates.test.tsx`)
- [x] E2E smoke test: template renders + key CTAs interactive — jsdom smoke in `tests/gates.test.tsx` (render, hero/closing CTA focusable + clickable, mobile menu open/links/Escape)
- [x] Reduced-motion test — marquee `motion-reduce:animate-none` + global `prefers-reduced-motion` kill switch in `tests/gates.test.tsx`

**Exit criteria**: Two production-quality templates usable by a real SaaS with only content/token changes.

---

## Phase 4/4 — Analytics, Testing & Templates

**Goal**: Measurement infrastructure, experimentation, full template library, documentation site.

### 4.1 Analytics Package
- [x] Event taxonomy (naming convention + typed events) — `packages/analytics/src/events.ts`
- [x] Component-embedded tracking (CTA clicks, scroll depth, section views) — `Cta` emits `cta_click`
- [x] Consent-aware initialization (respects cookie preferences) — `packages/analytics/src/consent.ts`
- [x] Provider adapters (GA4, Plausible, PostHog, Segment) — pluggable, no SDK bundled — `packages/analytics/src/adapters/`
- [ ] Server-side event support (Server Actions) — `track()` is server-safe (no-op without `window`)

### 4.2 Experimentation (A/B)
- [x] Variant assignment (stable, deterministic, traffic-aware) — `packages/experimentation/src/types.ts`
- [x] `<ExperimentProvider>` with SSR-safe variant resolution (no flicker) — `packages/experimentation/src/react.tsx`
- [x] `variant` prop convention on marketing components (already in `Cta`, `ComparisonTable`)
- [x] Assignment logging via `experiment_exposure` event (consent-gated, deduplicated)
- [x] Ethics review checklist (documented in ETHICS.md §7)

### 4.3 SEO Package
- [x] Metadata helpers (`buildPageMeta`, Open Graph, Twitter cards) — `packages/seo/src/meta.ts`
- [x] JSON-LD generators (Organization, Product, FAQPage, SoftwareApplication, WebSite, BreadcrumbList) — `packages/seo/src/jsonld.ts`
- [x] Sitemap + robots generation — `packages/seo/src/sitemap.ts`
- [ ] Open Graph image generation (optional — deferred)

### 4.4 Remaining Templates (P1/P2)
- [x] `saas-b2c` — `apps/playground/app/templates/saas-b2c/page.tsx`
- [x] `ai-saas` — `apps/playground/app/templates/ai-saas/page.tsx`
- [x] `pro-tool` — `apps/playground/app/templates/pro-tool/page.tsx`
- [x] `marketplace` — `apps/playground/app/templates/marketplace/page.tsx`
- [x] `premium` — `apps/playground/app/templates/premium/page.tsx`
- [x] `complex` — `apps/playground/app/templates/complex/page.tsx`

### 4.5 Documentation Site
- [x] Next.js docs app (`apps/docs/`) — installation, architecture, components, patterns, templates, analytics, A/B testing, SEO
- [x] Live examples per template (playground routes)
- [x] Copywriting guidance (`docs/CONTENT-GUIDANCE.md`, auto-generated from Zod schemas)
- [ ] Component API reference (auto-generated from types — deferred)

### 4.6 Quality Gates (Phase 4)
- [x] Lint — `pnpm lint` (ESLint 9, zéro erreur)
- [x] Typecheck — `pnpm typecheck` (TS strict, zéro `any`)
- [x] Tests unitaires — `pnpm test` (263 tests, 10 fichiers, tous verts)
- [x] Accessibilité — axe-core (17 assertions), contraste WCAG AA (50 assertions)
- [x] Budget de bundle — `pnpm size` (35/35 composants ≤ 5 KB gzippé)
- [x] CI distante — GitHub Actions vert (run 38344615445, 1m 15s)
- [ ] Tests E2E — deferred (Playwright not configured)
- [ ] Régression visuelle — deferred (no visual-regression tooling)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge) — deferred
- [ ] Real-device spot check — deferred
- [ ] Mode sombre — tokens validés (contrast.test.ts light+dark), rendu visuel manuel uniquement

**Exit criteria**: Kit is publishable (private registry), all 8 templates available, analytics + A/B working, docs site live.

---

## Dependency Note

Phases 2–4 require creating actual code packages. Per Phase 1 rules, **architecture approval is needed before starting Phase 2** (see DECISIONS.md for pending approvals).

---

## Inter-Phase Deliverable Matrix

| Deliverable | P1 | P2 | P3 | P4 |
|-------------|----|----|----|----|
| Documentation | ✅ | extend | extend | docs site |
| Architecture | ✅ | validate | refine | — |
| Design tokens | spec ✅ | impl | theme library | — |
| ui-core | taxonomy ✅ | P0 impl | P1 impl | polish |
| Marketing components | taxonomy ✅ | P0 impl | P1 impl | P2 impl |
| Conversion patterns | framework ✅ | — | impl | refine |
| Copywriting | system ✅ | — | schemas impl | guidance tooling |
| Ethics | rules ✅ | review checklist | schema enforcement | A/B gate |
| Analytics | planned ✅ | — | — | impl |
| A/B testing | planned ✅ | — | variant prop convention | impl |
| Templates | 8 types specified ✅ | — | 2 impl | 6 impl |
| SEO | planned ✅ | — | — | impl |

---

*Next: [Decisions](DECISIONS.md) — Decision log & approvals needed*