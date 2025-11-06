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
    render: (p: any, children: string) => {
      // Parse options if provided
      const options = p.options ? p.options.split(',').map((o: string) => o.trim()) : [];
      const optionItems = options.map((opt: string) =>
        `<SelectItem value="${opt}">${opt}</SelectItem>`
      ).join('');

      return `<Select ${propStr(p, ["id", "value", "onValueChange"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>${optionItems || children || ""}</SelectContent></Select>`;
    },
  },
  SelectItem: {
    import: ``,
    render: (p: any, children: string) =>
      `<SelectItem ${propStr(p, ["value"])}>${children || ""}</SelectItem>`,
  },
  Checkbox: {
    import: `import { Checkbox } from "@/components/ui/checkbox"`,
    render: (p: any) => {
      // If label is provided, wrap with Label
      if (p.label) {
        return `<div className="flex items-center space-x-2"><Checkbox ${propStr(p, ["id", "checked"])} /><label htmlFor="${p.id || ''}" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">${p.label}</label></div>`;
      }
      return `<Checkbox ${propStr(p, ["id", "checked"])} />`;
    },
  },
  Label: {
    import: `import { Label } from "@/components/ui/label"`,
    render: (p: any, children: string) =>
      `<Label ${propStr(p, ["htmlFor", "for"])}>${children || ""}</Label>`,
  },
  Card: {
    import: `import { Card, CardContent } from "@/components/ui/card"`,
    render: (p: any, children: string) =>
      `<Card ${propStr(p, ["id", "className"])}><CardContent>${children || ""}</CardContent></Card>`,
  },
  Badge: {
    import: `import { Badge } from "@/components/ui/badge"`,
    render: (p: any, children: string) =>
      `<Badge ${propStr(p, ["variant"])}>${children || ""}</Badge>`,
  },
  Avatar: {
    import: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"`,
    render: (p: any, children: string) =>
      `<Avatar><AvatarImage ${propStr(p, ["src", "alt"])} /><AvatarFallback>${children || "?"}</AvatarFallback></Avatar>`,
  },
  Dialog: {
    import: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"`,
    render: (p: any, children: string) =>
      `<Dialog><DialogTrigger asChild>${p.trigger || "<Button>Open</Button>"}</DialogTrigger><DialogContent><DialogHeader><DialogTitle>${p.title || "Dialog"}</DialogTitle></DialogHeader>${children || ""}</DialogContent></Dialog>`,
  },
  Tooltip: {
    import: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"`,
    render: (p: any, children: string) =>
      `<TooltipProvider><Tooltip><TooltipTrigger asChild>${children || "<Button>Hover</Button>"}</TooltipTrigger><TooltipContent><p>${p.content || "Tooltip"}</p></TooltipContent></Tooltip></TooltipProvider>`,
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
    .map((k) => {
      // Map UIH 'for' to React 'htmlFor'
      const propName = k === "for" ? "htmlFor" : k;
      const value = p[k];

      // Check if value is an expression (starts with {)
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        // Expression: remove quotes, use as-is
        return `${propName}=${value}`;
      }

      // Regular string: wrap in quotes
      return `${propName}="${value}"`;
    })
    .join(" ");
}
