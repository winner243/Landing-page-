# Principles

> Core design and development principles governing the Landing Marketing Kit.

## Design Principles

### 1. Clarity Over Cleverness
> "Don't make me think." — Steve Krug

Every element must serve a clear purpose. Ambiguity creates cognitive load; clarity builds trust.
- **Application**: Explicit labels over icons alone; descriptive CTAs ("Start 14-day trial" not "Get started"); visible hierarchy.

### 2. Persuasion Through Trust, Not Manipulation
> Persuasion = Clarity + Credibility + Relevance

We reject dark patterns. Influence comes from:
- Honest value communication
- Verifiable proof (not fabricated)
- Respect for user autonomy
- Risk reduction (guarantees, trials, transparent pricing)

### 3. Mobile-First, Content-First
Layout serves content. Content serves conversion.
- Design for smallest viewport first
- Progressive enhancement for larger screens
- Content hierarchy preserved across breakpoints

### 4. Accessibility as Default, Not Checklist
WCAG 2.1 AA is the baseline.
- Semantic HTML always
- Focus management in interactive components
- Color contrast ≥ 4.5:1 (text), 3:1 (UI)
- Reduced motion respected
- Screen reader tested

### 5. Performance Is a Feature
- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Zero-JS fallback for critical content
- Fonts: `font-display: swap`, subsetted, preloaded
- Images: AVIF/WebP, responsive, lazy-loaded
- Third-party scripts: deferred, consent-gated

### 6. Composability Over Configuration
Components compose via slots and props — not 50 boolean flags.
- Prefer `children` / `slots` over `variant="x" | "y" | "z"`
- Pattern-level composition over component-level configuration
- Type-safe schemas replace ad-hoc prop drilling

### 7. Domain-Agnostic Architecture
The kit knows nothing about your SaaS.
- No product-specific copy, imagery, or logic
- Brand identity injected via tokens
- Content injected via schemas
- Business logic stays in the product

### 8. Evidence-Based Defaults
Default behaviors reflect research (see [PSYCHOLOGY.md](PSYCHOLOGY.md)), not trends.
- CTA placement, form length, proof density — all have documented rationale
- Overridable, but defaults are defensible

### 9. Explicit Over Implicit
- Token names: `color-brand-primary` not `color-blue-500`
- Component names: `CTAButton` not `ButtonPrimary`
- Event names: `cta_click_header_primary` not `click`
- Schema fields: `headline` not `title`

### 10. Maintainability Through Constraints
- Strict TypeScript (`strict: true`, no `any`)
- Zod schemas for all external boundaries
- ESLint + Prettier enforced in CI
- No circular dependencies (enforced by `madge` or `tsc`)
- Documentation co-located with code

---

## Development Principles

### 11. Type-Driven Development
Types are the primary documentation. If it's not in the type, it doesn't exist.
- Zod → TypeScript inference for all props, events, configs
- Branded types for IDs (`type CTAId = string & { readonly __brand: 'CTAId' }`)
- Discriminated unions for pattern variants

### 12. Server-First Rendering
Default to React Server Components.
- Client components only for interactivity (hydration boundary minimal)
- Streaming for below-fold content
- Server Actions for form submissions

### 13. Zero-Runtime Theme System
Theming via CSS variables — no runtime theme objects, no context providers for tokens.
- Build-time token → CSS variable generation
- Runtime: only brand token overrides via `<style>` or link preload

### 14. Test Behavior, Not Implementation
- Unit: pure utilities, token transformers, schema validators
- Integration: component rendering with content schemas
- E2E: critical conversion flows (hero → CTA → form submit)
- Visual regression: component states across themes

### 15. Incremental Adoption
Packages are independently usable.
- `design-tokens` works standalone
- `ui-core` works without marketing components
- `marketing-components` works without patterns
- No "all-or-nothing" dependency

### 16. Backward Compatibility Within Major Versions
- Semantic versioning strictly followed
- Deprecation warnings before removal
- Migration guides for breaking changes
- `peerDependencies` for React, Next.js, Tailwind

### 17. Observability Built-In
Every interactive component emits typed analytics events.
- No "add tracking later" — it's in the component API
- Event schemas versioned with components
- Consent-aware by default

### 18. Experimentation-Ready
Components accept `variant` prop for A/B testing.
- Variant assignment handled externally (middleware/cookie)
- Component renders variant deterministically
- No client-side flicker (server-assigned variants)

### 19. Documentation as Code
- JSDoc for all exported APIs
- README per package with usage examples
- Storybook stories for all component states
- Architecture decision records (ADRs) in `DECISIONS.md`

### 20. Security by Default
- No `dangerouslySetInnerHTML` without sanitization
- CSP-compatible (no inline styles/scripts)
- User-generated content escaped/validated
- No secrets in client bundles

---

## Principle Application Checklist

When adding/modifying anything, verify:

| Principle | Check |
|-----------|-------|
| Clarity | Can a user understand this in 3 seconds? |
| Trust | Does this make an honest claim? |
| Mobile-first | Works at 375px without horizontal scroll? |
| Accessibility | Passes axe-core + manual keyboard test? |
| Performance | Adds < 5kb gzipped? No layout shift? |
| Composability | Can I replace one slot without forking? |
| Domain-agnostic | Zero product-specific references? |
| Evidence-based | Rationale documented in PSYCHOLOGY.md? |
| Explicit | Names self-documenting? |
| Maintainability | Passes lint, typecheck, tests? |

---

## Conflict Resolution

When principles conflict (e.g., Performance vs. Clarity):

1. **Accessibility & Trust** — never compromised
2. **Clarity & Evidence** — prioritized over aesthetics
3. **Performance** — optimized within clarity constraints
4. **Composability** — favored over convenience
5. **Explicitness** — favored over brevity

Document the trade-off in `DECISIONS.md`.

---

*Next: [Psychology](PSYCHOLOGY.md) — Cognitive & behavioral research foundation*