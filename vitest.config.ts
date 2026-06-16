import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/workbench/server.ts", "src/workbench/ui.ts"],
      reporter: ["text", "lcov"],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80
      }
    },
    environment: "node"
  }
});
