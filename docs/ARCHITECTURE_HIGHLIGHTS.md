# Architecture Highlights

[← Back to Main](../CLAUDE.md) | [Architecture Details →](ARCHITECTURE.md)


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



---

[← Back to Main](../CLAUDE.md) | [Architecture Details →](ARCHITECTURE.md)
