/**
 * UIH VSCode Extension
 * Provides language support, AI code generation, and preview for .uih files
 */

import * as vscode from "vscode";
import { generateUIH, loadProjectContext } from "uih-ai";
import { pluginRegistry } from "uih-codegen-react";
import { parse } from "uih-parser";
import type { UIHFile, Node, ElementNode, StyleBlock } from "uih-parser";

export function activate(context: vscode.ExtensionContext) {
  console.log('UIH extension activated');

  // Register generate command
  const generateCommand = vscode.commands.registerCommand(
    "uih.generate",
    async () => {
      await handleGenerate(context);
    }
  );

  // Register preview command
  const previewCommand = vscode.commands.registerCommand(
    "uih.preview",
    async () => {
      await handlePreview(context);
    }
  );

  // Register compile command
  const compileCommand = vscode.commands.registerCommand(
    "uih.compile",
    async () => {
      await handleCompile();
    }
  );

  context.subscriptions.push(generateCommand, previewCommand, compileCommand);

  // Auto-preview if enabled
  const config = vscode.workspace.getConfiguration("uih");
  if (config.get("autoPreview")) {
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === "uih") {
        handlePreview(context);
      }
    });
  }
}

/**
 * Generate UIH code from natural language description
 */
async function handleGenerate(context: vscode.ExtensionContext) {
  // Get description from user
  const description = await vscode.window.showInputBox({
    prompt: "Describe the UI you want to generate",
    placeHolder: "e.g., 로그인 페이지 만들어줘",
    ignoreFocusOut: true,
  });

  if (!description) {
    return;
  }

  // Get API key
  const config = vscode.workspace.getConfiguration("uih");
  let apiKey = config.get<string>("anthropicApiKey");

  if (!apiKey) {
    apiKey = process.env.ANTHROPIC_API_KEY;
  }

  if (!apiKey) {
    const inputKey = await vscode.window.showInputBox({
      prompt: "Enter your Anthropic API key",
      placeHolder: "sk-ant-...",
      password: true,
      ignoreFocusOut: true,
    });

    if (!inputKey) {
      vscode.window.showErrorMessage(
        "API key required. Get one from https://console.anthropic.com/"
      );
      return;
    }

    apiKey = inputKey;

    // Ask to save
    const save = await vscode.window.showQuickPick(["Yes", "No"], {
      placeHolder: "Save API key to workspace settings?",
    });

    if (save === "Yes") {
      await config.update("anthropicApiKey", apiKey, vscode.ConfigurationTarget.Workspace);
    }
  }

  // Show progress
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Generating UIH code with Claude...",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ increment: 0, message: "Analyzing project context..." });

      // Load project context
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      const projectContext = workspaceFolder
        ? await loadProjectContext(workspaceFolder.uri.fsPath)
        : undefined;

      progress.report({ increment: 30, message: "Generating code..." });

      try {
        const result = await generateUIH({
          prompt: description,
          projectContext,
          apiKey,
        });

        progress.report({ increment: 60, message: "Validating..." });

        if (!result.isValid) {
          vscode.window.showErrorMessage(
            `Generated code has syntax errors: ${result.errors?.join(", ")}`
          );
          return;
        }

        progress.report({ increment: 90, message: "Creating file..." });

        // Create new file
        const doc = await vscode.workspace.openTextDocument({
          language: "uih",
          content: result.code,
        });

        await vscode.window.showTextDocument(doc);

        progress.report({ increment: 100 });

        vscode.window.showInformationMessage(
          `✅ Generated UIH code (${result.usage?.inputTokens}+${result.usage?.outputTokens} tokens)`
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(`Generation failed: ${error.message}`);
      }
    }
  );
}

/**
 * Preview compiled UI
 */
async function handlePreview(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (!editor || editor.document.languageId !== "uih") {
    vscode.window.showErrorMessage("Open a .uih file to preview");
    return;
  }

  const uihCode = editor.document.getText();

  try {
    // Parse UIH
    const ast = parse(uihCode);

    // Create webview panel
    const panel = vscode.window.createWebviewPanel(
      "uihPreview",
      "UIH Live Preview",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true, // Need scripts for Tailwind CSS
        localResourceRoots: [],
      }
    );

    // Set HTML content with live UI rendering
    panel.webview.html = getPreviewHtml(ast);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Preview failed: ${error.message}`);
  }
}

/**
 * Compile UIH to target framework
 */
async function handleCompile() {
  const editor = vscode.window.activeTextEditor;

  if (!editor || editor.document.languageId !== "uih") {
    vscode.window.showErrorMessage("Open a .uih file to compile");
    return;
  }

  // Ask for target framework
  const target = await vscode.window.showQuickPick(["react", "vue", "svelte"], {
    placeHolder: "Select target framework",
  });

  if (!target) {
    return;
  }

  const uihCode = editor.document.getText();

  try {
    // Parse UIH
    const ast = parse(uihCode);

    // Generate code
    const plugin = pluginRegistry.get(target);
    if (!plugin) {
      vscode.window.showErrorMessage(`Unknown target: ${target}`);
      return;
    }

    const code = await plugin.generate(ast);

    // Create output file
    const fileName = `Page${plugin.fileExtension}`;
    const doc = await vscode.workspace.openTextDocument({
      language: target === "react" ? "typescriptreact" : target,
      content: code,
    });

    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

    vscode.window.showInformationMessage(`✅ Compiled to ${target}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Compilation failed: ${error.message}`);
  }
}

/**
 * Generate preview HTML with live UI rendering
 */
function getPreviewHtml(ast: UIHFile): string {
  // Extract style tokens
  const styleBlock = ast.blocks.find(b => b.type === "Style") as StyleBlock | undefined;
  const cssVars = styleBlock ? generateCSSVariables(styleBlock.tokens) : "";

  // Extract layout nodes
  const layoutBlock = ast.blocks.find(b => b.type === "Layout");
  const htmlContent = layoutBlock ? renderNodes((layoutBlock as any).nodes) : "<p>No layout found</p>";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${cssVars}
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}

/**
 * Generate CSS variables from style tokens
 */
function generateCSSVariables(tokens: Record<string, string>): string {
  const vars = Object.entries(tokens)
    .map(([key, value]) => `  --${key.replace(/\./g, "-")}: ${value};`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}

/**
 * Render UIH nodes to HTML
 */
function renderNodes(nodes: Node[]): string {
  return nodes.map(node => renderNode(node)).join("\n");
}

/**
 * Render a single UIH node to HTML
 */
function renderNode(node: Node): string {
  if (node.kind === "Text") {
    return escapeHtml(node.text);
  }

  if (node.kind === "Element") {
    return renderElement(node);
  }

  if (node.kind === "Conditional") {
    // For preview, just render the then branch
    return renderNodes(node.thenNodes);
  }

  if (node.kind === "Loop") {
    // For preview, render once as example
    return `<div class="space-y-2">${renderNodes(node.children)}</div>`;
  }

  return "";
}

/**
 * Render an element node to HTML
 */
function renderElement(node: ElementNode): string {
  const tagName = getHTMLTag(node.name);
  const attrs = renderAttributes(node.props);
  const children = renderNodes(node.children);

  // Self-closing tags
  if (["img", "input", "br", "hr"].includes(tagName.toLowerCase())) {
    return `<${tagName}${attrs} />`;
  }

  return `<${tagName}${attrs}>${children}</${tagName}>`;
}

/**
 * Map UIH element names to HTML tags
 */
function getHTMLTag(name: string): string {
  const htmlElements: Record<string, string> = {
    // Layout
    Div: "div", Section: "section", Article: "article", Aside: "aside",
    Header: "header", Footer: "footer", Nav: "nav", Main: "main",
    // Text
    H1: "h1", H2: "h2", H3: "h3", H4: "h4", H5: "h5", H6: "h6",
    P: "p", Span: "span", Text: "span",
    // Form
    Form: "form", Input: "input", Textarea: "textarea", Button: "button",
    Label: "label", Select: "select", Option: "option",
    // List
    Ul: "ul", Ol: "ol", Li: "li",
    // Table
    Table: "table", Thead: "thead", Tbody: "tbody", Tr: "tr", Td: "td", Th: "th",
    // Media
    Img: "img", Video: "video", Audio: "audio",
    // Other
    A: "a", Card: "div", CardContent: "div"
  };

  return htmlElements[name] || "div";
}

/**
 * Render element attributes
 */
function renderAttributes(props: Array<{ key: string; value: string }>): string {
  if (props.length === 0) return "";

  const attrs = props.map(prop => {
    let value = prop.value;

    // Handle variable references {var}
    if (value.startsWith("{") && value.endsWith("}")) {
      value = value.slice(1, -1); // Remove braces for now
    }

    // Special attribute mappings
    if (prop.key === "class") {
      return `class="${escapeHtml(value)}"`;
    }

    return `${prop.key}="${escapeHtml(value)}"`;
  }).join(" ");

  return " " + attrs;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function deactivate() {
  console.log('UIH extension deactivated');
}
