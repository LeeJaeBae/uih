import type { UIHFile, LayoutBlock, MotionBlock, LogicBlock, StateBlock, DataBlock, StyleBlock, Node } from "uih-parser";
import { UIHMissingBlockError } from "uih-parser";
import { shadRegistry } from "./registry.js";
import type { CodegenPlugin } from "./plugin.js";

/**
 * React code generation plugin with shadcn/ui component support
 */
export class ReactPlugin implements CodegenPlugin {
  readonly name = "react";
  readonly fileExtension = ".tsx";

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
        "React code generation requires a layout block to define the component structure"
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

    const imports = new Set<string>();
    const jsx = layout.nodes
      .map((n) => {
        const nodeJsx = this.emitNode(n, imports, importedComponents);
        // Wrap expression nodes (Loop, Conditional) in braces at top level
        return this.isExpressionNode(n) ? `{${nodeJsx}}` : nodeJsx;
      })
      .join("\n");
    const motionStyles = motion ? this.generateMotionStyles(motion) : "";
    const styleVars = style ? this.generateStyleVars(style) : "";
    const { handlers, handlerImports } = logic ? this.generateLogicHandlers(logic) : { handlers: "", handlerImports: new Set<string>() };
    const { stateHooks, stateImports } = state ? this.generateStateHooks(state) : { stateHooks: "", stateImports: new Set<string>() };
    const { dataHooks, dataImports, fetcher } = data ? this.generateDataHooks(data) : { dataHooks: "", dataImports: new Set<string>(), fetcher: "" };

    // Merge all imports
    handlerImports.forEach(imp => imports.add(imp));
    stateImports.forEach(imp => imports.add(imp));
    dataImports.forEach(imp => imports.add(imp));

    const importStr = [...imports].filter(Boolean).join("\n");
    const allStyles = [styleVars, motionStyles].filter(Boolean).join("\n\n");
    const code = `
${userImports ? userImports + "\n" : ""}${importStr}
${fetcher ? fetcher : ""}
export default function Page() {
${stateHooks ? stateHooks : ""}${dataHooks ? dataHooks : ""}${handlers ? handlers : ""}
  return (
    <>
      ${allStyles ? `<style dangerouslySetInnerHTML={{ __html: \`${allStyles}\` }} />` : ""}
      <div className="container mx-auto p-6">
        ${jsx}
      </div>
    </>
  )
}
`;

    // Format with prettier (optional - fallback to unformatted if unavailable)
    try {
      const prettier = await import("prettier");
      const formatted = await prettier.default.format(code.trim(), {
        parser: "typescript",
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

  private emitNode(n: Node, imports: Set<string>, importedComponents: Set<string>): string {
    if (n.kind === "Text") {
      return n.text;
    }

    if (n.kind === "Conditional") {
      // Only wrap expression nodes in braces if there are multiple children
      const shouldWrapExpressions = n.thenNodes.length > 1;
      const thenJsx = n.thenNodes
        .map((node) => {
          const nodeJsx = this.emitNode(node, imports, importedComponents);
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
            const nodeJsx = this.emitNode(node, imports, importedComponents);
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
          const nodeJsx = this.emitNode(node, imports, importedComponents);
          // Wrap expression nodes in braces inside Fragment
          return this.isExpressionNode(node) ? `{${nodeJsx}}` : nodeJsx;
        })
        .join("\n");
      // Return as expression without outer braces (parent will add them if needed)
      return `${n.iterableExpr}.map((${n.iteratorVar}) => (<React.Fragment key={${n.iteratorVar}.id || Math.random()}>${childrenJsx}</React.Fragment>))`;
    }

    // Element node - check if it's an imported component first
    if (n.name && importedComponents.has(n.name)) {
      // This is an imported custom component - render it directly
      const children = (n.children || [])
        .map((c) => this.emitNode(c, imports, importedComponents))
        .join("");

      // Build props string
      const propsStr = (n.props || [])
        .map((p) => {
          // Map UIH 'class' to React 'className'
          const propName = p.key === "class" ? "className" : p.key;
          const value = String(p.value);
          // Check if value is a variable reference (already has braces)
          if (value.startsWith("{") && value.endsWith("}")) {
            return `${propName}=${value}`;
          }
          // Check if value is a number
          if (!isNaN(Number(value))) {
            return `${propName}={${value}}`;
          }
          // String literal - add quotes
          return `${propName}="${value}"`;
        })
        .join(" ");

      if (children) {
        return `<${n.name}${propsStr ? " " + propsStr : ""}>${children}</${n.name}>`;
      } else {
        return `<${n.name}${propsStr ? " " + propsStr : ""} />`;
      }
    }

    // Not an imported component - check shadcn registry
    const reg = (n.name && (shadRegistry as any)[n.name]) || null;
    const propsObj = Object.fromEntries(
      (n.props || []).map((p) => [p.key, String(p.value)])
    );
    const children = (n.children || [])
      .map((c) => this.emitNode(c, imports, importedComponents))
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

  private generateLogicHandlers(logic: LogicBlock): { handlers: string; handlerImports: Set<string> } {
    const imports = new Set<string>();
    const handlers = logic.events.map((event) => {
      const handlerName = `handle${event.name.charAt(0).toUpperCase()}${event.name.slice(1)}`;
      const statements: string[] = [];

      event.steps.forEach((step) => {
        if (step.type === "Navigate") {
          // Next.js router navigation
          imports.add(`import { useRouter } from "next/navigation"`);
          statements.push(`router.push("${step.to}");`);
        } else if (step.type === "Toast") {
          // shadcn/ui toast
          imports.add(`import { useToast } from "@/hooks/use-toast"`);
          statements.push(`toast({ title: "${step.message}" });`);
        } else if (step.type === "Call") {
          // API call
          const method = step.method || "POST";
          statements.push(`await fetch("${step.url}", { method: "${method}" });`);
        }
      });

      return `  const ${handlerName} = async () => {
    ${statements.join("\n    ")}
  };`;
    }).join("\n\n");

    // Add hook calls at the start of the component
    let hookCalls = "";
    if (imports.has(`import { useRouter } from "next/navigation"`)) {
      hookCalls += "  const router = useRouter();\n";
    }
    if (imports.has(`import { useToast } from "@/hooks/use-toast"`)) {
      hookCalls += "  const { toast } = useToast();\n";
    }

    return {
      handlers: hookCalls + "\n" + handlers + "\n",
      handlerImports: imports
    };
  }

  private generateStateHooks(state: StateBlock): { stateHooks: string; stateImports: Set<string> } {
    const imports = new Set<string>();
    imports.add(`import { useState } from "react"`);

    const hooks = state.declarations.map((decl) => {
      const varName = decl.name;
      const setterName = `set${varName.charAt(0).toUpperCase()}${varName.slice(1)}`;

      // Format initial value for code generation
      let initialValue: string;
      if (typeof decl.initialValue === "string") {
        initialValue = `"${decl.initialValue}"`;
      } else if (typeof decl.initialValue === "boolean") {
        initialValue = String(decl.initialValue);
      } else {
        initialValue = String(decl.initialValue);
      }

      return `  const [${varName}, ${setterName}] = useState(${initialValue});`;
    }).join("\n");

    return {
      stateHooks: hooks + "\n\n",
      stateImports: imports
    };
  }

  private generateDataHooks(data: DataBlock): { dataHooks: string; dataImports: Set<string>; fetcher: string } {
    const imports = new Set<string>();
    imports.add(`import useSWR from "swr"`);

    // Generate fetcher function
    const fetcher = `\nconst fetcher = (url: string) => fetch(url).then((res) => res.json());\n`;

    const hooks = data.fetches.map((fetch) => {
      const varName = fetch.name;
      const errorVar = `${varName}Error`;
      const loadingVar = `${varName}Loading`;

      return `  const { data: ${varName}, error: ${errorVar}, isLoading: ${loadingVar} } = useSWR("${fetch.url}", fetcher);`;
    }).join("\n");

    return {
      dataHooks: hooks + "\n\n",
      dataImports: imports,
      fetcher
    };
  }
}

/**
 * Create and return a React plugin instance
 */
export function createReactPlugin(): CodegenPlugin {
  return new ReactPlugin();
}
