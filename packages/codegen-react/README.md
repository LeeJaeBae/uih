# uih-codegen-react

UIH AST를 React 컴포넌트 코드로 변환하는 코드 생성기

## 개요

uih-codegen-react는 UIH 파서가 생성한 AST를 받아 React + TypeScript 컴포넌트 코드를 생성합니다. 현재 shadcn/ui 컴포넌트를 기본으로 지원합니다.

## 설치

```bash
pnpm add uih-codegen-react uih-parser
```

## 사용법

### 기본 사용

```typescript
import { parse } from "uih-parser";
import { generateReact } from "uih-codegen-react";

const source = `
layout {
  Card(id:"demo") { "Hello" }
  Input(id:"name", placeholder:"Enter name")
  Button(variant:"primary"){ "Submit" }
}
`;

const ast = parse(source);
const reactCode = generateReact(ast);

console.log(reactCode);
```

### 출력 예시

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <Card><CardContent>Hello</CardContent></Card>
      <Input id="name" placeholder="Enter name" />
      <Button variant="primary">Submit</Button>
    </div>
  )
}
```

## 컴포넌트 레지스트리

현재 지원하는 컴포넌트 (shadcn/ui 기반):

### Button
```typescript
Button(variant:"primary", size:"default") { "Text" }
```
**Props**: `variant`, `size`

### Input
```typescript
Input(id:"username", placeholder:"Enter username", type:"text")
```
**Props**: `id`, `placeholder`, `type`

### Card
```typescript
Card { "Content" }
```
**Props**: 없음 (자동으로 CardContent로 래핑)

### Text
```typescript
Text { "Plain text" }
```
**Props**: 없음 (`<p>` 태그로 렌더링)

## API

### generateReact(ast: UIHFile): string

UIH AST를 React 컴포넌트 문자열로 변환합니다.

**파라미터**:
- `ast`: uih-parser가 생성한 UIHFile 객체

**반환값**:
- React + TypeScript 컴포넌트 코드 문자열

**예외**:
- Layout 블록이 없으면 `Error: Layout block required`

### 내부 구조

#### registry.ts
컴포넌트 매핑 정의:

```typescript
export const shadRegistry = {
  Button: {
    import: `import { Button } from "@/components/ui/button"`,
    render: (props, children) => `<Button ${propStr(props)}>...</Button>`
  },
  // ...
}
```

**커스텀 레지스트리 추가** (향후 지원 예정):
```typescript
import { shadRegistry } from "uih-codegen-react/registry";

export const myRegistry = {
  ...shadRegistry,
  MyComponent: {
    import: `import { MyComponent } from "@/components/MyComponent"`,
    render: (props, children) => `<MyComponent>${children}</MyComponent>`
  }
}
```

## 생성된 코드 특징

### Import 최적화
- 사용된 컴포넌트만 import
- 중복 import 자동 제거

### 구조
```tsx
// 1. Import 문
import { ... } from "..."

// 2. 컴포넌트 정의
export default function Page() {
  return (
    <div className="container mx-auto p-6">
      {/* 3. 생성된 JSX */}
    </div>
  )
}
```

### 컨테이너 스타일
기본적으로 Tailwind CSS를 사용한 컨테이너로 래핑:
- `container mx-auto p-6`

## 제한사항

### 현재 미지원
- ❌ Vue, Svelte 등 다른 프레임워크
- ❌ 컴포넌트 이벤트 핸들러 (logic 블록)
- ❌ 조건부 렌더링
- ❌ 반복 렌더링
- ❌ Style 블록 적용
- ❌ 다국어(i18n) 처리

### 향후 지원 계획
- ✅ Prettier 통합 (코드 포맷팅)
- ✅ 더 많은 shadcn/ui 컴포넌트
- ✅ 플러그인 시스템 (커스텀 레지스트리)
- ✅ Vue/Svelte 코드 생성기

## 테스트

```bash
pnpm test
```

스냅샷 테스트로 생성된 코드를 검증합니다.

## 개발

### 빌드
```bash
pnpm build
```

### 새 컴포넌트 추가
`src/registry.ts`에 정의 추가:

```typescript
export const shadRegistry = {
  // ...
  NewComponent: {
    import: `import { NewComponent } from "@/components/ui/new"`,
    render: (props: any, children: string) =>
      `<NewComponent ${propStr(props, ["prop1", "prop2"])}>${children}</NewComponent>`
  }
}
```

## 라이선스

MIT
