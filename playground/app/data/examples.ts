export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const examples: Example[] = [
  {
    id: "hello",
    name: "Hello World",
    description: "기본 UIH 문법 예제",
    code: `meta {
  route: "/hello";
  theme: "light";
}

layout "centered" {
  Card(id:"welcome") { "Hello, UIH!" }
  Button(variant:"primary"){ "확인" }
}`,
  },
  {
    id: "booking",
    name: "예약 폼",
    description: "여행 예약 양식",
    code: `meta {
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
}`,
  },
  {
    id: "conditional",
    name: "조건부 렌더링",
    description: "if/else 구문 사용",
    code: `meta {
  route: "/conditional";
  theme: "light";
}

layout {
  if (user.isLoggedIn) {
    Card { "환영합니다!" }
    Button(variant:"secondary") { "로그아웃" }
  } else {
    Card { "로그인이 필요합니다" }
    Button(variant:"primary") { "로그인" }
  }
}`,
  },
  {
    id: "loop",
    name: "반복 렌더링",
    description: "for...in 구문 사용",
    code: `meta {
  route: "/list";
  theme: "light";
}

layout {
  Card { "상품 목록" }
  for (item in items) {
    Card(id:item.id) { item.name }
    Text { item.price }
  }
}`,
  },
  {
    id: "components",
    name: "컴포넌트 쇼케이스",
    description: "다양한 UI 컴포넌트",
    code: `meta {
  route: "/showcase";
  theme: "light";
}

layout "centered" {
  Card(id:"title") { "UIH 컴포넌트" }

  Input(id:"text", placeholder:"텍스트 입력")
  Textarea(id:"desc", placeholder:"설명 입력")

  Button(variant:"primary") { "Primary" }
  Button(variant:"secondary") { "Secondary" }

  Checkbox(id:"agree", label:"동의합니다")
  Select(id:"option", options:"A,B,C")

  Badge { "NEW" }
  Text { "일반 텍스트" }
}`,
  },
  {
    id: "motion",
    name: "애니메이션",
    description: "Motion 블록 사용",
    code: `meta {
  route: "/motion";
  theme: "dark";
}

layout {
  Button(id:"btn") { "Hover Me" }
  Card(id:"card") { "Animated Card" }
}

motion {
  on hover(#btn) {
    scale: "1.05";
    duration: "200ms";
  }
  on click(#card) {
    rotate: "5deg";
    duration: "300ms";
  }
}`,
  },
  {
    id: "nested",
    name: "중첩 구조",
    description: "복잡한 중첩 예제",
    code: `meta {
  route: "/nested";
  theme: "light";
}

layout {
  Card { "중첩 구조 데모" }

  for (category in categories) {
    Card(id:category.id) { category.name }

    if (category.items.length > 0) {
      for (item in category.items) {
        Card(id:item.id) { item.title }
        Text { item.description }
      }
    } else {
      Text { "항목이 없습니다" }
    }
  }
}`,
  },
  {
    id: "form",
    name: "고급 폼",
    description: "다양한 입력 요소",
    code: `meta {
  route: "/form";
  theme: "light";
}

style {
  color.primary: "#2563eb";
  spacing.form: "16px";
}

layout "centered" {
  Card { "회원가입" }

  Label(for:"email") { "이메일" }
  Input(id:"email", type:"email", placeholder:"email@example.com")

  Label(for:"password") { "비밀번호" }
  Input(id:"password", type:"password", placeholder:"8자 이상")

  Label(for:"country") { "국가" }
  Select(id:"country", options:"한국,미국,일본,중국")

  Checkbox(id:"terms", label:"이용약관에 동의합니다")
  Checkbox(id:"marketing", label:"마케팅 수신 동의")

  Button(variant:"primary") { "가입하기" }
}`,
  },
];
