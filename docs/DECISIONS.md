# Decision Log

> Architecture decisions, rationale, alternatives considered, and approval status. Phase 1 records decisions made during foundation work and flags those requiring explicit approval.

---

## Decision Categories

| Status | Meaning |
|--------|---------|
| **APPROVED (by default rules)** | Small, reversible decision made within existing knowledge-base rules |
| **AWAITING APPROVAL** | Significant decision requiring explicit user sign-off before Phase 2 |
| **REJECTED** | Alternative considered and rejected, recorded for future reference |

---

## D-001: Documentation-First Phase 1 (No Code)

- **Status**: APPROVED (by default rules — non-destructive, reversible)
- **Decision**: Phase 1 produces only Markdown documentation in `docs/`. No scaffolding, no dependencies, no Git operations.
- **Rationale**: Master prompt specifies architecture/research phase before implementation; modification rules forbid destructive or infrastructural changes without approval.
- **Alternatives**: Scaffolding monorepo immediately — rejected; premature commitment before architecture review.
- **Impact**: Zero code risk; fully reversible (delete docs).

---

## D-002: Monorepo with pnpm Workspaces

- **Status**: **AWAITING APPROVAL** (Phase 2 prerequisite)
- **Decision**: Structure as pnpm workspace monorepo: `packages/*` + `apps/*`.
- **Rationale**: Matches existing SaaS projects' package manager (pnpm); aligns with ARCHITECTURE.md layer separation; enables independent package versioning.
- **Alternatives considered**:
  - Single package with subfolders — rejected: weaker dependency boundaries, harder independent reuse.
  - npm/yarn workspaces — rejected: existing knowledge base uses pnpm (pnpm-lock.yaml in Starter SaaS v2/v3).
  - Turborepo — optional add-on (decision on turbo.json deferred to Phase 2).
- **Impact**: High — determines project structure. Reversible but costly to change later.
- **Approval needed**: Yes — major structural choice.

---

## D-003: Tech Stack Alignment

- **Status**: APPROVED (follows knowledge base — existing SaaS projects use identical stack)
- **Decision**: Next.js 15+ (App Router), React 19, TypeScript 5 strict, Tailwind CSS v4, shadcn/ui (base-nova style), lucide-react, Vitest.
- **Rationale**: All confirmed in Starter SaaS v2/v3 `package.json`, `components.json`, `vitest.config.ts`. Consistency across the user's SaaS portfolio.
- **Alternatives**: Other UI libs (MUI, Chakra) — rejected: knowledge base standardizes on shadcn/Tailwind.
- **Impact**: Aligns with existing infrastructure; no new ecosystem introduced.

---

## D-004: shadcn/ui base-nova Style as ui-core Base

- **Status**: APPROVED (knowledge base precedent)
- **Decision**: `ui-core` primitives built by extending shadcn/ui components with `style: base-nova` and CVA variants.
- **Rationale**: `components.json` in v2/v3 specifies base-nova; CVA already a dependency; consistent component API across projects.
- **Impact**: ui-core inherits shadcn conventions (Radix primitives, `cn()` util, `components/ui` structure).

---

## D-005: Zero-Runtime Token Theming via CSS Variables

- **Status**: APPROVED (documented in ARCHITECTURE.md + DESIGN-SYSTEM.md, consistent with Tailwind v4 approach)
- **Decision**: Design tokens compile to CSS custom properties; brand themes override variables at runtime/build; no React theme context for tokens.
- **Rationale**: Tailwind v4 is CSS-first; zero-JS theming avoids hydration cost; aligns with performance principle.
- **Alternatives**: JS theme object + provider — rejected: adds runtime cost, hydration complexity.
- **Impact**: Low risk; native to Tailwind v4 `@theme` directive.

---

## D-006: Zod as Universal Schema Layer

- **Status**: **AWAITING APPROVAL** (adds a new dependency)
- **Decision**: Use Zod for content schemas, event payloads, experiment configs, template configs.
- **Rationale**: Industry standard for TS-first runtime validation; type inference eliminates duplicate type definitions; strong ecosystem (tRPC, react-hook-form).
- **Alternatives**:
  - TypeBox — less ecosystem adoption.
  - Manual TS types only — rejected: no runtime validation at boundaries.
  - Valibot — lighter but less adopted; Zod preferred for ecosystem/tooling.
- **Impact**: Adds `zod` dependency to packages. Reversible but widely used across all packages — decision needed before Phase 2.
- **Approval needed**: Yes — significant external dependency (D-006).

---

## D-007: Monorepo Package Boundaries Follow ARCHITECTURE.md

- **Status**: AWAITING APPROVAL (structure confirmed with D-002)
- **Decision**: Package split: `design-tokens`, `ui-core`, `marketing-components`, `conversion-patterns`, `copywriting`, `analytics`, `experimentation`, `seo`, `themes`.
- **Rationale**: One-way dependency graph (tokens → ui-core → marketing → patterns); no circular deps; each independently consumable (incremental adoption principle).
- **Alternatives**: Fewer, larger packages — rejected: weaker reuse granularity. More, smaller packages — rejected: premature complexity.
- **Approval needed**: Confirm package list before scaffolding.

---

## D-008: Phase 1 Does Not Initialize Git

- **Status**: APPROVED (master prompt rule: no Git operations without authorization)
- **Decision**: No `git init`, no commits, no pushes during Phase 1.
- **Rationale**: Explicit prohibition in modification rules.
- **Impact**: Repository initialization deferred (likely Phase 2 start).

---

## D-009: Documentation Language — English

- **Status**: APPROVED (small reversible decision)
- **Decision**: All documentation and code comments in English.
- **Rationale**: Standard for code/documentation; component APIs, token names, and event names are English regardless; prompt itself is in French but technical deliverables follow industry convention.
- **Alternatives**: French docs — rejected: would fragment with English code identifiers.
- **Impact**: None technically; user can request translation later.

---

## D-010: Proof-Level Tagging in Research Documents

- **Status**: APPROVED (master prompt requirement — no pseudoscience)
- **Decision**: Every research claim in PSYCHOLOGY.md carries a proof level (Strong/Moderate/Weak/Contested/Rejected) + source + limitations. Rejected claims documented explicitly.
- **Rationale**: Master prompt §5 (pseudoscience ban) and §6 (sources priority).
- **Impact**: Establishes evidence standard for all future claims in kit documentation.

---

## D-011: No Deployment/CI Configuration in Phase 1

- **Status**: APPROVED (destruction/infrastructure rules)
- **Decision**: CI/CD (GitHub Actions), deployment, and registry configuration deferred to Phase 2+ with approval.
- **Rationale**: Requires authorization; premature without code to test.
- **Impact**: Phase 2 must request approval for `.github/` creation.

---

## D-012: No Prettier

- **Status**: **APPROVED by user at Phase 2 recovery**
- **Decision**: ESLint 9 only; Prettier is not installed and not configured.
- **Rationale**: ESLint already enforces the code rules that matter (unused vars, hooks, TS semantics); adding a formatter means a new dependency plus a repository-wide reformat with no quality gain. Keeps `pnpm install` minimal (non-negotiable: no useless dependencies).
- **Alternatives**: Install Prettier + `prettier --check` gate — rejected by user; format churn across all Phase 1/2 files.
- **Impact**: Quality Gate category CODE → "Formatage" = `NOT APPLICABLE` (justified: ESLint covers style rules; no formatter adopted).

---

## D-013: GitHub Actions CI Workflow

- **Status**: **APPROVED by user at Phase 2 recovery** (overrides D-011 deferral for this scope)
- **Decision**: Create `.github/workflows/ci.yml` running `pnpm typecheck`, `pnpm lint`, `pnpm size`, `pnpm test` on push and pull request (Node 22, pnpm from `packageManager`, frozen lockfile).
- **Rationale**: Roadmap 2.1 requires it; it is the automated form of the Quality Gates CODE + TESTS categories.
- **Limits**: no `git init`, no commit, no push performed (file added only — D-008 stands). Lighthouse/E2E/visual regression are **not** in this workflow (see D-016).

---

## D-014: Design Token Source of Truth — TS Module + CSS, No JSON

- **Status**: APPROVED (small, reversible, follows P3 "one source of truth")
- **Decision**: Tokens live in `packages/design-tokens/src/tokens.css` (runtime source) + `src/index.ts` (typed constants). The roadmap's "JSON token definitions" are **not** implemented as a third copy.
- **Rationale**: A JSON file would be a duplicate of both files and would need its own transform step; Tailwind v4 is CSS-first (D-005) and TS consumers already get typed access.
- **Impact**: Roadmap 2.2 "Token definitions (JSON + TypeScript types)" satisfied by the TypeScript side only.

---

## D-015: Contrast Failures Fixed in Tokens (WCAG AA)

- **Status**: APPROVED (Level 3 product rule + roadmap 2.2; non-destructive, reversible)
- **Decision**: The automated contrast gate found two genuine WCAG failures; neutral grays were adjusted (brand hues untouched):
  - `--lmk-foreground-subtle`: light `0.6 → 0.53`, dark `0.55 → 0.62` (oklch L).
  - `--lmk-border-strong`: light `0.8 → 0.63`, dark `0.4 → 0.53` (oklch L).
- **Evidence (before → after)**: subtle text on white `3.95 → 5.28:1`; subtle on muted `4.33 → 4.70:1`; dark subtle on dark bg `4.05 → 5.40:1`; border-strong on white `1.87 → 3.23:1`; dark `2.14 → 3.73:1`.
- **Rationale**: `foreground-subtle` carries real text (footer legal, pricing fine print, captions) → AA 4.5:1; `border-strong` outlines outline-buttons/badges → WCAG 1.4.11 needs 3:1. Both were failing before recovery.
- **Alternatives**: Lower the test thresholds to match the old tokens — rejected (would hide a real accessibility defect).

---

## D-016: Bundle Budget Definition + Lighthouse Deferred

- **Status**: **Bundle definition APPROVED by user (bundle measured now); Lighthouse CI DEFERRED by user**
- **Decision**:
  - Bundle gate = each `packages/*/src/components/*.tsx` bundled standalone, minified ESM, gzipped, **≤ 5120 B**; framework (`react*`) and shared utilities (`clsx`, `tailwind-merge`, `class-variance-authority`, `zod`) marked external because they ship once per application, not once per component.
  - Lighthouse CI (performance ≥ 95) is **not** built in Phase 2 → moved to Roadmap 4.6.
- **Tooling**: reuses `esbuild` already present via vitest → vite → esbuild. **No new dependency installed** (`scripts/check-bundle-size.mjs`).
- **Impact**: gate wired into `pnpm size`, `pnpm check` and CI.

---

## D-017: vitest 4 Upgrade (Security Advisory) + Sequential Test Files

- **Status**: **APPROVED by user at Phase 2 recovery** (choice: "Upgrade vers vitest ≥4.1.11")
- **Decision**: `vitest` 3.2.7 → **4.1.11** (root devDependency) to clear GHSA-82fw-gwwq-j7x9 (`@vitest/mocker` redirect mock path traversal, severity moderate, **dev-only — never shipped to consumers**).
- **Side effect handled**: vitest 4 spawns parallel `forks` workers by default, which exhausted this 3.9 GB machine (`Failed to start forks worker`). `fileParallelism: false` was added to `vitest.config.ts` — test files now run sequentially (~150–220 s for the full suite).
- **Verification**: `pnpm audit --audit-level moderate` → **0 known vulnerabilities**; full suite **129/129 green on 4.1.11**; `pnpm check` (typecheck + lint + size + test) exit 0.

---

## Pending Approvals Summary

| ID | Decision | Status |
|----|----------|--------------------------|
| **D-002** | pnpm monorepo structure | ✅ **APPROVED** by user at Phase 2 start |
| **D-006** | Zod as schema dependency | ✅ **APPROVED** by user at Phase 2 start (add immediately) |
| **D-007** | Package boundary list | ✅ **APPROVED** — user chose all 9 packages scaffolded at once |
| — | Git repo initialization | ❌ **DECLINED** by user — no `git init`, no commits, no push |
| — | Phase 2 start (scaffolding + deps) | ✅ **APPROVED** — Phase 2 master prompt issued |
| **D-013** | GitHub Actions workflow (`.github/`) | ✅ **APPROVED** by user at Phase 2 recovery |
| **D-012** | No Prettier | ✅ **APPROVED** by user at Phase 2 recovery |
| **D-016** | Bundle gate now / Lighthouse CI | ✅ **APPROVED** (bundle) / ⏭️ **DEFERRED to Phase 4** (Lighthouse) |
| **D-015** | WCAG contrast fixes in tokens | ✅ Applied within Phase 2 a11y scope (reported to user) |
| **D-017** | vitest 3.2.7 → 4.1.11 (security advisory) | ✅ **APPROVED** by user at Phase 2 recovery |

---

## Rejected Alternatives (Recorded for Future Reference)

| Idea | Why rejected |
|------|-------------|
| Build all 4 phases in one pass | Master prompt mandates phase gates with approval |
| Use a CSS-in-JS library (emotion/styled-components) | Conflicts with Tailwind v4 / knowledge base stack |
| Hardcode example brand instead of token system | Violates domain-agnostic principle |
| Publish to public npm | Requires explicit authorization; kit is internal |
| Include analytics implementation with fake data | Violates ethics rules (fabricated metrics) |
| Copy templates from marketing sites | Copyright/attribution concerns; kit must be original |

---

*Phase 1 decisions (D-001 → D-011) and Phase 2 decisions (D-012 → D-017). See [README](../README.md) for overview and [PHASE-2.md](PHASE-2.md) for the Phase 2 delivery status.*