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
});
