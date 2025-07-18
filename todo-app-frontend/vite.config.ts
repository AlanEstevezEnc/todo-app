import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    coverage: {
      provider: "v8", // or 'c8'
      reporter: ["text", "html"], // You can also use 'json', 'lcov', etc.
    },
  },
  server: { port: 8080 },
});
