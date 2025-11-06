#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { parse } from "uih-parser";
import { pluginRegistry } from "uih-codegen-react";
import { dirname, resolve } from "node:path";
import { watch } from "chokidar";

// Parse command line arguments
function parseArgs(args: string[]) {
  const parsed: {
    command?: string;
    input?: string;
    outDir: string;
    target: string;
  } = {
    outDir: "out",
    target: "react",
  };

  let i = 2; // Skip node and script path
  while (i < args.length) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      // Handle flags
      if (arg === "--target") {
        parsed.target = args[i + 1] || "react";
        i += 2;
      } else {
        console.error(`Unknown flag: ${arg}`);
        process.exit(1);
      }
    } else {
      // Handle positional arguments
      if (!parsed.command) {
        parsed.command = arg;
      } else if (!parsed.input) {
        parsed.input = arg;
      } else {
        parsed.outDir = arg;
      }
      i++;
    }
  }

  return parsed;
}

const args = parseArgs(process.argv);
const { command, input, outDir, target } = args;

if (!command || !input) {
  console.log("Usage: uih <command> <file.uih> [options]");
  console.log("");
  console.log("Commands:");
  console.log("  compile <file.uih> [outDir]  Compile UIH file to framework code");
  console.log("  validate <file.uih>          Validate UIH file syntax");
  console.log("  watch <file.uih> [outDir]    Watch and recompile on changes");
  console.log("");
  console.log("Options:");
  console.log(
    "  --target <framework>         Target framework (react|vue|svelte) [default: react]"
  );
  console.log("");
  console.log("Available frameworks:", pluginRegistry.getAvailablePlugins().join(", "));
  process.exit(1);
}

async function compile(
  inputPath: string,
  outputDir: string,
  targetFramework: string,
  silent = false
) {
  try {
    const src = readFileSync(inputPath, "utf8");
    const ast = parse(src);
    if (!silent) {
      console.log("🧩 Parsed AST:", JSON.stringify(ast, null, 2));
    }

    // Get the plugin for the target framework
    const plugin = pluginRegistry.get(targetFramework);
    if (!plugin) {
      throw new Error(
        `Unknown target framework: ${targetFramework}. Available: ${pluginRegistry.getAvailablePlugins().join(", ")}`
      );
    }

    const code = await plugin.generate(ast);
    const fileName = `Page${plugin.fileExtension}`;
    const out = resolve(process.cwd(), outputDir, fileName);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, code, "utf8");
    console.log(`✅ Generated (${targetFramework}): ${out}`);
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

function watchFile(
  inputPath: string,
  outputDir: string,
  targetFramework: string
) {
  if (!existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    process.exit(1);
  }

  console.log(`👀 Watching ${inputPath} for changes (target: ${targetFramework})...`);
  console.log("   Press Ctrl+C to stop");

  // Initial compilation
  compile(inputPath, outputDir, targetFramework, true).catch(() => {
    console.error("   Initial compilation failed, waiting for changes...");
  });

  // Watch for changes
  const watcher = watch(inputPath, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", () => {
    console.log(`\n🔄 File changed, recompiling...`);
    compile(inputPath, outputDir, targetFramework, true).catch(() => {
      console.error("   Compilation failed");
    });
  });

  watcher.on("error", (error) => {
    console.error("❌ Watcher error:", error);
  });
}

if (command === "compile") {
  compile(input, outDir, target).catch(() => {
    process.exit(1);
  });
} else if (command === "validate") {
  validate(input);
} else if (command === "watch") {
  watchFile(input, outDir, target);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
