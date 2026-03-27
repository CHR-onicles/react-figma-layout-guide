import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  outExtension() {
    return { js: ".mjs" };
  },
});
