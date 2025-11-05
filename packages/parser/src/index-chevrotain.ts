import { UIHLexer } from "./lexer.js";
import { parserInstance } from "./parser-chevrotain.js";
import { visitor } from "./visitor.js";
import type { UIHFile } from "./ast.js";

export function parseChevrotain(source: string): UIHFile {
  // Lexing
  const lexResult = UIHLexer.tokenize(source);

  if (lexResult.errors.length > 0) {
    const error = lexResult.errors[0];
    throw new Error(
      `Lexer error at line ${error.line}, column ${error.column}: ${error.message}`
    );
  }

  // Parsing
  parserInstance.input = lexResult.tokens;
  const cst = parserInstance.uihFile();

  if (parserInstance.errors.length > 0) {
    const error = parserInstance.errors[0];
    throw new Error(
      `Parser error at line ${error.token.startLine}, column ${error.token.startColumn}: ${error.message}`
    );
  }

  // CST to AST
  const ast = visitor.visit(cst);
  return ast;
}

export * from "./ast.js";
