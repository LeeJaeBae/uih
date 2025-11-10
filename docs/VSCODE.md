# VSCode Extension

[← Back to Main](../CLAUDE.md) | [← AI Generation](AI_GENERATION.md) | [Development →](DEVELOPMENT.md)


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


---

[← Back to Main](../CLAUDE.md) | [← AI Generation](AI_GENERATION.md) | [Development →](DEVELOPMENT.md)
