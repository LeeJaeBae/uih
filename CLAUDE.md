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

## AI Code Generation Guidelines

### Natural Language to UIH Conversion

UIH is designed for AI-assisted code generation. When users request UI components in natural language, follow this systematic conversion process:

#### Conversion Process

**Input**: Natural language description (e.g., "로그인 페이지 만들어줘")

**Analysis Steps**:
1. **Identify Components**: Determine which components are needed (Form, Input, Button, Card, etc.)
2. **Determine Layout**: Decide on layout structure (centered, grid, flex, stack)
3. **Apply Design System**: Use Tailwind classes and CSS variables for styling
4. **Add Interactivity**: Include event handlers and state management if needed

**Output**: Complete `.uih` file with all necessary blocks

#### 20 Real-World Patterns

##### 1. Login Page (로그인 페이지)
```uih
meta {
  route: "/login";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50") {
    Card(class:"w-full max-w-md p-8 space-y-6") {
      H2(class:"text-3xl font-bold text-center") { "로그인" }

      Form(class:"space-y-4") {
        Div(class:"space-y-2") {
          Label { "이메일" }
          Input(
            type:"email",
            placeholder:"your@email.com",
            class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
          )
        }

        Div(class:"space-y-2") {
          Label { "비밀번호" }
          Input(
            type:"password",
            placeholder:"••••••••",
            class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
          )
        }

        Button(
          class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        ) {
          "로그인"
        }
      }

      P(class:"text-center text-sm text-gray-600") {
        "계정이 없으신가요? "
        A(href:"/signup", class:"text-[var(--color-primary)] hover:underline") {
          "회원가입"
        }
      }
    }
  }
}
```

##### 2. Dashboard (대시보드)
```uih
meta {
  route: "/dashboard";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.success: "#10b981";
  color.warning: "#f59e0b";
  color.danger: "#ef4444";
}

layout {
  Div(class:"min-h-screen bg-gray-50") {
    # Header
    Header(class:"bg-white border-b px-6 py-4") {
      Div(class:"flex items-center justify-between") {
        H1(class:"text-2xl font-bold") { "대시보드" }
        Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg") {
          "새 프로젝트"
        }
      }
    }

    # Main Content
    Main(class:"p-6") {
      # Stats Grid
      Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8") {
        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "총 사용자" }
              H3(class:"text-3xl font-bold mt-2") { "2,543" }
            }
            Div(class:"w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "👥" }
            }
          }
        }

        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "매출" }
              H3(class:"text-3xl font-bold mt-2") { "₩1.2M" }
            }
            Div(class:"w-12 h-12 bg-green-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "💰" }
            }
          }
        }

        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "진행 중" }
              H3(class:"text-3xl font-bold mt-2") { "12" }
            }
            Div(class:"w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "📊" }
            }
          }
        }

        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "완료" }
              H3(class:"text-3xl font-bold mt-2") { "89" }
            }
            Div(class:"w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "✅" }
            }
          }
        }
      }

      # Recent Activity
      Card(class:"p-6 bg-white rounded-xl shadow-sm") {
        H2(class:"text-xl font-bold mb-4") { "최근 활동" }
        Div(class:"space-y-4") {
          Div(class:"flex items-center gap-4 p-4 bg-gray-50 rounded-lg") {
            Span(class:"text-2xl") { "🎉" }
            Div {
              P(class:"font-semibold") { "새 프로젝트 완료" }
              P(class:"text-sm text-gray-600") { "2시간 전" }
            }
          }
        }
      }
    }
  }
}
```

##### 3. Registration Form (회원가입 폼)
```uih
meta {
  route: "/signup";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50 py-12") {
    Card(class:"w-full max-w-2xl p-8") {
      H2(class:"text-3xl font-bold text-center mb-8") { "회원가입" }

      Form(class:"space-y-6") {
        # Personal Info
        Div(class:"grid grid-cols-1 md:grid-cols-2 gap-4") {
          Div(class:"space-y-2") {
            Label { "이름" }
            Input(
              type:"text",
              placeholder:"홍길동",
              class:"w-full px-4 py-2 border rounded-lg"
            )
          }

          Div(class:"space-y-2") {
            Label { "생년월일" }
            Input(
              type:"date",
              class:"w-full px-4 py-2 border rounded-lg"
            )
          }
        }

        # Contact
        Div(class:"space-y-2") {
          Label { "이메일" }
          Input(
            type:"email",
            placeholder:"your@email.com",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        Div(class:"space-y-2") {
          Label { "전화번호" }
          Input(
            type:"tel",
            placeholder:"010-1234-5678",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        # Password
        Div(class:"space-y-2") {
          Label { "비밀번호" }
          Input(
            type:"password",
            placeholder:"8자 이상 입력하세요",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        Div(class:"space-y-2") {
          Label { "비밀번호 확인" }
          Input(
            type:"password",
            placeholder:"비밀번호를 다시 입력하세요",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        # Terms
        Div(class:"flex items-start gap-3") {
          Input(type:"checkbox", class:"mt-1")
          Label(class:"text-sm text-gray-600") {
            "이용약관 및 개인정보 처리방침에 동의합니다"
          }
        }

        Button(
          class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        ) {
          "가입하기"
        }
      }
    }
  }
}
```

##### 4. Landing Page Hero (랜딩 페이지 히어로)
```uih
meta {
  route: "/";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.accent: "#ec4899";
}

layout {
  Section(class:"min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50") {
    Div(class:"container mx-auto px-6 py-20") {
      Div(class:"text-center max-w-4xl mx-auto") {
        # Badge
        Span(class:"inline-block px-4 py-2 bg-blue-100 text-[var(--color-primary)] rounded-full text-sm font-semibold mb-6") {
          "🚀 New Release"
        }

        # Heading
        H1(class:"text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent") {
          "UI를 더 빠르게 만드세요"
        }

        # Subheading
        P(class:"text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto") {
          "UIH로 자연어를 React, Vue, Svelte 코드로 변환하세요"
        }

        # CTA Buttons
        Div(class:"flex flex-col sm:flex-row gap-4 justify-center mb-16") {
          Button(class:"px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-blue-700 font-semibold text-lg") {
            "무료로 시작하기"
          }
          Button(class:"px-8 py-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 font-semibold text-lg") {
            "데모 보기"
          }
        }

        # Social Proof
        Div(class:"flex items-center justify-center gap-8 text-sm text-gray-600") {
          Div(class:"flex items-center gap-2") {
            Span(class:"text-2xl") { "⭐" }
            Span { "4.9/5.0" }
          }
          Div(class:"flex items-center gap-2") {
            Span(class:"text-2xl") { "👥" }
            Span { "10,000+ 사용자" }
          }
          Div(class:"flex items-center gap-2") {
            Span(class:"text-2xl") { "🚀" }
            Span { "50,000+ 프로젝트" }
          }
        }
      }
    }
  }
}
```

##### 5. Product Card Grid (상품 카드 그리드)
```uih
meta {
  route: "/products";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold mb-8") { "인기 상품" }

    Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6") {
      # Product Card 1
      Card(class:"bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden") {
        Img(
          src:"/product1.jpg",
          alt:"Product 1",
          class:"w-full h-48 object-cover"
        )
        Div(class:"p-6") {
          H3(class:"text-xl font-bold mb-2") { "프리미엄 헤드폰" }
          P(class:"text-gray-600 mb-4") { "최고의 음질을 경험하세요" }
          Div(class:"flex items-center justify-between") {
            Span(class:"text-2xl font-bold text-[var(--color-primary)]") { "₩199,000" }
            Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
              "구매하기"
            }
          }
        }
      }

      # More product cards...
    }
  }
}
```

##### 6. Settings Page (설정 페이지)
```uih
meta {
  route: "/settings";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-3xl font-bold mb-8") { "설정" }

    Div(class:"grid grid-cols-1 lg:grid-cols-4 gap-8") {
      # Sidebar
      Nav(class:"space-y-2") {
        Button(class:"w-full text-left px-4 py-3 bg-blue-50 text-[var(--color-primary)] rounded-lg font-semibold") {
          "프로필"
        }
        Button(class:"w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg") {
          "계정"
        }
        Button(class:"w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg") {
          "알림"
        }
        Button(class:"w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg") {
          "보안"
        }
      }

      # Content
      Div(class:"lg:col-span-3") {
        Card(class:"p-8 bg-white rounded-xl shadow-sm") {
          H2(class:"text-2xl font-bold mb-6") { "프로필 설정" }

          Form(class:"space-y-6") {
            Div(class:"flex items-center gap-6 mb-6") {
              Div(class:"w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl") {
                "👤"
              }
              Button(class:"px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50") {
                "사진 변경"
              }
            }

            Div(class:"space-y-2") {
              Label { "이름" }
              Input(
                type:"text",
                value:"홍길동",
                class:"w-full px-4 py-2 border rounded-lg"
              )
            }

            Div(class:"space-y-2") {
              Label { "이메일" }
              Input(
                type:"email",
                value:"hong@example.com",
                class:"w-full px-4 py-2 border rounded-lg"
              )
            }

            Div(class:"space-y-2") {
              Label { "자기소개" }
              Textarea(
                placeholder:"자신을 소개해주세요",
                class:"w-full px-4 py-2 border rounded-lg h-32"
              )
            }

            Button(
              class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-semibold"
            ) {
              "변경사항 저장"
            }
          }
        }
      }
    }
  }
}
```

##### 7. Blog Post (블로그 글)
```uih
meta {
  route: "/blog/post";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Article(class:"max-w-4xl mx-auto px-6 py-12") {
    # Header
    Header(class:"mb-12") {
      Span(class:"inline-block px-3 py-1 bg-blue-100 text-[var(--color-primary)] rounded-full text-sm font-semibold mb-4") {
        "기술"
      }
      H1(class:"text-5xl font-bold mb-4") {
        "UIH로 UI 개발 속도를 10배 높이는 방법"
      }
      Div(class:"flex items-center gap-4 text-gray-600") {
        Img(
          src:"/avatar.jpg",
          alt:"Author",
          class:"w-12 h-12 rounded-full"
        )
        Div {
          P(class:"font-semibold") { "홍길동" }
          P(class:"text-sm") { "2024년 1월 10일 · 5분 읽기" }
        }
      }
    }

    # Featured Image
    Img(
      src:"/blog-hero.jpg",
      alt:"Blog featured image",
      class:"w-full h-96 object-cover rounded-2xl mb-12"
    )

    # Content
    Div(class:"prose prose-lg max-w-none") {
      P(class:"text-xl text-gray-700 leading-relaxed mb-6") {
        "현대 웹 개발에서 UI 구현은 반복적이고 시간이 많이 소요되는 작업입니다. UIH는 이 문제를 해결하기 위해 만들어졌습니다."
      }

      H2(class:"text-3xl font-bold mt-12 mb-6") {
        "UIH란 무엇인가?"
      }

      P(class:"text-gray-700 leading-relaxed mb-6") {
        "UIH (Universal UI Hierarchy)는 자연어와 유사한 메타 언어로 UI를 정의하고, React, Vue, Svelte 코드로 자동 변환하는 도구입니다."
      }

      # Code Example
      Div(class:"bg-gray-900 text-gray-100 p-6 rounded-xl my-8 font-mono text-sm") {
        "layout {\n  Button(variant:\"primary\") { \"Click me\" }\n}"
      }
    }
  }
}
```

##### 8. Contact Form (문의 양식)
```uih
meta {
  route: "/contact";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen bg-gray-50 py-12") {
    Div(class:"container mx-auto px-6") {
      Div(class:"max-w-2xl mx-auto") {
        H1(class:"text-4xl font-bold text-center mb-4") { "문의하기" }
        P(class:"text-center text-gray-600 mb-12") {
          "궁금한 점이 있으시면 언제든지 연락주세요"
        }

        Card(class:"p-8 bg-white rounded-xl shadow-sm") {
          Form(class:"space-y-6") {
            Div(class:"grid grid-cols-1 md:grid-cols-2 gap-6") {
              Div(class:"space-y-2") {
                Label { "이름" }
                Input(
                  type:"text",
                  placeholder:"홍길동",
                  class:"w-full px-4 py-2 border rounded-lg"
                )
              }

              Div(class:"space-y-2") {
                Label { "이메일" }
                Input(
                  type:"email",
                  placeholder:"your@email.com",
                  class:"w-full px-4 py-2 border rounded-lg"
                )
              }
            }

            Div(class:"space-y-2") {
              Label { "제목" }
              Input(
                type:"text",
                placeholder:"문의 제목",
                class:"w-full px-4 py-2 border rounded-lg"
              )
            }

            Div(class:"space-y-2") {
              Label { "메시지" }
              Textarea(
                placeholder:"문의 내용을 입력하세요",
                class:"w-full px-4 py-2 border rounded-lg h-40"
              )
            }

            Button(
              class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            ) {
              "보내기"
            }
          }
        }

        # Contact Info
        Div(class:"mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center") {
          Div {
            Div(class:"text-4xl mb-2") { "📧" }
            P(class:"font-semibold") { "이메일" }
            P(class:"text-gray-600 text-sm") { "support@example.com" }
          }
          Div {
            Div(class:"text-4xl mb-2") { "📞" }
            P(class:"font-semibold") { "전화" }
            P(class:"text-gray-600 text-sm") { "02-1234-5678" }
          }
          Div {
            Div(class:"text-4xl mb-2") { "📍" }
            P(class:"font-semibold") { "주소" }
            P(class:"text-gray-600 text-sm") { "서울시 강남구" }
          }
        }
      }
    }
  }
}
```

##### 9. Pricing Table (가격 테이블)
```uih
meta {
  route: "/pricing";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen bg-gray-50 py-20") {
    Div(class:"container mx-auto px-6") {
      # Header
      Div(class:"text-center mb-16") {
        H1(class:"text-5xl font-bold mb-4") { "간단하고 투명한 가격" }
        P(class:"text-xl text-gray-600") {
          "프로젝트 규모에 맞는 플랜을 선택하세요"
        }
      }

      # Pricing Cards
      Div(class:"grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto") {
        # Free Plan
        Card(class:"p-8 bg-white rounded-2xl shadow-sm border-2 border-gray-200") {
          H3(class:"text-2xl font-bold mb-2") { "무료" }
          Div(class:"mb-6") {
            Span(class:"text-5xl font-bold") { "₩0" }
            Span(class:"text-gray-600") { "/월" }
          }
          Ul(class:"space-y-4 mb-8") {
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "3개 프로젝트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "기본 컴포넌트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "커뮤니티 지원" }
            }
          }
          Button(class:"w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold") {
            "시작하기"
          }
        }

        # Pro Plan (Featured)
        Card(class:"p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl transform scale-105") {
          Span(class:"inline-block px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-semibold mb-4") {
            "인기"
          }
          H3(class:"text-2xl font-bold mb-2") { "프로" }
          Div(class:"mb-6") {
            Span(class:"text-5xl font-bold") { "₩29,000" }
            Span(class:"text-blue-100") { "/월" }
          }
          Ul(class:"space-y-4 mb-8") {
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "무제한 프로젝트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "모든 컴포넌트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "우선 지원" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "고급 기능" }
            }
          }
          Button(class:"w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold") {
            "지금 시작"
          }
        }

        # Enterprise Plan
        Card(class:"p-8 bg-white rounded-2xl shadow-sm border-2 border-gray-200") {
          H3(class:"text-2xl font-bold mb-2") { "엔터프라이즈" }
          Div(class:"mb-6") {
            Span(class:"text-5xl font-bold") { "맞춤" }
          }
          Ul(class:"space-y-4 mb-8") {
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "모든 Pro 기능" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "전담 지원" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "온프레미스" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "SLA 보장" }
            }
          }
          Button(class:"w-full py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-blue-50 font-semibold") {
            "문의하기"
          }
        }
      }
    }
  }
}
```

##### 10. Modal/Dialog (모달/다이얼로그)
```uih
meta {
  route: "/modal-demo";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg") {
      "모달 열기"
    }

    # Modal Overlay
    Div(class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6") {
      # Modal Content
      Div(class:"bg-white rounded-2xl shadow-2xl max-w-md w-full") {
        # Header
        Div(class:"flex items-center justify-between p-6 border-b") {
          H2(class:"text-2xl font-bold") { "알림" }
          Button(class:"text-gray-400 hover:text-gray-600 text-2xl") {
            "×"
          }
        }

        # Body
        Div(class:"p-6") {
          P(class:"text-gray-700 mb-4") {
            "정말로 이 작업을 진행하시겠습니까?"
          }
          P(class:"text-sm text-gray-500") {
            "이 작업은 되돌릴 수 없습니다."
          }
        }

        # Footer
        Div(class:"flex gap-3 p-6 border-t") {
          Button(class:"flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50") {
            "취소"
          }
          Button(class:"flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700") {
            "확인"
          }
        }
      }
    }
  }
}
```

##### 11. Navigation Menu (네비게이션 메뉴)
```uih
meta {
  route: "/";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Nav(class:"bg-white border-b sticky top-0 z-50") {
    Div(class:"container mx-auto px-6 py-4") {
      Div(class:"flex items-center justify-between") {
        # Logo
        A(href:"/", class:"flex items-center gap-2") {
          Span(class:"text-2xl font-bold text-[var(--color-primary)]") { "UIH" }
        }

        # Desktop Menu
        Div(class:"hidden md:flex items-center gap-8") {
          A(href:"/features", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
            "기능"
          }
          A(href:"/pricing", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
            "가격"
          }
          A(href:"/docs", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
            "문서"
          }
          A(href:"/blog", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
            "블로그"
          }
        }

        # CTA
        Div(class:"flex items-center gap-4") {
          Button(class:"hidden md:block px-4 py-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg") {
            "로그인"
          }
          Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
            "시작하기"
          }
        }

        # Mobile Menu Button
        Button(class:"md:hidden text-2xl") {
          "☰"
        }
      }
    }
  }
}
```

##### 12. Footer (푸터)
```uih
meta {
  route: "/";
  theme: "light";
}

layout {
  Footer(class:"bg-gray-900 text-gray-300 py-16") {
    Div(class:"container mx-auto px-6") {
      Div(class:"grid grid-cols-1 md:grid-cols-4 gap-12 mb-12") {
        # Company
        Div {
          H3(class:"text-white text-xl font-bold mb-4") { "UIH" }
          P(class:"text-sm mb-4") {
            "UI 개발을 더 빠르고 쉽게 만드는 메타 언어"
          }
          Div(class:"flex gap-4 text-2xl") {
            A(href:"#", class:"hover:text-white") { "🐙" }
            A(href:"#", class:"hover:text-white") { "🐦" }
            A(href:"#", class:"hover:text-white") { "📘" }
          }
        }

        # Product
        Div {
          H4(class:"text-white font-semibold mb-4") { "제품" }
          Ul(class:"space-y-2 text-sm") {
            Li { A(href:"/features", class:"hover:text-white") { "기능" } }
            Li { A(href:"/pricing", class:"hover:text-white") { "가격" } }
            Li { A(href:"/docs", class:"hover:text-white") { "문서" } }
            Li { A(href:"/examples", class:"hover:text-white") { "예제" } }
          }
        }

        # Resources
        Div {
          H4(class:"text-white font-semibold mb-4") { "리소스" }
          Ul(class:"space-y-2 text-sm") {
            Li { A(href:"/blog", class:"hover:text-white") { "블로그" } }
            Li { A(href:"/guides", class:"hover:text-white") { "가이드" } }
            Li { A(href:"/community", class:"hover:text-white") { "커뮤니티" } }
            Li { A(href:"/support", class:"hover:text-white") { "지원" } }
          }
        }

        # Company
        Div {
          H4(class:"text-white font-semibold mb-4") { "회사" }
          Ul(class:"space-y-2 text-sm") {
            Li { A(href:"/about", class:"hover:text-white") { "소개" } }
            Li { A(href:"/careers", class:"hover:text-white") { "채용" } }
            Li { A(href:"/contact", class:"hover:text-white") { "연락처" } }
            Li { A(href:"/privacy", class:"hover:text-white") { "개인정보" } }
          }
        }
      }

      # Copyright
      Div(class:"border-t border-gray-800 pt-8 text-center text-sm") {
        P { "© 2024 UIH. All rights reserved." }
      }
    }
  }
}
```

##### 13. Image Gallery (이미지 갤러리)
```uih
meta {
  route: "/gallery";
  theme: "light";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold mb-8") { "갤러리" }

    Div(class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4") {
      Div(class:"relative group overflow-hidden rounded-xl cursor-pointer") {
        Img(
          src:"/image1.jpg",
          alt:"Gallery image 1",
          class:"w-full h-64 object-cover transition-transform group-hover:scale-110"
        )
        Div(class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center") {
          Span(class:"text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity") {
            "🔍"
          }
        }
      }

      # More gallery items...
    }
  }
}
```

##### 14. User Profile Card (사용자 프로필 카드)
```uih
meta {
  route: "/profile";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    Card(class:"max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden") {
      # Cover Image
      Div(class:"h-48 bg-gradient-to-r from-blue-600 to-purple-600")

      # Profile Info
      Div(class:"px-8 pb-8") {
        # Avatar
        Div(class:"flex items-end justify-between -mt-20 mb-6") {
          Img(
            src:"/avatar.jpg",
            alt:"Profile",
            class:"w-32 h-32 rounded-full border-4 border-white shadow-lg"
          )
          Button(class:"px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
            "팔로우"
          }
        }

        # Details
        Div(class:"mb-6") {
          H2(class:"text-3xl font-bold mb-2") { "홍길동" }
          P(class:"text-gray-600 mb-4") { "@gildonghong" }
          P(class:"text-gray-700 leading-relaxed") {
            "프론트엔드 개발자 | React & Vue 전문가 | UIH 컨트리뷰터"
          }
        }

        # Stats
        Div(class:"flex gap-8 mb-6") {
          Div(class:"text-center") {
            P(class:"text-2xl font-bold") { "1.2K" }
            P(class:"text-sm text-gray-600") { "팔로워" }
          }
          Div(class:"text-center") {
            P(class:"text-2xl font-bold") { "567" }
            P(class:"text-sm text-gray-600") { "팔로잉" }
          }
          Div(class:"text-center") {
            P(class:"text-2xl font-bold") { "89" }
            P(class:"text-sm text-gray-600") { "프로젝트" }
          }
        }

        # Badges
        Div(class:"flex flex-wrap gap-2") {
          Span(class:"px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm") { "React" }
          Span(class:"px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm") { "Vue" }
          Span(class:"px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm") { "TypeScript" }
          Span(class:"px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm") { "Tailwind" }
        }
      }
    }
  }
}
```

##### 15. Timeline (타임라인)
```uih
meta {
  route: "/timeline";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold mb-12 text-center") { "회사 연혁" }

    Div(class:"max-w-4xl mx-auto relative") {
      # Timeline Line
      Div(class:"absolute left-8 top-0 bottom-0 w-1 bg-gray-200")

      # Timeline Items
      Div(class:"space-y-12 relative") {
        # Item 1
        Div(class:"flex gap-8") {
          Div(class:"flex-shrink-0 w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl z-10") {
            "1"
          }
          Card(class:"flex-1 p-6 bg-white rounded-xl shadow-sm") {
            Span(class:"text-sm text-gray-500") { "2024년 1월" }
            H3(class:"text-2xl font-bold my-2") { "UIH v1.0 출시" }
            P(class:"text-gray-700") {
              "React, Vue, Svelte 지원과 함께 정식 버전 출시"
            }
          }
        }

        # Item 2
        Div(class:"flex gap-8") {
          Div(class:"flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10") {
            "2"
          }
          Card(class:"flex-1 p-6 bg-white rounded-xl shadow-sm") {
            Span(class:"text-sm text-gray-500") { "2023년 11월" }
            H3(class:"text-2xl font-bold my-2") { "베타 테스트" }
            P(class:"text-gray-700") {
              "1,000명 이상의 개발자가 베타 테스트 참여"
            }
          }
        }

        # More items...
      }
    }
  }
}
```

##### 16. FAQ Accordion (FAQ 아코디언)
```uih
meta {
  route: "/faq";
  theme: "light";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold text-center mb-12") { "자주 묻는 질문" }

    Div(class:"max-w-3xl mx-auto space-y-4") {
      # FAQ Item 1
      Div(class:"bg-white rounded-xl shadow-sm border border-gray-200") {
        Button(class:"w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50") {
          Span(class:"font-semibold text-lg") { "UIH는 무엇인가요?" }
          Span(class:"text-2xl") { "+" }
        }
        Div(class:"px-6 pb-4 text-gray-700") {
          P {
            "UIH는 자연어와 유사한 메타 언어로 UI를 정의하고, React, Vue, Svelte 코드로 자동 변환하는 도구입니다."
          }
        }
      }

      # FAQ Item 2
      Div(class:"bg-white rounded-xl shadow-sm border border-gray-200") {
        Button(class:"w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50") {
          Span(class:"font-semibold text-lg") { "어떤 프레임워크를 지원하나요?" }
          Span(class:"text-2xl") { "+" }
        }
      }

      # More FAQ items...
    }
  }
}
```

##### 17. Loading States (로딩 상태)
```uih
meta {
  route: "/loading";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-3xl font-bold mb-8") { "로딩 상태" }

    Div(class:"space-y-8") {
      # Spinner
      Div(class:"flex items-center gap-4") {
        Div(class:"w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin")
        Span { "로딩 중..." }
      }

      # Progress Bar
      Div(class:"w-full bg-gray-200 rounded-full h-3 overflow-hidden") {
        Div(class:"h-full bg-[var(--color-primary)] w-2/3 transition-all duration-300")
      }

      # Skeleton
      Card(class:"p-6 bg-white rounded-xl shadow-sm") {
        Div(class:"flex items-center gap-4 mb-4") {
          Div(class:"w-12 h-12 bg-gray-200 rounded-full animate-pulse")
          Div(class:"flex-1 space-y-2") {
            Div(class:"h-4 bg-gray-200 rounded animate-pulse w-3/4")
            Div(class:"h-3 bg-gray-200 rounded animate-pulse w-1/2")
          }
        }
        Div(class:"space-y-2") {
          Div(class:"h-3 bg-gray-200 rounded animate-pulse")
          Div(class:"h-3 bg-gray-200 rounded animate-pulse w-5/6")
          Div(class:"h-3 bg-gray-200 rounded animate-pulse w-4/6")
        }
      }
    }
  }
}
```

##### 18. Error States (에러 상태)
```uih
meta {
  route: "/error";
  theme: "light";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50") {
    Div(class:"text-center max-w-2xl mx-auto px-6") {
      Span(class:"text-9xl mb-8 block") { "😔" }
      H1(class:"text-6xl font-bold mb-4") { "404" }
      P(class:"text-2xl text-gray-600 mb-8") {
        "페이지를 찾을 수 없습니다"
      }
      P(class:"text-gray-500 mb-12") {
        "요청하신 페이지가 존재하지 않거나 이동되었습니다."
      }
      Div(class:"flex gap-4 justify-center") {
        Button(class:"px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold") {
          "홈으로"
        }
        Button(class:"px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold") {
          "이전 페이지"
        }
      }
    }
  }
}
```

##### 19. Search Interface (검색 인터페이스)
```uih
meta {
  route: "/search";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    # Search Bar
    Div(class:"max-w-3xl mx-auto mb-12") {
      Div(class:"relative") {
        Input(
          type:"text",
          placeholder:"검색어를 입력하세요...",
          class:"w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-[var(--color-primary)] focus:outline-none"
        )
        Span(class:"absolute left-5 top-1/2 -translate-y-1/2 text-2xl") {
          "🔍"
        }
      }

      # Quick Links
      Div(class:"flex flex-wrap gap-2 mt-4") {
        Span(class:"text-sm text-gray-600") { "인기 검색어:" }
        A(href:"#", class:"px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm") {
          "React"
        }
        A(href:"#", class:"px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm") {
          "Tailwind"
        }
        A(href:"#", class:"px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm") {
          "Component"
        }
      }
    }

    # Search Results
    Div(class:"space-y-6") {
      Card(class:"p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow") {
        A(href:"#") {
          H3(class:"text-xl font-bold mb-2 text-[var(--color-primary)]") {
            "UIH 시작하기 가이드"
          }
          P(class:"text-gray-700 mb-2") {
            "UIH로 첫 번째 컴포넌트를 만드는 방법을 배워보세요..."
          }
          P(class:"text-sm text-gray-500") {
            "docs.uih.com/getting-started"
          }
        }
      }

      # More results...
    }
  }
}
```

##### 20. Data Table (데이터 테이블)
```uih
meta {
  route: "/users";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    Div(class:"flex items-center justify-between mb-8") {
      H1(class:"text-3xl font-bold") { "사용자 목록" }
      Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
        "+ 새 사용자"
      }
    }

    Card(class:"bg-white rounded-xl shadow-sm overflow-hidden") {
      # Filters
      Div(class:"p-4 border-b flex gap-4") {
        Input(
          type:"text",
          placeholder:"검색...",
          class:"flex-1 px-4 py-2 border rounded-lg"
        )
        Select(class:"px-4 py-2 border rounded-lg") {
          Option { "전체" }
          Option { "활성" }
          Option { "비활성" }
        }
      }

      # Table
      Table(class:"w-full") {
        Thead(class:"bg-gray-50 border-b") {
          Tr {
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") {
              Input(type:"checkbox")
            }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "이름" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "이메일" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "역할" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "상태" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "작업" }
          }
        }
        Tbody {
          Tr(class:"border-b hover:bg-gray-50") {
            Td(class:"px-6 py-4") {
              Input(type:"checkbox")
            }
            Td(class:"px-6 py-4") {
              Div(class:"flex items-center gap-3") {
                Img(
                  src:"/avatar1.jpg",
                  alt:"User",
                  class:"w-10 h-10 rounded-full"
                )
                Span(class:"font-medium") { "홍길동" }
              }
            }
            Td(class:"px-6 py-4 text-gray-600") { "hong@example.com" }
            Td(class:"px-6 py-4") {
              Span(class:"px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm") {
                "관리자"
              }
            }
            Td(class:"px-6 py-4") {
              Span(class:"px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm") {
                "활성"
              }
            }
            Td(class:"px-6 py-4") {
              Div(class:"flex gap-2") {
                Button(class:"text-blue-600 hover:text-blue-800") { "수정" }
                Button(class:"text-red-600 hover:text-red-800") { "삭제" }
              }
            }
          }

          # More rows...
        }
      }

      # Pagination
      Div(class:"p-4 border-t flex items-center justify-between") {
        P(class:"text-sm text-gray-600") { "10개 중 1-5 표시" }
        Div(class:"flex gap-2") {
          Button(class:"px-3 py-1 border rounded hover:bg-gray-50") { "이전" }
          Button(class:"px-3 py-1 bg-[var(--color-primary)] text-white rounded") { "1" }
          Button(class:"px-3 py-1 border rounded hover:bg-gray-50") { "2" }
          Button(class:"px-3 py-1 border rounded hover:bg-gray-50") { "다음" }
        }
      }
    }
  }
}
```

### Design System Best Practices

When generating UIH code:

1. **Consistent Spacing**: Use Tailwind spacing scale (p-4, p-6, p-8, gap-4, gap-6, space-y-4, etc.)
2. **Color Variables**: Define brand colors in `style` block, reference with `var(--color-primary)`
3. **Typography Hierarchy**: H1 (text-5xl), H2 (text-3xl), H3 (text-2xl), body (text-base)
4. **Responsive Design**: Use responsive prefixes (md:, lg:, xl:) for mobile-first design
5. **Accessibility**: Include aria-label, alt text, semantic HTML elements
6. **Interactive States**: Add hover:, focus:, active: states for all interactive elements

### Common Patterns Reference

**Centered Container**:
```uih
Div(class:"container mx-auto px-6 py-12")
```

**Card with Shadow**:
```uih
Card(class:"bg-white rounded-xl shadow-sm p-6")
```

**Primary Button**:
```uih
Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-semibold")
```

**Input Field**:
```uih
Input(
  type:"text",
  placeholder:"Enter text",
  class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
)
```

**Flex Layout**:
```uih
Div(class:"flex items-center justify-between gap-4")
```

**Grid Layout**:
```uih
Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")
```

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


## VSCode Extension

UIH provides a VSCode extension for enhanced development experience with live preview and AI-powered code generation.

### Installation

**From Marketplace**:
```bash
# Search "UIH" in VSCode Extensions marketplace
```

**From VSIX** (Development):
```bash
cd vscode-uih
pnpm build
npx @vscode/vsce package --no-dependencies
code --install-extension vscode-uih-*.vsix --force
```

### Features

#### 1. Live UI Preview (v1.3.4+)

Real-time UI rendering with Tailwind CSS integration:

**Activation**: Open `.uih` file → Right-click → "UIH: Preview UI" or `Cmd/Ctrl+Shift+P` → "UIH: Preview UI"

**Capabilities**:
- ✅ **Real-time rendering**: See actual UI with Tailwind styles applied
- ✅ **CSS Variables**: Style tokens automatically converted to CSS custom properties
- ✅ **All HTML elements**: Div, H1-H6, Button, Input, Card, and 25+ more
- ✅ **Nested structures**: Unlimited depth support for complex layouts
- ✅ **Responsive preview**: Full viewport with mobile/desktop view

**Example**:
```uih
style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl") {
    H1(class:"text-4xl font-bold mb-4") { "Hello UIH!" }
    Button(class:"bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100") {
      "Get Started"
    }
  }
}
```

**Preview Output**: Fully rendered UI with gradients, rounded corners, hover effects, and all Tailwind utilities applied.

#### 2. Code Compilation

Generate framework-specific code:

**Activation**: Open `.uih` file → Right-click → "UIH: Compile to Framework"

**Output**: New editor tab with generated React/Vue/Svelte code ready to copy to your project.

#### 3. Syntax Highlighting

- Keyword highlighting: `meta`, `style`, `layout`, `motion`, `logic`, etc.
- Comment support: `#` hash comments and `//` line comments
- Property highlighting: Props, values, and string literals
- Error detection: Syntax validation with inline error markers

#### 4. Code Snippets

Type shortcuts for rapid UIH development:

| Snippet | Trigger | Expands To |
|---------|---------|------------|
| `uih-meta` | meta block | Full meta block with route and theme |
| `uih-style` | style block | Style block with color tokens |
| `uih-layout` | layout block | Layout block with sample elements |
| `uih-button` | button element | Button with Tailwind classes |
| `uih-input` | input element | Input with placeholder and styling |
| `uih-card` | card layout | Card component with header/content |

#### 5. AI Code Generation (Requires Anthropic API Key)

**Setup**:
1. Open VSCode Settings → Search "UIH"
2. Set `uih.anthropicApiKey` to your Anthropic API key

**Usage**: Select text description → Right-click → "UIH: Generate from Description"

**Example**:
```
Input: "Create a pricing table with 3 tiers: Free, Pro, and Enterprise"
Output: Complete .uih file with styled pricing cards
```

### Configuration

**Settings** (`settings.json`):
```json
{
  "uih.targetFramework": "react",  // Default compilation target: react|vue|svelte
  "uih.anthropicApiKey": "sk-...", // API key for AI generation
  "uih.autoPreview": false          // Auto-open preview on .uih file open
}
```

### Development Commands

**Build Extension**:
```bash
cd vscode-uih
pnpm build                          # Build extension code
```

**Package Extension**:
```bash
npx @vscode/vsce package --no-dependencies
# Creates: vscode-uih-{version}.vsix
```

**Publish to Marketplace**:
```bash
npx @vscode/vsce publish
```

### Extension Architecture

**File Structure**:
```
vscode-uih/
├── src/
│   └── extension.ts              # Main extension entry point
├── syntaxes/
│   └── uih.tmLanguage.json       # Syntax highlighting grammar
├── snippets/
│   └── uih.json                  # Code snippets
├── language-configuration.json   # Language features (brackets, comments)
├── package.json                  # Extension manifest
└── tsup.config.ts                # Build configuration
```

**Key Functions**:

1. **handlePreview()** - Live UI preview generation
   - Parses `.uih` AST
   - Renders HTML with Tailwind CSS CDN
   - Converts UIH elements to semantic HTML
   - Applies CSS variables from style block

2. **handleCompile()** - Framework code generation
   - Parses `.uih` AST
   - Calls React/Vue/Svelte plugin
   - Opens generated code in new editor tab

3. **handleGenerate()** - AI-powered code generation
   - Loads project context from workspace
   - Calls Anthropic Claude API with UIH examples
   - Generates complete `.uih` file from description

**Preview Rendering Pipeline**:
```typescript
.uih source
  ↓ parse()
UIH AST
  ↓ getPreviewHtml(ast)
HTML with Tailwind CDN
  ↓ webview.html
Live UI Preview (rendered in VSCode)
```

**HTML Element Mapping** (renderElement):
- `Button` → `<button>`
- `Div` → `<div>`
- `H1-H6` → `<h1-h6>`
- `Input` → `<input>`
- `Card` → `<div>` (semantic wrapper)
- 25+ more elements

### Version History

**v1.3.4** (Latest) - Live UI Preview
- ✅ Real-time UI rendering with Tailwind CSS
- ✅ CSS variable integration from style blocks
- ✅ Full HTML element support with semantic mapping
- ✅ Nested structure rendering with unlimited depth

**v1.3.3** - Preview Improvements
- Fixed webview blank screen issues
- Simplified HTML generation

**v1.3.2** - Parser Enhancements
- Added GATE predicates for ambiguity resolution
- Fixed nested element parsing

**v1.3.0** - Nested Elements Support
- Full support for arbitrary nesting depth
- Improved AST visitor for complex layouts

**v1.2.9** - Comment Support
- Added hash comment (`#`) support in lexer

**v1.2.6-v1.2.8** - Stability Improvements
- Fixed prettier bundling issues
- Content Security Policy fixes

### Troubleshooting

**Preview shows blank screen**:
1. Reload VSCode window: `Cmd/Ctrl+R`
2. Check VSCode Developer Tools: `Help → Toggle Developer Tools`
3. Verify extension is activated: Look for "UIH extension activated" in console

**"Command not found" error**:
1. Uninstall all UIH extensions: `Extensions → UIH → Uninstall`
2. Reinstall latest version
3. Reload VSCode window

**AI Generation not working**:
1. Verify API key is set in VSCode settings
2. Check API key has sufficient credits
3. Verify internet connection for API calls

**Syntax highlighting not working**:
1. Verify file extension is `.uih`
2. Check language mode in bottom-right corner (should show "UIH")
3. Reload VSCode window

### Contributing to Extension

**Adding New Features**:
1. Update `src/extension.ts` with new command handler
2. Register command in `package.json` → `contributes.commands`
3. Add keyboard shortcut in `contributes.keybindings` (optional)
4. Update documentation in CLAUDE.md and README.md
5. Build and test: `pnpm build && code --install-extension *.vsix`

**Testing Workflow**:
1. Make changes to `src/extension.ts`
2. Build: `pnpm build`
3. Press F5 in VSCode to launch Extension Development Host
4. Test .uih files in the development instance
5. Check console for errors: Help → Toggle Developer Tools

