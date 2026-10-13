/**
 * Design token constants — single source of truth mirroring tokens.css.
 * CSS variables in tokens.css are the runtime source; this module gives
 * TypeScript consumers typed access without importing CSS.
 */

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
} as const;

export const fontSize = {
  xs: ["0.75rem", { lineHeight: "1.5" }],
  sm: ["0.875rem", { lineHeight: "1.55" }],
  base: ["1rem", { lineHeight: "1.6" }],
  lg: ["1.125rem", { lineHeight: "1.6" }],
  xl: ["1.25rem", { lineHeight: "1.5" }],
  "2xl": ["1.5rem", { lineHeight: "1.4" }],
  "3xl": ["1.875rem", { lineHeight: "1.3" }],
  "4xl": ["2.25rem", { lineHeight: "1.2" }],
  "5xl": ["3rem", { lineHeight: "1.15" }],
  "6xl": ["3.75rem", { lineHeight: "1.1" }],
  "7xl": ["4.5rem", { lineHeight: "1.05" }],
} as const;

export const borderRadius = {
  none: "0px",
  sm: "6px",
  DEFAULT: "8px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;

export const duration = {
  fast: "150ms",
  normal: "250ms",
  slow: "400ms",
} as const;

export const easing = {
  DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const zIndex = {
  base: "0",
  dropdown: "1000",
  sticky: "1010",
  overlay: "1040",
  modal: "1050",
  popover: "1060",
  toast: "1070",
} as const;

export const container = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
  "2xl": "1400px",
} as const;

/** Semantic color token names — must match CSS custom properties in tokens.css. */
export const colorTokenNames = [
  "brand-primary",
  "brand-primary-hover",
  "brand-primary-active",
  "brand-secondary",
  "brand-accent",
  "background",
  "background-surface",
  "background-muted",
  "foreground",
  "foreground-muted",
  "foreground-subtle",
  "foreground-on-brand",
  "accent",
  "accent-hover",
  "accent-active",
  "accent-foreground",
  "success",
  "success-background",
  "success-foreground",
  "warning",
  "warning-background",
  "warning-foreground",
  "error",
  "error-background",
  "error-foreground",
  "border",
  "border-subtle",
  "border-strong",
  "focus-ring",
] as const;

export type ColorToken = (typeof colorTokenNames)[number];
