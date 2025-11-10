# Styling System

[← Back to Main](../CLAUDE.md) | [← Language](LANGUAGE.md) | [Components →](COMPONENTS.md)


UIH supports modern styling approaches with Tailwind CSS and CSS variables, designed for AI-friendly code generation.

### Tailwind CSS Support

UIH fully supports Tailwind CSS utility classes through the `class` prop:

**UIH Input**:
```uih
layout {
  Button(class:"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded") {
    "Click me"
  }
}
```

**React Output**:
```tsx
<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</Button>
```

**Key Features**:
- `class` prop automatically converted to `className` in React
- Vue and Svelte keep `class` as-is (native support)
- Full Tailwind utility class support
- Works with all components (built-in and imported)

### CSS Variables (Design Tokens)

The `style` block generates CSS variables for design consistency:

**UIH Input**:
```uih
style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
  color.success: "#10b981";
  spacing.card: "1.5rem";
  radius.button: "8px";
}

layout {
  Button(class:"bg-[var(--color-primary)] text-white px-4 py-2") {
    "Primary Button"
  }
}
```

**React Output**:
```tsx
<style dangerouslySetInnerHTML={{ __html: `:root {
  --color-primary: #0E5EF7;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --spacing-card: 1.5rem;
  --radius-button: 8px;
}` }} />

<Button className="bg-[var(--color-primary)] text-white px-4 py-2">
  Primary Button
</Button>
```

**Naming Convention**:
- Dot notation in UIH: `color.primary`, `spacing.card`
- Converted to kebab-case CSS variables: `--color-primary`, `--spacing-card`
- Use with Tailwind's arbitrary value syntax: `bg-[var(--color-primary)]`

### Combining Tailwind and CSS Variables

**Complete Example** (`examples/tailwind-test.uih`):
```uih
meta {
  route: "/demo";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
}

layout {
  Text(class:"text-3xl font-bold text-gray-900 mb-6") {
    "Tailwind + CSS Variables"
  }

  Button(
    class:"bg-[var(--color-primary)] hover:bg-blue-700 text-white px-4 py-2 rounded",
    variant:"primary"
  ) {
    "Primary Button"
  }

  Input(
    placeholder:"Focus to see primary color ring",
    class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
  )
}
```

**Why This Approach?**

This design is optimized for AI code generation:
1. **AI knows Tailwind**: LLMs are trained on Tailwind, no custom syntax needed
2. **Design tokens**: CSS variables provide consistent theming
3. **Full flexibility**: Combine Tailwind utilities with design system variables
4. **Framework agnostic**: Works across React, Vue, and Svelte

### Framework Output

**Vue** (`.vue`):
```vue
<template>
  <button class="bg-[var(--color-primary)] text-white px-4 py-2">
    Button
  </button>
</template>

<style scoped>
:root {
  --color-primary: #0E5EF7;
}
</style>
```

**Svelte** (`.svelte`):
```svelte
<button class="bg-[var(--color-primary)] text-white px-4 py-2">
  Button
</button>

<style>
  :root {
    --color-primary: #0E5EF7;
  }
</style>
```


---

[← Back to Main](../CLAUDE.md) | [← Language](LANGUAGE.md) | [Components →](COMPONENTS.md)
