export const shadRegistry = {
  Button: {
    import: `import { Button } from "@/components/ui/button"`,
    render: (p: any, children: string) =>
      `<Button ${propStr(p, ["variant", "size"])}>${children || ""}</Button>`,
  },
  Input: {
    import: `import { Input } from "@/components/ui/input"`,
    render: (p: any) =>
      `<Input ${propStr(p, ["id", "placeholder", "type", "value"])} />`,
  },
  Textarea: {
    import: `import { Textarea } from "@/components/ui/textarea"`,
    render: (p: any, children: string) =>
      `<Textarea ${propStr(p, ["id", "placeholder", "rows"])}>${children || ""}</Textarea>`,
  },
  Select: {
    import: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`,
    render: (p: any, children: string) =>
      `<Select ${propStr(p, ["value", "onValueChange"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>${children || ""}</SelectContent></Select>`,
  },
  SelectItem: {
    import: ``,
    render: (p: any, children: string) =>
      `<SelectItem ${propStr(p, ["value"])}>${children || ""}</SelectItem>`,
  },
  Checkbox: {
    import: `import { Checkbox } from "@/components/ui/checkbox"`,
    render: (p: any) =>
      `<Checkbox ${propStr(p, ["id", "checked"])} />`,
  },
  Label: {
    import: `import { Label } from "@/components/ui/label"`,
    render: (p: any, children: string) =>
      `<Label ${propStr(p, ["htmlFor"])}>${children || ""}</Label>`,
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
