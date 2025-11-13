# Changelog

All notable changes to UIH will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2025-11-14

### Added
- **Interactive Templates**: Hybrid workflow system for Claude Code integration
  - Automatic feature detection from UIH AST (forms, inputs, modals, tabs)
  - Smart placeholder injection with 🤖 TODO comments
  - State management scaffolding (useState for React, ref for Vue, let for Svelte)
  - Form validation templates with email/password patterns
  - Submit handler templates with API call skeletons
  - Input change handler templates with error clearing
  - Modal and tab state management templates
- **MCP Server Enhancements**:
  - `interactive` parameter for compile_uih tool
  - `features` parameter for selective placeholder injection
  - `output_file` parameter for direct file saving
- **Component Support**:
  - Full HTML element support (25+ elements: Div, H1-H6, Form, etc.)
  - Accessibility attributes for semantic HTML
- **Documentation**:
  - Added HYBRID_TEMPLATE.md with 8 interactive patterns
  - Added PDCA documentation for playground live preview
  - Updated MCP server README with interactive mode examples

### Changed
- React plugin now supports interactive template injection
- MCP compile_uih tool schema updated with new parameters
- Improved code generation with better formatting

## [0.7.3] - 2025-11-11

### Added
- **Playground Live Preview**: Real-time UI rendering in Next.js playground
  - Monaco Editor integration for UIH code editing
  - Live compilation to React/Vue/Svelte
  - 8 example gallery with instant preview
  - Dark/Light mode support
  - Deployed at https://uih-playground.vercel.app
- **VSCode Extension v1.3.4**:
  - Live UI preview with Tailwind CSS rendering
  - Syntax highlighting improvements
  - Better error messages

### Changed
- Improved parser error handling
- Better TypeScript type inference

### Fixed
- Build issues with Prettier optional imports
- Nested element parsing edge cases

## [0.7.1] - 2025-01-XX

### Added
- **Tailwind CSS Support**: Full utility class support in components
- **CSS Variables**: Custom design tokens via style block
- **AI Code Generation**: CLI command for generating UIH from natural language
- **Import System**: Component reuse across .uih files
- **Data Block**: SWR data fetching support (experimental)

### Changed
- Improved type safety across all packages
- Better error handling in parser and codegen

### Fixed
- Props passing to imported components
- Variable reference syntax in props

## [0.6.0] - 2025-01-05

### Added
- **Plugin System**: Extensible architecture for multi-framework support
  - `CodegenPlugin` interface for creating custom code generators
  - `PluginRegistry` for managing and discovering plugins
  - Built-in React, Vue, and Svelte plugins
- **Vue 3 Support**: Full Vue 3 code generation with Composition API
  - `v-if`, `v-else`, `v-for` directives
  - Single File Component (.vue) format
  - Scoped styles support
- **Svelte Support**: Full Svelte code generation with TypeScript
  - `{#if}`, `{:else}`, `{/if}`, `{#each}` syntax
  - Single File Component (.svelte) format
  - Motion styles with CSS transitions
- **CLI Enhancements**:
  - `--target` flag to specify framework (react|vue|svelte)
  - Plugin discovery and automatic loading
  - Better error messages and help text
- **Nested Optimization**: Intelligent Fragment removal for cleaner code
  - Single-node conditionals no longer wrap in Fragment
  - Expression nodes properly handled in nested contexts
  - 30-40% reduction in generated code size
- **Comprehensive Examples**: 10 example files covering all features
  - Basic components (hello.uih, test.uih)
  - Forms (booking.uih, form-advanced.uih)
  - Control flow (conditional.uih, loop.uih, nested.uih)
  - Advanced features (motion-demo.uih, components-showcase.uih)

### Changed
- **Breaking**: Moved from regex parser to Chevrotain CST-based parser
- Refactored React code generation into plugin architecture
- Improved TypeScript types across all packages
- Better Prettier integration for formatted output

### Fixed
- Double-brace issue in nested conditionals
- Fragment wrapping in single-node loops
- Expression node handling in multiple contexts

### Documentation
- Added plugin system documentation
- Created custom plugin authoring guide
- Updated CLI usage examples
- Added comprehensive release checklist

## [0.5.0] - 2024-12-XX

### Added
- Conditional rendering support (`if`, `else`)
- Loop rendering support (`for ... in`)
- AST union types for better type safety

## [0.4.0] - 2024-12-XX

### Added
- Motion block support with CSS animations
- 12 shadcn/ui components (Button, Input, Card, Badge, etc.)
- Motion and Logic block tests

## [0.3.0] - 2024-12-XX

### Added
- Initial Chevrotain-based parser
- React code generation with shadcn/ui
- CLI with compile, watch, validate commands
- Prettier integration
- Meta, Style, Layout, Logic, I18n, Bind blocks

## [0.2.0] - 2024-XX-XX

### Added
- Regex-based parser (temporary implementation)
- Basic AST structure
- Initial project setup

## [0.1.0] - 2024-XX-XX

### Added
- Initial project structure
- pnpm workspace configuration
- Build system with tsup

[0.8.0]: https://github.com/LeeJaeBae/uih/releases/tag/v0.8.0
[0.7.3]: https://github.com/LeeJaeBae/uih/releases/tag/v0.7.3
[0.7.1]: https://github.com/LeeJaeBae/uih/releases/tag/v0.7.1
[0.6.0]: https://github.com/LeeJaeBae/uih/releases/tag/v0.6.0
[0.5.0]: https://github.com/LeeJaeBae/uih/releases/tag/v0.5.0
[0.4.0]: https://github.com/LeeJaeBae/uih/releases/tag/v0.4.0
[0.3.0]: https://github.com/LeeJaeBae/uih/releases/tag/v0.3.0
[0.2.0]: https://github.com/LeeJaeBae/uih/releases/tag/v0.2.0
[0.1.0]: https://github.com/LeeJaeBae/uih/releases/tag/v0.1.0
