import type { UIHFile, LayoutBlock, MotionBlock, Node } from "uih-parser";
import { shadRegistry } from "./registry.js";
import prettier from "prettier";
import type { CodegenPlugin } from "./plugin.js";

/**
 * React code generation plugin with shadcn/ui component support
 */
export class ReactPlugin implements CodegenPlugin {
  readonly name = "react";
  readonly fileExtension = ".tsx";

  async generate(file: UIHFile): Promise<string> {
    const layout = file.blocks.find((b) => b.type === "Layout") as
      | LayoutBlock
      | undefined;
    if (!layout) throw new Error("Layout block required");

    const motion = file.blocks.find((b) => b.type === "Motion") as
      | MotionBlock
      | undefined;

    const imports = new Set<string>();
    const jsx = layout.nodes
      .map((n) => {
        const nodeJsx = this.emitNode(n, imports);
        // Wrap expression nodes (Loop, Conditional) in braces at top level
        return this.isExpressionNode(n) ? `{${nodeJsx}}` : nodeJsx;
      })
      .join("\n");
    const motionStyles = motion ? this.generateMotionStyles(motion) : "";

    const importStr = [...imports].filter(Boolean).join("\n");
    const code = `
${importStr}
export default function Page() {
  return (
    <>
      ${motionStyles ? `<style dangerouslySetInnerHTML={{ __html: \`${motionStyles}\` }} />` : ""}
      <div className="container mx-auto p-6">
        ${jsx}
      </div>
    </>
  )
}
`;

    // Format with prettier
    const formatted = await prettier.format(code.trim(), {
      parser: "typescript",
      semi: true,
      singleQuote: false,
      trailingComma: "es5",
      printWidth: 80,
    });

    return formatted;
  }

  // Helper: Check if nodes need Fragment wrapper (multiple nodes or no nodes)
  private needsFragment(nodes: Node[]): boolean {
    return nodes.length !== 1;
  }

  // Helper: Check if node is already an expression (Loop or Conditional)
  private isExpressionNode(node: Node): boolean {
    return node.kind === "Loop" || node.kind === "Conditional";
  }

  // Helper: Wrap JSX in Fragment if needed
  private wrapIfNeeded(jsx: string, nodes: Node[]): string {
    if (this.needsFragment(nodes)) {
      return `<>${jsx}</>`;
    }
    // Single node - check if it's already an expression
    if (nodes.length === 1 && this.isExpressionNode(nodes[0])) {
      // Loop and Conditional already produce {...} expressions, no wrapping needed
      return jsx;
    }
    return jsx;
  }

  private emitNode(n: Node, imports: Set<string>): string {
    if (n.kind === "Text") {
      return n.text;
    }

    if (n.kind === "Conditional") {
      // Only wrap expression nodes in braces if there are multiple children
      const shouldWrapExpressions = n.thenNodes.length > 1;
      const thenJsx = n.thenNodes
        .map((node) => {
          const nodeJsx = this.emitNode(node, imports);
          // Wrap expression nodes in braces only when multiple children exist
          return shouldWrapExpressions && this.isExpressionNode(node)
            ? `{${nodeJsx}}`
            : nodeJsx;
        })
        .join("\n");
      const wrappedThen = this.wrapIfNeeded(thenJsx, n.thenNodes);
      const needsParensThen =
        n.thenNodes.length !== 1 || !this.isExpressionNode(n.thenNodes[0]);

      if (n.elseNodes && n.elseNodes.length > 0) {
        const shouldWrapExpressionsElse = n.elseNodes.length > 1;
        const elseJsx = n.elseNodes
          .map((node) => {
            const nodeJsx = this.emitNode(node, imports);
            // Wrap expression nodes in braces only when multiple children exist
            return shouldWrapExpressionsElse && this.isExpressionNode(node)
              ? `{${nodeJsx}}`
              : nodeJsx;
          })
          .join("\n");
        const wrappedElse = this.wrapIfNeeded(elseJsx, n.elseNodes);
        const needsParensElse =
          n.elseNodes.length !== 1 || !this.isExpressionNode(n.elseNodes[0]);

        const thenPart = needsParensThen ? `(${wrappedThen})` : wrappedThen;
        const elsePart = needsParensElse ? `(${wrappedElse})` : wrappedElse;
        // Return without outer braces (parent will add them if needed)
        return `${n.condition} ? ${thenPart} : ${elsePart}`;
      }

      const thenPart = needsParensThen ? `(${wrappedThen})` : wrappedThen;
      // Return without outer braces (parent will add them if needed)
      return `${n.condition} && ${thenPart}`;
    }

    if (n.kind === "Loop") {
      const childrenJsx = n.children
        .map((node) => {
          const nodeJsx = this.emitNode(node, imports);
          // Wrap expression nodes in braces inside Fragment
          return this.isExpressionNode(node) ? `{${nodeJsx}}` : nodeJsx;
        })
        .join("\n");
      // Return as expression without outer braces (parent will add them if needed)
      return `${n.iterableExpr}.map((${n.iteratorVar}) => (<React.Fragment key={${n.iteratorVar}.id || Math.random()}>${childrenJsx}</React.Fragment>))`;
    }

    // Element node
    const reg = (n.name && (shadRegistry as any)[n.name]) || null;
    const propsObj = Object.fromEntries(
      (n.props || []).map((p) => [p.key, String(p.value)])
    );
    const children = (n.children || [])
      .map((c) => this.emitNode(c, imports))
      .join("");
    if (reg?.import) imports.add(reg.import);
    if (reg?.render) return reg.render(propsObj, children);
    // fallback div
    return `<div>${children}</div>`;
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

      return `${selector}${pseudo} { ${cssProps.join(" ")} }`;
    });

    return cssRules.join("\n");
  }
}

/**
 * Create and return a React plugin instance
 */
export function createReactPlugin(): CodegenPlugin {
  return new ReactPlugin();
}
