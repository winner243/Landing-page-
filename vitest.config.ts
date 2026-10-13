import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@landing/design-tokens": path.resolve(
        __dirname,
        "packages/design-tokens/src/index.ts",
      ),
      "@landing/themes": path.resolve(__dirname, "packages/themes/src/index.ts"),
      "@landing/ui-core": path.resolve(__dirname, "packages/ui-core/src/index.ts"),
      "@landing/marketing": path.resolve(
        __dirname,
        "packages/marketing-components/src/index.ts",
      ),
      "@landing/patterns": path.resolve(
        __dirname,
        "packages/conversion-patterns/src/index.tsx",
      ),
      "@landing/copywriting": path.resolve(
        __dirname,
        "packages/copywriting/src/index.ts",
      ),
      "@landing/analytics": path.resolve(
        __dirname,
        "packages/analytics/src/index.ts",
      ),
      "@landing/experimentation": path.resolve(
        __dirname,
        "packages/experimentation/src/index.ts",
      ),
      "@landing/seo": path.resolve(__dirname, "packages/seo/src/index.ts"),
      "@ui": path.resolve(__dirname, "packages/ui-core/src"),
      "@marketing": path.resolve(__dirname, "packages/marketing-components/src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["packages/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    css: false,
    restoreMocks: true,
    // Sequential file execution: concurrent jsdom workers exhaust low-RAM machines.
    fileParallelism: false,
    // Use forks pool with single fork to avoid worker startup timeout on memory-constrained machines (3.9 GB).
    // Increase worker startup timeout significantly.
    pool: "forks",
    singleFork: true,
    // Increase test timeout for slow environments.
    testTimeout: 180000,
    hookTimeout: 180000,
  },
});
