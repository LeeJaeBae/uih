import { describe, it, expect } from "vitest";
import { generateReact } from "./index.js";
import type { UIHFile } from "uih-parser";

describe("React Code Generator", () => {
  describe("Basic Components", () => {
    it("should generate Button component", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            mode: "centered",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                props: [
                  { key: "variant", value: "primary" },
                ],
                children: [{ kind: "Text", text: "Click me" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import { Button }');
      expect(code).toContain('variant="primary"');
      expect(code).toContain('Click me');
    });

    it("should generate Input component", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Input",
                props: [
                  { key: "id", value: "username" },
                  { key: "placeholder", value: "Enter username" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import { Input }');
      expect(code).toContain('id="username"');
      expect(code).toContain('placeholder="Enter username"');
    });

    it("should generate Card component", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Card",
                props: [],
                children: [{ kind: "Text", text: "Card content" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import { Card, CardContent }');
      expect(code).toContain('Card content');
    });
  });

  describe("Multiple Components", () => {
    it("should generate form with multiple inputs", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            mode: "centered",
            nodes: [
              {
                kind: "Element",
                name: "Card",
                children: [{ kind: "Text", text: "User Registration" }],
              },
              {
                kind: "Element",
                name: "Input",
                props: [
                  { key: "id", value: "name" },
                  { key: "placeholder", value: "Name" },
                ],
                children: [],
              },
              {
                kind: "Element",
                name: "Input",
                props: [
                  { key: "id", value: "email" },
                  { key: "placeholder", value: "Email" },
                  { key: "type", value: "email" },
                ],
                children: [],
              },
              {
                kind: "Element",
                name: "Button",
                props: [{ key: "variant", value: "primary" }],
                children: [{ kind: "Text", text: "Submit" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import { Button }');
      expect(code).toContain('import { Input }');
      expect(code).toContain('import { Card, CardContent }');
    });
  });

  describe("Import Deduplication", () => {
    it("should deduplicate imports for same component used multiple times", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                children: [{ kind: "Text", text: "Button 1" }],
              },
              {
                kind: "Element",
                name: "Button",
                children: [{ kind: "Text", text: "Button 2" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      const importMatches = code.match(/import { Button }/g);
      expect(importMatches).toHaveLength(1);
    });
  });

  describe("Error Handling", () => {
    it("should throw error when layout block is missing", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Meta",
            entries: { route: "/test" },
          },
        ],
      };

      await expect(generateReact(ast)).rejects.toThrow("Layout block required");
    });
  });

  describe("Conditional Rendering", () => {
    it("should generate single-node conditional without Fragment", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Conditional",
                condition: "isActive",
                thenNodes: [
                  {
                    kind: "Element",
                    name: "Badge",
                    children: [{ kind: "Text", text: "Active" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("{isActive && <Badge");
      expect(code).not.toContain("<><Badge");
    });

    it("should generate multi-node conditional with Fragment", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Conditional",
                condition: "isLoggedIn",
                thenNodes: [
                  {
                    kind: "Element",
                    name: "Button",
                    children: [{ kind: "Text", text: "Logout" }],
                  },
                  {
                    kind: "Element",
                    name: "Badge",
                    children: [{ kind: "Text", text: "Premium" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("{isLoggedIn && (");
      expect(code).toContain("<>");
      expect(code).toContain("<Button");
      expect(code).toContain("<Badge");
    });

    it("should generate ternary with single nodes without Fragment", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Conditional",
                condition: "isPremium",
                thenNodes: [
                  {
                    kind: "Element",
                    name: "Badge",
                    props: [{ key: "variant", value: "success" }],
                    children: [{ kind: "Text", text: "Premium" }],
                  },
                ],
                elseNodes: [
                  {
                    kind: "Element",
                    name: "Badge",
                    props: [{ key: "variant", value: "default" }],
                    children: [{ kind: "Text", text: "Free" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("{isPremium ?");
      expect(code).toContain("<Badge variant=\"success\">Premium</Badge>");
      expect(code).toContain("<Badge variant=\"default\">Free</Badge>");
      expect(code).not.toContain("<><Badge");
    });
  });

  describe("Loop Rendering", () => {
    it("should generate loop with React.Fragment", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Loop",
                iteratorVar: "user",
                iterableExpr: "users",
                children: [
                  {
                    kind: "Element",
                    name: "Card",
                    children: [{ kind: "Text", text: "User" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("users.map((user) =>");
      expect(code).toContain("React.Fragment");
      expect(code).toContain("key={user.id || Math.random()}");
    });
  });

  describe("Nested Control Flow", () => {
    it("should handle nested conditional in loop", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Loop",
                iteratorVar: "item",
                iterableExpr: "items",
                children: [
                  {
                    kind: "Element",
                    name: "Card",
                    children: [{ kind: "Text", text: "Item" }],
                  },
                  {
                    kind: "Conditional",
                    condition: "item.isActive",
                    thenNodes: [
                      {
                        kind: "Element",
                        name: "Badge",
                        children: [{ kind: "Text", text: "Active" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("items.map((item) =>");
      expect(code).toContain("{item.isActive &&");
      expect(code).toContain("<Badge");
    });

    it("should handle loop inside conditional", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Conditional",
                condition: "hasItems",
                thenNodes: [
                  {
                    kind: "Loop",
                    iteratorVar: "item",
                    iterableExpr: "items",
                    children: [
                      {
                        kind: "Element",
                        name: "Badge",
                        children: [{ kind: "Text", text: "Item" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("{hasItems &&");
      expect(code).toContain("items.map((item) =>");
    });
  });

  describe("State Block", () => {
    it("should generate useState hooks", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "State",
            declarations: [
              { name: "count", initialValue: 0 },
              { name: "isOpen", initialValue: false },
              { name: "message", initialValue: "" },
            ],
          },
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Text",
                children: [{ kind: "Text", text: "Count: {count}" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("const [count, setCount] = useState(0)");
      expect(code).toContain("const [isOpen, setIsOpen] = useState(false)");
      expect(code).toContain('const [message, setMessage] = useState("")');
    });
  });

  describe("Data Block", () => {
    it("should generate SWR data fetching", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "Data",
            fetches: [
              {
                name: "users",
                method: "GET",
                url: "/api/users",
              },
            ],
          },
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Text",
                children: [{ kind: "Text", text: "Users loaded" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import useSWR from "swr"');
      expect(code).toContain('data: users');
      expect(code).toContain('error: usersError');
      expect(code).toContain('isLoading: usersLoading');
    });
  });

  describe("Import Statements", () => {
    it("should handle imported components", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [
          {
            type: "Import",
            names: ["Counter"],
            from: "./components/Counter.uih",
          },
        ],
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Counter",
                props: [{ key: "initial", value: 10 }],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import Counter from "./components/Counter"');
      expect(code).toContain('<Counter initial={10} />');
    });

    it("should handle multiple imports", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [
          {
            type: "Import",
            names: ["Button", "Input"],
            from: "./components",
          },
        ],
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                children: [{ kind: "Text", text: "Click" }],
              },
              {
                kind: "Element",
                name: "Input",
                props: [{ key: "placeholder", value: "Type here" }],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import { Button, Input } from "./components"');
    });
  });

  describe("Variable References", () => {
    it("should render variable references in text", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "State",
            declarations: [
              { name: "count", initialValue: 0 },
            ],
          },
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Text",
                children: [{ kind: "Text", text: "Count: {count}" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("Count: {count}");
    });

    it("should render variable references in props", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Input",
                props: [{ key: "value", value: "{username}" }],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("value={username}");
    });
  });

  describe("Tailwind CSS Support", () => {
    it("should convert class to className", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                props: [
                  { key: "class", value: "bg-blue-500 text-white px-4 py-2" },
                ],
                children: [{ kind: "Text", text: "Click me" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('className="bg-blue-500 text-white px-4 py-2"');
      expect(code).not.toContain('class=');
    });
  });

  describe("CSS Variables", () => {
    it("should generate CSS variables from style block", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Style",
            tokens: {
              "color.primary": "#0E5EF7",
              "spacing.card": "1.5rem",
              "radius.button": "8px",
            },
          },
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                children: [{ kind: "Text", text: "Button" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("--color-primary: #0E5EF7");
      expect(code).toContain("--spacing-card: 1.5rem");
      expect(code).toContain("--radius-button: 8px");
      expect(code).toContain("dangerouslySetInnerHTML");
    });
  });

  describe("HTML Elements", () => {
    it("should generate Div with Tailwind classes", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Div",
                props: [
                  { key: "class", value: "container mx-auto p-4" },
                ],
                children: [{ kind: "Text", text: "Hello World" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<div");
      expect(code).toContain('className="container mx-auto p-4"');
      expect(code).toContain("Hello World");
      expect(code).not.toContain("import");
    });

    it("should generate heading tags", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "H1",
                props: [
                  { key: "class", value: "text-3xl font-bold" },
                ],
                children: [{ kind: "Text", text: "Main Title" }],
              },
              {
                kind: "Element",
                name: "H2",
                props: [
                  { key: "class", value: "text-2xl" },
                ],
                children: [{ kind: "Text", text: "Subtitle" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<h1");
      expect(code).toContain('className="text-3xl font-bold"');
      expect(code).toContain("Main Title");
      expect(code).toContain("<h2");
      expect(code).toContain('className="text-2xl"');
      expect(code).toContain("Subtitle");
    });

    it("should generate Form element", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Form",
                props: [
                  { key: "action", value: "/submit" },
                  { key: "class", value: "space-y-4" },
                ],
                children: [{ kind: "Text", text: "Form content" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<form");
      expect(code).toContain('action="/submit"');
      expect(code).toContain('className="space-y-4"');
    });

    it("should generate Link (A) with href", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "A",
                props: [
                  { key: "href", value: "https://example.com" },
                  { key: "class", value: "text-blue-500 underline" },
                ],
                children: [{ kind: "Text", text: "Click here" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<a");
      expect(code).toContain('href="https://example.com"');
      expect(code).toContain('className="text-blue-500 underline"');
      expect(code).toContain("Click here");
    });

    it("should generate Image (Img) with src and alt", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Img",
                props: [
                  { key: "src", value: "/logo.png" },
                  { key: "alt", value: "Logo" },
                  { key: "class", value: "w-32 h-32" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<img");
      expect(code).toContain('src="/logo.png"');
      expect(code).toContain('alt="Logo"');
      expect(code).toContain('className="w-32 h-32"');
    });

    it("should generate semantic HTML elements", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Header",
                props: [{ key: "class", value: "bg-gray-100" }],
                children: [{ kind: "Text", text: "Header" }],
              },
              {
                kind: "Element",
                name: "Main",
                props: [{ key: "class", value: "container" }],
                children: [
                  {
                    kind: "Element",
                    name: "Section",
                    children: [{ kind: "Text", text: "Content" }],
                  },
                ],
              },
              {
                kind: "Element",
                name: "Footer",
                props: [{ key: "class", value: "mt-8" }],
                children: [{ kind: "Text", text: "Footer" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<header");
      expect(code).toContain("<main");
      expect(code).toContain("<section");
      expect(code).toContain("<footer");
    });

    it("should generate list elements", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Ul",
                props: [{ key: "class", value: "list-disc" }],
                children: [
                  {
                    kind: "Element",
                    name: "Li",
                    children: [{ kind: "Text", text: "Item 1" }],
                  },
                  {
                    kind: "Element",
                    name: "Li",
                    children: [{ kind: "Text", text: "Item 2" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<ul");
      expect(code).toContain('className="list-disc"');
      expect(code).toContain("<li");
      expect(code).toContain("Item 1");
      expect(code).toContain("Item 2");
    });
  });

  describe("Media Elements", () => {
    it("should generate Video element with controls", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Video",
                props: [
                  { key: "src", value: "/video.mp4" },
                  { key: "controls", value: true },
                  { key: "class", value: "w-full" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<video");
      expect(code).toContain('src="/video.mp4"');
      expect(code).toContain("controls");
      expect(code).toContain('className="w-full"');
    });

    it("should generate Audio element with Source children", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Audio",
                props: [{ key: "controls", value: true }],
                children: [
                  {
                    kind: "Element",
                    name: "Source",
                    props: [
                      { key: "src", value: "/audio.mp3" },
                      { key: "type", value: "audio/mpeg" },
                    ],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<audio");
      expect(code).toContain("<source");
      expect(code).toContain('src="/audio.mp3"');
      expect(code).toContain('type="audio/mpeg"');
    });
  });

  describe("Table Elements", () => {
    it("should generate complete table structure", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Table",
                props: [{ key: "class", value: "w-full" }],
                children: [
                  {
                    kind: "Element",
                    name: "Thead",
                    children: [
                      {
                        kind: "Element",
                        name: "Tr",
                        children: [
                          {
                            kind: "Element",
                            name: "Th",
                            children: [{ kind: "Text", text: "Name" }],
                          },
                          {
                            kind: "Element",
                            name: "Th",
                            children: [{ kind: "Text", text: "Age" }],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    kind: "Element",
                    name: "Tbody",
                    children: [
                      {
                        kind: "Element",
                        name: "Tr",
                        children: [
                          {
                            kind: "Element",
                            name: "Td",
                            children: [{ kind: "Text", text: "John" }],
                          },
                          {
                            kind: "Element",
                            name: "Td",
                            children: [{ kind: "Text", text: "30" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<table");
      expect(code).toContain("<thead");
      expect(code).toContain("<tbody");
      expect(code).toContain("<tr");
      expect(code).toContain("<th");
      expect(code).toContain("<td");
    });
  });

  describe("Event Handlers", () => {
    it("should generate onClick event handler", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                props: [
                  { key: "onClick", value: "{handleClick}" },
                  { key: "class", value: "btn-primary" },
                ],
                children: [{ kind: "Text", text: "Click me" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("onClick={handleClick}");
      expect(code).toContain('className="btn-primary"');
    });

    it("should generate onChange event handler for inputs", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Input",
                props: [
                  { key: "onChange", value: "{handleChange}" },
                  { key: "value", value: "{inputValue}" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("onChange={handleChange}");
      expect(code).toContain("value={inputValue}");
    });
  });

  describe("Accessibility Attributes", () => {
    it("should generate aria-label attribute", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                props: [
                  { key: "aria-label", value: "Close dialog" },
                  { key: "class", value: "close-btn" },
                ],
                children: [{ kind: "Text", text: "X" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('aria-label="Close dialog"');
    });

    it("should generate role attribute", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Div",
                props: [
                  { key: "role", value: "navigation" },
                  { key: "aria-label", value: "Main navigation" },
                ],
                children: [{ kind: "Text", text: "Nav content" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('role="navigation"');
      expect(code).toContain('aria-label="Main navigation"');
    });

    it("should generate multiple aria attributes", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Input",
                props: [
                  { key: "aria-required", value: "true" },
                  { key: "aria-invalid", value: "false" },
                  { key: "aria-describedby", value: "error-msg" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('aria-required="true"');
      expect(code).toContain('aria-invalid="false"');
      expect(code).toContain('aria-describedby="error-msg"');
    });
  });

  describe("Canvas and SVG", () => {
    it("should generate Canvas element", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Canvas",
                props: [
                  { key: "width", value: "800" },
                  { key: "height", value: "600" },
                  { key: "id", value: "myCanvas" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<canvas");
      expect(code).toContain('width="800"');
      expect(code).toContain('height="600"');
      expect(code).toContain('id="myCanvas"');
    });

    it("should generate SVG element", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Svg",
                props: [
                  { key: "viewBox", value: "0 0 100 100" },
                  { key: "class", value: "icon" },
                ],
                children: [{ kind: "Text", text: "SVG content" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<svg");
      expect(code).toContain('viewBox="0 0 100 100"');
      expect(code).toContain('className="icon"');
    });
  });

  describe("Complete Integration", () => {
    it("should generate complete page with all features", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [
          {
            type: "Import",
            names: ["CustomHeader"],
            from: "./components/Header.uih",
          },
        ],
        blocks: [
          {
            type: "Meta",
            entries: {
              route: "/dashboard",
              theme: "light",
            },
          },
          {
            type: "Style",
            tokens: {
              "color.primary": "#0E5EF7",
            },
          },
          {
            type: "State",
            declarations: [
              { name: "count", initialValue: 0 },
            ],
          },
          {
            type: "Data",
            fetches: [
              {
                name: "users",
                method: "GET",
                url: "/api/users",
              },
            ],
          },
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "CustomHeader",
                children: [],
              },
              {
                kind: "Element",
                name: "Text",
                props: [{ key: "class", value: "text-2xl font-bold" }],
                children: [{ kind: "Text", text: "Count: {count}" }],
              },
              {
                kind: "Element",
                name: "Button",
                props: [
                  { key: "class", value: "bg-[var(--color-primary)]" },
                ],
                children: [{ kind: "Text", text: "Increment" }],
              },
            ],
          },
        ],
      };

      const code = await generateReact(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import CustomHeader from "./components/Header"');
      expect(code).toContain("useState");
      expect(code).toContain("useSWR");
      expect(code).toContain("--color-primary");
      expect(code).toContain("className=");
    });
  });
});
