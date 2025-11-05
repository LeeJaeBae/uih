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
});
