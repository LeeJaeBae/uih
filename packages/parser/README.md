# uih-parser

UIH (Universal UI Hierarchy) 언어 파서 - Chevrotain 기반 구문 분석기

## 개요

uih-parser는 `.uih` 파일을 읽어 AST(Abstract Syntax Tree)로 변환하는 파서입니다. Chevrotain을 사용하여 정확한 구문 분석과 상세한 에러 메시지를 제공합니다.

## 설치

```bash
pnpm add uih-parser
```

## 사용법

### 기본 사용

```typescript
import { parse } from "uih-parser";

const source = `
meta {
  route: "/hello";
  theme: "light";
}

layout {
  Card(id:"welcome") { "Hello, UIH!" }
  Button(variant:"primary"){ "Click me" }
}
`;

const ast = parse(source);
console.log(ast);
```

### 출력 AST 구조

```typescript
{
  type: "UIHFile",
  blocks: [
    {
      type: "Meta",
      entries: {
        route: "/hello",
        theme: "light"
      }
    },
    {
      type: "Layout",
      mode: "default",
      nodes: [
        {
          kind: "Element",
          name: "Card",
          props: [{ key: "id", value: "welcome" }],
          children: [{ kind: "Text", text: "Hello, UIH!" }]
        },
        // ...
      ]
    }
  ]
}
```

## AST 타입

### UIHFile
```typescript
interface UIHFile {
  type: "UIHFile";
  blocks: Block[];
}
```

### 블록 타입
```typescript
type Block =
  | MetaBlock
  | StyleBlock
  | LayoutBlock
  | MotionBlock
  | LogicBlock
  | I18nBlock
  | BindBlock;
```

### MetaBlock
```typescript
interface MetaBlock {
  type: "Meta";
  entries: Record<string, Literal>;
}
```

### StyleBlock
```typescript
interface StyleBlock {
  type: "Style";
  tokens: Record<string, Literal>;
}
```

### LayoutBlock
```typescript
interface LayoutBlock {
  type: "Layout";
  mode?: string;
  nodes: Node[];
}

interface Node {
  kind: "Element" | "Text";
  name?: string;        // Element만
  props?: NodeProp[];   // Element만
  children?: Node[];
  text?: string;        // Text만
}
```

### LogicBlock
```typescript
interface LogicBlock {
  type: "Logic";
  events: LogicEvent[];
}

interface LogicEvent {
  name: string;
  steps: Expr[];
}
```

### I18nBlock
```typescript
interface I18nBlock {
  type: "I18n";
  entries: Record<string, Record<string, string>>;
  // 예: { greeting: { en: "Hello", ko: "안녕" } }
}
```

### BindBlock
```typescript
interface BindBlock {
  type: "Bind";
  map: Record<string, string>;
  // 예: { "#name": "user.name" }
}
```

## 에러 처리

파서는 구문 오류 발생 시 상세한 위치 정보와 함께 에러를 던집니다:

```typescript
try {
  const ast = parse(invalidSource);
} catch (error) {
  console.error(error.message);
  // 예: "Parser error at line 3, column 5: Expecting token of type StringLiteral"
}
```

## 파서 구조

### Lexer (lexer.ts)
토큰 정의 및 렉싱 규칙을 관리합니다.

**토큰 목록**:
- 키워드: `meta`, `style`, `layout`, `motion`, `logic`, `i18n`, `bind`, `on`
- 리터럴: 문자열, 식별자
- 구분자: `{`, `}`, `(`, `)`, `:`, `;`, `,`, `->`

### Parser (parser-chevrotain.ts)
Chevrotain 기반 구문 분석 규칙을 정의합니다.

**주요 규칙**:
- `uihFile`: 최상위 파일 구조
- `block`: 블록 타입 분기
- `metaBlock`, `styleBlock`, `layoutBlock` 등: 각 블록별 파싱
- `element`: 레이아웃 컴포넌트 파싱
- `keyValue`: 키-값 쌍 파싱

### Visitor (visitor.ts)
CST(Concrete Syntax Tree)를 AST로 변환합니다.

## 테스트

```bash
pnpm test
```

테스트는 vitest를 사용하며, 스냅샷 테스팅으로 AST 출력을 검증합니다.

## 개발

### 빌드
```bash
pnpm build
```

### 테스트 업데이트
```bash
pnpm test -- --update
```

## 라이선스

MIT
