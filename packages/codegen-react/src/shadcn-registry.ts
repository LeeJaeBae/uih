/**
 * Shadcn Registry - React-specific shadcn/ui Components
 *
 * This registry contains components that depend on shadcn/ui library.
 * These are React-only and should not be used in Vue/Svelte plugins.
 */

import type { ComponentConfig, ComponentProps } from "./core-registry.js";
import { propStr } from "./core-registry.js";

/**
 * Shadcn Registry - React-specific Components
 * Total: 28 shadcn components
 */
export const shadcnRegistry: Record<string, ComponentConfig> = {
  // ===== FORM COMPONENTS =====
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
  Label: {
    import: `import { Label } from "@/components/ui/label"`,
    render: (p: ComponentProps, children: string) =>
      `<Label ${propStr(p, ["htmlFor", "for", "class"])}>${children || ""}</Label>`,
  },

  // ===== SELECT COMPONENTS =====
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

  // ===== CHECKBOX & RADIO =====
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

  // ===== CARD COMPONENTS =====
  Card: {
    import: `import { Card, CardContent } from "@/components/ui/card"`,
    render: (p: ComponentProps, children: string) =>
      `<Card ${propStr(p, ["id", "class"])}><CardContent>${children || ""}</CardContent></Card>`,
  },

  // ===== BADGE =====
  Badge: {
    import: `import { Badge } from "@/components/ui/badge"`,
    render: (p: ComponentProps, children: string) =>
      `<Badge ${propStr(p, ["variant", "class"])}>${children || ""}</Badge>`,
  },

  // ===== AVATAR =====
  Avatar: {
    import: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"`,
    render: (p: ComponentProps, children: string) =>
      `<Avatar><AvatarImage ${propStr(p, ["src", "alt"])} /><AvatarFallback>${children || "?"}</AvatarFallback></Avatar>`,
  },

  // ===== DIALOG =====
  Dialog: {
    import: `import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"`,
    render: (p: ComponentProps, children: string) =>
      `<Dialog><DialogTrigger asChild>${p.trigger || "<Button>Open</Button>"}</DialogTrigger><DialogContent><DialogHeader><DialogTitle>${p.title || "Dialog"}</DialogTitle></DialogHeader>${children || ""}</DialogContent></Dialog>`,
  },

  // ===== TOOLTIP =====
  Tooltip: {
    import: `import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"`,
    render: (p: ComponentProps, children: string) =>
      `<TooltipProvider><Tooltip><TooltipTrigger asChild>${children || "<Button>Hover</Button>"}</TooltipTrigger><TooltipContent><p>${p.content || "Tooltip"}</p></TooltipContent></Tooltip></TooltipProvider>`,
  },

  // ===== SHEET =====
  Sheet: {
    import: `import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"`,
    render: (p: ComponentProps, children: string) =>
      `<Sheet><SheetTrigger asChild>${p.trigger || "<Button>Open</Button>"}</SheetTrigger><SheetContent ${propStr(p, ["side"])}><SheetHeader><SheetTitle>${p.title || "Sheet"}</SheetTitle></SheetHeader>${children || ""}</SheetContent></Sheet>`,
  },

  // ===== TABS =====
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

  // ===== ACCORDION =====
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

  // ===== SEPARATOR =====
  Separator: {
    import: `import { Separator } from "@/components/ui/separator"`,
    render: (p: ComponentProps) =>
      `<Separator ${propStr(p, ["orientation", "className"])} />`,
  },

  // ===== ALERT =====
  Alert: {
    import: `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"`,
    render: (p: ComponentProps, children: string) =>
      `<Alert ${propStr(p, ["variant"])}>${p.title ? `<AlertTitle>${p.title}</AlertTitle>` : ""}<AlertDescription>${children || ""}</AlertDescription></Alert>`,
  },

  // ===== PROGRESS =====
  Progress: {
    import: `import { Progress } from "@/components/ui/progress"`,
    render: (p: ComponentProps) =>
      `<Progress ${propStr(p, ["value", "max", "className"])} />`,
  },

  // ===== SKELETON =====
  Skeleton: {
    import: `import { Skeleton } from "@/components/ui/skeleton"`,
    render: (p: ComponentProps) =>
      `<Skeleton ${propStr(p, ["className"])} />`,
  },
};
