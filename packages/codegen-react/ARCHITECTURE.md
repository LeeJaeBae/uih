# Registry 계층 분리 아키텍처

## 개요

UIH 코드 생성기의 컴포넌트 레지스트리를 **프레임워크 독립적인 core-registry**와 **React 전용 shadcn-registry**로 분리하여 진짜 멀티 프레임워크 지원을 구현했습니다.

## 파일 구조

```
packages/codegen-react/src/
├── core-registry.ts      # 순수 HTML 요소 (42개) - 프레임워크 독립
├── shadcn-registry.ts    # shadcn/ui 컴포넌트 (28개) - React 전용
├── react-plugin.ts       # React 코드 생성 (core + shadcn 병합)
├── vue-plugin.ts         # Vue 코드 생성 (core만 사용)
├── svelte-plugin.ts      # Svelte 코드 생성 (core만 사용)
└── index.ts              # 통합 export
```

## 계층 분리 원칙

### 1. Core Registry (core-registry.ts)
**프레임워크 독립적인 순수 HTML 요소**

- **목적**: 모든 프레임워크에서 공통으로 사용 가능
- **의존성**: 없음 (순수 HTML만)
- **컴포넌트 수**: 42개

**카테고리**:
```typescript
// Layout (9개)
Div, Span, Section, Article, Aside, Header, Footer, Nav, Main

// Typography (7개)
P, H1, H2, H3, H4, H5, H6, Text

// Form (1개 - 기본 Form만)
Form

// List (3개)
Ul, Ol, Li

// Link & Media (2개)
A, Img

// Media Elements (3개)
Video, Audio, Source

// Table (7개)
Table, Thead, Tbody, Tfoot, Tr, Td, Th

// Form Extended (3개)
Option, Fieldset, Legend

// Canvas & SVG (2개)
Canvas, Svg

// Code (2개)
Pre, Code
```

### 2. Shadcn Registry (shadcn-registry.ts)
**React 전용 shadcn/ui 컴포넌트**

- **목적**: React 프로젝트에서 고급 UI 컴포넌트 사용
- **의존성**: `@/components/ui/*` (shadcn/ui)
- **컴포넌트 수**: 28개

**카테고리**:
```typescript
// Form Components (4개)
Button, Input, Textarea, Label

// Select Components (2개)
Select, SelectItem

// Checkbox & Radio (5개)
Checkbox, RadioGroup, RadioGroupItem, Switch

// Card (1개)
Card

// Badge & Avatar (2개)
Badge, Avatar

// Dialog & Tooltip (2개)
Dialog, Tooltip

// Sheet (1개)
Sheet

// Tabs (4개)
Tabs, TabsList, TabsTrigger, TabsContent

// Accordion (4개)
Accordion, AccordionItem, AccordionTrigger, AccordionContent

// Others (3개)
Separator, Alert, Progress, Skeleton
```

## 플러그인 동작

### React Plugin (react-plugin.ts)
```typescript
class ReactPlugin {
  private registry: Record<string, ComponentConfig>;

  constructor(useShadcn: boolean = true) {
    // shadcn이 core override (Button → shadcn Button)
    this.registry = useShadcn
      ? { ...coreRegistry, ...shadcnRegistry }
      : coreRegistry;  // 순수 HTML만
  }
}
```

**사용 예시**:
```typescript
// shadcn 사용 (기본값)
const plugin = createReactPlugin(true);
// Input → @/components/ui/input

// 순수 HTML만 사용
const plugin = createReactPlugin(false);
// Input → <input> (존재하지 않음, fallback)
```

### Vue Plugin (vue-plugin.ts)
```typescript
class VuePlugin {
  // core-registry만 사용
  // Button → <button>
  // Input → <input>
  // Card → <div>
}
```

### Svelte Plugin (svelte-plugin.ts)
```typescript
class SveltePlugin {
  // core-registry만 사용
  // Button → <button>
  // Input → <input>
  // Card → <div>
}
```

## 실제 출력 예시

### React (shadcn 사용)
```tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <Card>
      <CardContent>
        <Input placeholder="이름" />
        <Button>제출</Button>
      </CardContent>
    </Card>
  );
}
```

### Vue (순수 HTML)
```vue
<template>
  <div>
    <input placeholder="이름" />
    <button>제출</button>
  </div>
</template>
```

### Svelte (순수 HTML)
```svelte
<div>
  <input placeholder="이름" />
  <button>제출</button>
</div>
```

## 하위 호환성

기존 코드가 깨지지 않도록 backward compatibility alias 제공:

```typescript
// index.ts
export { shadcnRegistry as shadRegistry } from "./shadcn-registry.js";
```

**이전 코드**:
```typescript
import { shadRegistry } from "uih-codegen-react";
```

**새로운 코드 (권장)**:
```typescript
import { coreRegistry, shadcnRegistry } from "uih-codegen-react";
```

## 테스트 결과

```bash
✓ src/index.test.ts (38 tests)
✓ src/vue-plugin.test.ts (23 tests)
✓ src/svelte-plugin.test.ts (23 tests)

Test Files  3 passed (3)
Tests       84 passed (84)
```

## 미래 확장성

### 1. 브랜드 커스텀 레지스트리
```typescript
// custom-registry.ts
export const myBrandRegistry = {
  Button: {
    import: `import { MyButton } from "@my-brand/ui"`,
    render: (p, c) => `<MyButton ${propStr(p)}>${c}</MyButton>`,
  },
};

// React 플러그인에서 사용
const plugin = new ReactPlugin();
plugin.registry = { ...coreRegistry, ...myBrandRegistry };
```

### 2. 다른 React 컴포넌트 라이브러리
```typescript
// chakra-registry.ts
export const chakraRegistry = {
  Button: {
    import: `import { Button } from "@chakra-ui/react"`,
    render: (p, c) => `<Button ${propStr(p)}>${c}</Button>`,
  },
};
```

### 3. 프레임워크별 최적화
```typescript
// vue-optimized-registry.ts
// Vue 전용 최적화된 컴포넌트 (v-model, scoped slots 등)
```

## 설계 장점

1. **진짜 프레임워크 독립성**
   - Vue/Svelte는 shadcn 의존성 없음
   - 순수 HTML만 사용하여 번들 크기 최소화

2. **명확한 책임 분리**
   - core-registry: 범용 HTML
   - shadcn-registry: React 전용 UI 라이브러리

3. **확장 가능성**
   - 새로운 컴포넌트 라이브러리 추가 쉬움
   - 브랜드별 커스텀 레지스트리 생성 가능

4. **타입 안전성**
   - ComponentConfig 인터페이스 통일
   - TypeScript로 엄격한 타입 체크

5. **하위 호환성 보장**
   - 기존 코드 영향 없음
   - 점진적 마이그레이션 가능

## 마이그레이션 가이드

**기존 사용자**:
```typescript
// 변경 불필요 - 자동으로 작동
import { generateReact } from "uih-codegen-react";
```

**새로운 사용자**:
```typescript
// 명시적 레지스트리 선택
import { createReactPlugin, coreRegistry, shadcnRegistry } from "uih-codegen-react";

// shadcn 사용
const reactPlugin = createReactPlugin(true);

// 순수 HTML만 사용
const reactPlugin = createReactPlugin(false);
```

## 결론

Registry 계층 분리로 UIH는 진짜 멀티 프레임워크 코드 생성기가 되었습니다. React는 shadcn/ui의 풍부한 컴포넌트를 활용하고, Vue/Svelte는 가벼운 순수 HTML로 최적화됩니다.
