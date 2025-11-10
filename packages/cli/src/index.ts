#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { parse } from "uih-parser";
import { pluginRegistry } from "uih-codegen-react";
import { generateUIH, loadProjectContext } from "uih-ai";
import { dirname, resolve } from "node:path";
import { watch } from "chokidar";

// Parse command line arguments
function parseArgs(args: string[]) {
  const parsed: {
    command?: string;
    input?: string;
    outDir: string;
    target: string;
    output?: string;
    apiKey?: string;
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
      } else if (arg === "--output" || arg === "-o") {
        parsed.output = args[i + 1];
        i += 2;
      } else if (arg === "--api-key") {
        parsed.apiKey = args[i + 1];
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
const { command, input, outDir, target, output, apiKey } = args;

if (!command || (command !== "generate" && !input)) {
  console.log("Usage: uih <command> [arguments] [options]");
  console.log("");
  console.log("Commands:");
  console.log("  compile <file.uih> [outDir]     Compile UIH file to framework code");
  console.log("  validate <file.uih>             Validate UIH file syntax");
  console.log("  watch <file.uih> [outDir]       Watch and recompile on changes");
  console.log("  generate <description>          Generate UIH from natural language (AI)");
  console.log("");
  console.log("Options:");
  console.log("  --target <framework>            Target framework (react|vue|svelte) [default: react]");
  console.log("  --output, -o <file.uih>         Output file for generate command");
  console.log("  --api-key <key>                 Anthropic API key (or set ANTHROPIC_API_KEY env)");
  console.log("");
  console.log("Available frameworks:", pluginRegistry.getAvailablePlugins().join(", "));
  console.log("");
  console.log("Examples:");
  console.log("  uih compile login.uih out --target react");
  console.log("  uih generate \"로그인 페이지 만들어줘\" --output login.uih");
  console.log("  uih generate \"dashboard with stats\" -o dashboard.uih");
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

async function generate(prompt: string, outputPath?: string, apiKey?: string) {
  try {
    console.log("🤖 Generating UIH code with Claude...");
    console.log(`📝 Prompt: "${prompt}"`);
    console.log("");

    // Load project context from current directory
    console.log("🔍 Analyzing existing .uih files for context...");
    const projectContext = await loadProjectContext(process.cwd());
    if (projectContext && !projectContext.includes("Project using UIH v0.7.1")) {
      console.log("✅ Found project patterns - will maintain consistency");
      console.log("");
    }

    const result = await generateUIH({
      prompt,
      projectContext,
      apiKey,
    });

    if (!result.isValid) {
      console.error("⚠️  Generated code has syntax errors:");
      result.errors?.forEach((err) => console.error(`   ${err}`));
      console.log("");
      console.log("Generated code (with errors):");
      console.log(result.code);
      process.exit(1);
    }

    // Write to file if output path is specified
    if (outputPath) {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, result.code, "utf8");
      console.log(`✅ Generated UIH code saved to: ${outputPath}`);
    } else {
      console.log("✅ Generated UIH code:");
      console.log("");
      console.log(result.code);
      console.log("");
      console.log("💡 Tip: Use --output or -o flag to save to a file");
    }

    if (result.usage) {
      console.log("");
      console.log(
        `📊 Token usage: ${result.usage.inputTokens} input + ${result.usage.outputTokens} output = ${result.usage.inputTokens + result.usage.outputTokens} total`
      );
    }
  } catch (err: any) {
    console.error("❌ Generation failed:", err.message);
    if (err.message.includes("ANTHROPIC_API_KEY")) {
      console.log("");
      console.log("💡 Get your API key from: https://console.anthropic.com/");
      console.log("   Set it with: export ANTHROPIC_API_KEY=your-key-here");
      console.log("   Or use: uih generate \"...\" --api-key your-key-here");
    }
    process.exit(1);
  }
}

if (command === "compile") {
  compile(input, outDir, target).catch(() => {
    process.exit(1);
  });
} else if (command === "validate") {
  validate(input);
} else if (command === "watch") {
  watchFile(input, outDir, target);
} else if (command === "generate") {
  if (!input) {
    console.error("❌ Please provide a description for generation");
    console.log("Example: uih generate \"로그인 페이지 만들어줘\" --output login.uih");
    process.exit(1);
  }
  generate(input, output, apiKey).catch(() => {
    process.exit(1);
  });
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
