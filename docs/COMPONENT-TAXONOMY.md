# Component Taxonomy

> Catalog of all planned components, organized by category, layer, and priority. No components are built in Phase 1 — this is the classified blueprint.

## Taxonomy Structure

Components are classified on three axes:

1. **Category** — functional grouping (navigation, hero, trust…)
2. **Layer** — which package owns it (ui-core, marketing-components, conversion-patterns)
3. **Priority** — build order (P0 = Phase 2, P1 = Phase 3, P2 = Phase 4)

---

## Layer Assignment Rules

| Layer | Contents | Rule |
|-------|----------|------|
| `ui-core` | Generic UI (Button, Card, Input, Accordion…) | No marketing semantics in name or API |
| `marketing-components` | Marketing-specific (Hero, CTA, Testimonial…) | Accepts content schema props |
| `conversion-patterns` | Section compositions (ProblemSolution, SocialProof…) | Composes marketing components; defines slots |

---

## Full Taxonomy

### 1. Navigation

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `Navbar` | marketing | P0 | Default, Transparent (scroll-aware), Sticky | Links, CTA, logo slot |
| `MobileNav` | marketing | P0 | Slide-over, Accordion | Hamburger trigger, focus trap |
| `SkipLink` | ui-core | P0 | — | Accessibility, first tab stop |
| `Breadcrumbs` | ui-core | P1 | — | For multi-page marketing sites |

### 2. Hero

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `Hero` | marketing | P0 | — | Container + slots |
| ↳ `HeroClassic` | marketing | P0 | — | Centered headline + sub + CTA |
| ↳ `HeroSplit` | marketing | P0 | — | Text left, visual right |
| ↳ `HeroProduct` | marketing | P1 | — | Product screenshot as visual |
| ↳ `HeroDashboard` | marketing | P1 | — | Floating dashboard mockup |
| ↳ `HeroVideo` | marketing | P1 | — | Video/demo as background or inline |
| ↳ `HeroMinimal` | marketing | P1 | — | Text-only, ultra-focused |
| `HeroBadge` | marketing | P0 | — | Eyebrow announcement pill |
| `HeroProof` | marketing | P0 | — | Inline proof (avatars + count) below CTA |

### 3. Conversion (CTA)

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `CTAButton` | ui-core | P0 | Primary, Secondary, Ghost, Link | Extends Button; analytics-ready |
| `CTABanner` | marketing | P1 | Inline, Section-level | Mid-page conversion prompt |
| `CTAFinal` | marketing | P1 | — | Full-width closing section |
| `CTASticky` | marketing | P2 | Mobile-only | Appears after scroll threshold |
| `CTAWithProof` | marketing | P1 | — | CTA + trust micro-copy ("No credit card") |

### 4. Trust & Social Proof

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `LogoCloud` | marketing | P0 | Marquee, Grid | Grayscale logos, real customers only |
| `TestimonialCard` | marketing | P0 | Standard, Featured | Avatar, quote, name, role, company |
| `TestimonialGrid` | marketing | P1 | 2-col, 3-col, Masonry | Groups testimonial cards |
| `TestimonialCarousel` | marketing | P2 | — | Accessible carousel (reduced motion aware) |
| `ReviewCard` | marketing | P1 | — | Star rating + text (for aggregated reviews) |
| `CaseStudyCard` | marketing | P1 | — | Thumbnail, metric, summary, link |
| `TrustBar` | marketing | P0 | — | Compact: badges + certifications row |
| `TrustBadges` | marketing | P1 | Security, Compliance, Guarantee | Icon + label + optional link |
| `StatsBar` | marketing | P0 | — | 3–4 key metrics with labels |
| `AvatarGroup` | ui-core | P0 | — | Overlapping avatars for social proof |

### 5. Product

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `FeatureCard` | marketing | P0 | Icon-top, Icon-left | Title, description, optional link |
| `FeatureGrid` | marketing | P0 | 2-col, 3-col, Bento | Groups feature cards |
| `ProductShowcase` | marketing | P1 | Screenshot, Annotated | Large visual + callouts |
| `Workflow` | marketing | P1 | Steps horizontal/vertical | Numbered steps + icons |
| `IntegrationShowcase` | marketing | P1 | Grid, Marquee | Logos + connection narrative |
| `ComparisonTable` | marketing | P1 | Plans, Alternatives | Feature × plan matrix |
| `CodeShowcase` | marketing | P2 | — | For developer tools (code snippet + visual) |

### 6. Pricing

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `PricingCard` | marketing | P0 | Default, Featured, Compact | Plan name, price, features, CTA |
| `PricingTable` | marketing | P0 | Grid, Table | Groups pricing cards |
| `PricingToggle` | marketing | P1 | Monthly/Annual | Real savings calculation, honest labels |
| `PricingFAQ` | marketing | P1 | — | FAQ specific to billing/pricing |
| `PricingNote` | marketing | P1 | — | Fine print: taxes, billing terms |

### 7. Content

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `FAQAccordion` | ui-core | P0 | — | Accessible accordion (details/summary or controlled) |
| `BenefitList` | marketing | P0 | Checkmark, Icon | Benefits with positive framing |
| `UseCaseCard` | marketing | P1 | — | Persona/scenario → outcome |
| `IconList` | marketing | P1 | Horizontal, Vertical | Icon + short label list |
| `SectionHeader` | marketing | P0 | — | Eyebrow + title + description pattern |
| `Section` | marketing | P0 | — | Layout wrapper: padding, container, bg variant |

### 8. Footer

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `Footer` | marketing | P0 | — | Container + slots |
| ↳ `FooterClassic` | marketing | P0 | — | Simple: logo, links, legal |
| ↳ `FooterSaaS` | marketing | P1 | — | Columns: Product, Company, Resources, Legal |
| ↳ `FooterMultiColumn` | marketing | P1 | — | 5+ columns for complex products |
| `NewsletterForm` | marketing | P1 | — | Email input + consent checkbox |

### 9. Forms (Signup / Contact)

| Component | Layer | Priority | Variants | Notes |
|-----------|-------|----------|----------|-------|
| `Input` | ui-core | P0 | Text, Email, Password | Label + hint + error pattern |
| `FormField` | ui-core | P0 | — | Wraps label, input, hint, error (a11y) |
| `SignupForm` | marketing | P1 | Inline, Card | Email-only or name+email; server action ready |
| `ContactForm` | marketing | P2 | — | Name, email, message |
| `Select` | ui-core | P1 | — | Native-first, enhanced if needed |

### 10. Primitives (ui-core)

| Component | Layer | Priority | Notes |
|-----------|-------|----------|-------|
| `Button` | ui-core | P0 | CVA variants: primary, secondary, ghost, destructive |
| `Card` | ui-core | P0 | Header, content, footer slots |
| `Badge` | ui-core | P0 | Status / label pill |
| `Separator` | ui-core | P0 | hr with semantic role |
| `Avatar` | ui-core | P0 | Image + initials fallback |
| `Tooltip` | ui-core | P1 | Accessible (keyboard + screen reader) |
| `Dialog` | ui-core | P1 | Modal with focus trap |
| `DropdownMenu` | ui-core | P1 | Menu with keyboard nav |
| `Tabs` | ui-core | P1 | ARIA tabs pattern |
| `Accordion` | ui-core | P0 | Base for FAQ |
| `Skeleton` | ui-core | P1 | Loading placeholder |
| `VisuallyHidden` | ui-core | P0 | Screen-reader-only text |

---

## Component API Conventions

### Content Props (Marketing Components)

Marketing components **never** accept raw ad-hoc strings for structured content. They accept **typed content objects**:

```typescript
// Conceptual — actual schemas in Phase 2
interface TestimonialCardContent {
  quote: string;           // max length enforced
  author: {
    name: string;
    role?: string;
    company?: string;
    avatarUrl?: string;
    verified?: boolean;    // must be true if displayed as verified
  };
  rating?: 1 | 2 | 3 | 4 | 5;
  source?: 'customer' | 'review-platform' | 'case-study';
}
```

### Slot Conventions

```typescript
// Composition via slots/children, not boolean flags
<Hero
  badge={<HeroBadge>New: AI-powered insights</HeroBadge>}
  headline="..."
  subheadline="..."
  actions={<CTAGroup primary={...} secondary={...} />}
  visual={<HeroDashboard variant="analytics" />}
  proof={<HeroProof customerCount={2400} avatars={[...]} />}
/>
```

### Analytics Convention

Every conversion-relevant component emits typed events:

```typescript
// Auto-tracked internally; consumers configure destination
onCTAClick?: (event: CTAEvent) => void
// Event includes: component, variant, location (header/hero/final), experimentId
```

### Variant Convention (A/B Testing)

```typescript
// Server-assigned variant, no client flicker
variant?: 'control' | 'treatment-a' | 'treatment-b'
// Default: 'control'. Externally assigned via middleware/experiment context.
```

---

## Build Order Summary

| Phase | Components |
|-------|-----------|
| **Phase 2** (P0) | ui-core primitives, Navbar, MobileNav, Hero (classic + split), CTAButton, LogoCloud, TestimonialCard, TrustBar, StatsBar, FeatureCard, FeatureGrid, PricingCard, PricingTable, FAQAccordion, SectionHeader, Section, Footer, FormField, Input |
| **Phase 3** (P1) | Hero variants, CTABanner, CTAFinal, TestimonialGrid, CaseStudyCard, ProductShowcase, Workflow, ComparisonTable, PricingToggle, FooterSaaS, NewsletterForm, SignupForm, Dialog, Tooltip, Tabs |
| **Phase 4** (P2) | CTASticky, TestimonialCarousel, CodeShowcase, ContactForm, conversion-pattern compositions, template pages |

---

*Next: [Copywriting](COPYWRITING.md) — Content structures & templates*