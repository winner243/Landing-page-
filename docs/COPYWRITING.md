# Copywriting System

> Structures that separate **component structure** from **marketing content**. Every major block has a defined content schema, writing guidance, and error patterns to avoid.

## Core Principle

```
Component (structure) + Content Schema (fields) + Copy Guidance (how to write) = Published Section
```

Components render *whatever* content is passed in. The copywriting system defines *what fields exist*, *what good looks like*, and *what to avoid*.

---

## Content Schema Philosophy

- **Typed**: Every content shape is a Zod schema (Phase 2) → compile-time safety
- **Validated**: Lengths, formats, required fields enforced
- **Variant-ready**: Schemas support multiple variants for A/B testing
- **Localization-ready**: All fields are strings (no baked-in text in components)
- **Ethics-checked**: Schema constraints prevent dark patterns (e.g., fake countdown fields don't exist)

---

## Block Content Specifications

### 1. Hero

**Objective**: Communicate who this is for, what it does, and what to do next — in < 5 seconds.

```typescript
HeroContent {
  badge?: { text: string }              // optional eyebrow/announcement
  headline: string                       // ≤ 12 words
  subheadline: string                    // ≤ 25 words, expands headline
  primaryCTA: { label: string, href: string }   // action + outcome
  secondaryCTA?: { label: string, href: string } // optional alternative
  proof?: {                              // inline credibility
    customerCount?: number               // real number only
    avatars?: Array<{ src, alt }>
    text?: string                        // e.g., "Trusted by 2,000+ teams"
  }
  visual?: { type, src, alt, caption? }  // image/video/demo
}
```

**Writing guidance**:
- Headline formula (pick one):
  - Outcome: "Get [desired result] without [pain]"
  - Category + differentiator: "[Category] that [differentiator]"
  - Question: "Still [struggling with X]?"
  - Social: "Join [N] teams shipping [outcome]"
- Subheadline: Expand — how, for whom, why now
- CTA: Verb + outcome ("Start free trial", "See it in action") — never "Submit" or "Click here"
- Proof: Real numbers only; avatars need real photos or initials

**Avoid**:
- ❌ Vague headlines: "The future of work" / "Better. Faster. Smarter."
- ❌ Jargon without benefit
- ❌ CTA that describes the mechanism not the outcome ("Sign up" → "Start free")
- ❌ Fake social proof counts

**Variants** (for A/B): Headline framing, CTA wording, proof placement.

---

### 2. Section Header (reusable for all sections)

**Objective**: Frame the section's content in one glance.

```typescript
SectionHeaderContent {
  eyebrow?: string       // small label, ≤ 5 words (e.g., "PRICING")
  title: string          // ≤ 10 words — the section's single message
  description?: string   // ≤ 30 words — supporting context
}
```

**Writing guidance**:
- Title = one clear claim or topic
- Description = why it matters or what they'll see
- Eyebrow = category, not clickbait

**Avoid**:
- ❌ Clever-but-unclear titles ("The Secret Sauce")
- ❌ Stacked headlines without visual hierarchy

---

### 3. Feature / Benefit

**Objective**: Translate capability into user value.

```typescript
FeatureContent {
  icon?: IconName
  title: string           // ≤ 8 words — benefit-oriented, not feature name
  description: string     // ≤ 30 words — what it does + why it matters
  link?: { label, href }  // optional "learn more"
}
```

**Writing guidance**:
- Title format: Benefit-first ("Save 10 hours/week", not "Time-tracking module")
- Description: Feature → mechanism → outcome
  - Weak: "Advanced reporting."
  - Strong: "Generate investor-ready reports in one click — no spreadsheets needed."
- One idea per feature; group related features in grids

**Avoid**:
- ❌ Feature names as titles (users don't search for your internal module names)
- ❌ Superlatives without proof ("revolutionary", "game-changing")
- ❌ Wall-of-text descriptions (> 30 words)

**Feature vs Benefit mapping** (enforced in schema guidance):

| Feature (what it does) | Benefit (what it means for them) |
|------------------------|----------------------------------|
| Automated invoicing | Get paid 40% faster without manual work |
| Real-time collaboration | Stop version confusion — everyone sees the latest |
| SOC 2 certified | Pass your security review without extra work |

---

### 4. Testimonial

**Objective**: Provide credible, specific evidence from real users.

```typescript
TestimonialContent {
  quote: string                 // 15–60 words — specific outcome or feeling
  author: {
    name: string                // real full name
    role?: string               // real title
    company?: string            // real company
    avatar?: { src, alt }       // real photo (or initials fallback)
    verified?: boolean          // true ONLY if verified
  }
  rating?: 1-5                  // only if genuine
  metric?: { value, label }     // e.g., "3× faster onboarding"
  source?: 'direct' | 'g2' | 'capterra' | 'case-study'
}
```

**Writing guidance**:
- Strongest testimonials mention: **specific metric** + **before/after** + **emotional relief**
- "We cut onboarding time from 3 weeks to 4 days. Our team stopped dreading setup." (specific + before/after + feeling)
- Attribute fully: real name, role, company — anonymous testimonials carry less weight (proof level note in PSYCHOLOGY.md)
- Attribution = source credibility

**Avoid**:
- ❌ Fake names, stock-photo faces presented as real customers
- ❌ Generic praise ("Amazing product! Love it!") — zero informational value
- ❌ Fabricated metrics
- ❌ Testimonials from people who never used the product

---

### 5. Stats

**Objective**: Communicize scale or outcomes with verifiable numbers.

```typescript
StatsContent {
  items: Array<{
    value: string          // e.g., "2,000+", "40%", "4.8/5"
    label: string          // what it measures, ≤ 6 words
    source?: string        // optional attribution / link
  }>                        // 2–4 items max
}
```

**Writing guidance**:
- Every stat must be **true and verifiable**
- Prefer outcome stats over vanity stats ("94% of users report faster delivery" > "1M requests/day")
- Include source/context if the stat is a claim about results

**Avoid**:
- ❌ Fake numbers ("10,000,000 users served")
- ❌ Out-of-context stats (cherry-picked without methodology)
- ❌ Precision theater ("37.42% improvement" when measured on 5 users)

---

### 6. Pricing

**Objective**: Enable confident decision-making — transparent, comparable, honest.

```typescript
PricingContent {
  plans: Array<{
    name: string
    price: { amount: number, currency, interval: 'month'|'year' }
    originalPrice?: number         // ONLY for genuine, time-limited discounts
    description?: string
    features: string[]             // concrete capabilities
    cta: { label, href }
    highlighted?: boolean          // visually featured plan
    badge?: string                 // e.g., "Most popular" (must be true)
  }>
  toggle?: {
    monthlyLabel: string
    annualLabel: string
    savingsPercent: number         // mathematically accurate
    annualOnly?: boolean           // hidden fees prohibited
  }
  guarantee?: { text, href }       // real guarantee, links to terms
  finePrint?: string               // taxes, billing cycle, cancellation
}
```

**Writing guidance**:
- Price display: Show monthly equivalent + annual total clearly
- Feature lists: Concrete outcomes, not marketing adjectives
- Highlighted plan: Feature the plan most customers actually need (not the most expensive by default)
- "Most popular" badge: Only if data supports it
- Money-back guarantee: Link to actual policy terms

**Avoid**:
- ❌ Pre-checked "I want the annual plan" — default must be visible and honest
- ❌ Hidden fees revealed at checkout (dark pattern — see ETHICS.md)
- ❌ Fake "was $X" anchors with no genuine previous price
- ❌ Confusing price displays (per-seat + base + usage without total)

---

### 7. FAQ / Objection Handling

**Objective**: Address real objections before they block conversion.

```typescript
FAQContent {
  items: Array<{
    question: string     // the ACTUAL question users ask (not marketing-speak)
    answer: string       // direct, honest; ≤ 80 words
  }>                      // 4–8 items typical
}
```

**Writing guidance**:
- Sources for questions: Sales calls, support tickets, sales objections, review sites
- Answer directly first; expand only if needed
- Link to deeper docs for technical detail
- Include uncomfortable questions ("Can I cancel anytime?", "Where is my data stored?") — dodging them destroys trust

**Avoid**:
- ❌ Softball-only FAQ (only easy questions)
- ❌ Answers that dodge the actual question
- ❌ Wall-of-text answers (break into paragraphs or steps)

---

### 8. CTA Labels (Microcopy Standards)

| Context | Good | Bad |
|---------|------|-----|
| Primary signup | "Start free trial" / "Try it free" | "Submit" / "Sign up" (too generic) |
| Demo | "Book a live demo" / "Watch demo" | "Learn more" (ambiguous) |
| Secondary | "See pricing" / "View docs" | "Click here" |
| Purchase | "Start subscription — $29/mo" (price transparency) | "Buy now" (hiding cost) |
| Download | "Download the guide" | "Get it" (get what?) |

Rules:
- **Verb + outcome** — user knows what happens after clicking
- **Include price** at commitment points when relevant
- **Never** two different-looking CTAs doing the same thing
- **Never** CTAs that lie about what happens (opens modal vs navigates)

---

### 9. Trust Microcopy (Near Forms/CTAs)

Placement guidance for risk-reducing micro-copy:

| Location | Example |
|----------|---------|
| Under signup CTA | "No credit card required" (only if true) |
| Under signup CTA | "Cancel anytime — no questions asked" (only if true) |
| On email field | "We'll never spam you. Unsubscribe anytime." |
| Near pricing CTA | "14-day free trial · Full access · No commitment" |
| Near demo CTA | "30 minutes · No sales pressure" (only if true) |

---

## Content Schema Separation from Components

```
components/hero.tsx        → renders structure (layout, slots, states)
copywriting/schemas/hero.ts → defines HeroContent type (Zod)
copywriting/guidance/hero.ts → writing guidance, limits, examples
templates/saas-b2b/hero.ts  → actual content for one SaaS
```

**Result**: Swapping content (or brand, or language) never touches component code.

---

## Writing Quality Checklist

For every piece of copy:

- [ ] Specific (not generic — could a competitor's name replace it?)
- [ ] Benefit-led (user outcome, not feature name)
- [ ] Within length limits (schema-enforced)
- [ ] True (all claims verifiable)
- [ ] Plain language (Flesch reading score ≥ 60 for general audiences)
- [ ] Scannable (headings, bullets, bold key phrases)
- [ ] No jargon without context
- [ ] CTA describes outcome, not mechanism
- [ ] Proof adjacent to claims
- [ ] Tested against ETHICS.md anti-patterns

---

*Next: [Ethics](ETHICS.md) — Anti-dark-pattern rules*