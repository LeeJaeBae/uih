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
  On,
  If,
  Else,
  For,
  In,
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
        this.CONSUME(StringLiteral);
      });
      this.CONSUME(RCurly);
    });
  });

  private conditional = this.RULE("conditional", () => {
    this.CONSUME(If);
    this.CONSUME(LParen);
    this.CONSUME(Identifier); // condition expression
    this.CONSUME(RParen);
    this.SUBRULE(this.thenBlock);
    this.OPTION(() => {
      this.CONSUME(Else);
      this.SUBRULE(this.elseBlock);
    });
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
    this.CONSUME(StringLiteral);
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
