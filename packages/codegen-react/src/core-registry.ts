/**
 * Core Registry - Pure HTML Elements (Framework Independent)
 *
 * This registry contains only standard HTML elements with no external dependencies.
 * These components work across all frameworks (React, Vue, Svelte).
 */

/**
 * Component props type definition
 * Props can be strings, numbers, booleans, or variable references
 */
export interface ComponentProps {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Component registry entry
 */
export interface ComponentConfig {
  import: string;
  render: (props: ComponentProps, children: string) => string;
}

/**
 * Helper function to generate prop string for components
 * @param p Component props
 * @param allow Allowed prop names
 * @returns Formatted prop string
 */
export function propStr(p: ComponentProps, allow: string[]): string {
  if (!p) return "";

  // Collect all props from allow list and dynamic props (event handlers, aria, data, role)
  const allProps: string[] = [];

  // Process allowed props
  allow
    .filter((k) => k in p)
    .forEach((k) => {
      // Map UIH props to React props
      let propName = k;
      if (k === "for") propName = "htmlFor";
      if (k === "class") propName = "className";

      const value = p[k];

      // Check if value is an expression (starts with {)
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        // Expression: remove quotes, use as-is
        allProps.push(`${propName}=${value}`);
      } else if (typeof value === "boolean") {
        // Boolean attribute
        if (value) {
          allProps.push(propName);
        }
      } else {
        // Regular string: wrap in quotes
        allProps.push(`${propName}="${value}"`);
      }
    });

  // Process event handlers (onClick, onChange, onSubmit, etc.)
  Object.keys(p).forEach((k) => {
    if (k.startsWith("on") && k.length > 2 && k[2] === k[2].toUpperCase()) {
      const value = p[k];
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        allProps.push(`${k}=${value}`);
      }
    }
  });

  // Process aria-* attributes
  Object.keys(p).forEach((k) => {
    if (k.startsWith("aria-")) {
      const value = p[k];
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        allProps.push(`${k}=${value}`);
      } else {
        allProps.push(`${k}="${value}"`);
      }
    }
  });

  // Process data-* attributes
  Object.keys(p).forEach((k) => {
    if (k.startsWith("data-")) {
      const value = p[k];
      if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
        allProps.push(`${k}=${value}`);
      } else {
        allProps.push(`${k}="${value}"`);
      }
    }
  });

  // Process role attribute
  if ("role" in p && !allow.includes("role")) {
    const value = p.role;
    allProps.push(`role="${value}"`);
  }

  return allProps.join(" ");
}

/**
 * Core Registry - Pure HTML Elements
 * Total: 42 elements (25 basic + 17 extended)
 */
export const coreRegistry: Record<string, ComponentConfig> = {
  // ===== LAYOUT ELEMENTS =====
  Div: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<div ${propStr(p, ["id", "class"])}>${children || ""}</div>`,
  },
  Span: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<span ${propStr(p, ["id", "class"])}>${children || ""}</span>`,
  },
  Section: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<section ${propStr(p, ["id", "class"])}>${children || ""}</section>`,
  },
  Article: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<article ${propStr(p, ["id", "class"])}>${children || ""}</article>`,
  },
  Aside: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<aside ${propStr(p, ["id", "class"])}>${children || ""}</aside>`,
  },
  Header: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<header ${propStr(p, ["id", "class"])}>${children || ""}</header>`,
  },
  Footer: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<footer ${propStr(p, ["id", "class"])}>${children || ""}</footer>`,
  },
  Nav: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<nav ${propStr(p, ["id", "class"])}>${children || ""}</nav>`,
  },
  Main: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<main ${propStr(p, ["id", "class"])}>${children || ""}</main>`,
  },

  // ===== TYPOGRAPHY ELEMENTS =====
  P: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<p ${propStr(p, ["id", "class"])}>${children || ""}</p>`,
  },
  H1: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h1 ${propStr(p, ["id", "class"])}>${children || ""}</h1>`,
  },
  H2: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h2 ${propStr(p, ["id", "class"])}>${children || ""}</h2>`,
  },
  H3: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h3 ${propStr(p, ["id", "class"])}>${children || ""}</h3>`,
  },
  H4: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h4 ${propStr(p, ["id", "class"])}>${children || ""}</h4>`,
  },
  H5: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h5 ${propStr(p, ["id", "class"])}>${children || ""}</h5>`,
  },
  H6: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<h6 ${propStr(p, ["id", "class"])}>${children || ""}</h6>`,
  },
  Text: {
    import: ``,
    render: (_: ComponentProps, children: string) => `<p>${children || ""}</p>`,
  },

  // ===== FORM ELEMENTS (Basic HTML) =====
  Form: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<form ${propStr(p, ["id", "class", "action", "method"])}>${children || ""}</form>`,
  },

  // ===== LIST ELEMENTS =====
  Ul: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<ul ${propStr(p, ["id", "class"])}>${children || ""}</ul>`,
  },
  Ol: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<ol ${propStr(p, ["id", "class"])}>${children || ""}</ol>`,
  },
  Li: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<li ${propStr(p, ["id", "class"])}>${children || ""}</li>`,
  },

  // ===== LINK & MEDIA =====
  A: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<a ${propStr(p, ["id", "class", "href", "target", "rel"])}>${children || ""}</a>`,
  },
  Img: {
    import: ``,
    render: (p: ComponentProps) =>
      `<img ${propStr(p, ["id", "class", "src", "alt", "width", "height"])} />`,
  },

  // ===== MEDIA ELEMENTS =====
  Video: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<video ${propStr(p, ["id", "class", "src", "controls", "autoplay", "loop", "muted", "width", "height"])}>${children || ""}</video>`,
  },
  Audio: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<audio ${propStr(p, ["id", "class", "src", "controls", "autoplay", "loop", "muted"])}>${children || ""}</audio>`,
  },
  Source: {
    import: ``,
    render: (p: ComponentProps) =>
      `<source ${propStr(p, ["src", "type"])} />`,
  },

  // ===== TABLE ELEMENTS =====
  Table: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<table ${propStr(p, ["id", "class"])}>${children || ""}</table>`,
  },
  Thead: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<thead ${propStr(p, ["id", "class"])}>${children || ""}</thead>`,
  },
  Tbody: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<tbody ${propStr(p, ["id", "class"])}>${children || ""}</tbody>`,
  },
  Tfoot: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<tfoot ${propStr(p, ["id", "class"])}>${children || ""}</tfoot>`,
  },
  Tr: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<tr ${propStr(p, ["id", "class"])}>${children || ""}</tr>`,
  },
  Td: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<td ${propStr(p, ["id", "class", "colspan", "rowspan"])}>${children || ""}</td>`,
  },
  Th: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<th ${propStr(p, ["id", "class", "colspan", "rowspan", "scope"])}>${children || ""}</th>`,
  },

  // ===== FORM ELEMENTS (Extended) =====
  Option: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<option ${propStr(p, ["value", "selected", "disabled"])}>${children || ""}</option>`,
  },
  Fieldset: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<fieldset ${propStr(p, ["id", "class"])}>${children || ""}</fieldset>`,
  },
  Legend: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<legend ${propStr(p, ["id", "class"])}>${children || ""}</legend>`,
  },

  // ===== CANVAS & SVG =====
  Canvas: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<canvas ${propStr(p, ["id", "class", "width", "height"])}>${children || ""}</canvas>`,
  },
  Svg: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<svg ${propStr(p, ["id", "class", "width", "height", "viewBox"])}>${children || ""}</svg>`,
  },

  // ===== CODE BLOCKS =====
  Pre: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<pre ${propStr(p, ["id", "class"])}>${children || ""}</pre>`,
  },
  Code: {
    import: ``,
    render: (p: ComponentProps, children: string) =>
      `<code ${propStr(p, ["id", "class"])}>${children || ""}</code>`,
  },
};
