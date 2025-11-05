import { parseChevrotain } from "./index-chevrotain.js";
import type { UIHFile } from "./ast.js";

/**
 * UIH Parser (Chevrotain-based)
 *
 * Replaced regex-based parser with Chevrotain for:
 * - Proper nested structure support
 * - Better error messages with line/column info
 * - Maintainable grammar rules
 */

export function parse(source: string): UIHFile {
  return parseChevrotain(source);
}

export * from "./ast.js";
