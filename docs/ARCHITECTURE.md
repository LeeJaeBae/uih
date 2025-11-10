# Architecture Details

[← Back to Main](../CLAUDE.md) | [Language →](LANGUAGE.md)

## Parser (packages/parser)

**Current Implementation**: Regex-based parser (temporary)
- **Known Limitation**: Comment in index.ts:15-19 indicates planned migration to tree-sitter/chevrotain
- Parses 7 block types: `meta`, `style`, `layout`, `motion`, `logic`, `i18n`, `bind`
- Outputs typed AST (see ast.ts for complete type definitions)

**Key Parsing Flow**:
1. Regex captures blocks: `/(meta|style|layout|...)(?:"label")?\{body\}/gm`
2. Each block type has dedicated parser function (parseMeta, parseLayout, etc.)
3. Key-value pairs parsed as: `key: value;`
4. Layout blocks support Element syntax: `Component(props) { children }`

## Codegen-React (packages/codegen-react)

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

## CLI (packages/cli)

**Single Command**: `compile <file.uih> [outDir] --target <framework>`
- Reads .uih file
- Calls parser → codegen pipeline
- Supports three target frameworks: `react`, `vue`, `svelte`
- Writes output to `{outDir}/Page.{tsx|vue|svelte}`
- Logs AST to console for debugging

---

[← Back to Main](../CLAUDE.md) | [Language →](LANGUAGE.md)
