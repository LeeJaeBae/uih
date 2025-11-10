# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📚 Documentation Index

### Core Concepts
- **[Development Guide](docs/DEVELOPMENT.md)** - Project overview, commands, build details, commit conventions
- **[Architecture Details](docs/ARCHITECTURE.md)** - Parser, codegen, and CLI architecture
- **[UIH Language](docs/LANGUAGE.md)** - Language structure and block types

### Features & Usage
- **[Styling System](docs/STYLING.md)** - Tailwind CSS integration and CSS variables
- **[Components Guide](docs/COMPONENTS.md)** - Component imports and pure HTML elements
- **[AI Code Generation](docs/AI_GENERATION.md)** - 20 real-world UI patterns and guidelines
- **[VSCode Extension](docs/VSCODE.md)** - Live preview, syntax highlighting, and AI generation

### Technical Reference
- **[Architecture Highlights](docs/ARCHITECTURE_HIGHLIGHTS.md)** - Production system overview and known issues

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Compile UIH to React/Vue/Svelte
node packages/cli/dist/index.js compile examples/booking.uih out --target react
```

## Project Structure

```
uih/
├── packages/
│   ├── parser/          # Core UIH language parser (AST generation)
│   ├── codegen-react/   # React code generator (AST → JSX)
│   └── cli/             # Command-line interface
├── examples/            # Example .uih files
├── docs/                # Detailed documentation
└── vscode-uih/          # VSCode extension
```

**Dependency Flow**: `cli` → `codegen-react` → `parser`

## Key Features

- 🎨 **Tailwind CSS** - Full utility class support with CSS variables
- 🧩 **Component Imports** - Reusable .uih components
- 🏗️ **Pure HTML Elements** - 25+ HTML elements (Div, H1-H6, Form, etc.)
- 🤖 **AI-Friendly** - Designed for natural language → code generation
- 🖼️ **Live Preview** - Real-time UI rendering in VSCode
- 🔄 **Multi-Framework** - React, Vue, and Svelte support

## Example UIH File

```uih
meta {
  route: "/login";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50") {
    Card(class:"w-full max-w-md p-8") {
      H2(class:"text-3xl font-bold mb-6") { "로그인" }

      Form(class:"space-y-4") {
        Input(
          type:"email",
          placeholder:"이메일",
          class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
        )
        Button(class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg") {
          "로그인"
        }
      }
    }
  }
}
```

## Development Workflow

1. **Write** UIH files with natural language-like syntax
2. **Compile** to your target framework (React/Vue/Svelte)
3. **Preview** live in VSCode extension
4. **Deploy** generated components to your project

See [Development Guide](docs/DEVELOPMENT.md) for detailed commands and workflow.

## Documentation

Each documentation file includes:
- 📖 Comprehensive explanations and examples
- 🔗 Cross-references to related topics
- ⬅️ Navigation links for easy browsing
- 💡 Best practices and patterns

Start with [Development Guide](docs/DEVELOPMENT.md) for setup instructions, or jump to [AI Code Generation](docs/AI_GENERATION.md) for 20 ready-to-use UI patterns.

---

**Version**: 1.3.4 | **License**: MIT | **Repository**: [github.com/yourusername/uih](https://github.com/yourusername/uih)
