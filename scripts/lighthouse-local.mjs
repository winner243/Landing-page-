/**
 * Local Lighthouse run — manual gate for Roadmap 3.5.
 * No CI here (D-016 defers Lighthouse CI to Phase 4); scores are recorded
 * manually in docs/LIGHTHOUSE.md after each run.
 *
 * Usage:
 *   pnpm --filter playground exec next start --port 3113   (build first)
 *   node scripts/lighthouse-local.mjs http://localhost:3113
 *
 * Desktop preset, 3 runs per route, **median score per category** (same
 * approach as Lighthouse CI) — exits non-zero if any route medians < 95
 * on performance / accessibility / SEO / best-practices.
 * Full-page screenshots are disabled (they force a full relayout on long
 * content-visibility pages and distort TBT without affecting scores).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { launch } from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";

const base = (process.argv[2] ?? "http://localhost:3113").replace(/\/+$/, "");
const outDir = resolve(process.cwd(), process.argv[3] ?? ".lighthouse");
const routes = ["/", "/landing", "/templates/saas-b2b", "/templates/simple"];
const categories = ["performance", "accessibility", "seo", "best-practices"];
const RUNS = Number(process.env.LH_RUNS ?? 3);
const TARGET = 95;

mkdirSync(outDir, { recursive: true });

const profileDir = resolve(outDir, "chrome-profile");
mkdirSync(profileDir, { recursive: true });

// Warm every route first: the first request after `next start` pays the
// cold-start TTFB, which would unfairly tank the perf score of route 1.
for (const route of routes) {
  const res = await fetch(base + route).catch(() => null);
  if (!res || !res.ok) {
    console.error(`warmup failed: ${route} (${res ? res.status : "no response"})`);
    process.exit(1);
  }
}
console.log(`warmed ${routes.length} routes, ${RUNS} runs per route`);

const chrome = await launch({
  chromeFlags: ["--headless=new", "--disable-gpu", "--disable-dev-shm-usage"],
  userDataDir: profileDir,
  logLevel: "silent",
});

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

let failures = 0;
try {
  for (const route of routes) {
    const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    try {
      const runs = [];
      for (let i = 0; i < RUNS; i += 1) {
        const result = await lighthouse(base + route, {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: categories,
          // Full-page capture resizes the viewport to page height, which
          // forces one giant layout task on long pages (content-visibility
          // sections all become relevant at once) and pollutes TBT.
          disableFullPageScreenshot: true,
        }, desktopConfig);
        runs.push(result.lhr);
      }

      // Representative artifact = the run with the median performance score.
      const byPerf = [...runs].sort(
        (a, b) => (a.categories.performance?.score ?? 0) - (b.categories.performance?.score ?? 0),
      );
      const representative = byPerf[Math.floor(byPerf.length / 2)];
      writeFileSync(resolve(outDir, `${name}.json`), JSON.stringify(representative));

      const medians = Object.fromEntries(
        categories.map((c) => [
          c,
          median(runs.map((lhr) => Math.round((lhr.categories[c]?.score ?? 0) * 100))),
        ]),
      );
      const below = Object.entries(medians).filter(([, v]) => v < TARGET);
      const perfRuns = runs.map((lhr) => Math.round((lhr.categories.performance?.score ?? 0) * 100)).join("/");
      console.log(
        `${name}: ${Object.entries(medians).map(([k, v]) => `${k}=${v}`).join(" ")} (perf runs: ${perfRuns})` +
          (below.length ? `  BELOW TARGET: ${below.map(([k]) => k).join(",")}` : ""),
      );
      if (below.length > 0) failures += 1;
    } catch (err) {
      failures += 1;
      console.error(`${name} FAILED: ${err.message}`);
    }
  }
} finally {
  // chrome-launcher's kill() is sync (cleanup runs on process close);
  // calling .catch() on it throws. Failures here must not mask scores.
  try {
    chrome.kill();
  } catch {
    /* profile dir is reused; locked files are safe to ignore */
  }
}
process.exit(failures > 0 ? 1 : 0);
