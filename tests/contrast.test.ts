import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Automated WCAG 2.1 contrast validation for design tokens (Roadmap 2.2).
 *
 * Parses tokens.css (oklch), resolves var() indirections and checks the
 * pairs that carry meaning: body/secondary text (AA 4.5:1), status text on
 * tinted backgrounds (AA 4.5:1) and non-text UI boundaries such as focus
 * ring / strong borders (AA 3:1, WCAG 1.4.11).
 *
 * No external dependency — OKLab maths implemented from the specification.
 */

const TOKENS_PATH = path.join(
  process.cwd(),
  "packages/design-tokens/src/tokens.css",
);

type Rgb = [number, number, number];

/** oklch -> linear sRGB (OKLab specification). Out-of-gamut channels clamp. */
function oklchToLinearSrgb(L: number, C: number, H: number): Rgb {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return [
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** WCAG relative luminance from linear sRGB channels. */
function luminance([r, g, b]: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

interface TokenSet {
  get(name: string): string | undefined;
}

function parseBlock(css: string, selector: string): Map<string, string> {
  const idx = css.indexOf(selector);
  if (idx === -1) throw new Error(`selector not found: ${selector}`);
  const start = css.indexOf("{", idx);
  const end = css.indexOf("}", start);
  const body = css.slice(start + 1, end);
  const map = new Map<string, string>();
  for (const line of body.split("\n")) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);/);
    if (m && m[1] && m[2]) map.set(m[1], m[2].trim());
  }
  return map;
}

function makeTokenSet(raw: Map<string, string>): TokenSet {
  const resolve = (value: string, depth = 0): string => {
    if (depth > 10) return value;
    const m = value.match(/^var\((--[\w-]+)\)$/);
    if (!m || !m[1]) return value;
    const next = raw.get(m[1]);
    if (!next) throw new Error(`unresolved token: ${value}`);
    return resolve(next, depth + 1);
  };
  return {
    get(name) {
      const value = raw.get(name);
      return value ? resolve(value) : undefined;
    },
  };
}

function toLinear(name: string, tokens: TokenSet): Rgb {
  if (/^#f{3,6}$/i.test(name)) return [1, 1, 1];
  const value = tokens.get(name);
  if (!value) throw new Error(`missing color token: ${name}`);
  const m = value.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)$/);
  if (!m) throw new Error(`unsupported color format for ${name}: ${value}`);
  return oklchToLinearSrgb(Number(m[1]), Number(m[2]), Number(m[3]));
}

const css = fs.readFileSync(TOKENS_PATH, "utf8");
const lightRaw = parseBlock(css, ":root {");
const darkRaw = new Map(lightRaw);
for (const [k, v] of parseBlock(css, ".dark {")) darkRaw.set(k, v);

const themes: Array<{ name: string; tokens: TokenSet }> = [
  { name: "light", tokens: makeTokenSet(lightRaw) },
  { name: "dark", tokens: makeTokenSet(darkRaw) },
];

/** WCAG 2.1 AA — normal text. */
const AA_TEXT = 4.5;
/** WCAG 2.1 AA — non-text UI boundaries (1.4.11). */
const AA_NON_TEXT = 3;

const textPairs: Array<[fg: string, bg: string]> = [
  ["--lmk-foreground", "--lmk-background"],
  ["--lmk-foreground", "--lmk-background-surface"],
  ["--lmk-foreground", "--lmk-background-muted"],
  ["--lmk-foreground-muted", "--lmk-background"],
  ["--lmk-foreground-muted", "--lmk-background-surface"],
  ["--lmk-foreground-muted", "--lmk-background-muted"],
  ["--lmk-foreground-subtle", "--lmk-background"],
  ["--lmk-foreground-subtle", "--lmk-background-surface"],
  ["--lmk-foreground-subtle", "--lmk-background-muted"],
  ["--lmk-foreground-on-brand", "--lmk-brand-primary"],
  ["--lmk-accent-foreground", "--lmk-accent"],
  ["--lmk-success-foreground", "--lmk-success-background"],
  ["--lmk-warning-foreground", "--lmk-warning-background"],
  ["--lmk-error-foreground", "--lmk-error-background"],
  // Solid button fills: white label on the Button primary / destructive fills.
  ["#ffffff", "--lmk-accent"],
  ["#ffffff", "--lmk-error"],
];

const nonTextPairs: Array<[fg: string, bg: string]> = [
  ["--lmk-focus-ring", "--lmk-background"],
  ["--lmk-focus-ring", "--lmk-background-muted"],
  ["--lmk-border-strong", "--lmk-background"],
  ["--lmk-border-strong", "--lmk-background-surface"],
  ["--lmk-border-strong", "--lmk-background-muted"],
  ["--lmk-accent", "--lmk-background"],
  ["--lmk-error", "--lmk-error-background"],
  ["--lmk-success", "--lmk-success-background"],
];

describe("Design token contrast (WCAG 2.1 AA)", () => {
  for (const theme of themes) {
    describe(theme.name, () => {
      for (const [fg, bg] of textPairs) {
        it(`${fg} on ${bg} reaches ${AA_TEXT}:1`, () => {
          const ratio = contrast(
            luminance(toLinear(fg, theme.tokens)),
            luminance(toLinear(bg, theme.tokens)),
          );
          expect(
            Number(ratio.toFixed(2)),
            `${theme.name}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1`,
          ).toBeGreaterThanOrEqual(AA_TEXT);
        });
      }

      for (const [fg, bg] of nonTextPairs) {
        it(`${fg} on ${bg} reaches ${AA_NON_TEXT}:1 (non-text)`, () => {
          const ratio = contrast(
            luminance(toLinear(fg, theme.tokens)),
            luminance(toLinear(bg, theme.tokens)),
          );
          expect(
            Number(ratio.toFixed(2)),
            `${theme.name}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1`,
          ).toBeGreaterThanOrEqual(AA_NON_TEXT);
        });
      }

      it("keeps every semantic color token resolvable", () => {
        for (const [fg, bg] of [...textPairs, ...nonTextPairs]) {
          expect(() => toLinear(fg, theme.tokens)).not.toThrow();
          expect(() => toLinear(bg, theme.tokens)).not.toThrow();
        }
      });
    });
  }
});
