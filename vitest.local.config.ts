import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Local development test configuration.
 * 
 * On memory-constrained machines (< 4 GB RAM), vitest worker processes
 * can take > 60s to start, exceeding the hardcoded START_TIMEOUT (60s).
 * 
 * Workaround: Use this config with increased timeouts and single fork.
 * For CI (GitHub Actions, 7+ GB RAM), use the standard vitest.config.ts.
 * 
 * Usage: npx vitest run -c vitest.local.config.ts
 */
export default defineConfig({
  plugins: [react()],
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
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["packages/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    css: false,
    restoreMocks: true,
    // Sequential file execution prevents OOM on low-RAM machines
    fileParallelism: false,
    // Single fork pool: avoids concurrent worker startup memory pressure
    pool: "forks",
    singleFork: true,
    // Extended timeouts for slow worker startup on memory-constrained machines
    // Note: START_TIMEOUT (60s) and WORKER_START_TIMEOUT (90s) are hardcoded in vitest.
    // On machines with < 4 GB RAM, worker startup may exceed these limits.
    // If you encounter "Timeout waiting for worker to respond", use this config.
    testTimeout: 180000,
    hookTimeout: 180000,
  },
});