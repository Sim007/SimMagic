import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/messages", replacement: path.resolve(__dirname, "./messages") },
      { find: "@/content", replacement: path.resolve(__dirname, "./content") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/tests/unit/**/*.test.{ts,tsx}", "src/tests/integration/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/tests/**", "src/app/**/*.ts", "src/types/**"]
    }
  }
});
