# AI Code Generation Guidelines

[← Back to Main](../CLAUDE.md) | [← Components](COMPONENTS.md) | [VSCode →](VSCODE.md)

## UIH Core Syntax

UIH는 AI 친화적인 메타 언어로 자연어를 UI 코드로 변환합니다.

### 기본 구조
```uih
meta {
  route: "/path";      # 라우트 경로
  theme: "light";      # 테마 설정
}

style {
  color.primary: "#0E5EF7";    # CSS 변수 정의
  color.secondary: "#64748b";   # var(--color-primary)로 사용
}

layout {
  # 컴포넌트(속성) { 내용 }
  Div(class:"container") {
    H1 { "제목" }
  }
}
```

### 핵심 기능
- **반복문**: `for item in items { ... }`
- **조건부**: `if condition { ... } else { ... }`
- **컴포넌트 import**: `import Component from "./component.uih"`
- **Tailwind CSS**: 모든 유틸리티 클래스 지원
- **CSS 변수**: `var(--color-primary)` 형태로 참조

## 5 Essential Patterns

### 1. Form Pattern
모든 폼 요소와 입력 타입을 포괄하는 패턴

```uih
meta {
  route: "/form";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50") {
    Card(class:"w-full max-w-2xl p-8") {
      H2(class:"text-3xl font-bold text-center mb-8") { "폼 예제" }

      Form(class:"space-y-6") {
        # 텍스트 입력
        Div(class:"grid grid-cols-1 md:grid-cols-2 gap-4") {
          Div(class:"space-y-2") {
            Label { "이름" }
            Input(
              type:"text",
              placeholder:"홍길동",
              class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            )
          }

          Div(class:"space-y-2") {
            Label { "생년월일" }
            Input(type:"date", class:"w-full px-4 py-2 border rounded-lg")
          }
        }

        # 이메일/비밀번호
        Div(class:"space-y-2") {
          Label { "이메일" }
          Input(type:"email", placeholder:"email@example.com", class:"w-full px-4 py-2 border rounded-lg")
        }

        Div(class:"space-y-2") {
          Label { "비밀번호" }
          Input(type:"password", placeholder:"••••••••", class:"w-full px-4 py-2 border rounded-lg")
        }

        # 전화번호
        Div(class:"space-y-2") {
          Label { "전화번호" }
          Input(type:"tel", placeholder:"010-1234-5678", class:"w-full px-4 py-2 border rounded-lg")
        }

        # Textarea
        Div(class:"space-y-2") {
          Label { "메시지" }
          Textarea(
            placeholder:"내용을 입력하세요",
            class:"w-full px-4 py-2 border rounded-lg h-32"
          )
        }

        # Select
        Div(class:"space-y-2") {
          Label { "옵션 선택" }
          Select(class:"w-full px-4 py-2 border rounded-lg") {
            Option { "선택하세요" }
            Option { "옵션1" }
            Option { "옵션2" }
          }
        }

        # Checkbox
        Div(class:"flex items-start gap-3") {
          Input(type:"checkbox", class:"mt-1")
          Label(class:"text-sm text-gray-600") {
            "약관에 동의합니다"
          }
        }

        # Submit Button
        Button(
          class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        ) {
          "제출하기"
        }
      }

      # 링크
      P(class:"text-center text-sm text-gray-600 mt-6") {
        "계정이 없으신가요? "
        A(href:"/signup", class:"text-[var(--color-primary)] hover:underline") {
          "회원가입"
        }
      }
    }
  }
}
```

### 2. Layout Pattern
대시보드, 그리드, 카드 레이아웃

```uih
meta {
  route: "/dashboard";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.success: "#10b981";
  color.warning: "#f59e0b";
  color.danger: "#ef4444";
}

layout {
  Div(class:"min-h-screen bg-gray-50") {
    # Header
    Header(class:"bg-white border-b px-6 py-4") {
      Div(class:"flex items-center justify-between") {
        H1(class:"text-2xl font-bold") { "대시보드" }
        Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg") {
          "새 프로젝트"
        }
      }
    }

    # Main Content
    Main(class:"p-6") {
      # Stats Grid - 반응형 그리드
      Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8") {
        # Stats Card 패턴
        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "총 사용자" }
              H3(class:"text-3xl font-bold mt-2") { "2,543" }
            }
            Div(class:"w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "👥" }
            }
          }
        }

        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "매출" }
              H3(class:"text-3xl font-bold mt-2") { "₩1.2M" }
            }
            Div(class:"w-12 h-12 bg-[var(--color-success)] bg-opacity-20 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "💰" }
            }
          }
        }
      }

      # 중첩 레이아웃
      Div(class:"grid grid-cols-1 lg:grid-cols-3 gap-8") {
        # 2/3 너비 컨텐츠
        Div(class:"lg:col-span-2") {
          Card(class:"p-6 bg-white rounded-xl shadow-sm") {
            H2(class:"text-xl font-bold mb-4") { "최근 활동" }
            Div(class:"space-y-4") {
              Div(class:"flex items-center gap-4 p-4 bg-gray-50 rounded-lg") {
                Span(class:"text-2xl") { "🎉" }
                Div {
                  P(class:"font-semibold") { "새 프로젝트 완료" }
                  P(class:"text-sm text-gray-600") { "2시간 전" }
                }
              }
            }
          }
        }

        # 1/3 너비 사이드바
        Nav(class:"space-y-2") {
          Button(class:"w-full text-left px-4 py-3 bg-blue-50 text-[var(--color-primary)] rounded-lg font-semibold") {
            "프로필"
          }
          Button(class:"w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg") {
            "설정"
          }
        }
      }
    }
  }
}
```

### 3. Navigation Pattern
헤더, 푸터, 네비게이션 메뉴

```uih
meta {
  route: "/";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen flex flex-col") {
    # Header/Navigation
    Nav(class:"bg-white border-b sticky top-0 z-50") {
      Div(class:"container mx-auto px-6 py-4") {
        Div(class:"flex items-center justify-between") {
          # Logo
          A(href:"/", class:"flex items-center gap-2") {
            Span(class:"text-2xl font-bold text-[var(--color-primary)]") { "UIH" }
          }

          # Desktop Menu
          Div(class:"hidden md:flex items-center gap-8") {
            A(href:"/features", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
              "기능"
            }
            A(href:"/pricing", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
              "가격"
            }
            A(href:"/docs", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
              "문서"
            }
          }

          # CTA Buttons
          Div(class:"flex items-center gap-4") {
            Button(class:"hidden md:block px-4 py-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg") {
              "로그인"
            }
            Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
              "시작하기"
            }
          }

          # Mobile Menu Button
          Button(class:"md:hidden text-2xl") { "☰" }
        }
      }
    }

    # Main Content (flex-grow로 푸터를 아래로)
    Main(class:"flex-grow") {
      # 컨텐츠
    }

    # Footer
    Footer(class:"bg-gray-900 text-gray-300 py-16") {
      Div(class:"container mx-auto px-6") {
        Div(class:"grid grid-cols-1 md:grid-cols-4 gap-12 mb-12") {
          # Company Info
          Div {
            H3(class:"text-white text-xl font-bold mb-4") { "UIH" }
            P(class:"text-sm mb-4") {
              "UI 개발을 더 빠르고 쉽게"
            }
            # Social Links
            Div(class:"flex gap-4 text-2xl") {
              A(href:"#", class:"hover:text-white") { "🐙" }
              A(href:"#", class:"hover:text-white") { "🐦" }
            }
          }

          # Links Columns
          Div {
            H4(class:"text-white font-semibold mb-4") { "제품" }
            Ul(class:"space-y-2 text-sm") {
              Li { A(href:"/features", class:"hover:text-white") { "기능" } }
              Li { A(href:"/pricing", class:"hover:text-white") { "가격" } }
            }
          }
        }

        # Copyright
        Div(class:"border-t border-gray-800 pt-8 text-center text-sm") {
          P { "© 2024 UIH. All rights reserved." }
        }
      }
    }
  }
}
```

### 4. Data Pattern
테이블, 리스트, 반복문, 조건부 렌더링

```uih
meta {
  route: "/data";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    # 헤더 with 액션
    Div(class:"flex items-center justify-between mb-8") {
      H1(class:"text-3xl font-bold") { "데이터 목록" }
      Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg") {
        "+ 추가"
      }
    }

    Card(class:"bg-white rounded-xl shadow-sm overflow-hidden") {
      # 필터/검색
      Div(class:"p-4 border-b flex gap-4") {
        Input(type:"text", placeholder:"검색...", class:"flex-1 px-4 py-2 border rounded-lg")
        Select(class:"px-4 py-2 border rounded-lg") {
          Option { "전체" }
          Option { "활성" }
          Option { "비활성" }
        }
      }

      # 테이블
      Table(class:"w-full") {
        Thead(class:"bg-gray-50 border-b") {
          Tr {
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") {
              Input(type:"checkbox")
            }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "이름" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "상태" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "작업" }
          }
        }
        Tbody {
          # 반복문 예제
          for user in users {
            Tr(class:"border-b hover:bg-gray-50") {
              Td(class:"px-6 py-4") {
                Input(type:"checkbox")
              }
              Td(class:"px-6 py-4 font-medium") { user.name }
              Td(class:"px-6 py-4") {
                # 조건부 렌더링
                if user.active {
                  Span(class:"px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm") {
                    "활성"
                  }
                } else {
                  Span(class:"px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm") {
                    "비활성"
                  }
                }
              }
              Td(class:"px-6 py-4") {
                Div(class:"flex gap-2") {
                  Button(class:"text-blue-600 hover:text-blue-800") { "수정" }
                  Button(class:"text-red-600 hover:text-red-800") { "삭제" }
                }
              }
            }
          }
        }
      }

      # 페이지네이션
      Div(class:"p-4 border-t flex items-center justify-between") {
        P(class:"text-sm text-gray-600") { "10개 중 1-5 표시" }
        Div(class:"flex gap-2") {
          Button(class:"px-3 py-1 border rounded hover:bg-gray-50") { "이전" }
          Button(class:"px-3 py-1 bg-[var(--color-primary)] text-white rounded") { "1" }
          Button(class:"px-3 py-1 border rounded hover:bg-gray-50") { "2" }
          Button(class:"px-3 py-1 border rounded hover:bg-gray-50") { "다음" }
        }
      }
    }

    # 리스트 형태 (테이블 대안)
    Div(class:"mt-8 space-y-4") {
      for item in items {
        Card(class:"p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow") {
          Div(class:"flex items-center justify-between") {
            Div {
              H3(class:"font-semibold") { item.title }
              P(class:"text-sm text-gray-600") { item.description }
            }
            Button(class:"text-[var(--color-primary)]") { "보기" }
          }
        }
      }
    }
  }
}
```

### 5. Interaction Pattern
모달, 로딩, 에러 상태, 인터랙티브 요소

```uih
meta {
  route: "/interactive";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.danger: "#ef4444";
}

layout {
  Div(class:"container mx-auto px-6 py-12 space-y-12") {
    # 모달/다이얼로그
    Section {
      H2(class:"text-2xl font-bold mb-6") { "모달" }

      Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg") {
        "모달 열기"
      }

      # Modal Overlay
      Div(class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50") {
        # Modal Content
        Div(class:"bg-white rounded-2xl shadow-2xl max-w-md w-full") {
          # Header
          Div(class:"flex items-center justify-between p-6 border-b") {
            H2(class:"text-2xl font-bold") { "확인" }
            Button(class:"text-gray-400 hover:text-gray-600 text-2xl") { "×" }
          }

          # Body
          Div(class:"p-6") {
            P(class:"text-gray-700") {
              "정말로 이 작업을 진행하시겠습니까?"
            }
          }

          # Footer
          Div(class:"flex gap-3 p-6 border-t") {
            Button(class:"flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50") {
              "취소"
            }
            Button(class:"flex-1 py-3 bg-[var(--color-danger)] text-white rounded-lg hover:bg-red-700") {
              "확인"
            }
          }
        }
      }
    }

    # 로딩 상태
    Section {
      H2(class:"text-2xl font-bold mb-6") { "로딩 상태" }

      Div(class:"space-y-6") {
        # Spinner
        Div(class:"flex items-center gap-4") {
          Div(class:"w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin")
          Span { "로딩 중..." }
        }

        # Progress Bar
        Div(class:"w-full bg-gray-200 rounded-full h-3 overflow-hidden") {
          Div(class:"h-full bg-[var(--color-primary)] w-2/3 transition-all duration-300")
        }

        # Skeleton
        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center gap-4 mb-4") {
            Div(class:"w-12 h-12 bg-gray-200 rounded-full animate-pulse")
            Div(class:"flex-1 space-y-2") {
              Div(class:"h-4 bg-gray-200 rounded animate-pulse w-3/4")
              Div(class:"h-3 bg-gray-200 rounded animate-pulse w-1/2")
            }
          }
        }
      }
    }

    # 에러 상태
    Section {
      H2(class:"text-2xl font-bold mb-6") { "에러 상태" }

      # 404 Error
      Div(class:"text-center py-12") {
        Span(class:"text-9xl mb-8 block") { "😔" }
        H1(class:"text-6xl font-bold mb-4") { "404" }
        P(class:"text-2xl text-gray-600 mb-8") {
          "페이지를 찾을 수 없습니다"
        }
        Div(class:"flex gap-4 justify-center") {
          Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg") {
            "홈으로"
          }
          Button(class:"px-6 py-3 border border-gray-300 rounded-lg") {
            "이전 페이지"
          }
        }
      }

      # Alert/Toast
      Div(class:"fixed bottom-4 right-4 space-y-3") {
        # Success
        Div(class:"bg-green-100 border-l-4 border-green-500 p-4 rounded-lg") {
          P(class:"text-green-700") { "✅ 성공적으로 저장되었습니다" }
        }

        # Error
        Div(class:"bg-red-100 border-l-4 border-red-500 p-4 rounded-lg") {
          P(class:"text-red-700") { "❌ 오류가 발생했습니다" }
        }
      }
    }
  }
}
```

## Best Practices

### Design System
1. **Spacing**: Tailwind 스케일 사용 (p-4, p-6, p-8, gap-4, space-y-4)
2. **Colors**: CSS 변수로 브랜드 색상 정의 `var(--color-primary)`
3. **Typography**: H1 (text-5xl), H2 (text-3xl), H3 (text-2xl), body (text-base)
4. **Responsive**: 모바일 우선 (md:, lg:, xl: prefixes)
5. **States**: hover:, focus:, active: 상태 포함

### Common Snippets
```uih
# Container
Div(class:"container mx-auto px-6 py-12")

# Card
Card(class:"bg-white rounded-xl shadow-sm p-6")

# Primary Button
Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-semibold")

# Input
Input(type:"text", class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]")

# Flex Layout
Div(class:"flex items-center justify-between gap-4")

# Grid Layout
Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")
```

---

[← Back to Main](../CLAUDE.md) | [← Components](COMPONENTS.md) | [VSCode →](VSCODE.md)