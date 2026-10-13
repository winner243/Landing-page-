# Design System Foundation

> Foundational design token strategy and UI rules. The kit ships tokens, not fixed styles — each SaaS brand overrides tokens without touching components.

## 1. Typography

### Scale (Modular — 1.2 ratio)

| Token | Size | Line Height | Use |
|-------|------|-------------|-----|
| `text-xs` | 0.75rem / 12px | 1.5 | Captions, labels, badges |
| `text-sm` | 0.875rem / 14px | 1.55 | Secondary text, metadata |
| `text-base` | 1rem / 16px | 1.6 | Body text (default) |
| `text-lg` | 1.125rem / 18px | 1.6 | Lead paragraphs, hero sub |
| `text-xl` | 1.25rem / 20px | 1.5 | Card titles, section labels |
| `text-2xl` | 1.5rem / 24px | 1.4 | H6 / feature titles |
| `text-3xl` | 1.875rem / 30px | 1.3 | H5 / small section headers |
| `text-4xl` | 2.25rem / 36px | 1.2 | H4 / section headers |
| `text-5xl` | 3rem / 48px | 1.15 | H3 / major headers |
| `text-6xl` | 3.75rem / 60px | 1.1 | H2 / hero headline (desktop) |
| `text-7xl` | 4.5rem / 72px | 1.05 | H1 / hero headline (large) |

### Heading Hierarchy

| Level | Semantic | Default Size | Weight |
|-------|----------|-------------|--------|
| H1 | Page title / Hero headline | `text-6xl` → `text-7xl` (lg) | 700–800 |
| H2 | Section header | `text-4xl` → `text-5xl` (lg) | 700 |
| H3 | Subsection / Card group title | `text-2xl` → `text-3xl` (lg) | 600–700 |
| H4 | Feature title / Major card | `text-xl` → `text-2xl` (lg) | 600 |
| H5 | Small section header | `text-lg` → `text-xl` (lg) | 600 |
| H6 | Eyebrow / Label | `text-sm` → `text-base` | 600 |

### Body Text Rules

- **Max measure**: 65–75 characters per line (≈ `max-w-prose` / `max-w-[65ch]`)
- **Body default**: `text-base` (16px) — never below 16px on mobile
- **Line height**: 1.6 for body, 1.4–1.5 for headings
- **Paragraph spacing**: `margin-bottom: 1em`
- **Label / eyebrow**: `text-sm` uppercase, `tracking-wider`, `font-medium` (used sparingly — not for all text)

### Font Strategy

- **Headings**: Brand font (loaded via token), fallback: `system-ui`
- **Body**: System font stack or brand font; avoid loading > 2 font families
- **Font loading**: `font-display: swap`, preload critical weights only, subset (Latin minimum)
- **Weights used**: 400 (body), 600 (emphasis/labels), 700–800 (headings) — max 3 per family

---

## 2. Spacing

### Base Unit: 4px (0.25rem)

| Token | Value | Use |
|-------|-------|-----|
| `space-0` | 0 | Reset |
| `space-1` | 4px | Icon gaps, badge padding |
| `space-2` | 8px | Inline gaps, tight padding |
| `space-3` | 12px | Input padding, small gaps |
| `space-4` | 16px | Default gap, card padding, form fields |
| `space-5` | 20px | Card internal spacing |
| `space-6` | 24px | Section padding (mobile), grid gap |
| `space-8` | 32px | Between related blocks, large gaps |
| `space-10` | 40px | Section spacing (mobile) |
| `space-12` | 48px | Major section spacing |
| `space-16` | 64px | Section padding (desktop), hero padding |
| `space-20` | 80px | Large section spacing (desktop) |
| `space-24` | 96px | Full section separation |
| `space-32` | 128px | Major page sections |

### Section Spacing Strategy (Vertical Rhythm)

| Context | Mobile | Desktop |
|---------|--------|---------|
| Between related cards | `space-4`–`space-6` | `space-6`–`space-8` |
| Between sections | `space-12`–`space-16` | `space-20`–`space-32` |
| Inside section (header → content) | `space-6`–`space-8` | `space-8`–`space-12` |
| Hero internal | `space-6` | `space-8`–`space-10` |
| Card internal | `space-4`–`space-6` | `space-6`–`space-8` |

---

## 3. Colors

### Token Categories (Semantic, not raw values)

| Category | Tokens | Purpose |
|----------|--------|---------|
| **Brand** | `brand-primary`, `brand-secondary`, `brand-accent` | Identity — overridden per SaaS |
| **Background** | `bg-background`, `bg-surface`, `bg-surface-raised`, `bg-muted` | Page & component surfaces |
| **Foreground** | `fg-default`, `fg-muted`, `fg-subtle`, `fg-on-brand` | Text & icons |
| **Accent/Interactive** | `accent`, `accent-hover`, `accent-active`, `accent-fg` | Buttons, links, focus |
| **Success** | `success`, `success-bg`, `success-fg` | Positive states, toasts |
| **Warning** | `warning`, `warning-bg`, `warning-fg` | Caution states |
| **Error** | `error`, `error-bg`, `error-fg` | Errors, destructive actions |
| **Border** | `border-default`, `border-subtle`, `border-strong` | Dividers, inputs |
| **Focus** | `focus-ring` | Focus-visible outline |

### Color Format

- **Storage**: OKLCH (Tailwind CSS v4 default) — perceptually uniform, accessible contrast calculations
- **Output**: CSS custom properties (`--color-*`)
- **Fallback**: Hex values for older tooling

### Accessibility Requirements (WCAG 2.1 AA)

| Pair | Minimum Ratio |
|------|--------------|
| Body text on background | **4.5:1** |
| Large text (≥18.66px bold / ≥24px) | **3:1** |
| UI components (borders, icons) | **3:1** |
| Focus ring on background | **3:1** |

> Contrast ratios are verified per theme via automated checks (Phase 2 tooling).

### Theme Strategy

```
Base Theme (neutral, shipped with kit)
  ├── All semantic tokens defined with default values
  └── Accessible by default (verified)

Brand Theme Override (per SaaS)
  ├── Overrides: brand-primary, brand-secondary, brand-accent
  ├── Optional: surface tints, accent-hover
  └── Inherits: semantic structure, success/warning/error, focus

Dark Mode (optional, Phase 3+)
  └── Inverts bg/fg tokens; preserves brand tokens
```

---

## 4. Component States

Every interactive component supports these states:

| State | Trigger | Visual Treatment |
|-------|---------|-----------------|
| **Default** | Resting | Base styles |
| **Hover** | Pointer over | Slight color/shadow shift (`bg-accent-hover`) |
| **Focus** | Keyboard focus | Visible ring: `outline: 2px solid focus-ring; outline-offset: 2px` |
| **Active** | Being pressed | Darker shade / reduced scale (0.98) |
| **Disabled** | Unavailable | Reduced opacity (0.5), `cursor: not-allowed`, no hover/focus |
| **Loading** | Async operation | Spinner replaces/supplements label; `aria-busy="true"`; width preserved |
| **Error** | Validation failure | Error color border + message; `aria-invalid="true"` + `aria-describedby` |

### Focus Ring Rules

- **Always visible** on keyboard navigation (`:focus-visible`)
- **Never removed** — `outline: none` without replacement is prohibited
- **Contrast ≥ 3:1** against adjacent colors
- **Consistent**: 2px solid + 2px offset (default)

### Loading State Rules

- Buttons: preserve original width; show spinner inside
- Forms: disable submit; show progress; announce via `aria-live`
- Never: infinite loading without timeout handling

---

## 5. Responsive Strategy (Mobile-First)

### Breakpoints

| Token | Min-width | Target |
|-------|-----------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Rules

1. **Start at 375px** (smallest common viewport) — design upward
2. **Single column default** → multi-column at `md`+
3. **Touch targets ≥ 44×44px** always (WCAG 2.5.5)
4. **Navigation**: Hamburger below `lg`, horizontal at `lg`+ (configurable)
5. **Typography**: Use `clamp()` for fluid sizing where possible; explicit breakpoints for hero
6. **Images**: Always responsive (`srcset`/`sizes` or Next.js `<Image>`)
7. **Spacing**: Reduce vertical rhythm by ~30% on mobile vs desktop
8. **Pricing tables**: Stack cards on mobile, table on desktop
9. **Sticky elements**: CTA sticky bar only on mobile (desktop has persistent nav CTA)

### Fluid Typography (Preferred)

```css
/* Instead of fixed sizes at breakpoints: */
h1 { font-size: clamp(2.25rem, 5vw + 1rem, 4.5rem); }
```

---

## 6. Elevation (Shadows)

| Token | Use |
|-------|-----|
| `shadow-sm` | Subtle: hover states, dropdowns |
| `shadow-md` | Default: cards, popovers |
| `shadow-lg` | Elevated: modals, sticky nav |
| `shadow-xl` | Floating: command palette, toast |

> Prefer border + subtle shadow over heavy shadows. Shadows must not obscure content.

---

## 7. Radius

| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | 6px | Badges, tags, small elements |
| `radius-md` | 8px | Inputs, buttons |
| `radius-lg` | 12px | Cards |
| `radius-xl` | 16px | Large cards, modals |
| `radius-full` | 9999px | Pills, avatars |

---

## 8. Motion

| Token | Duration | Use |
|-------|----------|-----|
| `duration-fast` | 150ms | Hover, focus transitions |
| `duration-normal` | 250ms | Dropdowns, accordions |
| `duration-slow` | 400ms | Page transitions, reveals |

### Rules

- `prefers-reduced-motion: reduce` → disable all non-essential animation
- Use `transform`/`opacity` only (GPU-friendly, no layout shift)
- No scroll-jacking, no auto-playing video with sound, no parallax that impairs reading

---

## 9. Token Definition Format

Tokens defined as JSON (platform-agnostic) + TypeScript types:

```typescript
// design-tokens/types.ts (conceptual)
interface DesignTokens {
  color: {
    brand: { primary: string; secondary: string; accent: string };
    background: { default: string; surface: string; muted: string };
    foreground: { default: string; muted: string; onBrand: string };
    semantic: { success: string; warning: string; error: string };
    // ...
  };
  spacing: { /* 4px scale */ };
  typography: { fontFamily: { heading: string; body: string }; /* scale */ };
  radius: { /* ... */ };
  shadow: { /* ... */ };
  motion: { duration: { /* ... */ } };
}
```

**Generation pipeline (Phase 2)**: JSON → Style Dictionary / custom transformer → CSS variables + TS types.

---

*Next: [Component Taxonomy](COMPONENT-TAXONOMY.md) — Component catalog & categorization*