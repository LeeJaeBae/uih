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
  | BindBlock
  | StateBlock;

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

export type Node = ElementNode | TextNode | ConditionalNode | LoopNode;

export interface ElementNode {
  kind: "Element";
  name: string;
  props?: NodeProp[];
  children?: Node[];
  id?: string;
}

export interface TextNode {
  kind: "Text";
  text: string;
}

export interface ConditionalNode {
  kind: "Conditional";
  condition: string;
  thenNodes: Node[];
  elseNodes?: Node[];
}

export interface LoopNode {
  kind: "Loop";
  iteratorVar: string;
  iterableExpr: string;
  children: Node[];
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

export interface StateDeclaration {
  name: string;
  initialValue: Literal;
}

export interface StateBlock {
  type: "State";
  declarations: StateDeclaration[];
}
