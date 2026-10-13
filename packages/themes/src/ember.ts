import type { BrandTheme } from "./types";

/** Ember - warm identity, consumer/creative feel, softer radius. */
export const ember: BrandTheme = {
  name: "ember",
  label: "Ember (Warm)",
  colors: {
    "brand-primary": "oklch(0.6 0.19 30)",
    "brand-primary-hover": "oklch(0.53 0.19 30)",
    "brand-primary-active": "oklch(0.47 0.19 30)",
    "brand-secondary": "oklch(0.7 0.14 60)",
    "brand-accent": "oklch(0.75 0.15 85)",
  },
  radius: {
    md: "10px",
    lg: "16px",
    xl: "20px",
  },
};
