# UIH VSCode Extension 사용 가이드

VSCode에서 UIH 파일을 직접 작성하고, AI로 생성하고, 실시간으로 미리보기할 수 있는 확장 프로그램입니다.

## 설치

### 방법 1: VSIX 파일로 설치 (로컬)

```bash
# 확장 패키지 생성
cd packages/vscode
pnpm package

# VSCode에서 설치
code --install-extension uih-vscode-0.7.1.vsix
```

### 방법 2: VSCode Marketplace (향후 배포 예정)

```
VSCode Extensions 패널 → "UIH Language Support" 검색 → Install
```

## 설정

### 1. API 키 설정 (AI 생성 기능 사용 시)

**방법 A: VSCode 설정**
```json
// settings.json
{
  "uih.anthropicApiKey": "sk-ant-..."
}
```

**방법 B: 환경 변수**
```bash
export ANTHROPIC_API_KEY=your-key-here
```

### 2. 타겟 프레임워크 설정

```json
// settings.json
{
  "uih.targetFramework": "react"  // "react" | "vue" | "svelte"
}
```

### 3. 자동 미리보기 (선택사항)

```json
// settings.json
{
  "uih.autoPreview": true  // .uih 파일 열 때 자동으로 미리보기
}
```

## 주요 기능

### 🤖 AI 코드 생성

**명령어**: `UIH: Generate from Description`

1. `Cmd+Shift+P` (Windows: `Ctrl+Shift+P`)
2. "UIH: Generate from Description" 입력
3. 원하는 UI 설명 입력
   ```
   예: "로그인 페이지 만들어줘"
   예: "대시보드 with stats cards"
   예: "프로필 설정 페이지"
   ```
4. 자동으로 UIH 코드 생성
5. 새 파일이 열리고 코드가 표시됨

**프로젝트 컨텍스트 자동 학습**
- 현재 워크스페이스의 기존 .uih 파일들을 분석
- 색상 스킴, 컴포넌트 패턴 자동 추출
- 일관된 스타일로 코드 생성

### 🎨 실시간 미리보기

**명령어**: `UIH: Preview UI`

**방법 1: 툴바 아이콘**
- .uih 파일 열기
- 상단 툴바의 👁️ 아이콘 클릭
- 우측에 컴파일된 코드 미리보기 표시

**방법 2: 명령 팔레트**
- `Cmd+Shift+P`
- "UIH: Preview UI" 입력

**미리보기 기능**
- 선택한 프레임워크로 실시간 컴파일
- 생성된 코드 표시
- 다음 단계 가이드 제공

### ⚙️ 프레임워크 컴파일

**명령어**: `UIH: Compile to Framework`

1. .uih 파일 열기
2. 툴바의 ⚙️ 아이콘 클릭 (또는 명령 팔레트)
3. 타겟 프레임워크 선택 (React/Vue/Svelte)
4. 컴파일된 코드가 새 탭에서 열림
5. 프로젝트에 복사해서 사용

### 🌈 문법 강조

.uih 파일 열면 자동으로 적용:
- **블록 타입**: `meta`, `style`, `layout`, `logic` 등
- **컴포넌트**: `Button`, `Card`, `Input` 등
- **Props**: `class`, `variant`, `onClick` 등
- **조건문/반복문**: `if`, `for`, `else`
- **주석**: `# 주석 내용`

## 사용 예시

### 예시 1: AI로 새 페이지 생성

```
1. Cmd+Shift+P
2. "UIH: Generate from Description"
3. 입력: "회원가입 페이지 만들어줘"
4. 결과:
   - 자동으로 meta, style, layout 블록 생성
   - 기존 프로젝트의 색상 스킴 유지
   - Form, Input, Button 컴포넌트 사용
   - Tailwind 클래스 자동 적용
```

### 예시 2: 기존 파일 미리보기

```
1. examples/login.uih 파일 열기
2. 툴바의 👁️ 아이콘 클릭
3. React 코드 미리보기 표시
4. 설정에서 Vue로 변경 → 다시 미리보기
```

### 예시 3: React로 컴파일

```
1. dashboard.uih 파일 열기
2. 툴바의 ⚙️ 아이콘 클릭
3. "react" 선택
4. Page.tsx 코드가 새 탭에서 열림
5. 코드 복사해서 프로젝트에 붙여넣기
```

## 단축키 (커스터마이징 가능)

VSCode 설정에서 단축키 지정:

```json
// keybindings.json
[
  {
    "key": "cmd+shift+g",
    "command": "uih.generate"
  },
  {
    "key": "cmd+shift+p",
    "command": "uih.preview",
    "when": "resourceLangId == uih"
  }
]
```

## 워크플로우

### 전형적인 개발 플로우

```
1. 새 기능 계획
   └→ "결제 페이지 만들어줘" (AI 생성)

2. 생성된 코드 확인
   └→ 미리보기로 React 코드 확인

3. 필요 시 수정
   └→ .uih 파일 직접 편집
   └→ 실시간으로 미리보기 업데이트

4. 프레임워크로 컴파일
   └→ React/Vue/Svelte 선택
   └→ 생성된 코드 프로젝트에 통합

5. 다음 컴포넌트 반복
   └→ 프로젝트 컨텍스트가 자동으로 학습됨
   └→ 일관된 스타일 유지
```

## 문제 해결

### API 키 오류

```
Error: ANTHROPIC_API_KEY not found

해결:
1. settings.json에 API 키 추가
2. 또는 환경 변수로 설정
3. 확장 다시 시작
```

### 구문 오류

```
Error: Parse failed

해결:
1. UIH 구문 확인 (CLAUDE.md 참고)
2. 블록이 제대로 닫혔는지 확인 ({ } 매칭)
3. 속성 구문 확인 (key:value; 형식)
```

### 미리보기 안 보임

```
해결:
1. .uih 파일이 열려있는지 확인
2. 파일이 저장되었는지 확인
3. VSCode 재시작
```

## 고급 기능

### 프로젝트 컨텍스트 활용

확장이 자동으로 분석하는 항목:
- ✅ 색상 스킴 (style 블록의 color.* 변수)
- ✅ 자주 사용하는 컴포넌트
- ✅ Tailwind 클래스 패턴
- ✅ 레이아웃 구조

**활용 방법**:
```
프로젝트에 이미 10개의 .uih 파일이 있고
모두 color.primary: "#0E5EF7" 사용 중

→ 새로 생성하는 파일도 자동으로 같은 색상 사용
→ 일관된 디자인 시스템 유지
```

### 배치 생성

여러 페이지를 한 번에 생성:

```bash
# CLI와 VSCode 확장 병행 사용
uih generate "로그인" -o pages/login.uih
uih generate "회원가입" -o pages/signup.uih
uih generate "비밀번호 찾기" -o pages/reset.uih

# VSCode에서 각 파일 열어서 미리보기/수정
```

## 개발

### 확장 개발 모드

```bash
cd packages/vscode

# Watch 모드로 빌드
pnpm build:watch

# VSCode에서 F5 눌러서 Extension Development Host 실행
```

### 디버깅

```
1. packages/vscode 열기
2. F5 누르기 (Extension Development Host 시작)
3. 새 VSCode 창에서 확장 테스트
4. Console에서 로그 확인
```

## 다음 단계

- [ ] 자동완성 (IntelliSense) 추가
- [ ] 코드 스니펫 추가
- [ ] 린트/포매터 통합
- [ ] Marketplace 배포
- [ ] 온보딩 튜토리얼

## 링크

- [UIH 저장소](https://github.com/LeeJaeBae/uih)
- [문서](https://github.com/LeeJaeBae/uih#readme)
- [이슈 신고](https://github.com/LeeJaeBae/uih/issues)

## 라이선스

MIT
