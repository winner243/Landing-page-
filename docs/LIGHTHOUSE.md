# Lighthouse scores (manual gate — Roadmap 3.5)

Run manually on local builds (no CI — D-016 defers Lighthouse CI to Phase 4).

## How to reproduce

```bash
pnpm --filter playground build
pnpm --filter playground exec next start --port 3113   # in one terminal
node scripts/lighthouse-local.mjs http://localhost:3113 # in another
```

Script details (in `scripts/lighthouse-local.mjs`):

- Chrome headless (`chrome-launcher`), **desktop preset** (`desktopDense4G`).
- Categories: performance, accessibility, seo, best-practices.
- **3 runs per route, median score per category** (same approach as Lighthouse CI).
- Routes warm up before auditing (kills the `next start` cold-start TTFB).
- Full-page screenshots disabled (they force one giant relayout on long
  `content-visibility` pages and distort TBT without affecting scores).
- Exits non-zero if any median < **95** (the Roadmap 3.5 target).
- Raw LHR JSON lands in `.lighthouse/` (gitignored).

## Last run — 2026-10-06 (build of `main` workspace state)

| Route               | Performance | Accessibility | SEO | Best practices |
| ------------------- | ----------: | ------------: | --: | -------------: |
| `/`                 |         97  |           100 | 100 |            100 |
| `/landing`          |         99  |           100 | 100 |            100 |
| `/templates/saas-b2b` |       99  |           100 | 100 |            100 |
| `/templates/simple` |         99  |           100 | 100 |            100 |

Raw performance runs (spread shows machine variance — median is the gate):

- `/`: 97 / 97 / 99
- `/landing`: 94 / 99 / 100
- `/templates/saas-b2b`: 93 / 99 / 100
- `/templates/simple`: 99 / 99 / 100

## Fixes this gate required (kept as regression notes)

1. **Playground `@source` paths were off by one** (`app/../../packages` →
   nonexistent `apps/playground/packages`): none of the package component
   styles were in the built CSS. Fixed in `apps/playground/app/globals.css`
   (`../../../packages/...`). Verify after CSS changes: built CSS must
   contain package-only classes (`.mb-10`, `.bg-surface`, `[content-visibility:auto]`).
2. **`robots: noindex`** on all routes made SEO cap at 60. Layout keeps
   `noindex` for preview pages; the four audited routes override with
   `robots: { index: true, follow: true }`.
3. **Color contrast** (weight 7/10 in a11y): Badge `brand` at
   `bg-accent/10 text-accent` = 4.44:1 → `bg-accent/5` (≈4.8:1);
   `FinalCta` on brand background used `text-accent-foreground/85` and
   `/75` (4.14 / 3.59) → full-opacity `text-accent-foreground`.
4. **Landmarks**: composed pages wrapped in `<main>` in the playground.
   Kit users must do the same (LandingComposer renders sections only).
5. **Heading order**: playground home cards were `h3` right after the `h1`.
6. **TBT distortion**: full-page screenshot resizes the viewport to page
   height → every `content-visibility` section becomes relevant at once →
   one 300ms+ relayout task inside the TBT window. Disabled via
   `disableFullPageScreenshot` (screenshots are not a scored metric).
