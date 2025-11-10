/**
 * Component props type definition
 * Props can be strings, numbers, booleans, or variable references
 */
export interface ComponentProps {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Component registry entry
 */
export interface ShadComponent {
  import: string;
  render: (props: ComponentProps, children: string) => string;
}

/**
 * Registry of all available components
 */
export const shadRegistry: Record<string, ShadComponent> = {
  Button: {
    import: `import { Button } from "@/components/ui/button"`,
    render: (p: ComponentProps, children: string) =>
      `<Button ${propStr(p, ["variant", "size", "class"])}>${children || ""}</Button>`,
  },
  Input: {
    import: `import { Input } from "@/components/ui/input"`,
    render: (p: ComponentProps) =>
      `<Input ${propStr(p, ["id", "placeholder", "type", "value", "disabled", "class"])} />`,
  },
  Textarea: {
    import: `import { Textarea } from "@/components/ui/textarea"`,
    render: (p: ComponentProps, children: string) =>
      `<Textarea ${propStr(p, ["id", "placeholder", "rows", "class"])}>${children || ""}</Textarea>`,
  },
  Select: {
    import: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`,
    render: (p: ComponentProps, children: string) => {
      // Parse options if provided
      const options = p.options && typeof p.options === 'string'
        ? p.options.split(',').map((o: string) => o.trim())
        : [];
      const optionItems = options.map((opt: string) =>
        `<SelectItem value="${opt}">${opt}</SelectItem>`
      ).join('');

      return `<Select ${propStr(p, ["id", "value", "onValueChange"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>${optionItems || children || ""}</SelectContent></Select>`;
    },
  },
  SelectItem: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<SelectItem ${propStr(p, ["value"])}>${children || ""}</SelectItem>`,
  },
  Checkbox: {
    import: `import { Checkbox } from "@/components/ui/checkbox"`,
    render: (p: ComponentProps) => {
      // If label is provided, wrap with Label
      if (p.label) {
        return `<div className="flex items-center space-x-2"><Checkbox ${propStr(p, ["id", "checked"])} /><label htmlFor="${p.id || ''}" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">${p.label}</label></div>`;
      }
      return `<Checkbox ${propStr(p, ["id", "checked"])} />`;
    },
  },
  RadioGroup: {
    import: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"`,
    render: (p: ComponentProps, children: string) =>
      `<RadioGroup ${propStr(p, ["value", "onValueChange", "defaultValue"])}>${children || ""}</RadioGroup>`,
  },
  RadioGroupItem: {
    import: ``,
    render: (p: ComponentProps, children: string) => {
      if (p.label) {
        return `<div className="flex items-center space-x-2"><RadioGroupItem ${propStr(p, ["value", "id"])} /><Label htmlFor="${p.id || ''}">${p.label}</Label></div>`;
      }
      return `<RadioGroupItem ${propStr(p, ["value", "id"])} />`;
    },
  },
  Switch: {
    import: `import { Switch } from "@/components/ui/switch"`,
    render: (p: ComponentProps) => {
      if (p.label) {
        return `<div className="flex items-center space-x-2"><Switch ${propStr(p, ["id", "checked", "onCheckedChange"])} /><Label htmlFor="${p.id || ''}">${p.label}</Label></div>`;
      }
      return `<Switch ${propStr(p, ["id", "checked", "onCheckedChange"])} />`;
    },
  },
  Label: {
    import: `import { Label } from "@/components/ui/label"`,
    render: (p: ComponentProps, children: string) =>
      `<Label ${propStr(p, ["htmlFor", "for", "class"])}>${children || ""}</Label>`,
  },
  Card: {
    import: `import { Card, CardContent } from "@/components/ui/card"`,
    render: (p: ComponentProps, children: string) =>
      `<Card ${propStr(p, ["id", "class"])}><CardContent>${children || ""}</CardContent></Card>`,
  },
  Badge: {
    import: `import { Badge } from "@/components/ui/badge"`,
    render: (p: ComponentProps, children: string) =>
      `<Badge ${propStr(p, ["variant", "class"])}>${children || ""}</Badge>`,
  },
  Avatar: {
    import: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"`,
    render: (p: ComponentProps, children: string) =>
      `<Avatar><AvatarImage ${propStr(p, ["src", "alt"])} /><AvatarFallback>${children || "?"}</AvatarFallback></Avatar>`,
  },
  Dialog: {
    import: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"`,
    render: (p: ComponentProps, children: string) =>
      `<Dialog><DialogTrigger asChild>${p.trigger || "<Button>Open</Button>"}</DialogTrigger><DialogContent><DialogHeader><DialogTitle>${p.title || "Dialog"}</DialogTitle></DialogHeader>${children || ""}</DialogContent></Dialog>`,
  },
  Tooltip: {
    import: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"`,
    render: (p: ComponentProps, children: string) =>
      `<TooltipProvider><Tooltip><TooltipTrigger asChild>${children || "<Button>Hover</Button>"}</TooltipTrigger><TooltipContent><p>${p.content || "Tooltip"}</p></TooltipContent></Tooltip></TooltipProvider>`,
  },
  Sheet: {
    import: `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"`,
    render: (p: ComponentProps, children: string) =>
      `<Sheet><SheetTrigger asChild>${p.trigger || "<Button>Open</Button>"}</SheetTrigger><SheetContent ${propStr(p, ["side"])}><SheetHeader><SheetTitle>${p.title || "Sheet"}</SheetTitle></SheetHeader>${children || ""}</SheetContent></Sheet>`,
  },
  Tabs: {
    import: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`,
    render: (p: ComponentProps, children: string) =>
      `<Tabs ${propStr(p, ["defaultValue", "value"])}>${children || ""}</Tabs>`,
  },
  TabsList: {
    import: ``,
    render: (_: ComponentProps, children: string) =>
      `<TabsList>${children || ""}</TabsList>`,
  },
  TabsTrigger: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<TabsTrigger ${propStr(p, ["value"])}>${children || ""}</TabsTrigger>`,
  },
  TabsContent: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<TabsContent ${propStr(p, ["value"])}>${children || ""}</TabsContent>`,
  },
  Accordion: {
    import: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"`,
    render: (p: ComponentProps, children: string) =>
      `<Accordion ${propStr(p, ["type", "collapsible"])}>${children || ""}</Accordion>`,
  },
  AccordionItem: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<AccordionItem ${propStr(p, ["value"])}>${children || ""}</AccordionItem>`,
  },
  AccordionTrigger: {
    import: ``,
    render: (_: ComponentProps, children: string) =>
      `<AccordionTrigger>${children || ""}</AccordionTrigger>`,
  },
  AccordionContent: {
    import: ``,
    render: (_: ComponentProps, children: string) =>
      `<AccordionContent>${children || ""}</AccordionContent>`,
  },
  Separator: {
    import: `import { Separator } from "@/components/ui/separator"`,
    render: (p: ComponentProps) =>
      `<Separator ${propStr(p, ["orientation", "className"])} />`,
  },
  Alert: {
    import: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"`,
    render: (p: ComponentProps, children: string) =>
      `<Alert ${propStr(p, ["variant"])}>${p.title ? `<AlertTitle>${p.title}</AlertTitle>` : ""}<AlertDescription>${children || ""}</AlertDescription></Alert>`,
  },
  Progress: {
    import: `import { Progress } from "@/components/ui/progress"`,
    render: (p: ComponentProps) =>
      `<Progress ${propStr(p, ["value", "max", "className"])} />`,
  },
  Skeleton: {
    import: `import { Skeleton } from "@/components/ui/skeleton"`,
    render: (p: ComponentProps) =>
      `<Skeleton ${propStr(p, ["className"])} />`,
  },
  Text: {
    import: ``,
    render: (_: ComponentProps, children: string) => `<p>${children || ""}</p>`,
  },

  // Pure HTML Elements for Tailwind CSS
  Div: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<div ${propStr(p, ["id", "class"])}>${children || ""}</div>`,
  },
  Span: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<span ${propStr(p, ["id", "class"])}>${children || ""}</span>`,
  },
  P: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<p ${propStr(p, ["id", "class"])}>${children || ""}</p>`,
  },
  H1: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h1 ${propStr(p, ["id", "class"])}>${children || ""}</h1>`,
  },
  H2: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h2 ${propStr(p, ["id", "class"])}>${children || ""}</h2>`,
  },
  H3: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h3 ${propStr(p, ["id", "class"])}>${children || ""}</h3>`,
  },
  H4: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h4 ${propStr(p, ["id", "class"])}>${children || ""}</h4>`,
  },
  H5: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h5 ${propStr(p, ["id", "class"])}>${children || ""}</h5>`,
  },
  H6: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h6 ${propStr(p, ["id", "class"])}>${children || ""}</h6>`,
  },
  Section: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<section ${propStr(p, ["id", "class"])}>${children || ""}</section>`,
  },
  Article: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<article ${propStr(p, ["id", "class"])}>${children || ""}</article>`,
  },
  Aside: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<aside ${propStr(p, ["id", "class"])}>${children || ""}</aside>`,
  },
  Header: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<header ${propStr(p, ["id", "class"])}>${children || ""}</header>`,
  },
  Footer: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<footer ${propStr(p, ["id", "class"])}>${children || ""}</footer>`,
  },
  Nav: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<nav ${propStr(p, ["id", "class"])}>${children || ""}</nav>`,
  },
  Main: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<main ${propStr(p, ["id", "class"])}>${children || ""}</main>`,
  },
  Form: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<form ${propStr(p, ["id", "class", "action", "method"])}>${children || ""}</form>`,
  },
  Ul: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<ul ${propStr(p, ["id", "class"])}>${children || ""}</ul>`,
  },
  Ol: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<ol ${propStr(p, ["id", "class"])}>${children || ""}</ol>`,
  },
  Li: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<li ${propStr(p, ["id", "class"])}>${children || ""}</li>`,
  },
  A: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<a ${propStr(p, ["id", "class", "href", "target", "rel"])}>${children || ""}</a>`,
  },
  Img: {
    import: ``,
    render: (p: ComponentProps) =>
      `<img ${propStr(p, ["id", "class", "src", "alt", "width", "height"])} />`,
  },

  // Media Elements
  Video: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<video ${propStr(p, ["id", "class", "src", "controls", "autoplay", "loop", "muted", "width", "height"])}>${children || ""}</video>`,
  },
  Audio: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<audio ${propStr(p, ["id", "class", "src", "controls", "autoplay", "loop", "muted"])}>${children || ""}</audio>`,
  },
  Source: {
    import: ``,
    render: (p: ComponentProps) =>
      `<source ${propStr(p, ["src", "type"])} />`,
  },

  // Table Elements
  Table: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<table ${propStr(p, ["id", "class"])}>${children || ""}</table>`,
  },
  Thead: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<thead ${propStr(p, ["id", "class"])}>${children || ""}</thead>`,
  },
  Tbody: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<tbody ${propStr(p, ["id", "class"])}>${children || ""}</tbody>`,
  },
  Tfoot: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<tfoot ${propStr(p, ["id", "class"])}>${children || ""}</tfoot>`,
  },
  Tr: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<tr ${propStr(p, ["id", "class"])}>${children || ""}</tr>`,
  },
  Td: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<td ${propStr(p, ["id", "class", "colspan", "rowspan"])}>${children || ""}</td>`,
  },
  Th: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<th ${propStr(p, ["id", "class", "colspan", "rowspan", "scope"])}>${children || ""}</th>`,
  },

  // Form Elements (HTML native, Note: Select and Label already exist as shadcn components)
  Option: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<option ${propStr(p, ["value", "selected", "disabled"])}>${children || ""}</option>`,
  },
  Fieldset: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<fieldset ${propStr(p, ["id", "class"])}>${children || ""}</fieldset>`,
  },
  Legend: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<legend ${propStr(p, ["id", "class"])}>${children || ""}</legend>`,
  },

  // Canvas and SVG
  Canvas: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<canvas ${propStr(p, ["id", "class", "width", "height"])}>${children || ""}</canvas>`,
  },
  Svg: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<svg ${propStr(p, ["id", "class", "width", "height", "viewBox"])}>${children || ""}</svg>`,
  },
};

/**
 * Helper function to generate prop string for components
 * @param p Component props
 * @param allow Allowed prop names
 * @returns Formatted prop string
 */
function propStr(p: ComponentProps, allow: string[]): string {
  if (!p) return "";

  // Collect all props from allow list and dynamic props (event handlers, aria, data, role)
  const allProps: string[] = [];

  // Process allowed props
  allow
    .filter((k) => k in p)
    .forEach((k) => {
      // Map UIH props to React props
      let propName = k;
      if (k === "for") propName = "htmlFor";
      if (k === "class") propName = "className";

      const value = p[k];

      // Check if value is an expression (starts with {)
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        // Expression: remove quotes, use as-is
        allProps.push(`${propName}=${value}`);
      } else if (typeof value === "boolean") {
        // Boolean attribute
        if (value) {
          allProps.push(propName);
        }
      } else {
        // Regular string: wrap in quotes
        allProps.push(`${propName}="${value}"`);
      }
    });

  // Process event handlers (onClick, onChange, onSubmit, etc.)
  Object.keys(p).forEach((k) => {
    if (k.startsWith("on") && k.length > 2 && k[2] === k[2].toUpperCase()) {
      const value = p[k];
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        allProps.push(`${k}=${value}`);
      }
    }
  });

  // Process aria-* attributes
  Object.keys(p).forEach((k) => {
    if (k.startsWith("aria-")) {
      const value = p[k];
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        allProps.push(`${k}=${value}`);
      } else {
        allProps.push(`${k}="${value}"`);
      }
    }
  });

  // Process data-* attributes
  Object.keys(p).forEach((k) => {
    if (k.startsWith("data-")) {
      const value = p[k];
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        allProps.push(`${k}=${value}`);
      } else {
        allProps.push(`${k}="${value}"`);
      }
    }
  });

  // Process role attribute
  if ("role" in p && !allow.includes("role")) {
    const value = p.role;
    allProps.push(`role="${value}"`);
  }

  return allProps.join(" ");
}
