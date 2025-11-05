export const shadRegistry = {
  Button: {
    import: `import { Button } from "@/components/ui/button"`,
    render: (p: any, children: string) =>
      `<Button ${propStr(p, ["variant", "size"])}>${children || ""}</Button>`,
  },
  Input: {
    import: `import { Input } from "@/components/ui/input"`,
    render: (p: any) =>
      `<Input ${propStr(p, ["id", "placeholder", "type"])} />`,
  },
  Card: {
    import: `import { Card, CardContent } from "@/components/ui/card"`,
    render: (_: any, children: string) =>
      `<Card><CardContent>${children || ""}</CardContent></Card>`,
  },
  Text: {
    import: ``,
    render: (_: any, children: string) => `<p>${children || ""}</p>`,
  },
};

function propStr(p: any, allow: string[]) {
  if (!p) return "";
  return allow
    .filter((k) => k in p)
    .map((k) => `${k}="${p[k]}"`)
    .join(" ");
}
