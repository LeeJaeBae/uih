import { parserInstance } from "./parser-chevrotain.js";
import type {
  UIHFile,
  ImportStatement,
  MetaBlock,
  StyleBlock,
  LayoutBlock,
  MotionBlock,
  LogicBlock,
  I18nBlock,
  BindBlock,
  StateBlock,
  StateDeclaration,
  DataBlock,
  DataFetch,
  Node,
  ElementNode,
  TextNode,
  ConditionalNode,
  LoopNode,
  NodeProp,
  MotionRule,
  LogicEvent,
} from "./ast.js";

const BaseCstVisitor = parserInstance.getBaseCstVisitorConstructor();

export class UIHVisitor extends BaseCstVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  uihFile(ctx: any): UIHFile {
    const imports = ctx.importStatement?.map((i: any) => this.visit(i)) ?? [];
    const blocks = ctx.block?.map((b: any) => this.visit(b)) ?? [];
    return { type: "UIHFile", imports, blocks };
  }

  block(ctx: any) {
    if (ctx.metaBlock) return this.visit(ctx.metaBlock);
    if (ctx.styleBlock) return this.visit(ctx.styleBlock);
    if (ctx.layoutBlock) return this.visit(ctx.layoutBlock);
    if (ctx.motionBlock) return this.visit(ctx.motionBlock);
    if (ctx.logicBlock) return this.visit(ctx.logicBlock);
    if (ctx.i18nBlock) return this.visit(ctx.i18nBlock);
    if (ctx.bindBlock) return this.visit(ctx.bindBlock);
    if (ctx.stateBlock) return this.visit(ctx.stateBlock);
    if (ctx.dataBlock) return this.visit(ctx.dataBlock);
    return null;
  }

  metaBlock(ctx: any): MetaBlock {
    const entries: Record<string, any> = {};
    ctx.keyValue?.forEach((kv: any) => {
      const result = this.visit(kv);
      entries[result.key] = result.value;
    });
    return { type: "Meta", entries };
  }

  styleBlock(ctx: any): StyleBlock {
    const tokens: Record<string, any> = {};
    ctx.keyValue?.forEach((kv: any) => {
      const result = this.visit(kv);
      tokens[result.key] = result.value;
    });
    return { type: "Style", tokens };
  }

  layoutBlock(ctx: any): LayoutBlock {
    const mode = ctx.StringLiteral?.[0]
      ? stripQuotes(ctx.StringLiteral[0].image)
      : "default";
    const nodes = ctx.node?.map((n: any) => this.visit(n)) ?? [];
    return { type: "Layout", mode, nodes };
  }

  node(ctx: any): Node {
    if (ctx.element) return this.visit(ctx.element);
    if (ctx.conditional) return this.visit(ctx.conditional);
    if (ctx.loop) return this.visit(ctx.loop);
    throw new Error("Invalid node type");
  }

  element(ctx: any): ElementNode {
    const name = ctx.Identifier[0].image;
    const props: NodeProp[] = ctx.propList
      ? this.visit(ctx.propList[0])
      : [];
    const text = ctx.textContent ? this.visit(ctx.textContent[0]) : undefined;
    const children: Node[] = text ? [{ kind: "Text", text }] : [];

    return {
      kind: "Element",
      name,
      props,
      children,
    };
  }

  textContent(ctx: any): string {
    if (ctx.StringLiteral) {
      return stripQuotes(ctx.StringLiteral[0].image);
    }
    if (ctx.Identifier) {
      // Return identifier as expression (e.g., item.name)
      return `{${ctx.Identifier[0].image}}`;
    }
    return "";
  }

  conditional(ctx: any): ConditionalNode {
    const condition = this.visit(ctx.conditionExpression[0]);
    const thenNodes = ctx.thenBlock ? this.visit(ctx.thenBlock[0]) : [];
    const elseNodes = ctx.elseBlock ? this.visit(ctx.elseBlock[0]) : undefined;

    return {
      kind: "Conditional",
      condition,
      thenNodes,
      elseNodes,
    };
  }

  conditionExpression(ctx: any): string {
    // Build expression string from all tokens
    const parts: string[] = [];

    // Collect all operators into a single array with their positions
    const operators: Array<{pos: number, text: string}> = [];

    const operatorTypes = [
      'GreaterThan', 'LessThan', 'GreaterThanOrEqual', 'LessThanOrEqual',
      'Equal', 'NotEqual', 'StrictEqual', 'StrictNotEqual',
      'And', 'Or'
    ];

    operatorTypes.forEach(opType => {
      if (ctx[opType]) {
        ctx[opType].forEach((token: any) => {
          operators.push({
            pos: token.startOffset,
            text: token.image
          });
        });
      }
    });

    // Sort operators by position
    operators.sort((a, b) => a.pos - b.pos);

    // Build expression
    parts.push(this.visit(ctx.conditionTerm[0]));

    for (let i = 0; i < operators.length; i++) {
      parts.push(operators[i].text);
      if (i + 1 < ctx.conditionTerm.length) {
        parts.push(this.visit(ctx.conditionTerm[i + 1]));
      }
    }

    return parts.join(" ");
  }

  conditionTerm(ctx: any): string {
    let result = "";

    // Optional NOT operator
    if (ctx.Not) {
      result += "!";
    }

    // Term value
    if (ctx.Identifier) {
      result += ctx.Identifier[0].image;
    } else if (ctx.NumberLiteral) {
      result += ctx.NumberLiteral[0].image;
    } else if (ctx.conditionExpression) {
      result += "(" + this.visit(ctx.conditionExpression[0]) + ")";
    }

    return result;
  }

  thenBlock(ctx: any): Node[] {
    return ctx.node?.map((n: any) => this.visit(n)) ?? [];
  }

  elseBlock(ctx: any): Node[] {
    return ctx.node?.map((n: any) => this.visit(n)) ?? [];
  }

  loop(ctx: any): LoopNode {
    const iteratorVar = ctx.Identifier[0].image;
    const iterableExpr = ctx.Identifier[1].image;
    const children = ctx.node?.map((n: any) => this.visit(n)) ?? [];

    return {
      kind: "Loop",
      iteratorVar,
      iterableExpr,
      children,
    };
  }

  propList(ctx: any): NodeProp[] {
    return ctx.prop?.map((p: any) => this.visit(p)) ?? [];
  }

  prop(ctx: any): NodeProp {
    const key = ctx.propName ? this.visit(ctx.propName[0]) : ctx.Identifier[0].image;
    const value = ctx.propValue ? this.visit(ctx.propValue[0]) : "";
    return {
      key,
      value,
    };
  }

  propValue(ctx: any): string {
    if (ctx.StringLiteral) {
      return stripQuotes(ctx.StringLiteral[0].image);
    }
    // Explicit variable reference: {identifier}
    if (ctx.LCurly && ctx.RCurly) {
      // Identifier is at position [1] due to CONSUME2
      const varName = ctx.Identifier[1]?.image || ctx.Identifier[0]?.image;
      return `{${varName}}`;
    }
    if (ctx.Identifier) {
      // Bare identifier (for backward compatibility)
      return `{${ctx.Identifier[0].image}}`;
    }
    return "";
  }

  propName(ctx: any): string {
    // Return the image of whichever token matched
    if (ctx.Identifier) return ctx.Identifier[0].image;
    if (ctx.For) return ctx.For[0].image;
    if (ctx.In) return ctx.In[0].image;
    if (ctx.On) return ctx.On[0].image;
    if (ctx.If) return ctx.If[0].image;
    if (ctx.Else) return ctx.Else[0].image;
    if (ctx.Meta) return ctx.Meta[0].image;
    if (ctx.Style) return ctx.Style[0].image;
    if (ctx.Layout) return ctx.Layout[0].image;
    if (ctx.Motion) return ctx.Motion[0].image;
    if (ctx.Logic) return ctx.Logic[0].image;
    if (ctx.I18n) return ctx.I18n[0].image;
    if (ctx.Bind) return ctx.Bind[0].image;
    throw new Error("Invalid propName");
  }

  motionBlock(ctx: any): MotionBlock {
    const rules = ctx.motionRule?.map((r: any) => this.visit(r)) ?? [];
    return { type: "Motion", rules };
  }

  motionRule(ctx: any): MotionRule {
    const event = ctx.Identifier[0].image;
    const selector = ctx.Identifier[1].image;
    const props: Record<string, any> = {};
    ctx.keyValue?.forEach((kv: any) => {
      const result = this.visit(kv);
      props[result.key] = result.value;
    });
    return { selector, event, props };
  }

  logicBlock(ctx: any): LogicBlock {
    const events = ctx.logicEvent?.map((e: any) => this.visit(e)) ?? [];
    return { type: "Logic", events };
  }

  logicEvent(ctx: any): LogicEvent {
    const name = ctx.Identifier[0].image;
    const kv = ctx.keyValue?.map((k: any) => this.visit(k)) ?? [];
    const steps: any[] = [];

    kv.forEach((item: any) => {
      if (item.key === "navigate") {
        steps.push({ type: "Navigate", to: item.value });
      } else if (item.key === "toast") {
        steps.push({ type: "Toast", message: item.value });
      } else if (item.key === "POST") {
        steps.push({ type: "Call", method: "POST", url: item.value });
      }
    });

    return { name, steps };
  }

  i18nBlock(ctx: any): I18nBlock {
    const entries: Record<string, Record<string, string>> = {};
    ctx.keyValue?.forEach((kv: any) => {
      const result = this.visit(kv);
      const [name, locale] = result.key.split(".");
      entries[name] ??= {};
      entries[name][locale] = result.value;
    });
    return { type: "I18n", entries };
  }

  bindBlock(ctx: any): BindBlock {
    const map: Record<string, string> = {};
    ctx.bindMapping?.forEach((bm: any) => {
      const result = this.visit(bm);
      map[result.from] = result.to;
    });
    return { type: "Bind", map };
  }

  bindMapping(ctx: any) {
    return {
      from: ctx.Identifier[0].image,
      to: ctx.Identifier[1].image,
    };
  }

  stateBlock(ctx: any): StateBlock {
    const declarations = ctx.stateDeclaration?.map((d: any) => this.visit(d)) ?? [];
    return { type: "State", declarations };
  }

  stateDeclaration(ctx: any): StateDeclaration {
    const name = ctx.Identifier[0].image;
    let initialValue: any;

    if (ctx.StringLiteral) {
      initialValue = stripQuotes(ctx.StringLiteral[0].image);
    } else if (ctx.NumberLiteral) {
      initialValue = parseFloat(ctx.NumberLiteral[0].image);
    } else if (ctx.Identifier && ctx.Identifier[1]) {
      // Boolean: true/false
      const val = ctx.Identifier[1].image;
      initialValue = val === "true" ? true : val === "false" ? false : val;
    }

    return { name, initialValue };
  }

  dataBlock(ctx: any): DataBlock {
    const fetches = ctx.dataFetch?.map((f: any) => this.visit(f)) ?? [];
    return { type: "Data", fetches };
  }

  dataFetch(ctx: any): DataFetch {
    const name = ctx.Identifier[0].image;
    let method: "GET" | "POST" | "PUT" | "DELETE" = "GET";

    if (ctx.GET) method = "GET";
    else if (ctx.POST) method = "POST";
    else if (ctx.PUT) method = "PUT";
    else if (ctx.DELETE) method = "DELETE";

    const url = stripQuotes(ctx.StringLiteral[0].image);

    return { name, method, url };
  }

  keyValue(ctx: any) {
    return {
      key: ctx.Identifier[0].image,
      value: stripQuotes(ctx.StringLiteral[0].image),
    };
  }

  importStatement(ctx: any): ImportStatement {
    const names = ctx.Identifier.map((id: any) => id.image);
    const from = stripQuotes(ctx.StringLiteral[0].image);
    return { type: "Import", names, from };
  }
}

function stripQuotes(str: string): string {
  return str.replace(/^"(.*)"$/, "$1");
}

export const visitor = new UIHVisitor();
