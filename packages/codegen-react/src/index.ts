import type { UIHFile, LayoutBlock, Node } from "uih-parser";
import { shadRegistry } from "./registry.ts";

export function generateReact(file: UIHFile) {
  const layout = file.blocks.find((b) => b.type === "Layout") as
    | LayoutBlock
    | undefined;
  if (!layout) throw new Error("Layout block required");

  const imports = new Set<string>();
  const jsx = layout.nodes.map((n) => emitNode(n, imports)).join("\n");

  const importStr = [...imports].filter(Boolean).join("\n");
  const code = `
${importStr}
export default function Page() {
  return (
    <div className="container mx-auto p-6">
      ${jsx}
    </div>
  )
}
`;
  return code.trim();
}

function emitNode(n: Node, imports: Set<string>): string {
  if (n.kind === "Text") return n.text || "";
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
