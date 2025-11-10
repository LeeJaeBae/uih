# UIH Language Support for Visual Studio Code

Official Visual Studio Code extension for UIH (Universal UI Hierarchy) - a meta-language for building UI components across React, Vue, and Svelte.

## Features

### 🚀 Live UI Preview (v1.3.4+)
- **Real-time rendering**: See your UI come to life instantly with Tailwind CSS
- **Interactive preview**: Full viewport with responsive design support
- **CSS Variables**: Style tokens automatically converted to custom properties
- **All elements supported**: Div, H1-H6, Button, Input, Card, and 25+ more
- **Nested layouts**: Unlimited depth for complex component structures

### 🎨 Syntax Highlighting
- Full syntax highlighting for `.uih` files
- Color-coded blocks (meta, style, layout, motion, logic, i18n, bind)
- Component and prop highlighting
- Control flow keywords (if, else, for, in)
- Hash comments (`#`) support

### ✨ IntelliSense
- **Code Snippets**: Quick templates for all block types
- **Auto-completion**: Component names and common patterns
- **Bracket Matching**: Automatic closing of brackets and quotes

### 🤖 AI Code Generation
- **Claude-powered generation**: Convert natural language to UIH code
- **Context-aware**: Uses project patterns for consistent output
- **Example**: "Create a pricing table with 3 tiers" → Complete .uih file

### 🔧 Language Features
- **Comment Support**: Hash (`#`), line (`//`), and block (`/* */`) comments
- **Auto-indentation**: Smart indentation for nested structures
- **Code Folding**: Collapse/expand blocks for better readability
- **Framework Compilation**: One-click compile to React, Vue, or Svelte

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type: `ext install LeeJaeWon.vscode-uih`
4. Press Enter

### From VSIX File
1. Download the `.vsix` file from [releases](https://github.com/LeeJaeBae/uih/releases)
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
4. Click `...` → `Install from VSIX...`
5. Select the downloaded file

## Usage

### Live Preview (NEW in v1.3.4)

Create stunning UIs with real-time visual feedback:

1. **Create a .uih file**:
```uih
style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl") {
    H1(class:"text-4xl font-bold mb-4") { "Hello UIH!" }
    Button(class:"bg-white text-blue-600 px-6 py-3 rounded-lg") {
      "Get Started"
    }
  }
}
```

2. **Open Preview**:
   - Right-click in editor → "UIH: Preview UI"
   - Or press `Cmd/Ctrl+Shift+P` → "UIH: Preview UI"

3. **See Results**: Live preview shows actual UI with Tailwind styling applied!

### Compile to Framework

Generate production-ready code:

1. Right-click in editor → "UIH: Compile to Framework"
2. Choose target: React, Vue, or Svelte
3. Generated code opens in new tab
4. Copy to your project and use immediately

### Quick Start with Snippets

Create a new `.uih` file and start typing:

1. Type `uih` and press Tab → Full UIH file template
2. Type `meta` and press Tab → Meta block
3. Type `button` and press Tab → Button component

### Available Snippets

| Prefix | Description |
|--------|-------------|
| `uih` | Complete UIH file template |
| `meta` | Meta block (route, theme) |
| `style` | Style block (design tokens) |
| `layout` | Layout block |
| `motion` | Motion block (animations) |
| `logic` | Logic block (event handlers) |
| `i18n` | I18n block (translations) |
| `bind` | Bind block (data binding) |
| `card` | Card component |
| `button` | Button component |
| `input` | Input component |
| `badge` | Badge component |
| `textarea` | Textarea component |
| `select` | Select with options |
| `checkbox` | Checkbox component |
| `if` | Conditional block |
| `ifelse` | Conditional with else |
| `for` | Loop block |

### Example Workflow

```uih
meta {
  route: "/dashboard";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  radius.card: "12px";
}

layout "centered" {
  Card(id:"header") { "Dashboard" }

  if (isAuthenticated) {
    Button(variant:"primary") { "Logout" }
  } else {
    Button(variant:"primary") { "Login" }
  }

  for (item in items) {
    Card(id:"item-card") { "Item" }
  }
}
```

## Compile UIH Files

After writing your `.uih` file, compile it to your target framework:

```bash
# Install UIH CLI
npm install -g uih-cli

# Compile to React
uih compile myfile.uih --target react

# Compile to Vue
uih compile myfile.uih --target vue

# Compile to Svelte
uih compile myfile.uih --target svelte
```

## Language Specification

UIH supports 7 block types:

- **meta**: Route and theme metadata
- **style**: Design tokens (colors, spacing, etc.)
- **layout**: Component structure with JSX-like syntax
- **motion**: CSS animations and transitions
- **logic**: Event handlers (submit, click, etc.)
- **i18n**: Multi-language translations
- **bind**: Data binding between components and state

## Resources

- [GitHub Repository](https://github.com/LeeJaeBae/uih)
- [Language Specification](https://github.com/LeeJaeBae/uih/blob/main/docs/spec.md)
- [Examples](https://github.com/LeeJaeBae/uih/tree/main/examples)
- [Issue Tracker](https://github.com/LeeJaeBae/uih/issues)

## Contributing

Found a bug or have a feature request? Please file an issue on our [GitHub repository](https://github.com/LeeJaeBae/uih/issues).

## Configuration

### Settings

Access via VSCode Settings → Search "UIH":

```json
{
  // Default framework for compilation
  "uih.targetFramework": "react",  // Options: react, vue, svelte

  // API key for AI code generation
  "uih.anthropicApiKey": "sk-ant-...",

  // Auto-open preview on .uih file open
  "uih.autoPreview": false
}
```

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Preview | `Cmd/Ctrl+Shift+P` → "UIH: Preview UI" |
| Compile | `Cmd/Ctrl+Shift+P` → "UIH: Compile to Framework" |
| Generate AI Code | `Cmd/Ctrl+Shift+P` → "UIH: Generate from Description" |

## Release Notes

### 1.3.4 (Latest) - Live UI Preview

- ✨ **NEW**: Real-time UI preview with Tailwind CSS rendering
- ✨ **NEW**: CSS variables integration from style blocks
- ✨ **NEW**: Full semantic HTML element support (25+ elements)
- ✨ **NEW**: Nested layout rendering with unlimited depth
- 🐛 Fixed webview rendering issues
- 🎨 Improved preview styling and responsiveness

### 1.3.3 - Preview Improvements

- 🐛 Fixed blank preview screen issues
- 🔧 Simplified HTML generation
- ⚡ Performance optimizations

### 1.3.2 - Parser Enhancements

- ✅ Added GATE predicates for grammar ambiguity resolution
- 🐛 Fixed nested element parsing issues
- 🔧 Improved error reporting

### 1.3.0 - Nested Elements Support

- ✨ Full support for arbitrary nesting depth
- 🐛 Fixed complex layout structures
- 🔧 Enhanced AST visitor for nested nodes

### 1.2.9 - Comment Support

- ✨ Added hash comment (`#`) support
- 🔧 Improved lexer token handling

### 1.0.0 (Initial Release)

- ✅ Syntax highlighting for UIH files
- ✅ Code snippets for all block types
- ✅ IntelliSense for components
- ✅ Auto-closing brackets and quotes
- ✅ Comment support (// and /* */)
- ✅ Smart indentation

## License

MIT © LeeJaeWon

---

**Made with ❤️ for the UIH community**
