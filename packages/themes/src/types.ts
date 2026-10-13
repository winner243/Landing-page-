import type { ColorToken } from "@landing/design-tokens";

/**
 * A BrandTheme overrides a SUBSET of semantic tokens.
 * Components never reference brand colors directly — they use semantic
 * tokens (bg-accent, text-foreground…) which themes re-point.
 */
export interface BrandTheme {
  /** Unique theme id, e.g. "aurora". */
  name: string;
  /** Human label for tooling/playground. */
  label: string;
  /** Semantic color overrides (CSS variable values, e.g. oklch(...)). */
  colors?: Partial<Record<ColorToken, string>>;
  /** Font family overrides (CSS font stacks). */
  fonts?: {
    heading?: string;
    body?: string;
    mono?: string;
  };
  /** Radius personality overrides (explicit px/rem values). */
  radius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    full?: string;
  };
}
