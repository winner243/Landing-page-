# Conversion Framework

> Generic frameworks for structuring landing pages. Not rigid templates — each framework is a configurable sequence of semantic stages.

## Core Conversion Sequence

The canonical sequence follows the cognitive journey from arrival to action:

```
ATTENTION → COMPREHENSION → TRUST → INTEREST → ACTION
```

This maps to the extended structural framework:

| # | Stage | Question it answers | Section type |
|---|-------|---------------------|--------------|
| 1 | **Attention** | "Is this for me?" | Hero |
| 2 | **Value Proposition** | "What do I get?" | Hero content / Value section |
| 3 | **Comprehension** | "How does it work?" | Product showcase / Workflow |
| 4 | **Problem** | "Why should I care?" | Problem framing |
| 5 | **Solution** | "How does this solve it?" | Solution / Feature benefit |
| 6 | **Proof** | "Do others like me use this?" | Social proof / Logos / Testimonials |
| 7 | **Benefits** | "What changes for me?" | Benefit list / Feature grid |
| 8 | **Trust** | "Can I rely on this?" | Trust bar / Badges / Security |
| 9 | **Objections** | "What could go wrong?" | FAQ / Comparison |
| 10 | **Risk Reduction** | "What if it doesn't work?" | Guarantee / Trial / Pricing |
| 11 | **CTA** | "What do I do now?" | Final CTA / Signup |

> **Important**: This sequence is a *default*, not a requirement. Stage ordering adapts per SaaS type (below).

---

## Framework Variants by SaaS Type

### 1. B2B SaaS (Multi-Stakeholder)

**Audience**: Decision-makers + end users + possibly procurement.
**Characteristics**: Longer consideration, multiple objections, need for organizational proof.

```
Hero (value prop + primary CTA)
  ↓
Problem (industry pain, quantified)
  ↓
Solution (how product addresses it)
  ↓
Feature-to-Benefit mapping (grouped by persona/stakeholder)
  ↓
Proof: Case studies (detailed, with metrics)
  ↓
Logo cloud + Trust bar (enterprise credibility)
  ↓
Integration showcase (fits existing stack)
  ↓
Pricing (transparent, with "Contact sales" for enterprise)
  ↓
Objection handling (FAQ: security, SLA, migration)
  ↓
Risk reduction (free trial / pilot / demo)
  ↓
Final CTA (dual: "Start trial" + "Talk to sales")
```

**Key patterns**: Dual CTA strategy, case studies > testimonials, security/compliance badges, integration logos.

---

### 2. B2C SaaS (Individual Consumer)

**Audience**: Individual user, emotional decision, faster cycle.
**Characteristics**: Benefit-led, emotional, low friction, quick validation.

```
Hero (outcome-focused headline + CTA)
  ↓
Emotional benefit / transformation ("Before → After")
  ↓
Product in action (video/interactive demo)
  ↓
Social proof (reviews, user count, ratings)
  ↓
Simplicity: "3 steps to get started"
  ↓
Benefit grid (3–6 key benefits with icons)
  ↓
Testimonials (relatable personas)
  ↓
Pricing (simple, monthly default, free tier)
  ↓
Objection handling (short FAQ)
  ↓
Final CTA (single, clear action)
```

**Key patterns**: Video hero, simplicity signals, reviews over case studies, free tier prominent.

---

### 3. AI SaaS

**Audience**: Early adopters + skeptical professionals evaluating AI claims.
**Characteristics**: Capability demonstration essential; trust deficit; need to prove real value.

```
Hero (specific outcome + "See it in action" CTA)
  ↓
Interactive demo / live example (try-before-you-buy)
  ↓
How it works (transparent, not black box)
  ↓
Capability showcase (what it can/cannot do — honesty builds trust)
  ↓
Proof: Results / benchmarks (verifiable)
  ↓
Use cases (concrete, domain-specific)
  ↓
Trust & safety (data handling, model transparency, limitations)
  ↓
Comparison (vs. manual / vs. alternatives)
  ↓
Pricing (usage-based transparency)
  ↓
Objection handling (accuracy, data privacy, "will it replace me?")
  ↓
Final CTA
```

**Key patterns**: Live demo > screenshots, honest capability boundaries, transparency about limitations, data privacy proof.

---

### 4. Professional Tool

**Audience**: Practitioners (developers, designers, analysts).
**Characteristics**: Feature-oriented, workflow-focused, skeptical of marketing fluff.

```
Hero (specific capability + "Try it free")
  ↓
Workflow demonstration (real usage flow)
  ↓
Feature deep-dive (technical details welcome)
  ↓
Comparison table (vs. manual / competitor alternatives)
  ↓
Power user proof (technical testimonials, GitHub stars, community)
  ↓
Integration / extensibility (API, CLI, plugins)
  ↓
Pricing (transparent, developer-friendly — self-serve)
  ↓
Docs / Getting started (lowers activation barrier)
  ↓
Final CTA
```

**Key patterns**: Technical credibility (docs, API, open-source signals), workflow demos, comparison tables.

---

### 5. Marketplace (Two-Sided)

**Audience**: Both supply and demand sides.
**Characteristics**: Liquidity signals critical; trust between strangers; dual value props.

```
Hero (dual value prop or choose-side CTA)
  ↓
[For Buyers] section (browse, trust, quality signals)
  ↓
[For Sellers] section (earn, reach, tools)
  ↓
Trust & safety (verification, reviews, dispute resolution)
  ↓
Liquidity proof (volume, active users, transactions)
  ↓
How it works (both sides)
  ↓
Pricing / Commission transparency
  ↓
Objection handling (safety, quality, fees)
  ↓
Final CTA (side-specific)
```

**Key patterns**: Dual-path navigation, transaction volume signals, verification badges, review systems.

---

### 6. Premium Product

**Audience**: High-value buyers, quality/brand-sensitive.
**Characteristics**: Brand-led, minimal, exclusivity without fake scarcity.

```
Hero (bold brand statement, minimal text)
  ↓
Brand story / philosophy (why it exists)
  ↓
Craftsmanship / differentiation (what justifies premium)
  ↓
Curated proof (selected testimonials, prestigious clients)
  ↓
Product detail (high-fidelity visuals)
  ↓
Comparison (vs. standard alternatives — value justification)
  ↓
Pricing (transparent, no decoy tricks)
  ↓
Guarantee / concierge (premium risk reduction)
  ↓
Final CTA (refined, brand-consistent)
```

**Key patterns**: Visual restraint, brand narrative, real exclusivity only (e.g., genuine limited capacity), no discount tactics.

---

### 7. Simple Product (Single Value Prop)

**Audience**: Users who already understand the need.
**Characteristics**: Speed to action; minimal sections.

```
Hero (value prop + CTA, above the fold complete)
  ↓
How it works (3 steps max)
  ↓
Proof (logos + one strong testimonial)
  ↓
Pricing (single plan or free)
  ↓
Final CTA
```

**Key patterns**: Hero must contain complete value proposition; total page ≤ 3–4 sections; every section must earn its place.

---

### 8. Complex Product (Multi-Feature / Enterprise)

**Audience**: Diverse personas, long evaluation, feature comparison.
**Characteristics**: Information architecture matters; progressive disclosure.

```
Hero (category + primary value + CTA)
  ↓
Navigation / Table of contents (jump links for scanners)
  ↓
Problem framing (segmented by persona if needed)
  ↓
Solution overview (high-level)
  ↓
Feature sections (grouped by workflow/use case)
  ↓
Product showcase (interactive or video walkthrough)
  ↓
Social proof (segmented by industry/persona)
  ↓
Comparison table (vs. alternatives / plans)
  ↓
Pricing (tiered, feature-gated, transparent)
  ↓
Technical trust (security, compliance, SLA, docs)
  ↓
Objection handling (comprehensive FAQ)
  ↓
Risk reduction (trial, pilot, migration support)
  ↓
Final CTA (persona-aware)
```

**Key patterns**: Jump-link navigation, segmented content, comparison tables, comprehensive FAQ, progressive disclosure.

---

## Stage → Component Mapping

Each stage maps to specific component types (see [COMPONENT-TAXONOMY.md](COMPONENT-TAXONOMY.md)):

| Stage | Primary components |
|-------|-------------------|
| Attention | Hero (any variant) |
| Value Proposition | Hero content, BenefitList, StatsBar |
| Comprehension | ProductShowcase, Workflow, FeatureGrid |
| Problem | ProblemSection, IconList (pain points) |
| Solution | FeatureCard, ComparisonTable |
| Proof | LogoCloud, TestimonialCard, CaseStudyCard, Reviews |
| Benefits | BenefitList, FeatureGrid, UseCaseCard |
| Trust | TrustBar, TrustBadges, SecurityBadges |
| Objections | FAQAccordion, ComparisonTable |
| Risk Reduction | PricingCard, GuaranteeSection, CTAWithTrial |
| CTA | CTAButton, CTABanner, CTAFinal, CTASticky |

---

## Section Ordering Rules

1. **Hero must always be first** — contains primary value proposition and CTA.
2. **Proof must appear within the first 2 scroll depths** (before asking for commitment).
3. **Pricing appears only after value is established** (after Benefits at minimum).
4. **Final CTA must close the page** — never end on links or footer only.
5. **One primary CTA per viewport** — repeated same-action CTAs are fine; competing actions are not.
6. **FAQ/objection handling immediately precedes or follows pricing** — objections surface at decision point.

---

## Measurement Framework

Each stage has a measurable proxy metric:

| Stage | Metric |
|-------|--------|
| Attention | Scroll depth to first section, time to first interaction |
| Comprehension | Scroll depth through product sections, video play rate |
| Trust | Testimonial/logos section dwell time |
| Interest | CTA hover rate, pricing page views |
| Action | CTA click-through rate, form submission rate, signup completion |

These events feed the analytics taxonomy (see ROADMAP.md, Phase 4).

---

*Next: [Design System](DESIGN-SYSTEM.md) — Tokens, spacing, color, typography*