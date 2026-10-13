# Phase 2 — Design System & Core Components

> Delivery status, inventory and quality-gate evidence for Phase 2/4.
> Decisions referenced here are logged in [DECISIONS.md](DECISIONS.md); roadmap checkboxes in [ROADMAP.md](ROADMAP.md).

**Status: COMPLETE** (exit criteria met — a11y tests green, examples live in the playground).
**Last validated**: 2026-09-27, on this machine with **vitest 4.1.11 / Node 24.20.0 / pnpm 11.24.0** (commands and outputs below).

---

## 1. What Phase 2 delivers

| Layer | Package | Contents |
|-------|---------|----------|
| Tokens | `@landing/design-tokens` | `tokens.css` (semantic CSS vars → Tailwind v4 `@theme inline`), typed constants in `index.ts`, light + dark (`.dark`) |
| Themes | `@landing/themes` | `BrandTheme`, `themeToCss()` / `themeToStyleTag()`, 3 built-ins (aurora, emerald, ember) |
| UI primitives | `@landing/ui-core` | Button, Badge, Card, Input + FormField, Accordion, Avatar(+Group), Separator, Container/Stack/Grid, Heading/Text, Link, MediaFrame/ResponsiveImage/VideoEmbed, VisuallyHidden |
| Marketing | `@landing/marketing` | Section, Hero(2 variants), FeatureCard/Grid/List/Split, **BenefitList, IconList**, TestimonialCard/Grid, LogoCloud, StatsBar, TrustBar, PricingCard/Grid, FaqAccordion, Cta/CtaGroup, Navbar(+mobile island), Footer, FinalCta |
| Composition | `@landing/patterns` | `LandingComposer` — sections as data, arbitrary order, `custom` escape hatch, `defaultLandingOrder()` |
| Schemas | `@landing/copywriting` | Zod schemas for hero / testimonial / pricing / FAQ content + `parseLandingContent` |
| Analytics | `@landing/analytics` | Provider-agnostic `track()` / `setAnalyticsHandler()`, `cta_click` events |
| Rest | `@landing/experimentation`, `@landing/seo` | Phase 4 placeholders (types + entry only) |
| App | `apps/playground` | `/` overview, `/showcase` (all components), `/landing` (composed page), `/themes` |

Dependency graph is one-way: `design-tokens → ui-core → marketing → patterns`.

---

## 2. Quality Gates summary

Level: **STANDARD** (UI library feature delivery — no auth, no payments, no user data, no production deploy).

```
RÉSUMÉ QUALITY GATES — landing-marketing-kit | niveau: STANDARD
CODE        : PASS      (tsc root + 9 packages, eslint 0 error, 9 package builds, next build 5 routes)
TESTS       : PASS      (vitest 4.1.11: 6 files / 146 tests / 0 failed, full suite replayed)
SÉCURITÉ    : PASS      (secrets scan clean; pnpm audit → 0 known vulnerabilities after D-017)
DATABASE    : NOT APPLICABLE (no database in this package)
PRODUCTION  : NOT VERIFIED  (CI workflow written but never executed — no git repo per D-008)
VERDICT     : PAS "PRÊT POUR PRODUCTION" au sens strict — bloquant: CI jamais exécutée (D-008).
              Les critères de sortie Phase 2 sont remplis.
```

### CODE

| Control | Status | Proof |
|---------|--------|-------|
| TypeScript strict | **PASS** | `npx tsc -p tsconfig.json --noEmit` → exit 0; `pnpm -r --workspace-concurrency 2 --filter "./packages/*" typecheck` → 9× "Done", exit 0 |
| Lint | **PASS** | `pnpm lint` → exit 0, 0 error / 0 warning |
| Formatting (Prettier) | **NOT APPLICABLE** | No formatter adopted — D-012 (ESLint covers the enforced style rules) |
| Build (packages) | **PASS** | 9× "Done", exit 0 |
| Build (playground) | **PASS** | `next build` → "Compiled successfully", TypeScript passed, 5 static routes (`/`, `/showcase`, `/landing`, `/themes`, `/_not-found`) |
| Zero `any` | **PASS** | 0 hit across the 37 package source files |

### TESTS

| Control | Status | Proof |
|---------|--------|-------|
| Unit + a11y | **PASS** | `pnpm test` → `Test Files 6 passed (6)`, `Tests 146 passed (146)` (129 Phase 2 + 17 Phase 3.1 copywriting) |
| axe-core | **PASS** | 17 `toHaveNoViolations()` assertions across the 5 a11y test files |
| Contrast (WCAG AA) | **PASS** | `tests/contrast.test.ts` → 50 assertions, both light and dark themes, incl. solid button fills |
| Regression | **PASS** | Full suite replayed after every change (initial run at recovery: 56/56; final run: 146/146 on vitest 4.1.11) |
| Integration / E2E | **NOT APPLICABLE** | No server, no database, no network in this phase (E2E lands with Phase 3 templates) |

### SÉCURITÉ

| Control | Status | Proof |
|---------|--------|-------|
| Secrets | **PASS** | Equivalent of `scan-secrets.ps1` run over all 98 project files (script itself needs `git ls-files`; no repo per D-008): **0 hits**, no `.env` files |
| Dependencies | **PASS** | `pnpm audit --audit-level moderate` → **0 known vulnerabilities** after the approved `vitest` 4.1.11 upgrade (D-017, cleared GHSA-82fw-gwwq-j7x9) |
| Auth / RBAC / API / injections / rate limiting / PII | **NOT APPLICABLE** | No backend, no auth, no API, no personal data in the kit |

### PRODUCTION

| Control | Status | Proof |
|---------|--------|-------|
| CI/CD | **NOT VERIFIED** | `.github/workflows/ci.yml` written (typecheck → lint → size → test) but never executed: no `git init`, no push (D-008 / D-013) |
| Environment variables | **NOT APPLICABLE** | `process.env` / `NEXT_PUBLIC_` usage: 0 hit in project source |
| Monitoring / logs | **NOT APPLICABLE** | Library, not a deployed service |
| Performance (bundle) | **PASS** | `pnpm size` → 23/23 components ≤ 5120 B gzipped (largest: `pricing.tsx` 4115 B) |
| Accessibility | **PASS** | 17 axe assertions + 50 contrast assertions, all green |
| Full gate | **PASS** | `pnpm check` (typecheck → lint → size → test) exit 0; `next build` exit 0 (5 static routes) |

---

## 3. Recovery + changes made during this session

Recovered state: tokens, themes, ui-core, marketing components, composition, playground, tests and docs from Phase 1 were already on disk and passing; the machine stopped during a validation pass.

| Change | Why |
|--------|-----|
| Removed unused `Container` import in `apps/playground/app/showcase/page.tsx` | Only lint error inherited from the interruption |
| Added `tests/marketing.test.tsx` coverage for FAQ, Navbar (incl. mobile menu + Escape/focus restore), Footer/FinalCta, Feature, Proof, BenefitList/IconList | Roadmap 2.4/2.5 components were untested |
| Added `tests/contrast.test.ts` (50 assertions, incl. white-on-fill button pairs) | Roadmap 2.2 "automated WCAG AA checks" |
| Fixed 2 real contrast defects (D-015): `foreground-subtle`, `border-strong` (light + dark) | Gate found 3.95/4.05:1 text and 1.87/2.14:1 borders — below AA |
| Added `BenefitList` + `IconList` (`components/list.tsx`) | Last missing P0 marketing components; built on `FeatureList`, no duplicated markup |
| Added `scripts/check-bundle-size.mjs` + `pnpm size` (23/23 PASS) | Roadmap 2.5 bundle budget, **no new dependency** (reuses esbuild from the vitest toolchain) |
| Added `.github/workflows/ci.yml` | Roadmap 2.1, approved (D-013) |
| ESLint: node globals for `**/*.mjs` | New script failed lint; root cause fixed in config, not silenced |
| Upgraded `vitest` 3.2.7 → 4.1.11 + `fileParallelism: false` (D-017) | Cleared GHSA-82fw-gwwq-j7x9 (`pnpm audit` now 0 vulnerabilities); parallel forks exhausted this 3.9 GB machine |
| Added Button `status="error" \| "success"` feedback states (7th/6th states per `06-REFERENCES/design-system/README.md`) | Roadmap 2.3 "all 7 states" was blocked on an undefined state list — the list exists in the knowledge base reference |
| Updated ROADMAP checkboxes + DECISIONS (D-012 → D-017) | Knowledge base must reflect reality |

---

## 4. Known limits (not delivered, deliberately)

1. **Lighthouse CI (perf ≥ 95)** — deferred to Phase 4 (Roadmap 4.6), user decision.
2. **CI never executed** — the workflow file is untested until the project is put under version control and pushed.
3. **Dark mode is token-level only** — contrast is validated for both themes, but visual rendering in dark mode is manual (no visual-regression tooling in Phase 2).
4. **No E2E / visual regression / cross-browser** — scheduled in Phases 3–4.
5. **Memory-constrained machines**: `pnpm typecheck` / `pnpm build` run **sequentially** (`--workspace-concurrency 1`) and the test suite runs file-by-file (`fileParallelism: false`) — with defaults, 9 simultaneous `tsc` processes or parallel jsdom workers exhausted this 3.9 GB machine (`Zone Allocation failed` / `Failed to start forks worker`). Raise both limits on larger machines if speed matters.

*Resolved during recovery: the `vitest` moderate advisory (D-017 → 0 vulnerabilities) and the "7 states" roadmap item (state list found in `06-REFERENCES/design-system/README.md`).*

---

## 5. Commands

```bash
pnpm install
pnpm typecheck        # root + 9 packages
pnpm lint             # eslint .
pnpm size             # bundle budget, 5 kB gzipped per component
pnpm test             # vitest (unit + axe + contrast)
pnpm check            # typecheck && lint && size && test
pnpm build            # package builds
pnpm --filter playground build   # Next.js production build
pnpm dev              # playground
```

---

## 6. Next step

**Phase 3/4 — Conversion Patterns & Compositions**: copywriting schema enforcement in components, P1 components, six conversion patterns, and the first two production templates (`saas-b2b`, `simple`) with Lighthouse ≥ 95 + E2E smoke tests.

*See [ROADMAP.md](ROADMAP.md) for the full Phase 3 plan.*
