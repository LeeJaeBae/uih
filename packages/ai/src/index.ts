/**
 * UIH AI Generator - Claude API Integration
 */

import Anthropic from "@anthropic-ai/sdk";
import { parse } from "uih-parser";
import { SYSTEM_PROMPT, generatePrompt } from "./prompts.js";

export interface GenerateOptions {
  /** Natural language description of the UI to generate */
  prompt: string;
  /** Optional project context (existing .uih files to learn patterns from) */
  projectContext?: string;
  /** Anthropic API key (if not set, reads from ANTHROPIC_API_KEY env var) */
  apiKey?: string;
  /** Claude model to use */
  model?: "claude-3-5-sonnet-20241022" | "claude-3-opus-20240229" | "claude-3-haiku-20240307";
  /** Maximum tokens for response */
  maxTokens?: number;
}

export interface GenerateResult {
  /** Generated UIH code */
  code: string;
  /** Whether the code was successfully parsed */
  isValid: boolean;
  /** Parse errors if validation failed */
  errors?: string[];
  /** Usage statistics from Claude API */
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Generate UIH code from natural language using Claude API
 */
export async function generateUIH(options: GenerateOptions): Promise<GenerateResult> {
  const {
    prompt,
    projectContext,
    apiKey = process.env.ANTHROPIC_API_KEY,
    model = "claude-3-5-sonnet-20241022",
    maxTokens = 4096,
  } = options;

  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY not found. Set it as an environment variable or pass it in options."
    );
  }

  // Initialize Anthropic client
  const client = new Anthropic({ apiKey });

  // Generate user prompt
  const userPrompt = generatePrompt(prompt, projectContext);

  try {
    // Call Claude API
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract generated code
    const generatedCode = response.content[0].type === "text" ? response.content[0].text : "";

    // Clean up the code (remove markdown code blocks if present)
    let cleanCode = generatedCode.trim();
    if (cleanCode.startsWith("```uih")) {
      cleanCode = cleanCode.replace(/^```uih\n/, "").replace(/\n```$/, "");
    } else if (cleanCode.startsWith("```")) {
      cleanCode = cleanCode.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Validate the generated code by parsing it
    let isValid = true;
    let errors: string[] = [];

    try {
      parse(cleanCode);
    } catch (error) {
      isValid = false;
      errors = [error instanceof Error ? error.message : String(error)];
    }

    return {
      code: cleanCode,
      isValid,
      errors: errors.length > 0 ? errors : undefined,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load project context from existing .uih files
 */
export async function loadProjectContext(directory: string): Promise<string> {
  const { analyzeProject, summarizeContext } = await import("./context.js");

  const context = analyzeProject(directory);

  if (context.fileCount === 0) {
    return `Project using UIH v0.7.1 with Tailwind CSS and shadcn/ui components.`;
  }

  return summarizeContext(context);
}

// Export prompts for testing and customization
export { SYSTEM_PROMPT, generatePrompt, EXAMPLE_PATTERNS } from "./prompts.js";

// Export context analysis utilities
export { analyzeProject, summarizeContext, type ProjectContext } from "./context.js";
