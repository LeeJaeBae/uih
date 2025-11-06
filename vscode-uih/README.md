# UIH Language Support for Visual Studio Code

Official Visual Studio Code extension for UIH (Universal UI Hierarchy) - a meta-language for building UI components across React, Vue, and Svelte.

## Features

### 🎨 Syntax Highlighting
- Full syntax highlighting for `.uih` files
- Color-coded blocks (meta, style, layout, motion, logic, i18n, bind)
- Component and prop highlighting
- Control flow keywords (if, else, for, in)

### ✨ IntelliSense
- **Code Snippets**: Quick templates for all block types
- **Auto-completion**: Component names and common patterns
- **Bracket Matching**: Automatic closing of brackets and quotes

### 🔧 Language Features
- **Comment Support**: Line (`//`) and block (`/* */`) comments
- **Auto-indentation**: Smart indentation for nested structures
- **Code Folding**: Collapse/expand blocks for better readability

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

### Quick Start

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

## Release Notes

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
