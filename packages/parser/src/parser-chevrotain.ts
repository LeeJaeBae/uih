import { CstParser } from "chevrotain";
import {
  allTokens,
  Meta,
  Style,
  Layout,
  Motion,
  Logic,
  I18n,
  Bind,
  State,
  LCurly,
  RCurly,
  LParen,
  RParen,
  Colon,
  Semicolon,
  Comma,
  Arrow,
  Identifier,
  StringLiteral,
  NumberLiteral,
  On,
  If,
  Else,
  For,
  In,
  GreaterThan,
  LessThan,
  GreaterThanOrEqual,
  LessThanOrEqual,
  Equal,
  NotEqual,
  StrictEqual,
  StrictNotEqual,
  And,
  Or,
  Not,
} from "./lexer.js";

export class UIHParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  public uihFile = this.RULE("uihFile", () => {
    this.MANY(() => {
      this.SUBRULE(this.block);
    });
  });

  private block = this.RULE("block", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.metaBlock) },
      { ALT: () => this.SUBRULE(this.styleBlock) },
      { ALT: () => this.SUBRULE(this.layoutBlock) },
      { ALT: () => this.SUBRULE(this.motionBlock) },
      { ALT: () => this.SUBRULE(this.logicBlock) },
      { ALT: () => this.SUBRULE(this.i18nBlock) },
      { ALT: () => this.SUBRULE(this.bindBlock) },
      { ALT: () => this.SUBRULE(this.stateBlock) },
    ]);
  });

  private metaBlock = this.RULE("metaBlock", () => {
    this.CONSUME(Meta);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.keyValue);
    });
    this.CONSUME(RCurly);
  });

  private styleBlock = this.RULE("styleBlock", () => {
    this.CONSUME(Style);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.keyValue);
    });
    this.CONSUME(RCurly);
  });

  private layoutBlock = this.RULE("layoutBlock", () => {
    this.CONSUME(Layout);
    this.OPTION(() => {
      this.CONSUME(StringLiteral);
    });
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.node);
    });
    this.CONSUME(RCurly);
  });

  private node = this.RULE("node", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.element) },
      { ALT: () => this.SUBRULE(this.conditional) },
      { ALT: () => this.SUBRULE(this.loop) },
    ]);
  });

  private element = this.RULE("element", () => {
    this.CONSUME(Identifier);
    this.OPTION(() => {
      this.CONSUME(LParen);
      this.OPTION2(() => {
        this.SUBRULE(this.propList);
      });
      this.CONSUME(RParen);
    });
    this.OPTION3(() => {
      this.CONSUME(LCurly);
      this.OPTION4(() => {
        this.SUBRULE(this.textContent);
      });
      this.CONSUME(RCurly);
    });
  });

  // Allow both string literals and identifiers as text content
  private textContent = this.RULE("textContent", () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(Identifier) },
    ]);
  });

  private conditional = this.RULE("conditional", () => {
    this.CONSUME(If);
    this.CONSUME(LParen);
    this.SUBRULE(this.conditionExpression);
    this.CONSUME(RParen);
    this.SUBRULE(this.thenBlock);
    this.OPTION(() => {
      this.CONSUME(Else);
      this.SUBRULE(this.elseBlock);
    });
  });

  private conditionExpression = this.RULE("conditionExpression", () => {
    // Simple expression parsing: term (operator term)*
    this.SUBRULE(this.conditionTerm);

    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(GreaterThan) },
        { ALT: () => this.CONSUME(LessThan) },
        { ALT: () => this.CONSUME(GreaterThanOrEqual) },
        { ALT: () => this.CONSUME(LessThanOrEqual) },
        { ALT: () => this.CONSUME(Equal) },
        { ALT: () => this.CONSUME(NotEqual) },
        { ALT: () => this.CONSUME(StrictEqual) },
        { ALT: () => this.CONSUME(StrictNotEqual) },
        { ALT: () => this.CONSUME(And) },
        { ALT: () => this.CONSUME(Or) },
      ]);
      this.SUBRULE2(this.conditionTerm);
    });
  });

  private conditionTerm = this.RULE("conditionTerm", () => {
    this.OPTION(() => {
      this.CONSUME(Not);
    });
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => {
        this.CONSUME(LParen);
        this.SUBRULE(this.conditionExpression);
        this.CONSUME(RParen);
      }},
    ]);
  });

  private thenBlock = this.RULE("thenBlock", () => {
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.node);
    });
    this.CONSUME(RCurly);
  });

  private elseBlock = this.RULE("elseBlock", () => {
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.node);
    });
    this.CONSUME(RCurly);
  });

  private loop = this.RULE("loop", () => {
    this.CONSUME(For);
    this.CONSUME(LParen);
    this.CONSUME(Identifier); // iterator variable
    this.CONSUME(In);
    this.CONSUME2(Identifier); // iterable expression
    this.CONSUME(RParen);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.node);
    });
    this.CONSUME(RCurly);
  });

  private propList = this.RULE("propList", () => {
    this.SUBRULE(this.prop);
    this.MANY(() => {
      this.CONSUME(Comma);
      this.SUBRULE2(this.prop);
    });
  });

  private prop = this.RULE("prop", () => {
    this.SUBRULE(this.propName);
    this.CONSUME(Colon);
    this.SUBRULE(this.propValue);
  });

  // Allow both string literals and identifiers as property values
  private propValue = this.RULE("propValue", () => {
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(Identifier) },
    ]);
  });

  // Allow keywords as property names (e.g., for:"email", if:"condition")
  private propName = this.RULE("propName", () => {
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(For) },
      { ALT: () => this.CONSUME(In) },
      { ALT: () => this.CONSUME(On) },
      { ALT: () => this.CONSUME(If) },
      { ALT: () => this.CONSUME(Else) },
      { ALT: () => this.CONSUME(Meta) },
      { ALT: () => this.CONSUME(Style) },
      { ALT: () => this.CONSUME(Layout) },
      { ALT: () => this.CONSUME(Motion) },
      { ALT: () => this.CONSUME(Logic) },
      { ALT: () => this.CONSUME(I18n) },
      { ALT: () => this.CONSUME(Bind) },
      { ALT: () => this.CONSUME(State) },
    ]);
  });

  private motionBlock = this.RULE("motionBlock", () => {
    this.CONSUME(Motion);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.motionRule);
    });
    this.CONSUME(RCurly);
  });

  private motionRule = this.RULE("motionRule", () => {
    this.CONSUME(On);
    this.CONSUME(Identifier); // event name
    this.CONSUME(LParen);
    this.CONSUME2(Identifier); // selector
    this.CONSUME(RParen);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.keyValue);
    });
    this.CONSUME(RCurly);
  });

  private logicBlock = this.RULE("logicBlock", () => {
    this.CONSUME(Logic);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.logicEvent);
    });
    this.CONSUME(RCurly);
  });

  private logicEvent = this.RULE("logicEvent", () => {
    this.CONSUME(On);
    this.CONSUME(Identifier);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.keyValue);
    });
    this.CONSUME(RCurly);
  });

  private i18nBlock = this.RULE("i18nBlock", () => {
    this.CONSUME(I18n);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.keyValue);
    });
    this.CONSUME(RCurly);
  });

  private bindBlock = this.RULE("bindBlock", () => {
    this.CONSUME(Bind);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.bindMapping);
    });
    this.CONSUME(RCurly);
  });

  private bindMapping = this.RULE("bindMapping", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Arrow);
    this.CONSUME2(Identifier);
    this.CONSUME(Semicolon);
  });

  private stateBlock = this.RULE("stateBlock", () => {
    this.CONSUME(State);
    this.CONSUME(LCurly);
    this.MANY(() => {
      this.SUBRULE(this.stateDeclaration);
    });
    this.CONSUME(RCurly);
  });

  private stateDeclaration = this.RULE("stateDeclaration", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Colon);
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME2(Identifier) }, // for boolean: true/false
    ]);
    this.OPTION(() => {
      this.CONSUME(Semicolon);
    });
  });

  private keyValue = this.RULE("keyValue", () => {
    this.CONSUME(Identifier);
    this.CONSUME(Colon);
    this.CONSUME(StringLiteral);
    this.OPTION(() => {
      this.CONSUME(Semicolon);
    });
  });
}

// Export singleton instance
export const parserInstance = new UIHParser();
