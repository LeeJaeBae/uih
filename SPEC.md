# UIH (Universal UI Hierarchy) - Technical Specification

**Version**: 0.8.0  
**Last Updated**: 2025-11-14  
**License**: MIT

---

## Overview

UIH is a meta-language for cross-framework UI development. Write UI once, compile to React, Vue, or Svelte.

### Key Features

- 🎨 **Tailwind CSS Support**: Full utility classes + CSS variables
- 🧩 **Component System**: 42 core + 28 shadcn components
- 🔄 **Multi-Framework**: React, Vue, Svelte
- ⚡ **Interactive Templates**: Auto state/validation/API logic
- 🤖 **AI-Friendly**: Optimized for Claude Code
- 🖼️ **Live Preview**: VSCode extension
- 🔌 **MCP Integration**: Model Context Protocol

---

## Architecture

### Package Structure

```
uih/
├── packages/
│   ├── parser/          # UIH language parser (v0.7.4)
│   ├── codegen-react/   # React/Vue/Svelte generator (v0.9.0)
│   ├── cli/             # Command-line interface (v0.8.2)
│   ├── ai/              # Claude AI integration
│   └── mcp-server/      # MCP server for Claude Code
├── playground/          # Next.js playground
├── vscode-uih/          # VSCode extension (v1.3.4)
└── examples/            # Example .uih files
```

### Build Pipeline

```
.uih file → Parser (AST) → Codegen → React/Vue/Svelte → Prettier → Output
```

---

## UIH Language Syntax

### File Structure

```uih
import { Card } from "./Card.uih"

meta {
  route: "/page";
  title: "Page Title";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  spacing.unit: "8px";
}

state {
  count: 0;
  isOpen: false;
}

data {
  users = fetch("/api/users");
}

logic {
  on submit {
    Call("/api/submit", "POST");
    Navigate("/success");
    Toast("Success!");
  }
}

motion {
  .button on hover {
    scale: 1.05;
    duration: "200ms";
  }
}

layout {
  Div(class:"container") {
    H1 { "Hello World" }
    Button { "Click Me" }
  }
}
```

### Block Types

| Block | Purpose | Example |
|-------|---------|---------|
| `import` | Import components | `import { Card } from "./Card.uih"` |
| `meta` | Page metadata | `route: "/page"; title: "Title";` |
| `style` | CSS variables | `color.primary: "#0E5EF7";` |
| `state` | Component state | `count: 0; isOpen: false;` |
| `data` | Data fetching | `users = fetch("/api/users");` |
| `logic` | Event handlers | `on submit { Navigate("/home"); }` |
| `motion` | Animations | `.btn on hover { scale: 1.05; }` |
| `layout` | UI structure | `Div { H1 { "Title" } }` |

### Conditionals & Loops

```uih
? isLoggedIn {
  P { "Welcome!" }
} : {
  Button { "Login" }
}

@ items as item {
  Li { item.name }
}
```

---

## Component Registry

### Core Registry (42 Components)

**Framework-independent HTML elements**:

- **Layout**: Div, Header, Footer, Main, Section, Article, Aside, Nav
- **Typography**: H1-H6, P, Span, Strong, Em, Code, Pre
- **Lists**: Ul, Ol, Li
- **Media**: Img, Video, Audio
- **Forms**: Form, Input, Textarea, Select, Button, Label
- **Table**: Table, Thead, Tbody, Tr, Th, Td
- **Links**: A

### Shadcn Registry (28 Components)

**React-specific shadcn/ui components**:

- **Forms**: Button, Input, Textarea, Label, Checkbox, Radio, Switch, Select, Slider
- **Layout**: Card, Separator, Tabs, Dialog, Sheet, Popover, Dropdown
- **Display**: Avatar, Badge, Alert, Toast, Tooltip, Progress
- **Navigation**: Breadcrumb, Pagination, Command

**Button Variants**:
```uih
Button(variant:"default|destructive|outline|secondary|ghost|link")
Button(size:"sm|default|lg|icon")
```

---

## Code Generation

### React Plugin

**Output**: `.tsx` with TypeScript, JSX, useState, SWR, Next.js router

```tsx
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <div className="container">
      <h1>{count}</h1>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  );
}
```

### Vue Plugin

**Output**: `.vue` with Composition API, template, ref/reactive

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <div class="container">
    <h1>{{ count }}</h1>
    <button @click="count++">Increment</button>
  </div>
</template>
```

### Svelte Plugin

**Output**: `.svelte` with reactive declarations

```svelte
<script>
let count = 0;
</script>

<div class="container">
  <h1>{count}</h1>
  <button on:click={() => count++}>Increment</button>
</div>
```

### Interactive Templates

**Hybrid workflow**: UIH structure + Claude Code logic

```bash
uih compile form.uih out --target react --interactive
```

1. UIH generates form structure
2. Feature detection (inputs, validation, API)
3. Inject smart TODO placeholders
4. Claude Code implements logic
5. Complete functional component

---

## CLI Reference

### Installation

```bash
npm install -g uih-cli
# or
npx uih-cli compile input.uih output --target react
```

### Commands

#### compile

```bash
uih compile <input> <output> [options]

Options:
  -t, --target <framework>  react|vue|svelte [default: react]
  -i, --interactive         Generate with smart placeholders
  -w, --watch              Watch for changes

Examples:
  uih compile login.uih src/pages --target react
  uih compile form.uih components --target vue --interactive
```

#### watch

```bash
uih watch <input> <output> [options]
```

Watches directory for `.uih` changes and recompiles.

#### ai

```bash
uih ai <prompt>

Examples:
  uih ai "login form with email and password"
  uih ai "dashboard with sidebar and cards"
```

**Requires**: `ANTHROPIC_API_KEY` environment variable

---

## MCP Server Integration

### Setup

**Configure** `~/.claude/mcp_settings.json`:

```json
{
  "mcpServers": {
    "uih": {
      "command": "/absolute/path/to/uih/packages/mcp-server/bin/uih-mcp-server.js"
    }
  }
}
```

### MCP Tools

#### get_uih_guide

```typescript
{ section?: "full" | "syntax" | "examples" | "components" | "styling" }
```

Returns UIH documentation.

#### compile_uih

```typescript
{
  uih_code: string;
  target?: "react" | "vue" | "svelte";
  interactive?: boolean;
  features?: ("validation" | "api" | "animation" | "modal" | "tabs")[];
  output_file?: string;
}
```

Returns generated framework code.

---

## VSCode Extension

### Features

- **Live Preview**: Real-time UI rendering
- **Syntax Highlighting**: UIH language support
- **AI Generation**: Generate from prompts
- **Multi-Framework**: Switch React/Vue/Svelte

### Commands

- `UIH: Open Preview` - Live preview panel
- `UIH: Generate from Prompt` - AI generation
- `UIH: Switch Preview Framework` - Toggle framework

---

## API Documentation

### Parser API

```typescript
import { parse } from "uih-parser";

const ast = parse(uihCode);
// Returns: UIHFile
```

### Codegen API

```typescript
import { createReactPlugin } from "uih-codegen-react";

const plugin = createReactPlugin();
const code = await plugin.generate(ast);
```

### Interactive Templates API

```typescript
import { detectFeatures } from "uih-codegen-react";

const features = detectFeatures(ast);
const code = await plugin.generate(ast, { interactive: true });
```

---

## Development

### Setup

```bash
git clone https://github.com/LeeJaeBae/uih.git
cd uih
pnpm install
pnpm build
```

### Build

```bash
# All packages
pnpm build

# Specific package
pnpm --filter uih-parser build
pnpm --filter uih-codegen-react build
pnpm --filter uih-cli build
```

### Testing

```bash
# All tests
pnpm test

# Specific package
pnpm --filter uih-parser test
```

### Adding a Component

**1. Edit** `packages/codegen-react/src/core-registry.ts`:

```typescript
export const coreRegistry = {
  MyComponent: {
    import: ``,
    render: (p, children) => `<my-component ${propStr(p)}>${children}</my-component>`,
  },
};
```

**2. Build**:

```bash
pnpm --filter uih-codegen-react build
```

**3. Use**:

```uih
layout {
  MyComponent(class:"custom") { "Content" }
}
```

### Publishing

```bash
pnpm -r exec npm version patch
pnpm --filter uih-parser publish
pnpm --filter uih-codegen-react publish
pnpm --filter uih-cli publish
```

---

## Troubleshooting

### Common Issues

**Module not found**:
```bash
pnpm install && pnpm build
```

**Tailwind not working**:
```bash
cd playground
pnpm add tailwindcss-animate class-variance-authority clsx tailwind-merge
```

**Prettier fails**:
- Prettier is optional; generation continues
- Install if needed: `pnpm add prettier`

---

## Roadmap

### v0.9.0 (Q1 2025)
- Component marketplace
- Figma plugin
- Real-time collaboration
- 30+ shadcn components

### v1.0.0 (Q2 2025)
- Stable API
- 50+ shadcn components
- Advanced animations
- Testing framework

---

## License

MIT License

## Links

- **GitHub**: https://github.com/LeeJaeBae/uih
- **Issues**: https://github.com/LeeJaeBae/uih/issues
- **Documentation**: https://github.com/LeeJaeBae/uih/tree/main/docs
