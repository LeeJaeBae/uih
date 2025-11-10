# Change Log

All notable changes to the "vscode-uih" extension will be documented in this file.

## [1.3.4] - 2025-11-10

### Added
- **Live UI Preview**: Real-time UI rendering with Tailwind CSS integration
  - Direct HTML rendering from UIH AST
  - Tailwind CSS CDN integration for instant styling
  - CSS variables automatically generated from style blocks
  - Full semantic HTML element mapping (25+ elements)
  - Unlimited nesting depth support for complex layouts
- Preview command: "UIH: Preview UI" accessible via right-click or command palette
- Webview panel with responsive viewport for live UI inspection

### Changed
- Preview now shows actual rendered UI instead of generated code
- Enabled scripts in webview for Tailwind CSS processing
- Simplified webview configuration for better compatibility

### Technical Details
- Implemented AST-to-HTML rendering pipeline
- Added `renderElement()`, `renderNode()`, `renderAttributes()` functions
- Created element name mapping system (Button → button, Div → div, etc.)
- Integrated CSS variable generation from style tokens

## [1.3.3] - 2025-11-10

### Fixed
- Blank preview screen issues resolved
- Simplified HTML generation for better compatibility

## [1.3.2] - 2025-11-10

### Fixed
- Parser ambiguity errors with nested elements
- Added GATE predicates for grammar disambiguation
- Improved lookahead token handling

## [1.3.0] - 2025-11-10

### Added
- Full support for nested elements with arbitrary depth
- Enhanced AST visitor for complex layout structures

### Fixed
- Nested element parsing in layout blocks
- Complex component hierarchy rendering

## [1.2.9] - 2025-11-10

### Added
- Hash comment (`#`) support in lexer
- Improved comment handling across all styles

## [1.1.1] - 2025-01-10

### Updated
- Compatibility with UIH v0.7.1
- Updated to match core package improvements:
  - Enhanced type safety in code generation
  - Improved error handling with custom error classes
  - 100% test coverage across all packages

## [1.1.0] - 2025-01-06

### Added
- Enhanced syntax highlighting for HTML elements
- Support for Tailwind CSS class attributes
- Variable reference syntax highlighting ({variable})

## [1.0.0] - 2025-01-06

### Added
- Initial release of UIH Language Support
- Syntax highlighting for `.uih` files
  - Block keywords (meta, style, layout, motion, logic, i18n, bind)
  - Component names and props
  - Control flow (if, else, for, in)
  - Strings and comments
- Language configuration
  - Automatic bracket closing and matching
  - Comment toggling (// and /* */)
  - Smart indentation
  - Code folding support
- Code snippets
  - 20+ snippets for blocks and components
  - Complete file templates
  - Component shortcuts (card, button, input, etc.)
- IntelliSense support
  - Snippet suggestions
  - Property completion hints

### Features
- Full UIH language syntax support
- React, Vue, and Svelte framework compatibility
- Developer-friendly editing experience
- Quick start templates for common patterns

---

**For UIH CLI and language updates, see the [main CHANGELOG](https://github.com/LeeJaeBae/uih/blob/main/CHANGELOG.md)**
