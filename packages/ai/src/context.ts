/**
 * Project Context Analysis
 * Analyzes existing .uih files to learn project patterns
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { parse } from "uih-parser";
import type { UIHFile, StyleBlock, LayoutBlock, MetaBlock } from "uih-parser";

export interface ProjectContext {
  /** Color scheme extracted from style blocks */
  colors: Record<string, string>;
  /** Frequently used components */
  components: Record<string, number>;
  /** Common Tailwind class patterns */
  tailwindPatterns: string[];
  /** Route patterns */
  routes: string[];
  /** Common layout structures */
  layoutPatterns: string[];
  /** Total files analyzed */
  fileCount: number;
}

/**
 * Find all .uih files in a directory recursively
 */
function findUIHFiles(dir: string, maxDepth = 3, currentDepth = 0): string[] {
  if (currentDepth > maxDepth) return [];

  const files: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      // Skip node_modules, dist, out, .git directories
      if (["node_modules", "dist", "out", ".git", ".next"].includes(entry)) {
        continue;
      }

      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findUIHFiles(fullPath, maxDepth, currentDepth + 1));
      } else if (stat.isFile() && extname(entry) === ".uih") {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignore permission errors
  }

  return files;
}

/**
 * Extract color definitions from style block
 */
function extractColors(styleBlock: StyleBlock | undefined): Record<string, string> {
  if (!styleBlock) return {};

  const colors: Record<string, string> = {};

  for (const [key, value] of Object.entries(styleBlock.tokens)) {
    if (key.startsWith("color.")) {
      const colorName = key.replace("color.", "");
      colors[colorName] = String(value);
    }
  }

  return colors;
}

/**
 * Extract component usage from layout block
 */
function extractComponents(layoutBlock: LayoutBlock | undefined): Record<string, number> {
  if (!layoutBlock) return {};

  const components: Record<string, number> = {};

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      if (node.kind === "Element") {
        components[node.name] = (components[node.name] || 0) + 1;
        if (node.children) {
          traverse(node.children);
        }
      }
    }
  }

  traverse(layoutBlock.nodes);
  return components;
}

/**
 * Extract Tailwind class patterns from layout block
 */
function extractTailwindPatterns(layoutBlock: LayoutBlock | undefined): string[] {
  if (!layoutBlock) return [];

  const patterns = new Set<string>();

  function traverse(nodes: any[]) {
    for (const node of nodes) {
      if (node.kind === "Element" && node.props) {
        // Find class prop
        const classProp = node.props.find((p: any) => p.key === "class");
        if (!classProp) continue;

        const classes = String(classProp.value).split(/\s+/);

        // Extract common patterns
        for (const cls of classes) {
          // Container patterns
          if (cls.startsWith("container") || cls.includes("mx-auto")) {
            patterns.add("container mx-auto");
          }
          // Grid patterns
          if (cls.startsWith("grid-cols-")) {
            patterns.add("grid layout");
          }
          // Flex patterns
          if (cls.includes("flex") && cls.includes("items-")) {
            patterns.add("flex centering");
          }
          // Spacing patterns
          if (cls.match(/^(p|m|gap)-\d+$/)) {
            patterns.add("consistent spacing");
          }
          // Rounded patterns
          if (cls.startsWith("rounded-")) {
            patterns.add("rounded corners");
          }
          // Shadow patterns
          if (cls.startsWith("shadow-")) {
            patterns.add("shadows");
          }
        }

        if (node.children) {
          traverse(node.children);
        }
      }
    }
  }

  traverse(layoutBlock.nodes);
  return Array.from(patterns);
}

/**
 * Extract route from meta block
 */
function extractRoute(metaBlock: MetaBlock | undefined): string | null {
  if (!metaBlock) return null;
  const route = metaBlock.entries.route;
  return typeof route === "string" ? route : null;
}

/**
 * Analyze a single .uih file
 */
function analyzeFile(filePath: string): Partial<ProjectContext> {
  try {
    const content = readFileSync(filePath, "utf8");
    const ast = parse(content);

    const styleBlock = ast.blocks.find((b) => b.type === "Style") as StyleBlock | undefined;
    const layoutBlock = ast.blocks.find((b) => b.type === "Layout") as LayoutBlock | undefined;
    const metaBlock = ast.blocks.find((b) => b.type === "Meta") as MetaBlock | undefined;

    return {
      colors: extractColors(styleBlock),
      components: extractComponents(layoutBlock),
      tailwindPatterns: extractTailwindPatterns(layoutBlock),
      routes: extractRoute(metaBlock) ? [extractRoute(metaBlock)!] : [],
    };
  } catch (error) {
    // Skip files with parse errors
    return {};
  }
}

/**
 * Merge multiple project contexts
 */
function mergeContexts(contexts: Partial<ProjectContext>[]): ProjectContext {
  const merged: ProjectContext = {
    colors: {},
    components: {},
    tailwindPatterns: [],
    routes: [],
    layoutPatterns: [],
    fileCount: contexts.length,
  };

  for (const ctx of contexts) {
    // Merge colors (later files override earlier ones)
    if (ctx.colors) {
      Object.assign(merged.colors, ctx.colors);
    }

    // Merge component counts
    if (ctx.components) {
      for (const [name, count] of Object.entries(ctx.components)) {
        merged.components[name] = (merged.components[name] || 0) + count;
      }
    }

    // Collect Tailwind patterns
    if (ctx.tailwindPatterns) {
      merged.tailwindPatterns.push(...ctx.tailwindPatterns);
    }

    // Collect routes
    if (ctx.routes) {
      merged.routes.push(...ctx.routes);
    }
  }

  // Deduplicate Tailwind patterns
  merged.tailwindPatterns = Array.from(new Set(merged.tailwindPatterns));

  return merged;
}

/**
 * Analyze all .uih files in a directory
 */
export function analyzeProject(directory: string): ProjectContext {
  const uihFiles = findUIHFiles(directory);

  if (uihFiles.length === 0) {
    return {
      colors: {},
      components: {},
      tailwindPatterns: [],
      routes: [],
      layoutPatterns: [],
      fileCount: 0,
    };
  }

  const contexts = uihFiles.map(analyzeFile);
  return mergeContexts(contexts);
}

/**
 * Generate a summary string for Claude API
 */
export function summarizeContext(context: ProjectContext): string {
  if (context.fileCount === 0) {
    return "";
  }

  const parts: string[] = [];

  parts.push(`📊 Project Context (analyzed ${context.fileCount} .uih files):\n`);

  // Color scheme
  if (Object.keys(context.colors).length > 0) {
    parts.push("🎨 **Color Scheme**:");
    for (const [name, value] of Object.entries(context.colors)) {
      parts.push(`  - color.${name}: ${value}`);
    }
    parts.push("");
  }

  // Top components
  const topComponents = Object.entries(context.components)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (topComponents.length > 0) {
    parts.push("🧩 **Commonly Used Components**:");
    parts.push(`  ${topComponents.map(([name]) => name).join(", ")}`);
    parts.push("");
  }

  // Tailwind patterns
  if (context.tailwindPatterns.length > 0) {
    parts.push("🎯 **Tailwind Patterns**:");
    parts.push(`  ${context.tailwindPatterns.join(", ")}`);
    parts.push("");
  }

  // Instructions
  parts.push("💡 **Instructions**:");
  parts.push("- Use the SAME color scheme shown above");
  parts.push("- Prefer the commonly used components listed above");
  parts.push("- Follow the established Tailwind patterns");
  parts.push("- Maintain consistent styling with existing files");

  return parts.join("\n");
}
