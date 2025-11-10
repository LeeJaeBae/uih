# AI Code Generation Guidelines

[← Back to Main](../CLAUDE.md) | [← Components](COMPONENTS.md) | [VSCode →](VSCODE.md)


### Natural Language to UIH Conversion

UIH is designed for AI-assisted code generation. When users request UI components in natural language, follow this systematic conversion process:

#### Conversion Process

**Input**: Natural language description (e.g., "로그인 페이지 만들어줘")

**Analysis Steps**:
1. **Identify Components**: Determine which components are needed (Form, Input, Button, Card, etc.)
2. **Determine Layout**: Decide on layout structure (centered, grid, flex, stack)
3. **Apply Design System**: Use Tailwind classes and CSS variables for styling
4. **Add Interactivity**: Include event handlers and state management if needed

**Output**: Complete `.uih` file with all necessary blocks

#### 20 Real-World Patterns

##### 1. Login Page (로그인 페이지)
```uih
meta {
  route: "/login";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.secondary: "#64748b";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50") {
    Card(class:"w-full max-w-md p-8 space-y-6") {
      H2(class:"text-3xl font-bold text-center") { "로그인" }

      Form(class:"space-y-4") {
        Div(class:"space-y-2") {
          Label { "이메일" }
          Input(
            type:"email",
            placeholder:"your@email.com",
            class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
          )
        }

        Div(class:"space-y-2") {
          Label { "비밀번호" }
          Input(
            type:"password",
            placeholder:"••••••••",
            class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
          )
        }

        Button(
          class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        ) {
          "로그인"
        }
      }

      P(class:"text-center text-sm text-gray-600") {
        "계정이 없으신가요? "
        A(href:"/signup", class:"text-[var(--color-primary)] hover:underline") {
          "회원가입"
        }
      }
    }
  }
}
```

##### 2. Dashboard (대시보드)
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
      # Stats Grid
      Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8") {
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
            Div(class:"w-12 h-12 bg-green-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "💰" }
            }
          }
        }

        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "진행 중" }
              H3(class:"text-3xl font-bold mt-2") { "12" }
            }
            Div(class:"w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "📊" }
            }
          }
        }

        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          Div(class:"flex items-center justify-between") {
            Div {
              P(class:"text-sm text-gray-600") { "완료" }
              H3(class:"text-3xl font-bold mt-2") { "89" }
            }
            Div(class:"w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center") {
              Span(class:"text-2xl") { "✅" }
            }
          }
        }
      }

      # Recent Activity
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
  }
}
```

##### 3. Registration Form (회원가입 폼)
```uih
meta {
  route: "/signup";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50 py-12") {
    Card(class:"w-full max-w-2xl p-8") {
      H2(class:"text-3xl font-bold text-center mb-8") { "회원가입" }

      Form(class:"space-y-6") {
        # Personal Info
        Div(class:"grid grid-cols-1 md:grid-cols-2 gap-4") {
          Div(class:"space-y-2") {
            Label { "이름" }
            Input(
              type:"text",
              placeholder:"홍길동",
              class:"w-full px-4 py-2 border rounded-lg"
            )
          }

          Div(class:"space-y-2") {
            Label { "생년월일" }
            Input(
              type:"date",
              class:"w-full px-4 py-2 border rounded-lg"
            )
          }
        }

        # Contact
        Div(class:"space-y-2") {
          Label { "이메일" }
          Input(
            type:"email",
            placeholder:"your@email.com",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        Div(class:"space-y-2") {
          Label { "전화번호" }
          Input(
            type:"tel",
            placeholder:"010-1234-5678",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        # Password
        Div(class:"space-y-2") {
          Label { "비밀번호" }
          Input(
            type:"password",
            placeholder:"8자 이상 입력하세요",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        Div(class:"space-y-2") {
          Label { "비밀번호 확인" }
          Input(
            type:"password",
            placeholder:"비밀번호를 다시 입력하세요",
            class:"w-full px-4 py-2 border rounded-lg"
          )
        }

        # Terms
        Div(class:"flex items-start gap-3") {
          Input(type:"checkbox", class:"mt-1")
          Label(class:"text-sm text-gray-600") {
            "이용약관 및 개인정보 처리방침에 동의합니다"
          }
        }

        Button(
          class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
        ) {
          "가입하기"
        }
      }
    }
  }
}
```

##### 4. Landing Page Hero (랜딩 페이지 히어로)
```uih
meta {
  route: "/";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.accent: "#ec4899";
}

layout {
  Section(class:"min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50") {
    Div(class:"container mx-auto px-6 py-20") {
      Div(class:"text-center max-w-4xl mx-auto") {
        # Badge
        Span(class:"inline-block px-4 py-2 bg-blue-100 text-[var(--color-primary)] rounded-full text-sm font-semibold mb-6") {
          "🚀 New Release"
        }

        # Heading
        H1(class:"text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent") {
          "UI를 더 빠르게 만드세요"
        }

        # Subheading
        P(class:"text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto") {
          "UIH로 자연어를 React, Vue, Svelte 코드로 변환하세요"
        }

        # CTA Buttons
        Div(class:"flex flex-col sm:flex-row gap-4 justify-center mb-16") {
          Button(class:"px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-blue-700 font-semibold text-lg") {
            "무료로 시작하기"
          }
          Button(class:"px-8 py-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 font-semibold text-lg") {
            "데모 보기"
          }
        }

        # Social Proof
        Div(class:"flex items-center justify-center gap-8 text-sm text-gray-600") {
          Div(class:"flex items-center gap-2") {
            Span(class:"text-2xl") { "⭐" }
            Span { "4.9/5.0" }
          }
          Div(class:"flex items-center gap-2") {
            Span(class:"text-2xl") { "👥" }
            Span { "10,000+ 사용자" }
          }
          Div(class:"flex items-center gap-2") {
            Span(class:"text-2xl") { "🚀" }
            Span { "50,000+ 프로젝트" }
          }
        }
      }
    }
  }
}
```

##### 5. Product Card Grid (상품 카드 그리드)
```uih
meta {
  route: "/products";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold mb-8") { "인기 상품" }

    Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6") {
      # Product Card 1
      Card(class:"bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden") {
        Img(
          src:"/product1.jpg",
          alt:"Product 1",
          class:"w-full h-48 object-cover"
        )
        Div(class:"p-6") {
          H3(class:"text-xl font-bold mb-2") { "프리미엄 헤드폰" }
          P(class:"text-gray-600 mb-4") { "최고의 음질을 경험하세요" }
          Div(class:"flex items-center justify-between") {
            Span(class:"text-2xl font-bold text-[var(--color-primary)]") { "₩199,000" }
            Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
              "구매하기"
            }
          }
        }
      }

      # More product cards...
    }
  }
}
```

##### 6. Settings Page (설정 페이지)
```uih
meta {
  route: "/settings";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-3xl font-bold mb-8") { "설정" }

    Div(class:"grid grid-cols-1 lg:grid-cols-4 gap-8") {
      # Sidebar
      Nav(class:"space-y-2") {
        Button(class:"w-full text-left px-4 py-3 bg-blue-50 text-[var(--color-primary)] rounded-lg font-semibold") {
          "프로필"
        }
        Button(class:"w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg") {
          "계정"
        }
        Button(class:"w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg") {
          "알림"
        }
        Button(class:"w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg") {
          "보안"
        }
      }

      # Content
      Div(class:"lg:col-span-3") {
        Card(class:"p-8 bg-white rounded-xl shadow-sm") {
          H2(class:"text-2xl font-bold mb-6") { "프로필 설정" }

          Form(class:"space-y-6") {
            Div(class:"flex items-center gap-6 mb-6") {
              Div(class:"w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl") {
                "👤"
              }
              Button(class:"px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50") {
                "사진 변경"
              }
            }

            Div(class:"space-y-2") {
              Label { "이름" }
              Input(
                type:"text",
                value:"홍길동",
                class:"w-full px-4 py-2 border rounded-lg"
              )
            }

            Div(class:"space-y-2") {
              Label { "이메일" }
              Input(
                type:"email",
                value:"hong@example.com",
                class:"w-full px-4 py-2 border rounded-lg"
              )
            }

            Div(class:"space-y-2") {
              Label { "자기소개" }
              Textarea(
                placeholder:"자신을 소개해주세요",
                class:"w-full px-4 py-2 border rounded-lg h-32"
              )
            }

            Button(
              class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-semibold"
            ) {
              "변경사항 저장"
            }
          }
        }
      }
    }
  }
}
```

##### 7. Blog Post (블로그 글)
```uih
meta {
  route: "/blog/post";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Article(class:"max-w-4xl mx-auto px-6 py-12") {
    # Header
    Header(class:"mb-12") {
      Span(class:"inline-block px-3 py-1 bg-blue-100 text-[var(--color-primary)] rounded-full text-sm font-semibold mb-4") {
        "기술"
      }
      H1(class:"text-5xl font-bold mb-4") {
        "UIH로 UI 개발 속도를 10배 높이는 방법"
      }
      Div(class:"flex items-center gap-4 text-gray-600") {
        Img(
          src:"/avatar.jpg",
          alt:"Author",
          class:"w-12 h-12 rounded-full"
        )
        Div {
          P(class:"font-semibold") { "홍길동" }
          P(class:"text-sm") { "2024년 1월 10일 · 5분 읽기" }
        }
      }
    }

    # Featured Image
    Img(
      src:"/blog-hero.jpg",
      alt:"Blog featured image",
      class:"w-full h-96 object-cover rounded-2xl mb-12"
    )

    # Content
    Div(class:"prose prose-lg max-w-none") {
      P(class:"text-xl text-gray-700 leading-relaxed mb-6") {
        "현대 웹 개발에서 UI 구현은 반복적이고 시간이 많이 소요되는 작업입니다. UIH는 이 문제를 해결하기 위해 만들어졌습니다."
      }

      H2(class:"text-3xl font-bold mt-12 mb-6") {
        "UIH란 무엇인가?"
      }

      P(class:"text-gray-700 leading-relaxed mb-6") {
        "UIH (Universal UI Hierarchy)는 자연어와 유사한 메타 언어로 UI를 정의하고, React, Vue, Svelte 코드로 자동 변환하는 도구입니다."
      }

      # Code Example
      Div(class:"bg-gray-900 text-gray-100 p-6 rounded-xl my-8 font-mono text-sm") {
        "layout {\n  Button(variant:\"primary\") { \"Click me\" }\n}"
      }
    }
  }
}
```

##### 8. Contact Form (문의 양식)
```uih
meta {
  route: "/contact";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen bg-gray-50 py-12") {
    Div(class:"container mx-auto px-6") {
      Div(class:"max-w-2xl mx-auto") {
        H1(class:"text-4xl font-bold text-center mb-4") { "문의하기" }
        P(class:"text-center text-gray-600 mb-12") {
          "궁금한 점이 있으시면 언제든지 연락주세요"
        }

        Card(class:"p-8 bg-white rounded-xl shadow-sm") {
          Form(class:"space-y-6") {
            Div(class:"grid grid-cols-1 md:grid-cols-2 gap-6") {
              Div(class:"space-y-2") {
                Label { "이름" }
                Input(
                  type:"text",
                  placeholder:"홍길동",
                  class:"w-full px-4 py-2 border rounded-lg"
                )
              }

              Div(class:"space-y-2") {
                Label { "이메일" }
                Input(
                  type:"email",
                  placeholder:"your@email.com",
                  class:"w-full px-4 py-2 border rounded-lg"
                )
              }
            }

            Div(class:"space-y-2") {
              Label { "제목" }
              Input(
                type:"text",
                placeholder:"문의 제목",
                class:"w-full px-4 py-2 border rounded-lg"
              )
            }

            Div(class:"space-y-2") {
              Label { "메시지" }
              Textarea(
                placeholder:"문의 내용을 입력하세요",
                class:"w-full px-4 py-2 border rounded-lg h-40"
              )
            }

            Button(
              class:"w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            ) {
              "보내기"
            }
          }
        }

        # Contact Info
        Div(class:"mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center") {
          Div {
            Div(class:"text-4xl mb-2") { "📧" }
            P(class:"font-semibold") { "이메일" }
            P(class:"text-gray-600 text-sm") { "support@example.com" }
          }
          Div {
            Div(class:"text-4xl mb-2") { "📞" }
            P(class:"font-semibold") { "전화" }
            P(class:"text-gray-600 text-sm") { "02-1234-5678" }
          }
          Div {
            Div(class:"text-4xl mb-2") { "📍" }
            P(class:"font-semibold") { "주소" }
            P(class:"text-gray-600 text-sm") { "서울시 강남구" }
          }
        }
      }
    }
  }
}
```

##### 9. Pricing Table (가격 테이블)
```uih
meta {
  route: "/pricing";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen bg-gray-50 py-20") {
    Div(class:"container mx-auto px-6") {
      # Header
      Div(class:"text-center mb-16") {
        H1(class:"text-5xl font-bold mb-4") { "간단하고 투명한 가격" }
        P(class:"text-xl text-gray-600") {
          "프로젝트 규모에 맞는 플랜을 선택하세요"
        }
      }

      # Pricing Cards
      Div(class:"grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto") {
        # Free Plan
        Card(class:"p-8 bg-white rounded-2xl shadow-sm border-2 border-gray-200") {
          H3(class:"text-2xl font-bold mb-2") { "무료" }
          Div(class:"mb-6") {
            Span(class:"text-5xl font-bold") { "₩0" }
            Span(class:"text-gray-600") { "/월" }
          }
          Ul(class:"space-y-4 mb-8") {
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "3개 프로젝트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "기본 컴포넌트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "커뮤니티 지원" }
            }
          }
          Button(class:"w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold") {
            "시작하기"
          }
        }

        # Pro Plan (Featured)
        Card(class:"p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl transform scale-105") {
          Span(class:"inline-block px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-semibold mb-4") {
            "인기"
          }
          H3(class:"text-2xl font-bold mb-2") { "프로" }
          Div(class:"mb-6") {
            Span(class:"text-5xl font-bold") { "₩29,000" }
            Span(class:"text-blue-100") { "/월" }
          }
          Ul(class:"space-y-4 mb-8") {
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "무제한 프로젝트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "모든 컴포넌트" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "우선 지원" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "고급 기능" }
            }
          }
          Button(class:"w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold") {
            "지금 시작"
          }
        }

        # Enterprise Plan
        Card(class:"p-8 bg-white rounded-2xl shadow-sm border-2 border-gray-200") {
          H3(class:"text-2xl font-bold mb-2") { "엔터프라이즈" }
          Div(class:"mb-6") {
            Span(class:"text-5xl font-bold") { "맞춤" }
          }
          Ul(class:"space-y-4 mb-8") {
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "모든 Pro 기능" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "전담 지원" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "온프레미스" }
            }
            Li(class:"flex items-center gap-2") {
              Span { "✅" }
              Span { "SLA 보장" }
            }
          }
          Button(class:"w-full py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-blue-50 font-semibold") {
            "문의하기"
          }
        }
      }
    }
  }
}
```

##### 10. Modal/Dialog (모달/다이얼로그)
```uih
meta {
  route: "/modal-demo";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg") {
      "모달 열기"
    }

    # Modal Overlay
    Div(class:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6") {
      # Modal Content
      Div(class:"bg-white rounded-2xl shadow-2xl max-w-md w-full") {
        # Header
        Div(class:"flex items-center justify-between p-6 border-b") {
          H2(class:"text-2xl font-bold") { "알림" }
          Button(class:"text-gray-400 hover:text-gray-600 text-2xl") {
            "×"
          }
        }

        # Body
        Div(class:"p-6") {
          P(class:"text-gray-700 mb-4") {
            "정말로 이 작업을 진행하시겠습니까?"
          }
          P(class:"text-sm text-gray-500") {
            "이 작업은 되돌릴 수 없습니다."
          }
        }

        # Footer
        Div(class:"flex gap-3 p-6 border-t") {
          Button(class:"flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50") {
            "취소"
          }
          Button(class:"flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700") {
            "확인"
          }
        }
      }
    }
  }
}
```

##### 11. Navigation Menu (네비게이션 메뉴)
```uih
meta {
  route: "/";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
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
          A(href:"/blog", class:"text-gray-700 hover:text-[var(--color-primary)] font-medium") {
            "블로그"
          }
        }

        # CTA
        Div(class:"flex items-center gap-4") {
          Button(class:"hidden md:block px-4 py-2 text-[var(--color-primary)] hover:bg-blue-50 rounded-lg") {
            "로그인"
          }
          Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
            "시작하기"
          }
        }

        # Mobile Menu Button
        Button(class:"md:hidden text-2xl") {
          "☰"
        }
      }
    }
  }
}
```

##### 12. Footer (푸터)
```uih
meta {
  route: "/";
  theme: "light";
}

layout {
  Footer(class:"bg-gray-900 text-gray-300 py-16") {
    Div(class:"container mx-auto px-6") {
      Div(class:"grid grid-cols-1 md:grid-cols-4 gap-12 mb-12") {
        # Company
        Div {
          H3(class:"text-white text-xl font-bold mb-4") { "UIH" }
          P(class:"text-sm mb-4") {
            "UI 개발을 더 빠르고 쉽게 만드는 메타 언어"
          }
          Div(class:"flex gap-4 text-2xl") {
            A(href:"#", class:"hover:text-white") { "🐙" }
            A(href:"#", class:"hover:text-white") { "🐦" }
            A(href:"#", class:"hover:text-white") { "📘" }
          }
        }

        # Product
        Div {
          H4(class:"text-white font-semibold mb-4") { "제품" }
          Ul(class:"space-y-2 text-sm") {
            Li { A(href:"/features", class:"hover:text-white") { "기능" } }
            Li { A(href:"/pricing", class:"hover:text-white") { "가격" } }
            Li { A(href:"/docs", class:"hover:text-white") { "문서" } }
            Li { A(href:"/examples", class:"hover:text-white") { "예제" } }
          }
        }

        # Resources
        Div {
          H4(class:"text-white font-semibold mb-4") { "리소스" }
          Ul(class:"space-y-2 text-sm") {
            Li { A(href:"/blog", class:"hover:text-white") { "블로그" } }
            Li { A(href:"/guides", class:"hover:text-white") { "가이드" } }
            Li { A(href:"/community", class:"hover:text-white") { "커뮤니티" } }
            Li { A(href:"/support", class:"hover:text-white") { "지원" } }
          }
        }

        # Company
        Div {
          H4(class:"text-white font-semibold mb-4") { "회사" }
          Ul(class:"space-y-2 text-sm") {
            Li { A(href:"/about", class:"hover:text-white") { "소개" } }
            Li { A(href:"/careers", class:"hover:text-white") { "채용" } }
            Li { A(href:"/contact", class:"hover:text-white") { "연락처" } }
            Li { A(href:"/privacy", class:"hover:text-white") { "개인정보" } }
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
```

##### 13. Image Gallery (이미지 갤러리)
```uih
meta {
  route: "/gallery";
  theme: "light";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold mb-8") { "갤러리" }

    Div(class:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4") {
      Div(class:"relative group overflow-hidden rounded-xl cursor-pointer") {
        Img(
          src:"/image1.jpg",
          alt:"Gallery image 1",
          class:"w-full h-64 object-cover transition-transform group-hover:scale-110"
        )
        Div(class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center") {
          Span(class:"text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity") {
            "🔍"
          }
        }
      }

      # More gallery items...
    }
  }
}
```

##### 14. User Profile Card (사용자 프로필 카드)
```uih
meta {
  route: "/profile";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    Card(class:"max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden") {
      # Cover Image
      Div(class:"h-48 bg-gradient-to-r from-blue-600 to-purple-600")

      # Profile Info
      Div(class:"px-8 pb-8") {
        # Avatar
        Div(class:"flex items-end justify-between -mt-20 mb-6") {
          Img(
            src:"/avatar.jpg",
            alt:"Profile",
            class:"w-32 h-32 rounded-full border-4 border-white shadow-lg"
          )
          Button(class:"px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
            "팔로우"
          }
        }

        # Details
        Div(class:"mb-6") {
          H2(class:"text-3xl font-bold mb-2") { "홍길동" }
          P(class:"text-gray-600 mb-4") { "@gildonghong" }
          P(class:"text-gray-700 leading-relaxed") {
            "프론트엔드 개발자 | React & Vue 전문가 | UIH 컨트리뷰터"
          }
        }

        # Stats
        Div(class:"flex gap-8 mb-6") {
          Div(class:"text-center") {
            P(class:"text-2xl font-bold") { "1.2K" }
            P(class:"text-sm text-gray-600") { "팔로워" }
          }
          Div(class:"text-center") {
            P(class:"text-2xl font-bold") { "567" }
            P(class:"text-sm text-gray-600") { "팔로잉" }
          }
          Div(class:"text-center") {
            P(class:"text-2xl font-bold") { "89" }
            P(class:"text-sm text-gray-600") { "프로젝트" }
          }
        }

        # Badges
        Div(class:"flex flex-wrap gap-2") {
          Span(class:"px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm") { "React" }
          Span(class:"px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm") { "Vue" }
          Span(class:"px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm") { "TypeScript" }
          Span(class:"px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm") { "Tailwind" }
        }
      }
    }
  }
}
```

##### 15. Timeline (타임라인)
```uih
meta {
  route: "/timeline";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold mb-12 text-center") { "회사 연혁" }

    Div(class:"max-w-4xl mx-auto relative") {
      # Timeline Line
      Div(class:"absolute left-8 top-0 bottom-0 w-1 bg-gray-200")

      # Timeline Items
      Div(class:"space-y-12 relative") {
        # Item 1
        Div(class:"flex gap-8") {
          Div(class:"flex-shrink-0 w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl z-10") {
            "1"
          }
          Card(class:"flex-1 p-6 bg-white rounded-xl shadow-sm") {
            Span(class:"text-sm text-gray-500") { "2024년 1월" }
            H3(class:"text-2xl font-bold my-2") { "UIH v1.0 출시" }
            P(class:"text-gray-700") {
              "React, Vue, Svelte 지원과 함께 정식 버전 출시"
            }
          }
        }

        # Item 2
        Div(class:"flex gap-8") {
          Div(class:"flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl z-10") {
            "2"
          }
          Card(class:"flex-1 p-6 bg-white rounded-xl shadow-sm") {
            Span(class:"text-sm text-gray-500") { "2023년 11월" }
            H3(class:"text-2xl font-bold my-2") { "베타 테스트" }
            P(class:"text-gray-700") {
              "1,000명 이상의 개발자가 베타 테스트 참여"
            }
          }
        }

        # More items...
      }
    }
  }
}
```

##### 16. FAQ Accordion (FAQ 아코디언)
```uih
meta {
  route: "/faq";
  theme: "light";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold text-center mb-12") { "자주 묻는 질문" }

    Div(class:"max-w-3xl mx-auto space-y-4") {
      # FAQ Item 1
      Div(class:"bg-white rounded-xl shadow-sm border border-gray-200") {
        Button(class:"w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50") {
          Span(class:"font-semibold text-lg") { "UIH는 무엇인가요?" }
          Span(class:"text-2xl") { "+" }
        }
        Div(class:"px-6 pb-4 text-gray-700") {
          P {
            "UIH는 자연어와 유사한 메타 언어로 UI를 정의하고, React, Vue, Svelte 코드로 자동 변환하는 도구입니다."
          }
        }
      }

      # FAQ Item 2
      Div(class:"bg-white rounded-xl shadow-sm border border-gray-200") {
        Button(class:"w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50") {
          Span(class:"font-semibold text-lg") { "어떤 프레임워크를 지원하나요?" }
          Span(class:"text-2xl") { "+" }
        }
      }

      # More FAQ items...
    }
  }
}
```

##### 17. Loading States (로딩 상태)
```uih
meta {
  route: "/loading";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-3xl font-bold mb-8") { "로딩 상태" }

    Div(class:"space-y-8") {
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
        Div(class:"space-y-2") {
          Div(class:"h-3 bg-gray-200 rounded animate-pulse")
          Div(class:"h-3 bg-gray-200 rounded animate-pulse w-5/6")
          Div(class:"h-3 bg-gray-200 rounded animate-pulse w-4/6")
        }
      }
    }
  }
}
```

##### 18. Error States (에러 상태)
```uih
meta {
  route: "/error";
  theme: "light";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gray-50") {
    Div(class:"text-center max-w-2xl mx-auto px-6") {
      Span(class:"text-9xl mb-8 block") { "😔" }
      H1(class:"text-6xl font-bold mb-4") { "404" }
      P(class:"text-2xl text-gray-600 mb-8") {
        "페이지를 찾을 수 없습니다"
      }
      P(class:"text-gray-500 mb-12") {
        "요청하신 페이지가 존재하지 않거나 이동되었습니다."
      }
      Div(class:"flex gap-4 justify-center") {
        Button(class:"px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold") {
          "홈으로"
        }
        Button(class:"px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold") {
          "이전 페이지"
        }
      }
    }
  }
}
```

##### 19. Search Interface (검색 인터페이스)
```uih
meta {
  route: "/search";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    # Search Bar
    Div(class:"max-w-3xl mx-auto mb-12") {
      Div(class:"relative") {
        Input(
          type:"text",
          placeholder:"검색어를 입력하세요...",
          class:"w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-[var(--color-primary)] focus:outline-none"
        )
        Span(class:"absolute left-5 top-1/2 -translate-y-1/2 text-2xl") {
          "🔍"
        }
      }

      # Quick Links
      Div(class:"flex flex-wrap gap-2 mt-4") {
        Span(class:"text-sm text-gray-600") { "인기 검색어:" }
        A(href:"#", class:"px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm") {
          "React"
        }
        A(href:"#", class:"px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm") {
          "Tailwind"
        }
        A(href:"#", class:"px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm") {
          "Component"
        }
      }
    }

    # Search Results
    Div(class:"space-y-6") {
      Card(class:"p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow") {
        A(href:"#") {
          H3(class:"text-xl font-bold mb-2 text-[var(--color-primary)]") {
            "UIH 시작하기 가이드"
          }
          P(class:"text-gray-700 mb-2") {
            "UIH로 첫 번째 컴포넌트를 만드는 방법을 배워보세요..."
          }
          P(class:"text-sm text-gray-500") {
            "docs.uih.com/getting-started"
          }
        }
      }

      # More results...
    }
  }
}
```

##### 20. Data Table (데이터 테이블)
```uih
meta {
  route: "/users";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    Div(class:"flex items-center justify-between mb-8") {
      H1(class:"text-3xl font-bold") { "사용자 목록" }
      Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700") {
        "+ 새 사용자"
      }
    }

    Card(class:"bg-white rounded-xl shadow-sm overflow-hidden") {
      # Filters
      Div(class:"p-4 border-b flex gap-4") {
        Input(
          type:"text",
          placeholder:"검색...",
          class:"flex-1 px-4 py-2 border rounded-lg"
        )
        Select(class:"px-4 py-2 border rounded-lg") {
          Option { "전체" }
          Option { "활성" }
          Option { "비활성" }
        }
      }

      # Table
      Table(class:"w-full") {
        Thead(class:"bg-gray-50 border-b") {
          Tr {
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") {
              Input(type:"checkbox")
            }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "이름" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "이메일" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "역할" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "상태" }
            Th(class:"px-6 py-4 text-left text-sm font-semibold text-gray-700") { "작업" }
          }
        }
        Tbody {
          Tr(class:"border-b hover:bg-gray-50") {
            Td(class:"px-6 py-4") {
              Input(type:"checkbox")
            }
            Td(class:"px-6 py-4") {
              Div(class:"flex items-center gap-3") {
                Img(
                  src:"/avatar1.jpg",
                  alt:"User",
                  class:"w-10 h-10 rounded-full"
                )
                Span(class:"font-medium") { "홍길동" }
              }
            }
            Td(class:"px-6 py-4 text-gray-600") { "hong@example.com" }
            Td(class:"px-6 py-4") {
              Span(class:"px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm") {
                "관리자"
              }
            }
            Td(class:"px-6 py-4") {
              Span(class:"px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm") {
                "활성"
              }
            }
            Td(class:"px-6 py-4") {
              Div(class:"flex gap-2") {
                Button(class:"text-blue-600 hover:text-blue-800") { "수정" }
                Button(class:"text-red-600 hover:text-red-800") { "삭제" }
              }
            }
          }

          # More rows...
        }
      }

      # Pagination
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
  }
}
```

### Design System Best Practices

When generating UIH code:

1. **Consistent Spacing**: Use Tailwind spacing scale (p-4, p-6, p-8, gap-4, gap-6, space-y-4, etc.)
2. **Color Variables**: Define brand colors in `style` block, reference with `var(--color-primary)`
3. **Typography Hierarchy**: H1 (text-5xl), H2 (text-3xl), H3 (text-2xl), body (text-base)
4. **Responsive Design**: Use responsive prefixes (md:, lg:, xl:) for mobile-first design
5. **Accessibility**: Include aria-label, alt text, semantic HTML elements
6. **Interactive States**: Add hover:, focus:, active: states for all interactive elements

### Common Patterns Reference

**Centered Container**:
```uih
Div(class:"container mx-auto px-6 py-12")
```

**Card with Shadow**:
```uih
Card(class:"bg-white rounded-xl shadow-sm p-6")
```

**Primary Button**:
```uih
Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-semibold")
```

**Input Field**:
```uih
Input(
  type:"text",
  placeholder:"Enter text",
  class:"w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
)
```

**Flex Layout**:
```uih
Div(class:"flex items-center justify-between gap-4")
```

**Grid Layout**:
```uih
Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")
```


---

[← Back to Main](../CLAUDE.md) | [← Components](COMPONENTS.md) | [VSCode →](VSCODE.md)
