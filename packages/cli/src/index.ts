#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { parse } from "uih-parser";
import { generateReact } from "uih-codegen-react";
import { dirname, resolve } from "node:path";

const [, , cmd, input, outDir = "out"] = process.argv;

if (!cmd || !input) {
  console.log("Usage: uih compile <file.uih> [outDir]");
  process.exit(1);
}

if (cmd === "compile") {
  const src = readFileSync(input, "utf8");
  const ast = parse(src);
  console.log("🧩 Parsed AST:", JSON.stringify(ast, null, 2));

  const code = generateReact(ast);
  const out = resolve(process.cwd(), outDir, "Page.tsx");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, code, "utf8");
  console.log(`✅ Generated: ${out}`);
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}
