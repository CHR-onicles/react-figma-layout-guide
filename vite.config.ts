import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    process.env.VITEST ? undefined : reactRouter(),
    tsconfigPaths(),
  ].filter(Boolean),
  test: {
    environment: "jsdom",
    include: ["app/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./app/test/setup.ts"],
  },
});
