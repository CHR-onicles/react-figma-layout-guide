import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/** Monorepo root (this file’s directory). Fixes Vitest globs when `vitest` runs with cwd inside a workspace package. */
const projectRoot = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  root: projectRoot,
  plugins: [
    tailwindcss(),
    process.env.VITEST ? undefined : reactRouter(),
    tsconfigPaths(),
  ].filter(Boolean),
  test: {
    root: projectRoot,
    environment: "jsdom",
    include: [
      "app/**/*.{test,spec}.{ts,tsx}",
      "packages/**/*.{test,spec}.{ts,tsx}",
    ],
    setupFiles: ["./app/test/setup.ts"],
  },
});
