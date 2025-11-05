# uih-cli

UIH 파일을 React 컴포넌트로 컴파일하는 커맨드라인 도구

## 개요

uih-cli는 `.uih` 파일을 읽어 React + TypeScript 컴포넌트로 변환하는 CLI 도구입니다. 파싱과 코드 생성을 파이프라인으로 실행합니다.

## 설치

### 글로벌 설치
```bash
pnpm add -g uih-cli
```

### 로컬 설치 (프로젝트)
```bash
pnpm add -D uih-cli
```

## 사용법

### compile 명령

`.uih` 파일을 React 컴포넌트로 컴파일합니다.

```bash
uih compile <input.uih> [outputDir]
```

**파라미터**:
- `<input.uih>`: 입력 UIH 파일 (필수)
- `[outputDir]`: 출력 디렉토리 (선택, 기본값: `out`)

**예시**:
```bash
# 기본 출력 (out/Page.tsx)
uih compile examples/hello.uih

# 커스텀 출력 디렉토리
uih compile examples/booking.uih src/pages

# 상대 경로 사용
uih compile ./app.uih ./components
```

### 출력

컴파일 성공 시:
```bash
🧩 Parsed AST: { type: "UIHFile", blocks: [...] }
✅ Generated: /path/to/out/Page.tsx
```

## 예제

### 1. 간단한 Hello World

**입력** (`hello.uih`):
```
layout {
  Card(id:"welcome") { "Hello, UIH!" }
  Button(variant:"primary"){ "Get Started" }
}
```

**명령**:
```bash
uih compile hello.uih
```

**출력** (`out/Page.tsx`):
```tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="container mx-auto p-6">
      <Card><CardContent>Hello, UIH!</CardContent></Card>
      <Button variant="primary">Get Started</Button>
    </div>
  )
}
```

### 2. 예약 폼

**입력** (`booking.uih`):
```
meta {
  route: "/booking";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout "centered" {
  Card(id:"booking-card") { "울릉도 여행 예약" }
  Input(id:"name", placeholder:"이름 입력")
  Input(id:"phone", placeholder:"전화번호")
  Button(variant:"primary"){ "예약하기" }
}

logic {
  on submit {
    navigate: "/complete";
  }
}
```

**명령**:
```bash
uih compile booking.uih
```

## 워크플로우

### 개발 모드 (파일 감시)
```bash
pnpm dev
# 또는
node dist/index.js --watch examples/booking.uih
```

파일 변경 시 자동 재컴파일 (향후 `uih watch` 명령으로 지원 예정)

### 빌드 파이프라인 통합

**package.json**:
```json
{
  "scripts": {
    "uih:compile": "uih compile src/pages/**/*.uih src/generated",
    "build": "pnpm uih:compile && next build"
  }
}
```

## 디버깅

### AST 확인
CLI는 자동으로 파싱된 AST를 콘솔에 출력합니다:

```bash
uih compile app.uih
# 🧩 Parsed AST: {...}
```

### 에러 메시지
구문 오류 발생 시 상세한 위치 정보 제공:

```bash
Error: Parser error at line 5, column 12: Expecting token of type StringLiteral
```

## 향후 기능

### validate 명령 (개발 중)
UIH 파일의 구문을 검증만 수행:

```bash
uih validate <file.uih>
```

### watch 명령 (개발 중)
파일 변경 감지 및 자동 재컴파일:

```bash
uih watch <input.uih> [outputDir]
```

### init 명령 (계획 중)
새 UIH 프로젝트 초기화:

```bash
uih init my-project
```

### format 명령 (계획 중)
UIH 파일 포맷팅:

```bash
uih format <file.uih>
```

## 에러 해결

### "Layout block required"
- **원인**: UIH 파일에 `layout` 블록이 없음
- **해결**: 최소한 하나의 `layout` 블록 추가

### "Unknown command"
- **원인**: 지원하지 않는 명령어 사용
- **해결**: `uih compile` 명령 사용

### 파일을 찾을 수 없음
- **원인**: 입력 파일 경로가 잘못됨
- **해결**: 절대 경로 또는 올바른 상대 경로 사용

## 개발

### 빌드
```bash
pnpm build
```

### 테스트
```bash
pnpm test
```

E2E 테스트로 전체 컴파일 파이프라인을 검증합니다.

## 라이선스

MIT
