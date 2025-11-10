# Development Guide

[← Back to Main](../CLAUDE.md)

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

