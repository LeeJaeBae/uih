import { createToken, Lexer } from "chevrotain";

// Keywords
export const Meta = createToken({ name: "Meta", pattern: /meta/ });
export const Style = createToken({ name: "Style", pattern: /style/ });
export const Layout = createToken({ name: "Layout", pattern: /layout/ });
export const Motion = createToken({ name: "Motion", pattern: /motion/ });
export const Logic = createToken({ name: "Logic", pattern: /logic/ });
export const I18n = createToken({ name: "I18n", pattern: /i18n/ });
export const Bind = createToken({ name: "Bind", pattern: /bind/ });
export const State = createToken({ name: "State", pattern: /state/ });
export const Data = createToken({ name: "Data", pattern: /data/ });
export const On = createToken({ name: "On", pattern: /on/ });
export const If = createToken({ name: "If", pattern: /if/ });
export const Else = createToken({ name: "Else", pattern: /else/ });
export const For = createToken({ name: "For", pattern: /for/ });
export const In = createToken({ name: "In", pattern: /in/ });
export const GET = createToken({ name: "GET", pattern: /GET/ });
export const POST = createToken({ name: "POST", pattern: /POST/ });
export const PUT = createToken({ name: "PUT", pattern: /PUT/ });
export const DELETE = createToken({ name: "DELETE", pattern: /DELETE/ });

// Identifiers and Literals
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_#][a-zA-Z0-9.\-_#]*/,
});

export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:[^"\\]|\\.)*"/,
});

export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /\d+(\.\d+)?/,
});

// Comparison Operators (must come before single-char operators)
export const GreaterThanOrEqual = createToken({ name: "GreaterThanOrEqual", pattern: />=/ });
export const LessThanOrEqual = createToken({ name: "LessThanOrEqual", pattern: /<=/ });
export const StrictEqual = createToken({ name: "StrictEqual", pattern: /===/ });
export const StrictNotEqual = createToken({ name: "StrictNotEqual", pattern: /!==/ });
export const Equal = createToken({ name: "Equal", pattern: /==/ });
export const NotEqual = createToken({ name: "NotEqual", pattern: /!=/ });
export const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });
export const LessThan = createToken({ name: "LessThan", pattern: /</ });

// Logical Operators
export const And = createToken({ name: "And", pattern: /&&/ });
export const Or = createToken({ name: "Or", pattern: /\|\|/ });
export const Not = createToken({ name: "Not", pattern: /!/ });

// Symbols
export const LCurly = createToken({ name: "LCurly", pattern: /{/ });
export const RCurly = createToken({ name: "RCurly", pattern: /}/ });
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Arrow = createToken({ name: "Arrow", pattern: /->/ });

// Comments (ignored)
export const LineComment = createToken({
  name: "LineComment",
  pattern: /\/\/[^\n\r]*/,
  group: Lexer.SKIPPED,
});

export const BlockComment = createToken({
  name: "BlockComment",
  pattern: /\/\*[\s\S]*?\*\//,
  group: Lexer.SKIPPED,
});

// Whitespace (ignored)
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// All tokens in order (keywords must come before Identifier)
// Comments and whitespace first (will be skipped)
export const allTokens = [
  LineComment,
  BlockComment,
  WhiteSpace,
  // Keywords first
  Meta,
  Style,
  Layout,
  Motion,
  Logic,
  I18n,
  Bind,
  State,
  Data,
  On,
  If,
  Else,
  For,
  In,
  GET,
  POST,
  PUT,
  DELETE,
  // Operators (longer patterns first)
  StrictEqual,
  StrictNotEqual,
  GreaterThanOrEqual,
  LessThanOrEqual,
  Equal,
  NotEqual,
  And,
  Or,
  GreaterThan,
  LessThan,
  Not,
  // Then identifiers and literals
  Identifier,
  StringLiteral,
  NumberLiteral,
  // Symbols
  Arrow,
  LCurly,
  RCurly,
  LParen,
  RParen,
  Colon,
  Semicolon,
  Comma,
];

export const UIHLexer = new Lexer(allTokens);
