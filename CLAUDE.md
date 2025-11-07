# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIH (Universal UI Hierarchy) is a meta-language that bridges human-written interface descriptions and AI-generated components. The project compiles `.uih` files into framework-specific code (currently React).

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
node packages/cli/dist/index.js compile <input.uih> [outDir]
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

**Current Limitation**: Hardcoded shadcn/ui component mappings only

### CLI (packages/cli)

**Single Command**: `compile <file.uih> [outDir]`
- Reads .uih file
- Calls parser → codegen pipeline
- Writes output to `{outDir}/Page.tsx`
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
- **Generated Code**: `out/Page.tsx` (default CLI output)

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

## Known Issues & TODOs

1. **Parser Replacement Planned** (parser/src/index.ts:15-19): Current regex parser is temporary, tree-sitter/chevrotain migration intended
2. **No Tests Written**: vitest configured in parser package but no test files exist
3. **Limited Component Support**: Only 4 shadcn/ui components in registry
4. **Type Safety**: Multiple `any` types in codegen registry (registry.ts:4,9,14,19)
