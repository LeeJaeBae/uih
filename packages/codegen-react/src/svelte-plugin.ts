import type { UIHFile, LayoutBlock, MotionBlock, LogicBlock, StateBlock, DataBlock, StyleBlock, Node } from "uih-parser";
import prettier from "prettier";
import prettierPluginSvelte from "prettier-plugin-svelte";
import type { CodegenPlugin } from "./plugin.js";

/**
 * Svelte code generation plugin
 */
export class SveltePlugin implements CodegenPlugin {
  readonly name = "svelte";
  readonly fileExtension = ".svelte";

  async generate(file: UIHFile): Promise<string> {
    // Generate user imports from .uih files and collect imported component names
    const importedComponents = new Set<string>();
    const userImports = file.imports.map((imp) => {
      // Track all imported component names
      imp.names.forEach(name => importedComponents.add(name));

      const importPath = imp.from.replace(/\.uih$/, "");
      if (imp.names.length === 1) {
        return `  import ${imp.names[0]} from "${importPath}";`;
      } else {
        return `  import { ${imp.names.join(", ")} } from "${importPath}";`;
      }
    }).join("\n");

    const layout = file.blocks.find((b) => b.type === "Layout") as
      | LayoutBlock
      | undefined;
    if (!layout) throw new Error("Layout block required");

    const motion = file.blocks.find((b) => b.type === "Motion") as
      | MotionBlock
      | undefined;

    const logic = file.blocks.find((b) => b.type === "Logic") as
      | LogicBlock
      | undefined;

    const state = file.blocks.find((b) => b.type === "State") as
      | StateBlock
      | undefined;

    const data = file.blocks.find((b) => b.type === "Data") as
      | DataBlock
      | undefined;

    const style = file.blocks.find((b) => b.type === "Style") as
      | StyleBlock
      | undefined;

    const template = layout.nodes.map((n) => this.emitNode(n, 1, importedComponents)).join("\n");
    const motionStyles = motion ? this.generateMotionStyles(motion) : "";
    const styleVars = style ? this.generateStyleVars(style) : "";
    const { stateVars, stateImports } = state ? this.generateStateVars(state) : { stateVars: "", stateImports: new Set<string>() };
    const { dataFetches, dataImports } = data ? this.generateDataFetches(data) : { dataFetches: "", dataImports: new Set<string>() };
    const { handlers, handlerImports } = logic ? this.generateLogicHandlers(logic) : { handlers: "", handlerImports: new Set<string>() };

    // Merge all imports
    const imports = new Set<string>();
    stateImports.forEach(imp => imports.add(imp));
    dataImports.forEach(imp => imports.add(imp));
    handlerImports.forEach(imp => imports.add(imp));

    const importStr = imports.size > 0 ? `  import { ${[...imports].join(", ")} } from "svelte";\n` : "";
    const allStyles = [styleVars, motionStyles].filter(Boolean).join("\n\n");

    const code = `<script lang="ts">
${userImports ? userImports + "\n" : ""}${importStr}${stateVars}${dataFetches}${handlers}
</script>

<div class="container mx-auto p-6">
${template}
</div>

${allStyles ? `<style>\n${allStyles}\n</style>` : ""}
`;

    // Format with prettier (Svelte parser)
    const formatted = await prettier.format(code.trim(), {
      parser: "svelte",
      semi: true,
      singleQuote: false,
      trailingComma: "es5",
      printWidth: 80,
      plugins: [prettierPluginSvelte],
    });

    return formatted;
  }

  private emitNode(n: Node, indent: number = 0, importedComponents: Set<string>): string {
    const indentStr = "  ".repeat(indent);

    if (n.kind === "Text") {
      return `${indentStr}${n.text}`;
    }

    if (n.kind === "Conditional") {
      const thenJsx = n.thenNodes
        .map((node) => this.emitNode(node, indent + 1, importedComponents))
        .join("\n");

      if (n.elseNodes && n.elseNodes.length > 0) {
        const elseJsx = n.elseNodes
          .map((node) => this.emitNode(node, indent + 1, importedComponents))
          .join("\n");

        return `${indentStr}{#if ${n.condition}}
${thenJsx}
${indentStr}{:else}
${elseJsx}
${indentStr}{/if}`;
      }

      return `${indentStr}{#if ${n.condition}}
${thenJsx}
${indentStr}{/if}`;
    }

    if (n.kind === "Loop") {
      const childrenJsx = n.children
        .map((node) => this.emitNode(node, indent + 1, importedComponents))
        .join("\n");

      return `${indentStr}{#each ${n.iterableExpr} as ${n.iteratorVar} (${n.iteratorVar}.id || Math.random())}
${childrenJsx}
${indentStr}{/each}`;
    }

    // Element node - check if it's an imported component first
    const componentName = n.name || "div";
    const svelteComponent = importedComponents.has(componentName)
      ? componentName // Use imported component as-is
      : this.mapToSvelteComponent(componentName); // Map to HTML element

    const props = (n.props || [])
      .map((p) => {
        const value = String(p.value);
        // Check if value is a variable reference (starts with {)
        if (value.startsWith("{")) {
          return `${p.key}=${value}`;
        }
        // Check if value is a number
        if (!isNaN(Number(value))) {
          return `${p.key}={${value}}`;
        }
        // String literal
        return `${p.key}="${value}"`;
      })
      .join(" ");
    const children = (n.children || [])
      .map((c) => this.emitNode(c, indent + 1, importedComponents))
      .join("\n");

    if (children) {
      return `${indentStr}<${svelteComponent} ${props}>
${children}
${indentStr}</${svelteComponent}>`;
    } else {
      return `${indentStr}<${svelteComponent} ${props} />`;
    }
  }

  private mapToSvelteComponent(name: string): string {
    // Map component names to Svelte/HTML equivalents
    const mapping: Record<string, string> = {
      Button: "button",
      Input: "input",
      Card: "div",
      Badge: "span",
      Text: "p",
      Textarea: "textarea",
      Select: "select",
      SelectItem: "option",
      Checkbox: "input",
      Label: "label",
      Avatar: "div",
      Dialog: "div",
      Tooltip: "div",
      Switch: "input",
      Separator: "hr",
      Alert: "div",
      Progress: "progress",
      Skeleton: "div",
    };

    return mapping[name] || "div";
  }

  private generateMotionStyles(motion: MotionBlock): string {
    const cssRules = motion.rules.map((rule) => {
      const { selector, event, props } = rule;

      const cssProps: string[] = [];
      const transitions: string[] = [];

      Object.entries(props).forEach(([key, value]) => {
        if (key === "duration") {
          transitions.push(`all ${value}`);
        } else if (key === "scale") {
          cssProps.push(`transform: scale(${value});`);
        } else if (key === "opacity") {
          cssProps.push(`opacity: ${value};`);
        } else if (key === "rotate") {
          cssProps.push(`transform: rotate(${value}deg);`);
        } else if (key === "x") {
          cssProps.push(`transform: translateX(${value}px);`);
        } else if (key === "y") {
          cssProps.push(`transform: translateY(${value}px);`);
        }
      });

      if (transitions.length === 0) {
        transitions.push("all 200ms ease");
      }
      cssProps.push(`transition: ${transitions.join(", ")};`);

      let pseudo = "";
      if (event === "hover") pseudo = ":hover";
      else if (event === "focus") pseudo = ":focus";
      else if (event === "active") pseudo = ":active";

      return `${selector}${pseudo} {\n  ${cssProps.join("\n  ")}\n}`;
    });

    return cssRules.join("\n\n");
  }

  private generateStyleVars(style: StyleBlock): string {
    // Convert style tokens to CSS variables
    // e.g., "color.primary" -> "--color-primary"
    const cssVars = Object.entries(style.tokens)
      .map(([key, value]) => {
        const varName = key.replace(/\./g, "-");
        return `  --${varName}: ${value};`;
      })
      .join("\n");

    return `:root {\n${cssVars}\n}`;
  }

  private generateStateVars(state: StateBlock): { stateVars: string; stateImports: Set<string> } {
    const imports = new Set<string>();

    const vars = state.declarations.map((decl) => {
      let initialValue: string;
      if (typeof decl.initialValue === "string") {
        initialValue = `"${decl.initialValue}"`;
      } else if (typeof decl.initialValue === "boolean") {
        initialValue = String(decl.initialValue);
      } else {
        initialValue = String(decl.initialValue);
      }

      return `  let ${decl.name} = ${initialValue};`;
    }).join("\n");

    return {
      stateVars: vars + "\n\n",
      stateImports: imports
    };
  }

  private generateDataFetches(data: DataBlock): { dataFetches: string; dataImports: Set<string> } {
    const imports = new Set<string>();
    imports.add("onMount");

    const fetches = data.fetches.map((fetch) => {
      const varName = fetch.name;
      const loadingVar = `${varName}Loading`;
      const errorVar = `${varName}Error`;

      return `  let ${varName} = null;
  let ${loadingVar} = true;
  let ${errorVar} = null;

  onMount(async () => {
    try {
      const response = await fetch("${fetch.url}");
      ${varName} = await response.json();
    } catch (err) {
      ${errorVar} = err;
    } finally {
      ${loadingVar} = false;
    }
  });`;
    }).join("\n\n");

    return {
      dataFetches: fetches + "\n\n",
      dataImports: imports
    };
  }

  private generateLogicHandlers(logic: LogicBlock): { handlers: string; handlerImports: Set<string> } {
    const imports = new Set<string>();

    const handlers = logic.events.map((event) => {
      const handlerName = `handle${event.name.charAt(0).toUpperCase()}${event.name.slice(1)}`;
      const statements: string[] = [];

      event.steps.forEach((step) => {
        if (step.type === "Navigate") {
          statements.push(`// Navigate to ${step.to}`);
          statements.push(`window.location.href = "${step.to}";`);
        } else if (step.type === "Toast") {
          statements.push(`alert("${step.message}");`);
        } else if (step.type === "Call") {
          const method = step.method || "POST";
          statements.push(`await fetch("${step.url}", { method: "${method}" });`);
        }
      });

      return `  const ${handlerName} = async () => {
    ${statements.join("\n    ")}
  };`;
    }).join("\n\n");

    return {
      handlers: handlers + "\n\n",
      handlerImports: imports
    };
  }
}

/**
 * Create and return a Svelte plugin instance
 */
export function createSveltePlugin(): CodegenPlugin {
  return new SveltePlugin();
}
