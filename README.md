# UIH - Universal UI Hierarchy

[![VS Code Extension](https://img.shields.io/visual-studio-marketplace/v/LeeJaeWon.vscode-uih?label=VS%20Code&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=LeeJaeWon.vscode-uih)
[![npm version](https://img.shields.io/npm/v/uih-cli?label=CLI)](https://www.npmjs.com/package/uih-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

인간이 작성한 UI 설명을 AI가 생성한 컴포넌트로 연결하는 범용 UI 메타 언어

## 소개

UIH는 선언적이고 직관적인 문법으로 UI를 정의하고, 이를 React, Vue, Svelte 등 다양한 프레임워크 코드로 변환하는 메타 언어입니다.

### 왜 UIH인가?

- **단순함**: HTML보다 간결하고 JSON보다 읽기 쉬운 문법
- **프레임워크 중립적**: 하나의 정의로 여러 프레임워크 코드 생성
- **AI 친화적**: LLM이 쉽게 생성하고 이해할 수 있는 구조
- **블록 기반**: 메타, 스타일, 레이아웃, 로직을 명확히 분리

## 빠른 시작

### 설치

**VSCode 확장 (권장)**:
1. VS Code에서 Extensions view 열기 (`Cmd+Shift+X`)
2. "UIH" 검색
3. Install 클릭

또는 [마켓플레이스에서 설치](https://marketplace.visualstudio.com/items?itemName=LeeJaeWon.vscode-uih)

**CLI 도구**:
```bash
# CLI 도구 설치
pnpm add -g uih-cli

# 또는 프로젝트에 추가
pnpm add -D uih-cli
```

### 첫 번째 UIH 파일 작성

**hello.uih**:
```
meta {
  route: "/hello";
  theme: "light";
}

layout "centered" {
  Card(id:"welcome") { "Hello, UIH!" }
  Input(id:"name", placeholder:"Enter your name")
  Button(variant:"primary"){ "Submit" }
}
```

### 컴파일

```bash
# React 컴포넌트 생성 (기본값)
uih compile hello.uih

# Vue 컴포넌트 생성
uih compile hello.uih --target vue

# Svelte 컴포넌트 생성
uih compile hello.uih --target svelte
```

**생성된 코드** (\`out/Page.tsx\` 또는 \`out/Page.vue\`):
```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <Card><CardContent>Hello, UIH!</CardContent></Card>
      <Input id="name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </div>
  )
}
```

## 문법 개요

### 7가지 블록 타입

```uih
meta {          # 메타정보 (라우트, 테마 등)
  route: "/app";
}

style {         # 디자인 토큰
  color.primary: "#0E5EF7";
}

layout {        # UI 컴포넌트 구조
  Card { "Content" }
}

motion {        # 애니메이션 (실험적)
  on hover(#btn) { scale: "1.05"; }
}

logic {         # 이벤트 핸들러
  on submit { navigate: "/next"; }
}

i18n {          # 다국어
  title.en: "Hello";
  title.ko: "안녕하세요";
}

bind {          # 데이터 바인딩
  #name -> user.name;
}
```

### 컴포넌트 문법

```uih
ComponentName(prop1:"value1", prop2:"value2") { "child text" }
```

**예시**:
```uih
Button(variant:"primary", size:"lg") { "Click me" }
Input(id:"email", type:"email", placeholder:"Email")
Card(id:"profile") { "User Profile" }
```

## 실전 예제

### 예약 폼

```uih
meta {
  route: "/booking";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  radius.card: "16px";
}

layout "centered" {
  Card(id:"booking") { "울릉도 여행 예약" }
  Input(id:"name", placeholder:"이름 입력")
  Input(id:"phone", placeholder:"전화번호")
  Input(id:"date", type:"date", placeholder:"날짜 선택")
  Button(variant:"primary"){ "예약하기" }
}

logic {
  on submit {
    navigate: "/complete";
    toast: "예약이 완료되었습니다";
  }
}

i18n {
  title.ko: "울릉도 여행 예약";
  title.en: "Ulleungdo Travel Booking";
  submit.ko: "예약하기";
  submit.en: "Book Now";
}

bind {
  #name -> booking.guestName;
  #phone -> booking.phoneNumber;
  #date -> booking.travelDate;
}
```

## 프로젝트 구조

```
uih/
├── packages/
│   ├── parser/          # Chevrotain 기반 파서
│   ├── codegen-react/   # React 코드 생성기
│   └── cli/             # CLI 도구
├── examples/            # 예제 .uih 파일
├── docs/
│   └── spec.md         # 언어 스펙 문서
└── README.md
```

## 플러그인 시스템

v0.6부터 UIH는 플러그인 기반 아키텍처로 여러 프레임워크를 지원합니다.

### 사용 가능한 플러그인

- **React Plugin**: React + TypeScript + shadcn/ui (기본값)
- **Vue Plugin**: Vue 3 Composition API + TypeScript
- **Svelte Plugin**: Svelte + TypeScript

### 플러그인 작성

커스텀 코드 생성기를 만들려면 `CodegenPlugin` 인터페이스를 구현하세요:

```typescript
import { CodegenPlugin, pluginRegistry } from "uih-codegen-react";
import type { UIHFile } from "uih-parser";

class MyFrameworkPlugin implements CodegenPlugin {
  readonly name = "myframework";
  readonly fileExtension = ".myext";

  async generate(file: UIHFile): Promise<string> {
    // AST를 프레임워크 코드로 변환
    return "/* generated code */";
  }
}

// 플러그인 등록
pluginRegistry.register(new MyFrameworkPlugin());
```

그런 다음 CLI에서 사용:

```bash
uih compile input.uih --target myframework
```

## 패키지

### [@uih/parser](packages/parser)
UIH 파일을 AST로 파싱합니다.

```typescript
import { parse } from "uih-parser";

const ast = parse(source);
```

### [@uih/codegen-react](packages/codegen-react)
AST를 React 컴포넌트 코드로 변환합니다.

```typescript
import { generateReact } from "uih-codegen-react";

const reactCode = generateReact(ast);
```

### [uih-cli](packages/cli)
커맨드라인 도구로 컴파일을 실행합니다.

```bash
# 기본 사용법
uih compile input.uih [outputDir]

# 타겟 프레임워크 지정
uih compile input.uih --target react   # React 컴포넌트 생성
uih compile input.uih --target vue     # Vue 3 컴포넌트 생성
uih compile input.uih --target svelte  # Svelte 컴포넌트 생성

# 파일 감시 모드
uih watch input.uih [outputDir] --target vue
```

## 개발

### 설치

```bash
pnpm install
```

### 빌드

```bash
pnpm build              # 전체 빌드
pnpm --filter <pkg> build   # 특정 패키지 빌드
```

### 테스트

```bash
pnpm test               # 전체 테스트
pnpm --filter <pkg> test    # 특정 패키지 테스트
```

### 개발 모드

```bash
pnpm dev                # CLI dev 모드 (examples/booking.uih 감시)
```

## 로드맵

### v0.6 (현재)
- ✅ 중첩된 조건/반복 최적화 (불필요한 Fragment 제거)
- ✅ 중첩 테스트 케이스 추가
- ✅ 복잡한 중첩 예제 (nested.uih)
- ✅ 플러그인 시스템 아키텍처
- ✅ Vue 코드 생성기 (Vue 3 Composition API)
- ✅ Svelte 코드 생성기 (Svelte + TypeScript)
- ✅ CLI --target 옵션 (react|vue|svelte)

### v0.5 (완료)
- ✅ 조건부 렌더링 (`if`, `else`)
- ✅ 반복 렌더링 (`for ... in`)
- ✅ AST 타입 시스템 개선 (Node union types)
- ✅ 예제 파일 추가 (conditional.uih, loop.uih)

### v0.4 (완료)
- ✅ Motion 블록 완성 (CSS 애니메이션)
- ✅ shadcn/ui 컴포넌트 12개 (Button, Input, Card, Textarea, Select, Checkbox, Label, Text, Badge, Avatar, Dialog, Tooltip)
- ✅ Motion/Logic 블록 테스트 완성

### v0.3 (완료)
- ✅ Chevrotain 기반 파서
- ✅ React 코드 생성 (shadcn/ui)
- ✅ 기본 CLI (compile, watch, validate)
- ✅ Prettier 통합
- ✅ Meta, Style, Layout, Logic, I18n, Bind 블록

### v1.0 (계획)
- 📋 온라인 플레이그라운드
- 📋 VSCode 확장
- 📋 주석 지원
- 📋 타입 검증

## 문서

- [언어 스펙](docs/spec.md) - UIH 문법 규칙 10가지
- [파서 구현](packages/parser/README.md) - Chevrotain 파서 가이드
- [코드 생성기](packages/codegen-react/README.md) - React 코드 생성 가이드
- [CLI 도구](packages/cli/README.md) - 커맨드라인 사용법
- [예제 파일](examples/) - 실전 UIH 파일

## 기여

### 커밋 컨벤션

```
<type>(<scope>): <subject>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**타입**:
- \`parser\`: 파서 로직 변경
- \`codegen\`: 코드 생성 변경
- \`cli\`: CLI 도구 변경
- \`lang\`: 언어 스펙 변경
- \`test\`: 테스트 추가/수정
- \`docs\`: 문서 작업
- \`build\`: 빌드 시스템 변경

**예시**:
```
parser: add support for nested elements in layout blocks
codegen(registry): add Tooltip and Dialog components
cli: implement --watch flag for auto-recompilation
```

## 라이선스

MIT © LeeJaeWon

---

**Made with ❤️ by LeeJaeWon**
