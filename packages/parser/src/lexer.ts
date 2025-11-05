import { createToken, Lexer } from "chevrotain";

// Keywords
export const Meta = createToken({ name: "Meta", pattern: /meta/ });
export const Style = createToken({ name: "Style", pattern: /style/ });
export const Layout = createToken({ name: "Layout", pattern: /layout/ });
export const Motion = createToken({ name: "Motion", pattern: /motion/ });
export const Logic = createToken({ name: "Logic", pattern: /logic/ });
export const I18n = createToken({ name: "I18n", pattern: /i18n/ });
export const Bind = createToken({ name: "Bind", pattern: /bind/ });
export const On = createToken({ name: "On", pattern: /on/ });
export const If = createToken({ name: "If", pattern: /if/ });
export const Else = createToken({ name: "Else", pattern: /else/ });
export const For = createToken({ name: "For", pattern: /for/ });
export const In = createToken({ name: "In", pattern: /in/ });

// Identifiers and Literals
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z_#][a-zA-Z0-9.\-_#]*/,
});

export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(?:[^"\\]|\\.)*"/,
});

// Symbols
export const LCurly = createToken({ name: "LCurly", pattern: /{/ });
export const RCurly = createToken({ name: "RCurly", pattern: /}/ });
export const LParen = createToken({ name: "LParen", pattern: /\(/ });
export const RParen = createToken({ name: "RParen", pattern: /\)/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Arrow = createToken({ name: "Arrow", pattern: /->/ });

// Whitespace (ignored)
export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// All tokens in order (keywords must come before Identifier)
export const allTokens = [
  WhiteSpace,
  // Keywords first
  Meta,
  Style,
  Layout,
  Motion,
  Logic,
  I18n,
  Bind,
  On,
  If,
  Else,
  For,
  In,
  // Then identifiers and literals
  Identifier,
  StringLiteral,
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
