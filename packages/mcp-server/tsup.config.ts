import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  dts: { resolve: true },
  platform: "node",
  clean: true,
  shims: true,
  noExternal: ["uih-parser", "uih-codegen-react"],
});
