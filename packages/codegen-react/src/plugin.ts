import type { UIHFile } from "uih-parser";

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
   * @returns Promise resolving to formatted code string
   */
  generate(file: UIHFile): Promise<string>;
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
