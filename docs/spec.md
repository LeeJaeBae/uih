# UIH Language Specification

UIH (Universal UI Hierarchy)는 인간이 작성한 UI 설명을 AI가 생성한 컴포넌트로 변환하는 메타 언어입니다.

## 📐 10가지 핵심 문법 규칙

### 1. 파일 구조: 블록 기반 구성
UIH 파일은 7가지 블록 타입으로 구성됩니다.
```
meta { ... }      # 메타데이터
style { ... }     # 스타일 토큰
layout { ... }    # UI 구조
motion { ... }    # 애니메이션
logic { ... }     # 이벤트 로직
i18n { ... }      # 다국어
bind { ... }      # 데이터 바인딩
```

### 2. Meta 블록: 페이지 메타정보
키-값 쌍으로 라우트, 테마 등 메타정보를 정의합니다.
```
meta {
  route: "/booking";
  theme: "light";
}
```

### 3. Style 블록: 디자인 토큰
점(`.`) 표기법으로 네임스페이스를 구분합니다.
```
style {
  color.primary: "#0E5EF7";
  radius.card: "16px";
  spacing.base: "8px";
}
```

### 4. Layout 블록: UI 컴포넌트 구조
레이아웃 모드(선택)와 컴포넌트 트리를 정의합니다.
```
layout "centered" {
  Card(id:"welcome") { "안녕하세요" }
  Input(id:"name", placeholder:"이름")
  Button(variant:"primary"){ "제출" }
}
```

### 5. 컴포넌트 문법: 대문자 시작
```
ComponentName(prop1:"value1", prop2:"value2") { "child text" }
```
- 컴포넌트명: 대문자로 시작
- Props: 괄호 안에 쉼표로 구분
- Children: 중괄호 안에 텍스트 또는 중첩 컴포넌트

### 6. Logic 블록: 이벤트 핸들러
`on 이벤트명 { 액션 }` 형식으로 로직을 정의합니다.
```
logic {
  on submit {
    navigate: "/complete";
    toast: "제출 완료";
  }
}
```

### 7. I18n 블록: 다국어 지원
`키.로케일: "번역문"` 형식으로 번역을 정의합니다.
```
i18n {
  greeting.en: "Hello";
  greeting.ko: "안녕하세요";
  greeting.ja: "こんにちは";
}
```

### 8. Bind 블록: 데이터 바인딩
`셀렉터 -> 데이터경로;` 형식으로 UI와 데이터를 연결합니다.
```
bind {
  #name -> user.name;
  #email -> user.email;
  #age -> user.profile.age;
}
```

### 9. Motion 블록: 애니메이션 (실험적)
```
motion {
  on hover(#button) {
    scale: "1.05";
    duration: "200ms";
  }
}
```

### 10. 주석 및 공백
- 현재 주석은 미지원 (향후 `//`, `/* */` 지원 예정)
- 공백, 줄바꿈, 들여쓰기는 무시됨
- 세미콜론(`;`)은 선택사항이지만 권장

## 🔧 타입 시스템

### 값 타입
- **문자열**: `"value"` (큰따옴표 필수)
- **식별자**: `name`, `color.primary`, `#id-selector`
- **예약어**: `meta`, `style`, `layout`, `motion`, `logic`, `i18n`, `bind`, `on`

### 식별자 규칙
- 영문자, 숫자, `.`, `-`, `_`, `#` 사용 가능
- 첫 문자: 영문자, `_`, 또는 `#`
- 예: `userName`, `color.primary`, `#button-id`

## 📋 완전한 예제

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

i18n {
  title.ko: "울릉도 여행 예약";
  title.en: "Ulleungdo Travel Booking";
}

bind {
  #name -> booking.guestName;
  #phone -> booking.phoneNumber;
}
```

## 🚀 향후 확장

- **조건부 렌더링**: `if`, `else`, `switch` 구문
- **반복 렌더링**: `for`, `map` 구문
- **계산 속성**: `computed { ... }` 블록
- **슬롯 시스템**: 컴포넌트 합성 지원
- **주석**: `//` 및 `/* */` 지원
- **타입 검증**: 런타임 타입 체크

## 📖 추가 리소스

- [파서 구현](../packages/parser/README.md)
- [React 코드 생성기](../packages/codegen-react/README.md)
- [CLI 도구](../packages/cli/README.md)
- [예제 파일](../examples/)
