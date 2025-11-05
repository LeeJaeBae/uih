import type { UIHFile, LayoutBlock, MotionBlock, Node } from "uih-parser";
import { shadRegistry } from "./registry.ts";
import prettier from "prettier";

export async function generateReact(file: UIHFile): Promise<string> {
  const layout = file.blocks.find((b) => b.type === "Layout") as
    | LayoutBlock
    | undefined;
  if (!layout) throw new Error("Layout block required");

  const motion = file.blocks.find((b) => b.type === "Motion") as
    | MotionBlock
    | undefined;

  const imports = new Set<string>();
  const jsx = layout.nodes.map((n) => emitNode(n, imports)).join("\n");
  const motionStyles = motion ? generateMotionStyles(motion) : "";

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

function emitNode(n: Node, imports: Set<string>): string {
  if (n.kind === "Text") {
    return n.text;
  }

  if (n.kind === "Conditional") {
    const thenJsx = n.thenNodes.map((node) => emitNode(node, imports)).join("\n");
    if (n.elseNodes && n.elseNodes.length > 0) {
      const elseJsx = n.elseNodes.map((node) => emitNode(node, imports)).join("\n");
      return `{${n.condition} ? (<>${thenJsx}</>) : (<>${elseJsx}</>)}`;
    }
    return `{${n.condition} && (<>${thenJsx}</>)}`;
  }

  if (n.kind === "Loop") {
    const childrenJsx = n.children.map((node) => emitNode(node, imports)).join("\n");
    return `{${n.iterableExpr}.map((${n.iteratorVar}) => (<React.Fragment key={${n.iteratorVar}.id || Math.random()}>${childrenJsx}</React.Fragment>))}`;
  }

  // Element node
  const reg = (n.name && (shadRegistry as any)[n.name]) || null;
  const propsObj = Object.fromEntries(
    (n.props || []).map((p) => [p.key, String(p.value)])
  );
  const children = (n.children || []).map((c) => emitNode(c, imports)).join("");
  if (reg?.import) imports.add(reg.import);
  if (reg?.render) return reg.render(propsObj, children);
  // fallback div
  return `<div>${children}</div>`;
}

function generateMotionStyles(motion: MotionBlock): string {
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
