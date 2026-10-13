/**
 * Bundle size gate — Roadmap 2.2/2.5: every component must stay under
 * 5 kB gzipped.
 *
 * Each `src/components/*.tsx` file is bundled standalone and the minified
 * ESM output is gzipped. Framework code (react family) and shared utility
 * dependencies (clsx, tailwind-merge, class-variance-authority, zod) are
 * external: they ship once per application, not once per component, so the
 * budget measures the code this kit owns.
 *
 * Reuses esbuild already present in the toolchain (vitest -> vite -> esbuild):
 * no new dependency is installed.
 *
 * Usage: node scripts/check-bundle-size.mjs
 * Exit code 1 when a component exceeds the budget.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createRequire } from "node:module";

const root = process.cwd();
const BUDGET_BYTES = 5 * 1024;

const rootRequire = createRequire(path.join(root, "package.json"));
const viteRequire = createRequire(rootRequire.resolve("vitest/package.json"));
const esbuildRequire = createRequire(viteRequire.resolve("vite/package.json"));
const esbuild = esbuildRequire("esbuild");

const alias = {
  "@landing/design-tokens": path.join(root, "packages/design-tokens/src/index.ts"),
  "@landing/themes": path.join(root, "packages/themes/src/index.ts"),
  "@landing/ui-core": path.join(root, "packages/ui-core/src/index.ts"),
  "@landing/marketing": path.join(root, "packages/marketing-components/src/index.ts"),
  "@landing/patterns": path.join(root, "packages/conversion-patterns/src/index.tsx"),
  "@landing/copywriting": path.join(root, "packages/copywriting/src/index.ts"),
  "@landing/analytics": path.join(root, "packages/analytics/src/index.ts"),
  "@landing/experimentation": path.join(root, "packages/experimentation/src/index.ts"),
  "@landing/seo": path.join(root, "packages/seo/src/index.ts"),
};

const EXTERNAL = [
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "zod",
];

function componentFiles() {
  const files = [];
  for (const pkg of fs.readdirSync(path.join(root, "packages"))) {
    const dir = path.join(root, "packages", pkg, "src", "components");
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      if (entry.endsWith(".tsx")) files.push(path.join(dir, entry));
    }
  }
  return files.sort();
}

function gzipSize(file) {
  const result = esbuild.buildSync({
    entryPoints: [file],
    bundle: true,
    write: false,
    format: "esm",
    minify: true,
    treeShaking: true,
    platform: "browser",
    jsx: "automatic",
    external: EXTERNAL,
    alias,
    logLevel: "silent",
    tsconfig: path.join(root, "tsconfig.base.json"),
  });
  const code = result.outputFiles[0].text;
  return zlib.gzipSync(code, { level: 9 }).length;
}

const files = componentFiles();
if (files.length === 0) {
  console.error("No component files found under packages/*/src/components.");
  process.exit(1);
}

let failures = 0;
const rows = [];
for (const file of files) {
  const size = gzipSize(file);
  const rel = path.relative(root, file).replaceAll("\\", "/");
  const ok = size <= BUDGET_BYTES;
  if (!ok) failures += 1;
  rows.push({ rel, size, ok });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`Bundle size budget: ${BUDGET_BYTES} B gzipped per component (kit code only)\n`);
console.log(`${pad("COMPONENT", 62)} ${pad("GZIP", 8)} STATUS`);
for (const row of rows) {
  console.log(`${pad(row.rel, 62)} ${pad(`${row.size} B`, 8)} ${row.ok ? "PASS" : "FAIL"}`);
}
console.log(
  `\n${rows.length - failures}/${rows.length} components within budget.`,
);

if (failures > 0) {
  console.error(`\n${failures} component(s) exceed ${BUDGET_BYTES} B gzipped.`);
  process.exit(1);
}
