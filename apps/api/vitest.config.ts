import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {    
    silent: true,
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    globals: false,
    isolate: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "src/config.ts",
        "src/app.ts",
        "**/*.d.ts",
      ],
    },    
  },
});
