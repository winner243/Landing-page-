import type { BrandTheme } from "./types";
import { aurora } from "./aurora";
import { emerald } from "./emerald";
import { ember } from "./ember";

export { aurora, emerald, ember };
export type { BrandTheme };

/** Built-in example themes for the playground and as starting points. */
export const builtInThemes = [aurora, emerald, ember];

const CSS_VAR_PREFIX = "--lmk-";

const COLOR_TO_VAR: Record<string, string> = {
  "brand-primary": "brand-primary",
  "brand-primary-hover": "brand-primary-hover",
  "brand-primary-active": "brand-primary-active",
  "brand-secondary": "brand-secondary",
  "brand-accent": "brand-accent",
  background: "background",
  "background-surface": "background-surface",
  "background-muted": "background-muted",
  foreground: "foreground",
  "foreground-muted": "foreground-muted",
  "foreground-subtle": "foreground-subtle",
  "foreground-on-brand": "foreground-on-brand",
  accent: "accent",
  "accent-hover": "accent-hover",
  "accent-active": "accent-active",
  "accent-foreground": "accent-foreground",
  success: "success",
  "success-background": "success-background",
  "success-foreground": "success-foreground",
  warning: "warning",
  "warning-background": "warning-background",
  "warning-foreground": "warning-foreground",
  error: "error",
  "error-background": "error-background",
  "error-foreground": "error-foreground",
  border: "border",
  "border-subtle": "border-subtle",
  "border-strong": "border-strong",
  "focus-ring": "focus-ring",
};

/**
 * Serializes a BrandTheme to a CSS rule targeting `.theme-<name>`.
 *
 * Usage: append output to your stylesheet once, then add
 * `className="theme-aurora"` on the root element.
 *
 * Note: interactive tokens derived from brand-primary (accent, focus-ring)
 * are re-pointed automatically so actions follow the brand.
 */
export function themeToCss(theme: BrandTheme): string {
  const rules: string[] = [];

  if (theme.colors) {
    for (const [token, value] of Object.entries(theme.colors)) {
      const varName = COLOR_TO_VAR[token];
      if (varName) rules.push(`${CSS_VAR_PREFIX}${varName}: ${value};`);
    }
    // Keep interactive tokens in sync with brand-primary when overridden
    if (theme.colors["brand-primary"]) {
      if (!theme.colors["accent"]) {
        rules.push(`${CSS_VAR_PREFIX}accent: ${theme.colors["brand-primary"]};`);
      }
      if (!theme.colors["focus-ring"]) {
        rules.push(
          `${CSS_VAR_PREFIX}focus-ring: ${theme.colors["brand-primary"]};`,
        );
      }
    }
    if (theme.colors["brand-primary-hover"] && !theme.colors["accent-hover"]) {
      rules.push(
        `${CSS_VAR_PREFIX}accent-hover: ${theme.colors["brand-primary-hover"]};`,
      );
    }
    if (theme.colors["brand-primary-active"] && !theme.colors["accent-active"]) {
      rules.push(
        `${CSS_VAR_PREFIX}accent-active: ${theme.colors["brand-primary-active"]};`,
      );
    }
  }

  if (theme.fonts?.heading)
    rules.push(`${CSS_VAR_PREFIX}font-heading: ${theme.fonts.heading};`);
  if (theme.fonts?.body)
    rules.push(`${CSS_VAR_PREFIX}font-body: ${theme.fonts.body};`);
  if (theme.fonts?.mono)
    rules.push(`${CSS_VAR_PREFIX}font-mono: ${theme.fonts.mono};`);

  if (theme.radius) {
    const map: Record<string, string> = {
      sm: "radius-sm",
      md: "radius-md",
      lg: "radius-lg",
      xl: "radius-xl",
      full: "radius-full",
    };
    for (const [key, varName] of Object.entries(map)) {
      const value = theme.radius[key as keyof typeof theme.radius];
      if (value) rules.push(`${CSS_VAR_PREFIX}${varName}: ${value};`);
    }
  }

  if (rules.length === 0) return "";
  return `.theme-${theme.name} {\n  ${rules.join("\n  ")}\n}`;
}

/** Builds a `<style>` element string for runtime injection (SSR-safe head tag). */
export function themeToStyleTag(theme: BrandTheme): string {
  const css = themeToCss(theme);
  return css ? `<style data-theme="${theme.name}">${css}</style>` : "";
}
