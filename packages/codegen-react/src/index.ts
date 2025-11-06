import type { UIHFile } from "uih-parser";
import { createReactPlugin } from "./react-plugin.js";
import { pluginRegistry } from "./plugin.js";
import { createVuePlugin } from "./vue-plugin.js";
import { createSveltePlugin } from "./svelte-plugin.js";

// Export plugin system
export { CodegenPlugin, PluginRegistry, pluginRegistry } from "./plugin.js";
export { ReactPlugin, createReactPlugin } from "./react-plugin.js";
export { VuePlugin, createVuePlugin } from "./vue-plugin.js";
export { SveltePlugin, createSveltePlugin } from "./svelte-plugin.js";
export { shadRegistry } from "./registry.js";

// Register default plugins
pluginRegistry.register(createReactPlugin());
pluginRegistry.register(createVuePlugin());
pluginRegistry.register(createSveltePlugin());

/**
 * Generate React code from UIH AST
 * @deprecated Use createReactPlugin().generate() instead
 * This function is maintained for backward compatibility
 */
export async function generateReact(file: UIHFile): Promise<string> {
  const plugin = createReactPlugin();
  return plugin.generate(file);
}
