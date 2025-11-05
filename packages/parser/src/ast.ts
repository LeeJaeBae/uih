export type Literal = string | number | boolean;

export interface UIHFile {
  type: "UIHFile";
  blocks: Block[];
}

export type Block =
  | MetaBlock
  | StyleBlock
  | LayoutBlock
  | MotionBlock
  | LogicBlock
  | I18nBlock
  | BindBlock;

export interface MetaBlock {
  type: "Meta";
  entries: Record<string, Literal>;
}
export interface StyleBlock {
  type: "Style";
  tokens: Record<string, Literal>;
}

export interface NodeProp {
  key: string;
  value: Literal;
}
export interface Node {
  kind: "Element" | "Text";
  name?: string; // Element만
  props?: NodeProp[];
  children?: Node[];
  text?: string; // Text만
  id?: string; // quick lookup
}

export interface LayoutBlock {
  type: "Layout";
  mode?: string;
  nodes: Node[];
}
export interface MotionRule {
  selector: string;
  event: string;
  props: Record<string, Literal>;
}
export interface MotionBlock {
  type: "Motion";
  rules: MotionRule[];
}

export type Expr =
  | { type: "Identifier"; name: string }
  | {
      type: "Call";
      method: "GET" | "POST";
      url: string;
      data?: Record<string, unknown>;
      alias?: string;
    }
  | { type: "Navigate"; to: string }
  | { type: "Toast"; message: string }
  | { type: "Guard"; check: string; elseToast?: string; stop?: boolean };

export interface LogicEvent {
  name: string;
  steps: Expr[];
}
export interface LogicBlock {
  type: "Logic";
  events: LogicEvent[];
}

export interface I18nBlock {
  type: "I18n";
  entries: Record<string, Record<string, string>>;
}
export interface BindBlock {
  type: "Bind";
  map: Record<string, string>;
}
