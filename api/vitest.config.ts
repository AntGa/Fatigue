import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    reporters: ["verbose"],
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      include: ["src/routers/**/*.ts"],
      exclude: ["src/routers/**/*.test.ts", "src/routers/**/*.route.ts"],
    },
  },
});
