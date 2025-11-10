# UIH Language Structure

[← Back to Main](../CLAUDE.md) | [← Architecture](ARCHITECTURE.md) | [Styling →](STYLING.md)

## Example `.uih` File Structure

```uih
meta {
  route: "/path";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  radius.card: "16px";
}

layout "centered" {
  Card(id:"demo") { "Content" }
  Input(id:"name", placeholder:"Placeholder")
  Button(variant:"primary"){ "Label" }
}

logic {
  on submit {
    navigate: "/next";
  }
}
```

## Block Types

- **meta**: Route configuration, theme settings, metadata
- **style**: Design tokens and CSS variables
- **layout**: UI component hierarchy
- **motion**: Animation and transition definitions
- **logic**: Event handlers and business logic
- **i18n**: Internationalization strings
- **bind**: Data binding expressions

See [Styling System](STYLING.md) for style block details.
See [Components](COMPONENTS.md) for layout block component usage.

---

[← Back to Main](../CLAUDE.md) | [← Architecture](ARCHITECTURE.md) | [Styling →](STYLING.md)
