import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "node16",
  dts: { resolve: true },
  platform: "node",
  noExternal: ["chevrotain"], // Bundle chevrotain to avoid peer dependency issues
});
