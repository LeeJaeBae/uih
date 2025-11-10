# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIH (Universal UI Hierarchy) is a meta-language that bridges human-written interface descriptions and AI-generated components. The project compiles `.uih` files into framework-specific code (React, Vue, and Svelte).

## Repository Structure

This is a pnpm monorepo with three workspace packages:

```
packages/
├── parser/          # Core UIH language parser (AST generation)
├── codegen-react/   # React code generator (AST → JSX)
└── cli/             # Command-line interface (user-facing tool)
```

**Dependency Flow**: `cli` → `codegen-react` → `parser`

All packages use workspace protocol (`workspace:*`) for internal dependencies.

## Development Commands

### Build
```bash
pnpm build              # Build all packages in dependency order
pnpm --filter <pkg> build   # Build specific package
```

### Testing
```bash
pnpm test               # Run all tests (currently only parser has vitest setup)
pnpm --filter uih-parser test  # Run parser tests only
```

### Development
```bash
pnpm dev                # Run CLI in dev mode with examples/booking.uih
```

### CLI Usage
```bash
pnpm build              # Must build first
node packages/cli/dist/index.js compile <input.uih> [outDir] --target <react|vue|svelte>

# Examples
node packages/cli/dist/index.js compile examples/booking.uih out --target react
node packages/cli/dist/index.js compile examples/booking.uih out --target vue
node packages/cli/dist/index.js compile examples/booking.uih out --target svelte
```

## Architecture Details

### Parser (packages/parser)

**Current Implementation**: Regex-based parser (temporary)
- **Known Limitation**: Comment in index.ts:15-19 indicates planned migration to tree-sitter/chevrotain
- Parses 7 block types: `meta`, `style`, `layout`, `motion`, `logic`, `i18n`, `bind`
- Outputs typed AST (see ast.ts for complete type definitions)

**Key Parsing Flow**:
1. Regex captures blocks: `/(meta|style|layout|...)(?:"label")?\{body\}/gm`
2. Each block type has dedicated parser function (parseMeta, parseLayout, etc.)
3. Key-value pairs parsed as: `key: value;`
4. Layout blocks support Element syntax: `Component(props) { children }`

### Codegen-React (packages/codegen-react)

**Component Registry System** (registry.ts):
- Maps UIH element names (Button, Input, Card, Text) to React components
- Each entry defines:
  - `import`: Import statement string
  - `render`: Function that generates JSX string

**Code Generation** (index.ts):
1. Extract Layout block from AST
2. Recursively traverse nodes and emit JSX
3. Collect unique imports
4. Wrap in `export default function Page()` component

**Component Support**: shadcn/ui components + Pure HTML elements (see registry.ts for full list)

### CLI (packages/cli)

**Single Command**: `compile <file.uih> [outDir] --target <framework>`
- Reads .uih file
- Calls parser → codegen pipeline
- Supports three target frameworks: `react`, `vue`, `svelte`
- Writes output to `{outDir}/Page.{tsx|vue|svelte}`
- Logs AST to console for debugging

## UIH Language Structure

Example `.uih` file structure:

```
meta {
  route: "/path";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  radius.card: "16px";
}

layout "centered" {
  Card(id:"demo") { "Content" }
  Input(id:"name", placeholder:"Placeholder")
  Button(variant:"primary"){ "Label" }
}

logic {
  on submit {
    navigate: "/next";
  }
}
```

## Styling System

UIH supports modern styling approaches with Tailwind CSS and CSS variables, designed for AI-friendly code generation.

### Tailwind CSS Support

UIH fully supports Tailwind CSS utility classes through the `class` prop:

**UIH Input**:
```uih
layout {
  Button(class:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded") {
    "Click me"
  }
}
```

**React Output**:
```tsx
<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</Button>
```

**Key Features**:
- `class` prop automatically converted to `className` in React
- Vue and Svelte keep `class` as-is (native support)
- Full Tailwind utility class support
- Works with all components (built-in and imported)

### CSS Variables (Design Tokens)

The `style` block generates CSS variables for design consistency:

**UIH Input**:
```uih
style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
  color.success: "#10b981";
  spacing.card: "1.5rem";
  radius.button: "8px";
}

layout {
  Button(class:"bg-[var(--color-primary)] text-white px-4 py-2") {
    "Primary Button"
  }
}
```

**React Output**:
```tsx
<style dangerouslySetInnerHTML={{ __html: `:root {
  --color-primary: #0E5EF7;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --spacing-card: 1.5rem;
  --radius-button: 8px;
}` }} />

<Button className="bg-[var(--color-primary)] text-white px-4 py-2">
  Primary Button
</Button>
```

**Naming Convention**:
- Dot notation in UIH: `color.primary`, `spacing.card`
- Converted to kebab-case CSS variables: `--color-primary`, `--spacing-card`
- Use with Tailwind's arbitrary value syntax: `bg-[var(--color-primary)]`

### Combining Tailwind and CSS Variables

**Complete Example** (`examples/tailwind-test.uih`):
```uih
meta {
  route: "/demo";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
}

layout {
  Text(class:"text-3xl font-bold text-gray-900 mb-6") {
    "Tailwind + CSS Variables"
  }

  Button(
    class:"bg-[var(--color-primary)] hover:bg-blue-700 text-white px-4 py-2 rounded",
    variant:"primary"
  ) {
    "Primary Button"
  }

  Input(
    placeholder:"Focus to see primary color ring",
    class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
  )
}
```

**Why This Approach?**

This design is optimized for AI code generation:
1. **AI knows Tailwind**: LLMs are trained on Tailwind, no custom syntax needed
2. **Design tokens**: CSS variables provide consistent theming
3. **Full flexibility**: Combine Tailwind utilities with design system variables
4. **Framework agnostic**: Works across React, Vue, and Svelte

### Framework Output

**Vue** (`.vue`):
```vue
<template>
  <button class="bg-[var(--color-primary)] text-white px-4 py-2">
    Button
  </button>
</template>

<style scoped>
:root {
  --color-primary: #0E5EF7;
}
</style>
```

**Svelte** (`.svelte`):
```svelte
<button class="bg-[var(--color-primary)] text-white px-4 py-2">
  Button
</button>

<style>
  :root {
    --color-primary: #0E5EF7;
  }
</style>
```

## Import System (Component Reuse)

UIH supports importing components from other `.uih` files for reuse across your project.

### Syntax

**Single Import**:
```uih
import ComponentName from "./path/to/Component.uih"
```

**Multiple Imports**:
```uih
import Component1, Component2, Component3 from "./components"
```

### Usage Example

**Creating a Reusable Component** (`components/Button.uih`):
```uih
meta {
  route: "/button";
}

state {
  count: 0;
}

layout {
  Button(variant:"primary") { "Click me: {count}" }
}
```

**Importing and Using** (`page.uih`):
```uih
import Button from "./components/Button.uih"

meta {
  route: "/page";
}

layout {
  Text { "My Page" }

  # Use imported component without props
  Button

  # Use imported component with props
  Button(variant:"secondary", size:"large")
}
```

### Key Features

1. **Props Passing**: Pass props to imported components just like built-in components
2. **Path Resolution**: Relative paths supported (e.g., `./components/Button.uih`)
3. **File Extension**: `.uih` extension is automatically stripped in generated code
4. **Framework Support**: Works with React, Vue, and Svelte code generation

### Generated Code

When compiled, imports are transformed to framework-specific syntax:

**React** (`.tsx`):
```tsx
import Button from "./components/Button";

export default function Page() {
  return (
    <>
      <Button variant="secondary" size="large" />
    </>
  );
}
```

**Vue** (`.vue`):
```vue
<script setup lang="ts">
import Button from "./components/Button";
</script>

<template>
  <Button variant="secondary" size="large" />
</template>
```

**Svelte** (`.svelte`):
```svelte
<script lang="ts">
  import Button from "./components/Button";
</script>

<Button variant="secondary" size="large" />
```

### Examples

See `examples/` directory for working examples:
- `examples/import-test.uih` - Single component import
- `examples/multi-import-test.uih` - Multiple component imports
- `examples/props-test.uih` - Props passing to imported components

## Pure HTML Elements Support

UIH supports pure HTML elements for maximum flexibility with Tailwind CSS, eliminating dependency on component libraries.

### Available HTML Elements

**Layout Elements**:
- `Div`, `Section`, `Article`, `Aside`, `Header`, `Footer`, `Nav`, `Main`

**Text Elements**:
- `H1`, `H2`, `H3`, `H4`, `H5`, `H6`, `P`, `Span`

**Form Elements**:
- `Form`, `Input`, `Textarea`, `Button`, `Label`, `Select`, `Option`, `Fieldset`, `Legend`, `Checkbox`, `Radio`

**List Elements**:
- `Ul`, `Ol`, `Li`

**Media Elements**:
- `Video`, `Audio`, `Source`

**Table Elements**:
- `Table`, `Thead`, `Tbody`, `Tfoot`, `Tr`, `Td`, `Th`

**Canvas and SVG**:
- `Canvas`, `Svg`

**Other Elements**:
- `A` (links), `Img` (images)

### Usage Example

**Pure Tailwind with HTML Elements** (`examples/html-test.uih`):
```uih
meta {
  route: "/html-demo";
}

style {
  color.primary: "#6366f1";
  color.accent: "#ec4899";
}

layout {
  Div(class:"bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-8 rounded-3xl mb-8 shadow-2xl") {
    "Pure Tailwind CSS with HTML Elements"
  }

  H1(class:"text-5xl font-extrabold mb-4 text-center") {
    "Welcome"
  }

  P(class:"text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8") {
    "Beautiful UI with pure HTML and Tailwind"
  }

  Form(class:"bg-white p-8 rounded-2xl shadow-xl border border-gray-200") {
    "Contact Form"
  }

  Input(
    placeholder:"Your email",
    class:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
  )

  Button(class:"w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg") {
    "Submit"
  }

  A(href:"https://tailwindcss.com", class:"text-blue-600 hover:text-blue-800 underline") {
    "Visit Tailwind CSS"
  }

  Span(class:"inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800") {
    "Status Badge"
  }
}
```

### Generated Output

**React** (`.tsx`):
```tsx
export default function Page() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `:root {
  --color-primary: #6366f1;
  --color-accent: #ec4899;
}`
      }} />
      <div className="container mx-auto p-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-8 rounded-3xl mb-8 shadow-2xl">
          Pure Tailwind CSS with HTML Elements
        </div>
        <h1 className="text-5xl font-extrabold mb-4 text-center">Welcome</h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Beautiful UI with pure HTML and Tailwind
        </p>
        <form className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          Contact Form
        </form>
        <input
          placeholder="Your email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg">
          Submit
        </button>
        <a href="https://tailwindcss.com" className="text-blue-600 hover:text-blue-800 underline">
          Visit Tailwind CSS
        </a>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
          Status Badge
        </span>
      </div>
    </>
  );
}
```

**Vue** (`.vue`):
```vue
<template>
  <div class="container mx-auto p-6">
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-8 rounded-3xl mb-8 shadow-2xl">
      Pure Tailwind CSS with HTML Elements
    </div>
    <h1 class="text-5xl font-extrabold mb-4 text-center">Welcome</h1>
    <p class="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8">
      Beautiful UI with pure HTML and Tailwind
    </p>
    <form class="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
      Contact Form
    </form>
    <input
      placeholder="Your email"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
    />
    <button class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg">
      Submit
    </button>
    <a href="https://tailwindcss.com" class="text-blue-600 hover:text-blue-800 underline">
      Visit Tailwind CSS
    </a>
    <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
      Status Badge
    </span>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
:root {
  --color-primary: #6366f1;
  --color-accent: #ec4899;
}
</style>
```

### Key Features

1. **No Component Library Required**: Build UIs with pure HTML and Tailwind CSS
2. **Full Tailwind Support**: All Tailwind utility classes work seamlessly
3. **CSS Variables Integration**: Combine design tokens with Tailwind's arbitrary values
4. **Framework Agnostic**: Works consistently across React, Vue, and Svelte
5. **Automatic Prop Conversion**: `class` → `className` (React), `href`, `src`, etc.

### Supported Props

**Common Props** (all elements):
- `id` - Element ID
- `class` - CSS classes (converted to `className` in React)
- `aria-*` - Accessibility attributes (e.g., `aria-label`, `aria-describedby`)
- `data-*` - Custom data attributes
- `role` - ARIA role attribute

**Event Handlers** (all interactive elements):
- `onClick`, `onChange`, `onSubmit`, `onFocus`, `onBlur`, `onInput`, etc.
- Use variable reference syntax: `onClick:"{handleClick}"`

**Element-Specific Props**:
- `A`: `href`, `target`, `rel`
- `Img`: `src`, `alt`, `width`, `height`
- `Form`: `action`, `method`
- `Input` / `Textarea`: `placeholder`, `type`, `value`, `disabled`
- `Video` / `Audio`: `src`, `controls`, `autoplay`, `loop`, `muted`, `width`, `height`
- `Source`: `src`, `type`
- `Table`: `Td` / `Th` support `colspan`, `rowspan`; `Th` supports `scope`
- `Canvas`: `width`, `height`
- `Svg`: `width`, `height`, `viewBox`

### When to Use HTML Elements vs shadcn Components

**Use HTML Elements** when:
- Building custom designs with Tailwind CSS
- Maximum flexibility and control needed
- No component library dependency desired
- Simple, lightweight components required

**Use shadcn Components** when:
- Need pre-built accessible components (Dialog, Tooltip, etc.)
- Want consistent design system out of the box
- Require complex interactions (Tabs, Accordion, etc.)

### Media Elements

UIH supports HTML5 media elements with full control over playback and accessibility.

**Video Player Example**:
```uih
layout {
  Video(
    src:"/videos/tutorial.mp4",
    controls:true,
    class:"w-full rounded-lg shadow-lg",
    aria-label:"Product tutorial video"
  ) {
    Source(src:"/videos/tutorial.webm", type:"video/webm")
    Source(src:"/videos/tutorial.mp4", type:"video/mp4")
    "Your browser does not support the video tag."
  }
}
```

**Generated React**:
```tsx
<video
  src="/videos/tutorial.mp4"
  controls
  className="w-full rounded-lg shadow-lg"
  aria-label="Product tutorial video"
>
  <source src="/videos/tutorial.webm" type="video/webm" />
  <source src="/videos/tutorial.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

**Supported Media Props**:
- `controls` - Show playback controls (boolean)
- `autoplay` - Auto-play on load (boolean)
- `loop` - Loop playback (boolean)
- `muted` - Mute audio (boolean)
- `width`, `height` - Dimensions
- Event handlers: `onPlay`, `onPause`, `onEnded`, etc.

### Table Elements

UIH provides semantic table elements with accessibility support.

**Data Table Example**:
```uih
layout {
  Table(class:"w-full border-collapse border border-gray-300") {
    Thead(class:"bg-gray-100") {
      Tr {
        Th(scope:"col", class:"border border-gray-300 px-4 py-2") { "Name" }
        Th(scope:"col", class:"border border-gray-300 px-4 py-2") { "Email" }
        Th(scope:"col", class:"border border-gray-300 px-4 py-2") { "Role" }
      }
    }
    Tbody {
      Tr(class:"hover:bg-gray-50") {
        Td(class:"border border-gray-300 px-4 py-2") { "John Doe" }
        Td(class:"border border-gray-300 px-4 py-2") { "john@example.com" }
        Td(class:"border border-gray-300 px-4 py-2") { "Admin" }
      }
    }
  }
}
```

**Generated React**:
```tsx
<table className="w-full border-collapse border border-gray-300">
  <thead className="bg-gray-100">
    <tr>
      <th scope="col" className="border border-gray-300 px-4 py-2">Name</th>
      <th scope="col" className="border border-gray-300 px-4 py-2">Email</th>
      <th scope="col" className="border border-gray-300 px-4 py-2">Role</th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 px-4 py-2">John Doe</td>
      <td className="border border-gray-300 px-4 py-2">john@example.com</td>
      <td className="border border-gray-300 px-4 py-2">Admin</td>
    </tr>
  </tbody>
</table>
```

**Table Accessibility Features**:
- `scope` attribute on `<th>` for screen readers
- `colspan` and `rowspan` for cell spanning
- Semantic structure with `Thead`, `Tbody`, `Tfoot`

### Event Handlers and Interactivity

UIH supports all standard DOM event handlers with framework-specific syntax generation.

**Interactive Form Example**:
```uih
layout {
  Form(onSubmit:"{handleSubmit}", class:"space-y-4") {
    Input(
      placeholder:"Enter email",
      onChange:"{handleEmailChange}",
      onFocus:"{handleFocus}",
      class:"w-full px-4 py-2 border rounded-lg"
    )

    Button(
      onClick:"{handleClick}",
      class:"bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
    ) {
      "Submit"
    }
  }
}
```

**Generated React**:
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <input
    placeholder="Enter email"
    onChange={handleEmailChange}
    onFocus={handleFocus}
    className="w-full px-4 py-2 border rounded-lg"
  />
  <button
    onClick={handleClick}
    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
  >
    Submit
  </button>
</form>
```

**Generated Vue**:
```vue
<template>
  <form :onSubmit="handleSubmit" class="space-y-4">
    <input
      placeholder="Enter email"
      :onChange="handleEmailChange"
      :onFocus="handleFocus"
      class="w-full px-4 py-2 border rounded-lg"
    />
    <button
      :onClick="handleClick"
      class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
    >
      Submit
    </button>
  </form>
</template>
```

**Supported Event Handlers**:
- Mouse: `onClick`, `onDoubleClick`, `onMouseEnter`, `onMouseLeave`
- Form: `onChange`, `onSubmit`, `onInput`, `onFocus`, `onBlur`
- Keyboard: `onKeyDown`, `onKeyUp`, `onKeyPress`
- Media: `onPlay`, `onPause`, `onEnded`, `onVolumeChange`
- All handlers use variable reference syntax: `onClick:"{handlerName}"`

### Accessibility Features

UIH provides comprehensive accessibility support through ARIA attributes and semantic HTML.

**Accessible Button Example**:
```uih
layout {
  Button(
    onClick:"{handleClose}",
    aria-label:"Close dialog",
    aria-pressed:"false",
    role:"button",
    class:"p-2 rounded-full hover:bg-gray-100"
  ) {
    "×"
  }
}
```

**Generated React**:
```tsx
<button
  onClick={handleClose}
  aria-label="Close dialog"
  aria-pressed="false"
  role="button"
  className="p-2 rounded-full hover:bg-gray-100"
>
  ×
</button>
```

**Accessible Form with Labels**:
```uih
layout {
  Fieldset(class:"border border-gray-300 rounded-lg p-4") {
    Legend(class:"text-lg font-semibold px-2") { "User Information" }

    Label(class:"block mb-2") {
      "Email Address"
      Input(
        type:"email",
        aria-required:"true",
        aria-describedby:"email-help",
        class:"w-full px-3 py-2 border rounded"
      )
    }

    Span(id:"email-help", class:"text-sm text-gray-600") {
      "We'll never share your email"
    }
  }
}
```

**Supported ARIA Attributes**:
- `aria-label` - Accessible name for screen readers
- `aria-describedby` - Reference to description element
- `aria-required` - Indicate required fields
- `aria-pressed` - Button toggle state
- `aria-expanded` - Expandable element state
- `aria-hidden` - Hide from screen readers
- `role` - Explicit ARIA role override
- `data-*` - Custom data attributes for JavaScript hooks

**Framework-Specific Output**:
- **React**: All attributes passed as-is
- **Vue**: ARIA attributes work natively
- **Svelte**: Full ARIA support without conversion

## Important Build Details

- **Build Tool**: tsup (not tsc) for all packages
- **Output**: Dual format (ESM + CJS)
  - Parser: dist/index.cjs + dist/index.d.ts
  - Codegen: dist/index.js + dist/index.d.ts
  - CLI: dist/index.js (executable)
- **TypeScript Config**: Shared via tsconfig.base.json with path aliases
- **Module Resolution**: NodeNext (requires .js extensions in imports)

## File Locations

- **Source**: `packages/*/src/*.ts`
- **Built Output**: `packages/*/dist/`
- **Examples**: `examples/*.uih`
  - `examples/booking.uih` - Basic form example
  - `examples/simple-tailwind.uih` - Basic Tailwind example
  - `examples/tailwind-test.uih` - Comprehensive styling showcase
  - `examples/html-test.uih` - Pure HTML elements with Tailwind CSS
  - `examples/import-test.uih` - Component import examples
- **Generated Code**:
  - React: `out/Page.tsx`
  - Vue: `out/Page.vue`
  - Svelte: `out/Page.svelte`

## Commit Convention

This project follows a structured commit convention for clarity and maintainability.

### Format

```
<type>(<scope>): <subject>

[optional body]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `parser` | Parser logic changes | `parser: support nested layout blocks` |
| `codegen` | Code generation changes | `codegen: add Vue.js generator` |
| `cli` | CLI tool changes | `cli: add watch command` |
| `lang` | UIH language spec changes | `lang: add data block type` |
| `registry` | Component registry changes | `registry: add Dialog component mapping` |
| `test` | Test additions/changes | `test: add parser unit tests` |
| `docs` | Documentation only | `docs: update README with examples` |
| `build` | Build system changes | `build: optimize tsup config` |
| `chore` | Maintenance tasks | `chore: update dependencies` |

### Scope (Optional)

Specific package or area affected:
- `parser` - packages/parser
- `codegen` - packages/codegen-react
- `cli` - packages/cli
- `examples` - examples directory

### Examples

**Good**:
```
parser: add support for nested elements in layout blocks
codegen(registry): add Tooltip and Dialog components
cli: implement --watch flag for auto-recompilation
test(parser): add unit tests for motion block parsing
```

**Bad**:
```
fix bug
update code
changes
improved parser
```

### Rules

1. **Subject Line**:
   - Use imperative mood ("add" not "added" or "adds")
   - No period at the end
   - Keep under 72 characters
   - Be specific about what changed

2. **Body** (when needed):
   - Explain WHY the change was made
   - Include breaking changes if any
   - Reference issues if applicable

3. **Commit Frequency**:
   - Commit when a logical unit is complete
   - Don't batch unrelated changes
   - Each commit should pass tests (when tests exist)

## Architecture Highlights

1. **Chevrotain Parser**: Production-ready CST parser with full nested structure support (parser/src/parser-chevrotain.ts)
   - Supports all block types: Meta, Style, Layout, Motion, Logic, I18n, Bind, State, Data
   - Full support for conditionals (if/else), loops (for/in), and nested elements
   - Proper error reporting with line/column information

2. **Plugin System**: Framework-agnostic code generation architecture (codegen-react/src/plugin.ts)
   - Extensible plugin registry for multiple frameworks
   - React, Vue, and Svelte plugins with feature parity
   - Prettier integration for code formatting

3. **Type Safety**: Comprehensive AST type definitions (parser/src/ast.ts)
   - Strongly typed AST nodes for all language constructs
   - Type-safe code generation with minimal `any` usage

4. **Component Registry**: Extensive component support
   - shadcn/ui components integration
   - Pure HTML elements (25+ elements: Div, H1-H6, Form, Input, Button, etc.)
   - Custom component imports from .uih files

## Known Issues & TODOs

1. **Component Support Expanded**: Registry now includes shadcn/ui components + pure HTML elements (Div, H1-H6, Form, A, Img, etc.)
2. **Type Safety**: Few remaining `any` types in codegen registry for backwards compatibility (to be improved in v0.8.0)
