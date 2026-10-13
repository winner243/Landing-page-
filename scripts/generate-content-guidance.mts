import fs from "node:fs";
import path from "node:path";
import {
  getContentGuidance,
  renderGuidanceMarkdown,
} from "../packages/copywriting/src/index.ts";

/**
 * Regenerates docs/CONTENT-GUIDANCE.md from the Zod schemas.
 * Run with `pnpm guidance`; tests/copywriting-guidance.test.ts fails if the
 * committed file is stale.
 */

const out = path.resolve(process.cwd(), "docs/CONTENT-GUIDANCE.md");
fs.writeFileSync(out, renderGuidanceMarkdown(getContentGuidance()), "utf8");
process.stdout.write(`Wrote ${path.relative(process.cwd(), out)}\n`);
