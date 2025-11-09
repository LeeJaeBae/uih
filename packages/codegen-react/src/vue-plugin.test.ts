import { describe, it, expect } from "vitest";
import { generateVue } from "./index.js";
import type { UIHFile } from "uih-parser";

describe("Vue Code Generator", () => {
  describe("Basic Components", () => {
    it("should generate Button component", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Button",
                props: [{ key: "variant", value: "primary" }],
                children: [{ kind: "Text", text: "Click me" }],
              },
            ],
          },
        ],
      };

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<script setup");
      expect(code).toContain("<button variant=\"primary\">");
      expect(code).toContain("Click me");
    });

    it("should generate Input component", async () => {
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
                props: [
                  { key: "placeholder", value: "Enter text" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('<input placeholder="Enter text"');
    });
  });

  describe("State Block", () => {
    it("should generate ref declarations", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "State",
            declarations: [
              { name: "count", initialValue: 0 },
              { name: "isOpen", initialValue: false },
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import { ref } from "vue"');
      expect(code).toContain("const count = ref(0)");
      expect(code).toContain("const isOpen = ref(false)");
    });
  });

  describe("Data Block", () => {
    it("should generate useFetch composable", async () => {
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('const users = ref(null)');
      expect(code).toContain('const usersLoading = ref(true)');
      expect(code).toContain('fetch("/api/users")');
    });
  });

  describe("Conditional Rendering", () => {
    it("should generate v-if directive", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('v-if="isActive"');
      expect(code).toContain("<span");
    });

    it("should generate v-if v-else directives", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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
                    children: [{ kind: "Text", text: "Free" }],
                  },
                ],
              },
            ],
          },
        ],
      };

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('v-if="isPremium"');
      expect(code).toContain("v-else");
    });
  });

  describe("Loop Rendering", () => {
    it("should generate v-for directive", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('v-for="user in users"');
      expect(code).toContain(":key=");
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('import Counter from "./components/Counter"');
      expect(code).toContain(':initial="10"');
    });
  });

  describe("Tailwind CSS Support", () => {
    it("should preserve class attribute", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain('class="bg-blue-500 text-white px-4 py-2"');
    });
  });

  describe("CSS Variables", () => {
    it("should generate scoped style block with CSS variables", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "Style",
            tokens: {
              "color.primary": "#0E5EF7",
              "spacing.card": "1.5rem",
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<style scoped>");
      expect(code).toContain("--color-primary: #0e5ef7");
      expect(code).toContain("--spacing-card: 1.5rem");
    });
  });

  describe("HTML Elements", () => {
    it("should generate Div with Tailwind classes", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<div");
      expect(code).toContain('class="container mx-auto p-4"');
      expect(code).toContain("Hello World");
    });

    it("should generate heading tags", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<h1");
      expect(code).toContain('class="text-3xl font-bold"');
      expect(code).toContain("Main Title");
      expect(code).toContain("<h2");
      expect(code).toContain('class="text-2xl"');
      expect(code).toContain("Subtitle");
    });

    it("should generate Form element", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<form");
      expect(code).toContain('action="/submit"');
      expect(code).toContain('class="space-y-4"');
    });

    it("should generate Link (A) with href", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<a");
      expect(code).toContain('href="https://example.com"');
      expect(code).toContain('class="text-blue-500 underline"');
      expect(code).toContain("Click here");
    });

    it("should generate Image (Img) with src and alt", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<img");
      expect(code).toContain('src="/logo.png"');
      expect(code).toContain('alt="Logo"');
      expect(code).toContain('class="w-32 h-32"');
    });

    it("should generate semantic HTML elements", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<header");
      expect(code).toContain("<main");
      expect(code).toContain("<section");
      expect(code).toContain("<footer");
    });

    it("should generate list elements", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<ul");
      expect(code).toContain('class="list-disc"');
      expect(code).toContain("<li");
      expect(code).toContain("Item 1");
      expect(code).toContain("Item 2");
    });
  });

  describe("Variable References", () => {
    it("should render variable references with mustache syntax", async () => {
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("Count: {count}");
    });

    it("should render variable references in v-bind", async () => {
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain(":value=\"username\"");
    });
  });

  describe("Advanced Features", () => {
    it("should generate Table with accessibility attributes", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
        blocks: [
          {
            type: "Layout",
            nodes: [
              {
                kind: "Element",
                name: "Table",
                props: [
                  { key: "class", value: "w-full" },
                  { key: "role", value: "table" },
                ],
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
                            props: [{ key: "scope", value: "col" }],
                            children: [{ kind: "Text", text: "Name" }],
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

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<table");
      expect(code).toContain('role="table"');
      expect(code).toContain("<thead");
      expect(code).toContain("<th");
      expect(code).toContain('scope="col"');
    });

    it("should generate Video with event handlers", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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
                  { key: "onPlay", value: "{handlePlay}" },
                  { key: "aria-label", value: "Tutorial video" },
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<video");
      expect(code).toContain('src="/video.mp4"');
      expect(code).toContain(':onPlay="handlePlay"'); // Vue uses v-bind syntax
      expect(code).toContain('aria-label="Tutorial video"');
    });

    it("should generate Canvas element", async () => {
      const ast: UIHFile = {
        type: "UIHFile",
        imports: [],
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
                ],
                children: [],
              },
            ],
          },
        ],
      };

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<canvas");
      expect(code).toContain('width="800"');
      expect(code).toContain('height="600"');
    });
  });

  describe("Complete Integration", () => {
    it("should generate complete Vue SFC with all features", async () => {
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
            ],
          },
        ],
      };

      const code = await generateVue(ast);
      expect(code).toMatchSnapshot();
      expect(code).toContain("<script setup");
      expect(code).toContain("ref");
      expect(code).toContain("onMounted");
      expect(code).toContain("<style scoped>");
      expect(code).toContain("--color-primary");
    });
  });
});
