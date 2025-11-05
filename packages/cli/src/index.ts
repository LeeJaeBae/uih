#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { parse } from "uih-parser";
import { generateReact } from "uih-codegen-react";
import { dirname, resolve } from "node:path";
import { watch } from "chokidar";

const [, , cmd, input, outDir = "out"] = process.argv;

if (!cmd || !input) {
  console.log("Usage: uih <command> [options]");
  console.log("");
  console.log("Commands:");
  console.log("  compile <file.uih> [outDir]  Compile UIH file to React component");
  console.log("  validate <file.uih>          Validate UIH file syntax");
  console.log("  watch <file.uih> [outDir]    Watch and recompile on changes");
  process.exit(1);
}

async function compile(inputPath: string, outputDir: string, silent = false) {
  try {
    const src = readFileSync(inputPath, "utf8");
    const ast = parse(src);
    if (!silent) {
      console.log("🧩 Parsed AST:", JSON.stringify(ast, null, 2));
    }

    const code = await generateReact(ast);
    const out = resolve(process.cwd(), outputDir, "Page.tsx");
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, code, "utf8");
    console.log(`✅ Generated: ${out}`);
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    throw err;
  }
}

function validate(inputPath: string) {
  try {
    if (!existsSync(inputPath)) {
      console.error(`❌ File not found: ${inputPath}`);
      process.exit(1);
    }

    const src = readFileSync(inputPath, "utf8");
    parse(src);
    console.log(`✅ ${inputPath} is valid`);
  } catch (err: any) {
    console.error(`❌ Validation failed: ${err.message}`);
    process.exit(1);
  }
}

function watchFile(inputPath: string, outputDir: string) {
  if (!existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  console.log(`👀 Watching ${inputPath} for changes...`);
  console.log("   Press Ctrl+C to stop");

  // Initial compilation
  compile(inputPath, outputDir, true).catch(() => {
    console.error("   Initial compilation failed, waiting for changes...");
  });

  // Watch for changes
  const watcher = watch(inputPath, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", () => {
    console.log(`\n🔄 File changed, recompiling...`);
    compile(inputPath, outputDir, true).catch(() => {
      console.error("   Compilation failed");
    });
  });

  watcher.on("error", (error) => {
    console.error("❌ Watcher error:", error);
  });
}

if (cmd === "compile") {
  compile(input, outDir).catch(() => {
    process.exit(1);
  });
} else if (cmd === "validate") {
  validate(input);
} else if (cmd === "watch") {
  watchFile(input, outDir);
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}
