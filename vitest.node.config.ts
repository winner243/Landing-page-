import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Fast test configuration for pure logic tests (no jsdom).
 * Runs in Node.js environment - no worker startup delays.
 * 
 * Usage: npx vitest run -c vitest.node.config.ts
 * 
 * Covers: contrast, copywriting-guidance, schemas-themes
 * (patterns and templates require jsdom for React rendering)
 */
export default defineConfig({
  resolve: {
    alias: {
      "@landing/design-tokens": path.resolve(__dirname, "packages/design-tokens/src/index.ts"),
      "@landing/themes": path.resolve(__dirname, "packages/themes/src/index.ts"),
      "@landing/ui-core": path.resolve(__dirname, "packages/ui-core/src/index.ts"),
      "@landing/marketing": path.resolve(__dirname, "packages/marketing-components/src/index.ts"),
      "@landing/patterns": path.resolve(__dirname, "packages/conversion-patterns/src/index.tsx"),
      "@landing/copywriting": path.resolve(__dirname, "packages/copywriting/src/index.ts"),
      "@landing/analytics": path.resolve(__dirname, "packages/analytics/src/index.ts"),
      "@landing/experimentation": path.resolve(__dirname, "packages/experimentation/src/index.ts"),
      "@landing/seo": path.resolve(__dirname, "packages/seo/src/index.ts"),
      "@ui": path.resolve(__dirname, "packages/ui-core/src"),
      "@marketing": path.resolve(__dirname, "packages/marketing-components/src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/contrast.test.ts",
      "tests/copywriting-guidance.test.ts",
      "tests/schemas-themes.test.ts",
    ],
    pool: "forks",
    singleFork: true,
    fileParallelism: false,
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});