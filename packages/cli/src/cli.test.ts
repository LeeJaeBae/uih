import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CLI_PATH = resolve(__dirname, "../dist/index.js");
const TEST_DIR = resolve(__dirname, "../test-output");
const FIXTURES_DIR = resolve(__dirname, "../test-fixtures");

describe("UIH CLI E2E Tests", () => {
  beforeEach(() => {
    // Create test directories
    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true });
    }
    if (!existsSync(FIXTURES_DIR)) {
      mkdirSync(FIXTURES_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test output
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe("compile command", () => {
    it.skip("should compile basic UIH file to React component", () => {
      // Create test fixture
      const inputPath = resolve(FIXTURES_DIR, "basic.uih");
      const input = `
meta {
  route: "/test";
  theme: "light";
}

layout "centered" {
  Card(id:"demo") { "Test Card" }
  Button(variant:"primary"){ "Click" }
}
`;
      writeFileSync(inputPath, input, "utf8");

      // Run CLI
      const output = execSync(
        `node ${CLI_PATH} compile ${inputPath} ${TEST_DIR}`,
        { encoding: "utf8" }
      );

      // Verify output
      expect(output).toContain("Generated:");

      const generatedPath = resolve(TEST_DIR, "Page.tsx");
      expect(existsSync(generatedPath)).toBe(true);

      const generatedCode = readFileSync(generatedPath, "utf8");
      expect(generatedCode).toContain("import { Button }");
      expect(generatedCode).toContain("import { Card, CardContent }");
      expect(generatedCode).toContain("export default function Page()");
      expect(generatedCode).toMatchSnapshot();
    });

    it("should compile form example", () => {
      const inputPath = resolve(FIXTURES_DIR, "form.uih");
      const input = `
layout {
  Input(id:"name", placeholder:"이름")
  Input(id:"email", placeholder:"이메일", type:"email")
  Button(variant:"primary"){ "제출" }
}
`;
      writeFileSync(inputPath, input, "utf8");

      execSync(`node ${CLI_PATH} compile ${inputPath} ${TEST_DIR}`, {
        encoding: "utf8",
      });

      const generatedPath = resolve(TEST_DIR, "Page.tsx");
      const generatedCode = readFileSync(generatedPath, "utf8");

      expect(generatedCode).toContain("Input");
      expect(generatedCode).toContain("Button");
      expect(generatedCode).toContain('placeholder="이름"');
      expect(generatedCode).toContain('type="email"');
      expect(generatedCode).toMatchSnapshot();
    });

    it("should output AST to console", () => {
      const inputPath = resolve(FIXTURES_DIR, "minimal.uih");
      const input = `
layout {
  Text { "Hello" }
}
`;
      writeFileSync(inputPath, input, "utf8");

      const output = execSync(
        `node ${CLI_PATH} compile ${inputPath} ${TEST_DIR}`,
        { encoding: "utf8" }
      );

      expect(output).toContain("Parsed AST:");
      expect(output).toContain('"type": "UIHFile"');
      expect(output).toContain('"type": "Layout"');
    });
  });

  describe("error handling", () => {
    it("should show usage when no arguments provided", () => {
      try {
        execSync(`node ${CLI_PATH}`, { encoding: "utf8" });
      } catch (error: any) {
        expect(error.stdout).toContain("Usage: uih <command>");
        expect(error.stdout).toContain("compile");
        expect(error.stdout).toContain("validate");
        expect(error.stdout).toContain("watch");
        expect(error.status).toBe(1);
      }
    });

    it("should error on unknown command", () => {
      try {
        execSync(`node ${CLI_PATH} unknown test.uih`, { encoding: "utf8" });
      } catch (error: any) {
        expect(error.stderr).toContain("Unknown command");
        expect(error.status).toBe(1);
      }
    });
  });
});
