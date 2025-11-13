import type { UIHFile } from "uih-parser";

/**
 * Code generation options
 */
export interface GenerateOptions {
  /**
   * Generate interactive template with logic placeholders
   * When true, injects smart TODO comments for Claude Code to implement
   */
  interactive?: boolean;

  /**
   * Specific features to generate placeholders for
   * If not provided, auto-detects from UIH AST
   */
  features?: string[]; // ["validation", "api", "animation", "modal", "tabs"]
}

/**
 * CodegenPlugin interface for framework-specific code generators
 */
export interface CodegenPlugin {
  /**
   * Plugin name (e.g., "react", "vue", "svelte")
   */
  readonly name: string;

  /**
   * File extension for generated code (e.g., ".tsx", ".vue", ".svelte")
   */
  readonly fileExtension: string;

  /**
   * Generate framework-specific code from UIH AST
   * @param file - Parsed UIH file AST
   * @param options - Code generation options (optional)
   * @returns Promise resolving to formatted code string
   */
  generate(file: UIHFile, options?: GenerateOptions): Promise<string>;
}

/**
 * Plugin registry for managing multiple codegen plugins
 */
export class PluginRegistry {
  private plugins = new Map<string, CodegenPlugin>();

  /**
   * Register a codegen plugin
   */
  register(plugin: CodegenPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Get a registered plugin by name
   */
  get(name: string): CodegenPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugin names
   */
  getAvailablePlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Check if a plugin is registered
   */
  has(name: string): boolean {
    return this.plugins.has(name);
  }
}

/**
 * Global plugin registry instance
 */
export const pluginRegistry = new PluginRegistry();
