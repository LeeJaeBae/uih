import type { UIHFile, LayoutBlock, MotionBlock, Node } from "uih-parser";
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
    const layout = file.blocks.find((b) => b.type === "Layout") as
      | LayoutBlock
      | undefined;
    if (!layout) throw new Error("Layout block required");

    const motion = file.blocks.find((b) => b.type === "Motion") as
      | MotionBlock
      | undefined;

    const template = layout.nodes.map((n) => this.emitNode(n, 1)).join("\n");
    const motionStyles = motion ? this.generateMotionStyles(motion) : "";

    const code = `<script lang="ts">
  // Svelte component logic
</script>

<div class="container mx-auto p-6">
${template}
</div>

${motionStyles ? `<style>\n${motionStyles}\n</style>` : ""}
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
        .map((node) => this.emitNode(node, indent + 1))
        .join("\n");

      return `${indentStr}{#each ${n.iterableExpr} as ${n.iteratorVar} (${n.iteratorVar}.id || Math.random())}
${childrenJsx}
${indentStr}{/each}`;
    }

    // Element node
    const svelteComponent = this.mapToSvelteComponent(n.name || "div");
    const props = (n.props || [])
      .map((p) => `${p.key}="${p.value}"`)
      .join(" ");
    const children = (n.children || [])
      .map((c) => this.emitNode(c, indent + 1))
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
    // Map React component names to Svelte/HTML equivalents
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
 * Create and return a Svelte plugin instance
 */
export function createSveltePlugin(): CodegenPlugin {
  return new SveltePlugin();
}
