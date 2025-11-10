import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],
  target: "node16",
  platform: "node",
  external: ["vscode", "prettier", "prettier-plugin-svelte"],
  noExternal: ["uih-ai", "uih-codegen-react", "uih-parser", "@anthropic-ai/sdk", "chevrotain"],
  bundle: true,
  minify: false,
  sourcemap: true,
  clean: true,
  tsconfig: "./tsconfig.json",
});
