import { parserInstance } from "./parser-chevrotain.js";
import type {
  UIHFile,
  MetaBlock,
  StyleBlock,
  LayoutBlock,
  MotionBlock,
  LogicBlock,
  I18nBlock,
  BindBlock,
  Node,
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
    const blocks = ctx.block?.map((b: any) => this.visit(b)) ?? [];
    return { type: "UIHFile", blocks };
  }

  block(ctx: any) {
    if (ctx.metaBlock) return this.visit(ctx.metaBlock);
    if (ctx.styleBlock) return this.visit(ctx.styleBlock);
    if (ctx.layoutBlock) return this.visit(ctx.layoutBlock);
    if (ctx.motionBlock) return this.visit(ctx.motionBlock);
    if (ctx.logicBlock) return this.visit(ctx.logicBlock);
    if (ctx.i18nBlock) return this.visit(ctx.i18nBlock);
    if (ctx.bindBlock) return this.visit(ctx.bindBlock);
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
    const nodes = ctx.element?.map((e: any) => this.visit(e)) ?? [];
    return { type: "Layout", mode, nodes };
  }

  element(ctx: any): Node {
    const name = ctx.Identifier[0].image;
    const props: NodeProp[] = ctx.propList
      ? this.visit(ctx.propList[0])
      : [];
    const text = ctx.StringLiteral?.[0]
      ? stripQuotes(ctx.StringLiteral[0].image)
      : undefined;
    const children = text ? [{ kind: "Text" as const, text }] : [];

    return {
      kind: "Element",
      name,
      props,
      children,
    };
  }

  propList(ctx: any): NodeProp[] {
    return ctx.prop?.map((p: any) => this.visit(p)) ?? [];
  }

  prop(ctx: any): NodeProp {
    return {
      key: ctx.Identifier[0].image,
      value: stripQuotes(ctx.StringLiteral[0].image),
    };
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

  keyValue(ctx: any) {
    return {
      key: ctx.Identifier[0].image,
      value: stripQuotes(ctx.StringLiteral[0].image),
    };
  }
}

function stripQuotes(str: string): string {
  return str.replace(/^"(.*)"$/, "$1");
}

export const visitor = new UIHVisitor();
