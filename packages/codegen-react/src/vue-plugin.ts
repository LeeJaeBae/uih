import type { UIHFile, LayoutBlock, MotionBlock, LogicBlock, StateBlock, DataBlock, StyleBlock, Node } from "uih-parser";
import { UIHMissingBlockError } from "uih-parser";
import type { CodegenPlugin } from "./plugin.js";

/**
 * Vue 3 code generation plugin with Composition API
 */
export class VuePlugin implements CodegenPlugin {
  readonly name = "vue";
  readonly fileExtension = ".vue";

  async generate(file: UIHFile): Promise<string> {
    // Generate user imports from .uih files and collect imported component names
    const importedComponents = new Set<string>();
    const userImports = (file.imports || []).map((imp) => {
      // Track all imported component names
      imp.names.forEach(name => importedComponents.add(name));

      const importPath = imp.from.replace(/\.uih$/, "");
      if (imp.names.length === 1) {
        return `import ${imp.names[0]} from "${importPath}";`;
      } else {
        return `import { ${imp.names.join(", ")} } from "${importPath}";`;
      }
    }).join("\n");

    const layout = file.blocks.find((b) => b.type === "Layout") as
      | LayoutBlock
      | undefined;
    if (!layout) {
      throw new UIHMissingBlockError(
        "Layout",
        "Vue code generation requires a layout block to define the component structure"
      );
    }

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

    const template = layout.nodes.map((n) => this.emitNode(n, 0, importedComponents)).join("\n");
    const motionStyles = motion ? this.generateMotionStyles(motion) : "";
    const styleVars = style ? this.generateStyleVars(style) : "";
    const { stateRefs, stateImports } = state ? this.generateStateRefs(state) : { stateRefs: "", stateImports: new Set<string>() };
    const { dataFetches, dataImports } = data ? this.generateDataFetches(data) : { dataFetches: "", dataImports: new Set<string>() };
    const { handlers, handlerImports } = logic ? this.generateLogicHandlers(logic) : { handlers: "", handlerImports: new Set<string>() };

    // Merge all imports
    const imports = new Set<string>();
    stateImports.forEach(imp => imports.add(imp));
    dataImports.forEach(imp => imports.add(imp));
    handlerImports.forEach(imp => imports.add(imp));

    const importStr = imports.size > 0 ? `import { ${[...imports].join(", ")} } from "vue";\n` : "";
    const allStyles = [styleVars, motionStyles].filter(Boolean).join("\n\n");

    const code = `<template>
  <div class="container mx-auto p-6">
    ${template}
  </div>
</template>

<script setup lang="ts">
${userImports ? userImports + "\n" : ""}${importStr}${stateRefs}${dataFetches}${handlers}
</script>

${allStyles ? `<style scoped>\n${allStyles}\n</style>` : ""}
`;

    // Format with prettier (optional - fallback to unformatted if unavailable)
    try {
      const prettier = await import("prettier");
      const formatted = await prettier.default.format(code.trim(), {
        parser: "vue",
        semi: true,
        singleQuote: false,
        trailingComma: "es5",
        printWidth: 80,
      });
      return formatted;
    } catch (error) {
      // Prettier unavailable or formatting failed - return unformatted code
      console.warn("Prettier formatting failed, returning unformatted code:", error);
      return code.trim();
    }
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

        // Use template tag for multi-node conditionals
        if (n.thenNodes.length > 1 || n.elseNodes.length > 1) {
          return `${indentStr}<template v-if="${n.condition}">
${thenJsx}
${indentStr}</template>
${indentStr}<template v-else>
${elseJsx}
${indentStr}</template>`;
        } else {
          // Single nodes can use v-if/v-else directly
          return `${thenJsx.replace(/<(\w+)/, `<$1 v-if="${n.condition}"`)}
${elseJsx.replace(/<(\w+)/, `<$1 v-else`)}`;
        }
      }

      // No else branch
      if (n.thenNodes.length === 1) {
        return thenJsx.replace(/<(\w+)/, `<$1 v-if="${n.condition}"`);
      } else {
        return `${indentStr}<template v-if="${n.condition}">
${thenJsx}
${indentStr}</template>`;
      }
    }

    if (n.kind === "Loop") {
      const childrenJsx = n.children
        .map((node) => this.emitNode(node, indent + 1, importedComponents))
        .join("\n");

      // Use template tag for loops
      if (n.children.length > 1) {
        return `${indentStr}<template v-for="${n.iteratorVar} in ${n.iterableExpr}" :key="${n.iteratorVar}.id || Math.random()">
${childrenJsx}
${indentStr}</template>`;
      } else {
        // Single child can use v-for directly
        return childrenJsx.replace(
          /<(\w+)/,
          `<$1 v-for="${n.iteratorVar} in ${n.iterableExpr}" :key="${n.iteratorVar}.id || Math.random()"`
        );
      }
    }

    // Element node - check if it's an imported component first
    const componentName = n.name || "div";
    const vueComponent = importedComponents.has(componentName)
      ? componentName // Use imported component as-is
      : this.mapToVueComponent(componentName); // Map to HTML element

    const props = (n.props || [])
      .map((p) => {
        const value = String(p.value);
        // Check if value is a variable reference (starts with {)
        if (value.startsWith("{")) {
          return `:${p.key}="${value.slice(1, -1)}"`;
        }
        // Check if value is a number
        if (!isNaN(Number(value))) {
          return `:${p.key}="${value}"`;
        }
        // String literal
        return `${p.key}="${value}"`;
      })
      .join(" ");
    const children = (n.children || [])
      .map((c) => this.emitNode(c, indent + 1, importedComponents))
      .join("\n");

    if (children) {
      return `${indentStr}<${vueComponent} ${props}>
${children}
${indentStr}</${vueComponent}>`;
    } else {
      return `${indentStr}<${vueComponent} ${props} />`;
    }
  }

  private mapToVueComponent(name: string): string {
    // Map component names to Vue equivalents
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
      // Pure HTML Elements
      Div: "div",
      Span: "span",
      P: "p",
      H1: "h1",
      H2: "h2",
      H3: "h3",
      H4: "h4",
      H5: "h5",
      H6: "h6",
      Section: "section",
      Article: "article",
      Aside: "aside",
      Header: "header",
      Footer: "footer",
      Nav: "nav",
      Main: "main",
      Form: "form",
      Ul: "ul",
      Ol: "ol",
      Li: "li",
      A: "a",
      Img: "img",
      // Media Elements
      Video: "video",
      Audio: "audio",
      Source: "source",
      // Table Elements
      Table: "table",
      Thead: "thead",
      Tbody: "tbody",
      Tfoot: "tfoot",
      Tr: "tr",
      Td: "td",
      Th: "th",
      // Form Elements
      Option: "option",
      Fieldset: "fieldset",
      Legend: "legend",
      // Canvas and SVG
      Canvas: "canvas",
      Svg: "svg",
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

  private generateStateRefs(state: StateBlock): { stateRefs: string; stateImports: Set<string> } {
    const imports = new Set<string>();
    imports.add("ref");

    const refs = state.declarations.map((decl) => {
      let initialValue: string;
      if (typeof decl.initialValue === "string") {
        initialValue = `"${decl.initialValue}"`;
      } else if (typeof decl.initialValue === "boolean") {
        initialValue = String(decl.initialValue);
      } else {
        initialValue = String(decl.initialValue);
      }

      return `const ${decl.name} = ref(${initialValue});`;
    }).join("\n");

    return {
      stateRefs: refs + "\n\n",
      stateImports: imports
    };
  }

  private generateDataFetches(data: DataBlock): { dataFetches: string; dataImports: Set<string> } {
    const imports = new Set<string>();
    imports.add("ref");
    imports.add("onMounted");

    const fetches = data.fetches.map((fetch) => {
      const varName = fetch.name;
      const loadingVar = `${varName}Loading`;
      const errorVar = `${varName}Error`;

      return `const ${varName} = ref(null);
const ${loadingVar} = ref(true);
const ${errorVar} = ref(null);

onMounted(async () => {
  try {
    const response = await fetch("${fetch.url}");
    ${varName}.value = await response.json();
  } catch (err) {
    ${errorVar}.value = err;
  } finally {
    ${loadingVar}.value = false;
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
          // Vue Router navigation
          statements.push(`// Navigate to ${step.to}`);
          statements.push(`window.location.href = "${step.to}";`);
        } else if (step.type === "Toast") {
          // Simple alert for now (can be replaced with Vue toast library)
          statements.push(`alert("${step.message}");`);
        } else if (step.type === "Call") {
          const method = step.method || "POST";
          statements.push(`await fetch("${step.url}", { method: "${method}" });`);
        }
      });

      return `const ${handlerName} = async () => {
  ${statements.join("\n  ")}
};`;
    }).join("\n\n");

    return {
      handlers: handlers + "\n\n",
      handlerImports: imports
    };
  }
}

/**
 * Create and return a Vue plugin instance
 */
export function createVuePlugin(): CodegenPlugin {
  return new VuePlugin();
}
