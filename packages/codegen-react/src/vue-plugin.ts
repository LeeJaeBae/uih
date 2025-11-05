import type { UIHFile, LayoutBlock, MotionBlock, Node } from "uih-parser";
import prettier from "prettier";
import type { CodegenPlugin } from "./plugin.js";

/**
 * Vue 3 code generation plugin with composition API
 */
export class VuePlugin implements CodegenPlugin {
  readonly name = "vue";
  readonly fileExtension = ".vue";

  async generate(file: UIHFile): Promise<string> {
    const layout = file.blocks.find((b) => b.type === "Layout") as
      | LayoutBlock
      | undefined;
    if (!layout) throw new Error("Layout block required");

    const motion = file.blocks.find((b) => b.type === "Motion") as
      | MotionBlock
      | undefined;

    const template = layout.nodes.map((n) => this.emitNode(n, 0)).join("\n");
    const motionStyles = motion ? this.generateMotionStyles(motion) : "";

    const code = `<template>
  <div class="container mx-auto p-6">
    ${template}
  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API
</script>

${motionStyles ? `<style scoped>\n${motionStyles}\n</style>` : ""}
`;

    // Format with prettier (Vue parser)
    const formatted = await prettier.format(code.trim(), {
      parser: "vue",
      semi: true,
      singleQuote: false,
      trailingComma: "es5",
      printWidth: 80,
    });

    return formatted;
  }

  private emitNode(n: Node, indent: number = 0): string {
    const indentStr = "  ".repeat(indent);

    if (n.kind === "Text") {
      return `${indentStr}${n.text}`;
    }

    if (n.kind === "Conditional") {
      const thenJsx = n.thenNodes
        .map((node) => this.emitNode(node, indent + 1))
        .join("\n");

      if (n.elseNodes && n.elseNodes.length > 0) {
        const elseJsx = n.elseNodes
          .map((node) => this.emitNode(node, indent + 1))
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
        .map((node) => this.emitNode(node, indent + 1))
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

    // Element node
    const vueComponent = this.mapToVueComponent(n.name || "div");
    const props = (n.props || [])
      .map((p) => `${p.key}="${p.value}"`)
      .join(" ");
    const children = (n.children || [])
      .map((c) => this.emitNode(c, indent + 1))
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
    // Map React component names to Vue equivalents or use generic div
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
    };

    return mapping[name] || "div";
  }

  private generateMotionStyles(motion: MotionBlock): string {
    const cssRules = motion.rules.map((rule) => {
      const { selector, event, props } = rule;

      // Convert motion props to CSS properties
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

      // Generate CSS rule based on event type
      let pseudo = "";
      if (event === "hover") {
        pseudo = ":hover";
      } else if (event === "focus") {
        pseudo = ":focus";
      } else if (event === "active") {
        pseudo = ":active";
      }

      return `${selector}${pseudo} {\n  ${cssProps.join("\n  ")}\n}`;
    });

    return cssRules.join("\n\n");
  }
}

/**
 * Create and return a Vue plugin instance
 */
export function createVuePlugin(): CodegenPlugin {
  return new VuePlugin();
}
