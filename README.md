# Landing Marketing Kit

> A professional, reusable, production-ready foundation for SaaS and digital product landing pages.

## Overview

The **Landing Marketing Kit** is not just a landing page template—it's a comprehensive **Landing Marketing OS** that combines:

- **Conversion Strategy** — Evidence-based frameworks for attention → trust → action
- **Cognitive Psychology** — Attention, memory, decision-making heuristics
- **Behavioral Economics** — Framing, loss aversion, social proof, risk reduction
- **UX/HCI Principles** — Visual hierarchy, affordance, friction reduction
- **Copywriting & Storytelling** — Value proposition, objection handling, narrative structures
- **Trust & Proof Systems** — Testimonials, case studies, badges, social validation
- **Accessibility (WCAG 2.1 AA)** — Inclusive by default
- **SEO & Performance** — Core Web Vitals, semantic HTML, structured data
- **Analytics & Experimentation** — Event taxonomy, A/B testing infrastructure
- **Reusable Component Library** — Modular, composable, themeable components

## Architecture Philosophy

```
SaaS / Product
       ↓
Landing Marketing Kit (domain-agnostic)
       ↓
Design System → Marketing Components → Conversion Patterns
       ↓              ↓                      ↓
Content/Copy    Analytics/Experiments   Brand Themes
```

**Key Principle**: The kit is **independent of any specific SaaS product**. Brand identity, copy, and visual theme are injected via design tokens—not hardcoded.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15+ (App Router, RSC) |
| Language | TypeScript 5+ (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui (base-nova style) + custom marketing components |
| Icons | lucide-react |
| Utilities | class-variance-authority, clsx, tailwind-merge |
| Testing | Vitest + React Testing Library + Playwright |
| Linting | ESLint 9 + TypeScript ESLint |
| Package Manager | pnpm 10+ |

## Project Structure (Planned)

```
landing-marketing-kit/
├── docs/                    # Documentation (this phase)
│   ├── ARCHITECTURE.md
│   ├── PRINCIPLES.md
│   ├── PSYCHOLOGY.md
│   ├── CONVERSION.md
│   ├── DESIGN-SYSTEM.md
│   ├── COMPONENT-TAXONOMY.md
│   ├── COPYWRITING.md
│   ├── ETHICS.md
│   ├── ROADMAP.md
│   └── DECISIONS.md
├── packages/
│   ├── design-tokens/       # Design token definitions (JSON/TS)
│   ├── ui-core/             # Base UI primitives (shadcn extended)
│   ├── marketing-components/ # Conversion-focused components
│   ├── conversion-patterns/ # Composable section patterns
│   ├── copywriting/         # Content structures & schemas
│   ├── analytics/           # Event taxonomy & tracking utilities
│   └── themes/              # Brand theme presets
├── apps/
│   ├── docs/                # Documentation site (Next.js)
│   ├── playground/          # Component sandbox
│   └── templates/           # Starter landing templates
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── turbo.json               # Turborepo config (optional)
```

## Phase Overview

| Phase | Focus | Deliverables |
|-------|-------|--------------|
| **1/4** | Foundation, Research & Architecture | Documentation, architecture, research, design system foundation, component taxonomy |
| **2/4** | Design System & Core Components | Design tokens, base UI primitives, theme system, core marketing components |
| **3/4** | Conversion Patterns & Compositions | Section patterns, full page compositions, copywriting system integration |
| **4/4** | Analytics, Testing & Templates | Event taxonomy, A/B framework, starter templates, documentation site |

## Getting Started (Phase 2+)

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development
pnpm dev

# Run tests
pnpm test

# Lint
pnpm lint

# Full quality gate (typecheck + lint + bundle size + tests)
pnpm check

# Regenerate docs/CONTENT-GUIDANCE.md from the Zod schemas
pnpm guidance
```

## Documentation

Start with the [Architecture](docs/ARCHITECTURE.md) to understand the system design, then explore:

- [Principles](docs/PRINCIPLES.md) — Core design & development principles
- [Psychology](docs/PSYCHOLOGY.md) — Cognitive & behavioral research foundation
- [Conversion](docs/CONVERSION.md) — Frameworks for different SaaS types
- [Design System](docs/DESIGN-SYSTEM.md) — Tokens, spacing, color, typography
- [Component Taxonomy](docs/COMPONENT-TAXONOMY.md) — Component catalog & categorization
- [Copywriting](docs/COPYWRITING.md) — Content structures & templates
- [Ethics](docs/ETHICS.md) — Anti-dark-pattern commitments
- [Roadmap](docs/ROADMAP.md) — Phases 2–4 detailed plan
- [Phase 2 Status](docs/PHASE-2.md) — Delivery status, component inventory & quality-gate evidence
- [Decisions](docs/DECISIONS.md) — Decision log & approvals needed

## Contributing

This kit is designed for **internal reuse** across SaaS products. Changes should:

1. Maintain domain-agnostic architecture
2. Follow evidence-based principles (documented in PSYCHOLOGY.md)
3. Pass accessibility, performance, and type-check gates
4. Be documented with rationale in DECISIONS.md

## License

Internal use only — proprietary foundation for SaaS products.