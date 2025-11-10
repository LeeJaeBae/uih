import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "node18",
  dts: { resolve: true },
  platform: "node",
  skipNodeModulesBundle: true,
});
