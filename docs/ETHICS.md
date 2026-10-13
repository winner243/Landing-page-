# Ethics & Anti-Dark-Pattern Rules

> Hard rules for the kit. Persuasion strong — but honest. These rules are **enforced by design** (schemas don't provide fields for forbidden patterns) and by review.

## Philosophy

**Persuasion → Clarity → Confidence → Friction reduction**

We reject: **Deception → Manipulation → Dark patterns**

The kit's goal is to help users make **informed decisions they don't regret**. A conversion obtained through deception is not a conversion — it's a future refund, a damaged brand, and a lost customer.

---

## Forbidden Patterns (Hard Rules)

### 1. Fabricated Social Proof

| Forbidden | Why |
|-----------|-----|
| Fake testimonials (invented names, quotes) | Fraud; destroys trust when discovered |
| Fake user/customer counts | Deceptive claim |
| Fake reviews / ratings | Violates FTC guidelines (US), consumer law (EU/FR) |
| Stock photos presented as real customers | Deception |
| Fake "verified buyer" badges | False credibility signal |

**Enforcement**: Testimonial schema requires `verified` field — documentation states it must reflect reality. Logo cloud docs: "real customers only."

### 2. Fabricated Scarcity or Urgency

| Forbidden | Why |
|-----------|-----|
| Fake countdown timers (reset on reload) | Proven dark pattern; erodes trust |
| Fake stock counters ("3 left!" when unlimited) | Deceptive |
| Fake "people viewing now" | Fabricated social proof |
| Perpetual "Sale ends tonight" (never ends) | False urgency; legal risk in EU (OMNIDIRECTIVE) |
| Fake limited seats for unlimited digital product | Manufactured scarcity |

**Enforcement**: No schema fields exist for countdown timers or stock counters in this kit. If genuine urgency exists (real deadline, real limited beta), it must be documented as real.

### 3. Misleading CTAs

| Forbidden | Why |
|-----------|-----|
| CTA text that misrepresents the action ("Download" that signs you up) | Deception |
| "Start free trial" that immediately requires credit card (if not disclosed) | Bait-and-switch |
| Confusing CTA hierarchy (decoy dark pattern: making the "No thanks" hard to click) | Manipulative design |
| Pre-checked consent/subscription boxes | Illegal in GDPR territory; deceptive |

**Enforcement**: CTA schema: `label` + `href` + `disclaimer?`. Guidance requires action transparency. Forms: consent checkboxes default to **unchecked**.

### 4. Hidden Costs & Information

| Forbidden | Why |
|-----------|-----|
| Price revealed only at final checkout step | Drip pricing — regulated (EU OMC) |
| "Free" product with undisclosed mandatory fees | Deceptive |
| Hidden subscription in "free" signup | Negative option billing without consent |
| Obscured cancellation path | Illegal in many jurisdictions (ROSCA, EU consumer law) |
| Terms of service designed to be unreadable | Bad faith |

**Enforcement**: Pricing schema includes `finePrint` field — documentation mandates total-cost disclosure. No component supports "price at checkout only" flow.

### 5. Manipulation by Confusion

| Forbidden | Why |
|-----------|-----|
| Tricky language in opt-outs ("Are you sure you want to lose your progress?") | Emotional blackmail |
| Confirm-shaming ("No thanks, I hate saving money") | Shaming manipulates rather than informs |
| Misdirection (highlighting "Accept all" while de-emphasizing "Manage") | Dark pattern (per darkpatterns.org taxonomy) |
| Roach motel (easy to get in, hard to get out) | Illegal in some jurisdictions |
| Disguised ads (ad that looks like content/navigation) | Deceptive |

**Enforcement**: Copywriting guidance bans confirm-shaming. Design system: equal-weight choice presentation required for consent UI.

### 6. Fake Trust Signals

| Forbidden | Why |
|-----------|-----|
| Invented security badges / certifications | Fraud; may violate certification marks |
| "As seen in Forbes" when never covered | False claim |
| Fake press logos | Deception |
| Invented awards | Deception |
| SSL/security icons without actual security | False reassurance |

**Enforcement**: TrustBadges schema: `verified: boolean` + `source: string` (link to verification). Docs: "link to actual certification or remove."

### 7. Unethical A/B Testing

| Forbidden | Why |
|-----------|-----|
| Testing deception (which lie converts best) | Optimization of manipulation |
| Dark pattern variants (hidden unsubscribe tested vs visible) | Unethical experiment |
| Not rolling back harmful variants | Irresponsibility |
| Fake scarcity as variant | Deception |

**Enforcement**: Experiment review requires ethics check before launch (documented in Phase 4 experimentation guide).

---

## Required Patterns (Positive Obligations)

| Obligation | Where |
|------------|-------|
| **Real proof only** — testimonials, counts, logos must be genuine | Every trust component |
| **True pricing** — total cost visible before commitment | Pricing components |
| **Consent default unchecked** — GDPR/consent best practice | Forms, newsletter |
| **Cancellation equal to signup** — as easy to leave as to join | Signup flows |
| **Disclaimers near claims** — "Results vary", "Based on internal data" | Stats, testimonials with metrics |
| **Honest CTAs** — label matches actual action | All CTAs |
| **Accessible opt-outs** — visible unsubscribe, close, decline | All flows |

---

## Legal Awareness (Not Legal Advice)

The kit operates with awareness of (but does not substitute for legal counsel on):

| Regulation | Relevance |
|------------|-----------|
| **GDPR** (EU) | Consent, data transparency, right to withdraw |
| **UCPD / Omnibus Directive** (EU) | Fake reviews banned (2022), price transparency, fake countdowns |
| **ROSCA** (US) | Negative option billing consent requirements |
| **FTC Endorsement Guides** (US) | Testimonial truthfulness, disclosure requirements |
| **CNIL** (FR) | Cookie consent, French consumer law |
| **DPA** (various) | Privacy policy, cookie banners |

> **Disclaimer**: This is engineering guidance, not legal advice. Each product should obtain legal review for its jurisdiction.

---

## Review Checklist (Before Shipping Any Section)

- [ ] All testimonials are from real customers with consent
- [ ] All counts/statistics are true and current
- [ ] All logos are of actual customers/partners (with permission)
- [ ] Countdown/deadline (if any) reflects a genuine deadline
- [ ] Price shown includes all mandatory costs before commitment
- [ ] CTA labels accurately describe what happens on click
- [ ] Consent checkboxes are unchecked by default
- [ ] Cancellation path is documented and as easy as signup
- [ ] No confirm-shaming or guilt-tripping language
- [ ] No fake trust badges or unverifiable claims
- [ ] Claims have evidence (or are labeled as opinion/illustration)

---

## Enforcement Mechanisms

| Layer | Mechanism |
|-------|-----------|
| **Schema** | Forbidden patterns have no fields (no `fakeCountdown` prop) |
| **Documentation** | Guidance blocks per component state rules explicitly |
| **TypeScript** | `verified: boolean` required on testimonials — reviewer must pass explicit `true` |
| **Review** | PR review checklist includes ethics section |
| **A/B testing** | Experiment ethics review gate (Phase 4) |

---

*Next: [Roadmap](ROADMAP.md) — Phases 2–4 detailed plan*