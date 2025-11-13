#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { parse } from "uih-parser";
import { pluginRegistry } from "uih-codegen-react";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

// Create MCP server
const server = new Server(
  {
    name: "uih-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_uih_guide",
      description:
        "Get UIH language syntax guide and examples. Use this when you need to generate UIH code. Claude Code should read this guide and generate UIH code directly, without requiring external API calls.",
      inputSchema: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["full", "syntax", "examples", "components", "styling"],
            description: "Which section of the guide to retrieve",
            default: "full",
          },
        },
      },
    },
    {
      name: "compile_uih",
      description:
        "Compile UIH code to React, Vue, or Svelte component code. Returns the generated framework code as a string. When interactive=true, generates smart placeholders for Claude Code to implement logic automatically.",
      inputSchema: {
        type: "object",
        properties: {
          uih_code: {
            type: "string",
            description: "UIH code to compile",
          },
          target: {
            type: "string",
            enum: ["react", "vue", "svelte"],
            description: "Target framework (react, vue, or svelte)",
            default: "react",
          },
          interactive: {
            type: "boolean",
            description:
              "Generate interactive template with logic placeholders. When true, adds smart TODO comments for Claude Code to implement state management, validation, API calls, etc.",
            default: false,
          },
          features: {
            type: "array",
            items: {
              type: "string",
              enum: ["validation", "api", "animation", "modal", "tabs"],
            },
            description:
              "Specific features to generate placeholders for. If not provided, auto-detects from UIH AST. Options: validation, api, animation, modal, tabs",
          },
          output_file: {
            type: "string",
            description:
              "Optional file path to save the generated code (e.g., 'src/components/Login.tsx')",
          },
        },
        required: ["uih_code"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_uih_guide": {
        const { section = "full" } = args as { section?: string };

        console.error(`📖 Retrieving UIH guide: ${section}`);

        const guide = `# UIH Language Guide for Code Generation

## Quick Syntax Reference

### Basic Structure
\`\`\`uih
meta {
  route: "/path";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.secondary: "#6B7280";
}

layout {
  // Your UI components here
}
\`\`\`

### Available Components

#### Pure HTML Elements
- Div, Span, Section, Article, Header, Footer, Nav, Main, Aside
- H1, H2, H3, H4, H5, H6, P, Blockquote, Pre, Code
- A, Button, Input, Textarea, Select, Label, Form
- Ul, Ol, Li, Dl, Dt, Dd
- Img, Video, Audio, Canvas, Svg
- Table, Thead, Tbody, Tr, Th, Td

#### shadcn/ui Components
- Card, Button, Input, Textarea, Label
- Select, Checkbox, RadioGroup, Switch
- Dialog, Sheet, Popover, Tooltip
- Badge, Avatar, Alert, Progress
- Tabs, Accordion, Collapsible
- And many more...

### Styling with Tailwind CSS
\`\`\`uih
Div(class:"flex items-center justify-center min-h-screen bg-gray-50") {
  Card(class:"w-full max-w-md p-8 shadow-lg") {
    H2(class:"text-3xl font-bold mb-6 text-gray-900") { "Welcome" }
  }
}
\`\`\`

### Using CSS Variables
\`\`\`uih
style {
  color.primary: "#3B82F6";
}

layout {
  Button(class:"bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg") {
    "Click Me"
  }
}
\`\`\`

### Attributes
\`\`\`uih
Input(
  type:"email",
  placeholder:"Enter your email",
  class:"w-full px-4 py-2 border rounded-lg",
  required:true
)

A(href:"/about", target:"_blank", class:"text-blue-600 hover:underline") {
  "Learn More"
}
\`\`\`

## Common Patterns

### Login Form
\`\`\`uih
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
      H2(class:"text-3xl font-bold mb-6 text-center") { "Login" }

      Form(class:"space-y-4") {
        Div(class:"space-y-2") {
          Label(for:"email", class:"text-sm font-medium") { "Email" }
          Input(
            id:"email",
            type:"email",
            placeholder:"you@example.com",
            class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
          )
        }

        Div(class:"space-y-2") {
          Label(for:"password", class:"text-sm font-medium") { "Password" }
          Input(
            id:"password",
            type:"password",
            placeholder:"••••••••",
            class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
          )
        }

        Button(
          type:"submit",
          class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:opacity-90"
        ) {
          "Sign In"
        }
      }
    }
  }
}
\`\`\`

### Dashboard Card
\`\`\`uih
Card(class:"p-6 hover:shadow-lg transition-shadow") {
  Div(class:"flex items-center justify-between") {
    Div {
      P(class:"text-sm text-gray-600 mb-1") { "Total Users" }
      H3(class:"text-3xl font-bold text-gray-900") { "1,234" }
    }
    Div(class:"w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center") {
      Span(class:"text-2xl") { "👥" }
    }
  }
  P(class:"text-sm text-green-600 mt-4") { "↑ 12% from last month" }
}
\`\`\`

### Navigation Bar
\`\`\`uih
Nav(class:"bg-white shadow-sm border-b") {
  Div(class:"container mx-auto px-4") {
    Div(class:"flex items-center justify-between h-16") {
      // Logo
      A(href:"/", class:"text-2xl font-bold text-gray-900") { "Brand" }

      // Nav Links
      Div(class:"hidden md:flex space-x-8") {
        A(href:"/", class:"text-gray-700 hover:text-gray-900") { "Home" }
        A(href:"/about", class:"text-gray-700 hover:text-gray-900") { "About" }
        A(href:"/contact", class:"text-gray-700 hover:text-gray-900") { "Contact" }
      }

      // CTA Button
      Button(class:"bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700") {
        "Get Started"
      }
    }
  }
}
\`\`\`

## Best Practices

1. **Use semantic HTML elements** when possible (Header, Nav, Main, Footer)
2. **Leverage Tailwind CSS classes** for styling
3. **Use CSS variables** for theme colors
4. **Keep components simple** and focused
5. **Follow consistent spacing** with Tailwind utilities
6. **Use descriptive text** for accessibility

## When Generating UIH Code

1. Start with the \`meta\` block if routing is needed
2. Define CSS variables in \`style\` block for colors
3. Build the UI structure in \`layout\` block
4. Use appropriate semantic elements
5. Apply Tailwind CSS classes for styling
6. Test with different components (Card, Button, Input, etc.)

## Error Handling

- All blocks are optional except \`layout\`
- Strings must be in quotes: "text" or 'text'
- Attributes use colon syntax: \`class:"value"\`
- Children go inside curly braces: \`Div { ... }\`
`;

        return {
          content: [
            {
              type: "text",
              text: guide,
            },
          ],
        };
      }

      case "compile_uih": {
        const {
          uih_code,
          target = "react",
          interactive = false,
          features,
          output_file,
        } = args as {
          uih_code: string;
          target?: string;
          interactive?: boolean;
          features?: string[];
          output_file?: string;
        };

        console.error(
          `⚛️  Compiling UIH to ${target}${interactive ? " (interactive)" : ""}...`
        );

        // Parse UIH
        const ast = parse(uih_code);

        // Get plugin for target framework
        const plugin = pluginRegistry.get(target);
        if (!plugin) {
          throw new Error(
            `Unknown framework: ${target}. Available: ${pluginRegistry.getAvailablePlugins().join(", ")}`
          );
        }

        // Generate code with options
        const code = await plugin.generate(ast, { interactive, features });

        // Save to file if requested
        if (output_file) {
          const dir = dirname(output_file);
          mkdirSync(dir, { recursive: true });
          writeFileSync(output_file, code, "utf8");
          console.error(`✅ Saved ${target} code to: ${output_file}`);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  target,
                  code,
                  output_file: output_file || null,
                  message: output_file
                    ? `Compiled to ${target} and saved to ${output_file}`
                    : `Compiled to ${target} (not saved to file)`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(`❌ Error in ${name}:`, errorMessage);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: errorMessage,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("UIH MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
