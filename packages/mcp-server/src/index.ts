#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { parse } from "uih-parser";
import { pluginRegistry } from "uih-codegen-react";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ESM에서 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경변수로 디버그 모드 제어
const DEBUG = process.env.DEBUG === 'true' || process.env.UIH_DEBUG === 'true';

// 디버그 로깅 함수
function debugLog(message: string): void {
  if (DEBUG) {
    console.error(`[UIH MCP] ${message}`);
  }
}

// MCP 응답 최대 크기 (50KB)
const MAX_OUTPUT_SIZE = 50000;

// 프로젝트 루트를 안전하게 찾기
function findProjectRoot(): string {
  let currentDir = __dirname;

  // 최대 10단계까지만 상위 디렉토리 탐색
  for (let i = 0; i < 10; i++) {
    if (currentDir === '/') {
      break;
    }

    const packageJsonPath = join(currentDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        // uih 프로젝트 루트인지 확인
        if (pkg.name === 'uih' || existsSync(join(currentDir, 'docs', 'AI_GENERATION.md'))) {
          debugLog(`Found project root: ${currentDir}`);
          return currentDir;
        }
      } catch {
        // package.json 파싱 실패 시 무시하고 계속
      }
    }

    currentDir = dirname(currentDir);
  }

  throw new Error('Could not find UIH project root. Make sure you are running from within the uih repository.');
}

// 자동 컨텍스트 감지 함수 (우선순위 기반)
function detectContext(userRequest: string): string {
  const request = userRequest.toLowerCase();

  // 우선순위 기반 매칭 (더 구체적인 것부터)
  const patterns = [
    { keywords: ['table', 'list', 'data', 'row', 'column', '테이블', '리스트', '데이터', '목록'], context: 'data' },
    { keywords: ['modal', 'dialog', 'popup', 'loading', 'error', 'toast', 'alert', '모달', '다이얼로그', '로딩', '에러'], context: 'interaction' },
    { keywords: ['nav', 'menu', 'header', 'footer', 'bar', '네비', '메뉴', '헤더', '푸터'], context: 'navigation' },
    { keywords: ['dashboard', 'grid', 'layout', 'card', 'stats', '대시보드', '레이아웃', '카드'], context: 'layout' },
    { keywords: ['form', 'login', 'signup', 'sign', 'input', 'submit', '폼', '로그인', '회원가입', '가입'], context: 'form' },
  ];

  for (const { keywords, context } of patterns) {
    // 단어 경계를 고려한 매칭 (false positive 감소)
    for (const keyword of keywords) {
      // 완전 단어 매칭 또는 단어의 일부로 포함되는 경우
      const wordBoundaryRegex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (wordBoundaryRegex.test(request)) {
        debugLog(`Detected context '${context}' from keyword '${keyword}'`);
        return context;
      }
    }
  }

  debugLog('No specific context detected, using default: syntax');
  return 'syntax'; // 기본값: 기본 문법만
}

// 가이드 섹션별 반환 함수
function getGuideSection(section: string): string {
  const syntaxGuide = `# UIH Language Guide for Code Generation

## UIH Core Syntax

UIH는 AI 친화적인 메타 언어로 자연어를 UI 코드로 변환합니다.

### 기본 구조
\`\`\`uih
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
\`\`\`

### 핵심 기능
- **반복문**: \`for item in items { ... }\`
- **조건부**: \`if condition { ... } else { ... }\`
- **컴포넌트 import**: \`import Component from "./component.uih"\`
- **Tailwind CSS**: 모든 유틸리티 클래스 지원
- **CSS 변수**: \`var(--color-primary)\` 형태로 참조

### Available Components

#### Pure HTML Elements
- Div, Span, Section, Article, Header, Footer, Nav, Main, Aside
- H1, H2, H3, H4, H5, H6, P, Blockquote, Pre, Code
- A, Button, Input, Textarea, Select, Label, Form
- Ul, Ol, Li, Dl, Dt, Dd
- Img, Video, Audio, Canvas, Svg
- Table, Thead, Tbody, Tr, Th, Td

#### shadcn/ui Components
- Card, Button, Input, Textarea, Label
- Select, Checkbox, RadioGroup, Switch
- Dialog, Sheet, Popover, Tooltip
- Badge, Avatar, Alert, Progress
- Tabs, Accordion, Collapsible
- And many more...`;

  const formPattern = `
## Form Pattern
모든 폼 요소와 입력 타입을 포괄하는 패턴

\`\`\`uih
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
    }
  }
}
\`\`\``;

  const layoutPattern = `
## Layout Pattern
대시보드, 그리드, 카드 레이아웃

\`\`\`uih
meta {
  route: "/dashboard";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.success: "#10b981";
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
      }

      # 중첩 레이아웃
      Div(class:"grid grid-cols-1 lg:grid-cols-3 gap-8") {
        # 2/3 너비 컨텐츠
        Div(class:"lg:col-span-2") {
          Card(class:"p-6 bg-white rounded-xl shadow-sm") {
            H2(class:"text-xl font-bold mb-4") { "최근 활동" }
          }
        }

        # 1/3 너비 사이드바
        Nav(class:"space-y-2") {
          Button(class:"w-full text-left px-4 py-3 bg-blue-50 text-[var(--color-primary)] rounded-lg font-semibold") {
            "프로필"
          }
        }
      }
    }
  }
}
\`\`\``;

  const navigationPattern = `
## Navigation Pattern
헤더, 푸터, 네비게이션 메뉴

\`\`\`uih
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
          }

          # CTA Buttons
          Div(class:"flex items-center gap-4") {
            Button(class:"px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg") {
              "시작하기"
            }
          }
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
        Div(class:"border-t border-gray-800 pt-8 text-center text-sm") {
          P { "© 2024 UIH. All rights reserved." }
        }
      }
    }
  }
}
\`\`\``;

  const dataPattern = `
## Data Pattern
테이블, 리스트, 반복문, 조건부 렌더링

\`\`\`uih
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
      # 테이블
      Table(class:"w-full") {
        Thead(class:"bg-gray-50 border-b") {
          Tr {
            Th(class:"px-6 py-4 text-left") { "이름" }
            Th(class:"px-6 py-4 text-left") { "상태" }
            Th(class:"px-6 py-4 text-left") { "작업" }
          }
        }
        Tbody {
          # 반복문 예제
          for user in users {
            Tr(class:"border-b hover:bg-gray-50") {
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
                Button(class:"text-blue-600 hover:text-blue-800") { "수정" }
              }
            }
          }
        }
      }
    }

    # 리스트 형태 (테이블 대안)
    Div(class:"mt-8 space-y-4") {
      for item in items {
        Card(class:"p-4 bg-white rounded-lg shadow-sm hover:shadow-md") {
          Div(class:"flex items-center justify-between") {
            H3(class:"font-semibold") { item.title }
            Button(class:"text-[var(--color-primary)]") { "보기" }
          }
        }
      }
    }
  }
}
\`\`\``;

  const interactionPattern = `
## Interaction Pattern
모달, 로딩, 에러 상태, 인터랙티브 요소

\`\`\`uih
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
            Button(class:"flex-1 py-3 border rounded-lg") { "취소" }
            Button(class:"flex-1 py-3 bg-[var(--color-danger)] text-white rounded-lg") {
              "확인"
            }
          }
        }
      }
    }

    # 로딩 상태
    Section {
      # Spinner
      Div(class:"flex items-center gap-4") {
        Div(class:"w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin")
        Span { "로딩 중..." }
      }

      # Skeleton
      Card(class:"p-6 bg-white rounded-xl shadow-sm") {
        Div(class:"flex items-center gap-4") {
          Div(class:"w-12 h-12 bg-gray-200 rounded-full animate-pulse")
          Div(class:"flex-1 space-y-2") {
            Div(class:"h-4 bg-gray-200 rounded animate-pulse w-3/4")
          }
        }
      }
    }

    # 에러 상태
    Section {
      # 404 Error
      Div(class:"text-center py-12") {
        H1(class:"text-6xl font-bold mb-4") { "404" }
        P(class:"text-2xl text-gray-600 mb-8") {
          "페이지를 찾을 수 없습니다"
        }
        Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg") {
          "홈으로"
        }
      }
    }
  }
}
\`\`\``;

  const bestPractices = `
## Best Practices

### Design System
1. **Spacing**: Tailwind 스케일 사용 (p-4, p-6, p-8, gap-4, space-y-4)
2. **Colors**: CSS 변수로 브랜드 색상 정의 \`var(--color-primary)\`
3. **Typography**: H1 (text-5xl), H2 (text-3xl), H3 (text-2xl), body (text-base)
4. **Responsive**: 모바일 우선 (md:, lg:, xl: prefixes)
5. **States**: hover:, focus:, active: 상태 포함

### Common Snippets
\`\`\`uih
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
\`\`\``;

  // 섹션별 조합
  switch (section) {
    case "syntax":
      return syntaxGuide;
    case "form":
      return syntaxGuide + formPattern;
    case "layout":
      return syntaxGuide + layoutPattern;
    case "navigation":
      return syntaxGuide + navigationPattern;
    case "data":
      return syntaxGuide + dataPattern;
    case "interaction":
      return syntaxGuide + interactionPattern;
    case "best-practices":
      return syntaxGuide + bestPractices;
    case "full":
    default:
      // 전체 AI_GENERATION.md 읽기 (안전한 경로 탐색)
      try {
        const projectRoot = findProjectRoot();
        const aiGenPath = join(projectRoot, 'docs', 'AI_GENERATION.md');

        if (existsSync(aiGenPath)) {
          debugLog(`Reading AI_GENERATION.md from: ${aiGenPath}`);
          return readFileSync(aiGenPath, 'utf-8');
        } else {
          debugLog(`AI_GENERATION.md not found at ${aiGenPath}, using embedded patterns`);
          return syntaxGuide + formPattern + layoutPattern + navigationPattern + dataPattern + interactionPattern + bestPractices;
        }
      } catch (error) {
        debugLog(`Error finding project root: ${error instanceof Error ? error.message : String(error)}`);
        // 파일을 읽을 수 없으면 모든 패턴 반환
        return syntaxGuide + formPattern + layoutPattern + navigationPattern + dataPattern + interactionPattern + bestPractices;
      }
  }
}

// Create MCP server
const server = new Server(
  {
    name: "uih-mcp-server",
    version: "0.3.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_uih_guide",
      description:
        "Get UIH language syntax guide and examples. Use this when you need to generate UIH code. Claude Code should read this guide and generate UIH code directly, without requiring external API calls.",
      inputSchema: {
        type: "object",
        properties: {
          section: {
            type: "string",
            enum: ["full", "syntax", "form", "layout", "navigation", "data", "interaction", "best-practices"],
            description: "Which section of the guide to retrieve (form/layout/navigation/data/interaction for specific patterns)",
            default: "full",
          },
          userRequest: {
            type: "string",
            description: "Optional: User's original request for automatic context detection",
          },
        },
      },
    },
    {
      name: "compile_uih",
      description:
        "Compile UIH code to React, Vue, or Svelte component code. Returns the generated framework code as a string. When interactive=true, generates smart placeholders for Claude Code to implement logic automatically.",
      inputSchema: {
        type: "object",
        properties: {
          uih_code: {
            type: "string",
            description: "UIH code to compile",
          },
          target: {
            type: "string",
            enum: ["react", "vue", "svelte"],
            description: "Target framework (react, vue, or svelte)",
            default: "react",
          },
          interactive: {
            type: "boolean",
            description:
              "Generate interactive template with logic placeholders. When true, adds smart TODO comments for Claude Code to implement state management, validation, API calls, etc.",
            default: false,
          },
          features: {
            type: "array",
            items: {
              type: "string",
              enum: ["validation", "api", "animation", "modal", "tabs"],
            },
            description:
              "Specific features to generate placeholders for. If not provided, auto-detects from UIH AST. Options: validation, api, animation, modal, tabs",
          },
          output_file: {
            type: "string",
            description:
              "Optional file path to save the generated code (e.g., 'src/components/Login.tsx')",
          },
        },
        required: ["uih_code"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_uih_guide": {
        const { section = "full", userRequest } = args as {
          section?: string;
          userRequest?: string;
        };

        // 자동 컨텍스트 감지
        let actualSection = section;
        if (!section || section === "full") {
          if (userRequest) {
            actualSection = detectContext(userRequest);
            debugLog(`🔍 Auto-detected context: ${actualSection} from "${userRequest}"`);
          }
        }

        debugLog(`📖 Retrieving UIH guide: ${actualSection}`);

        const guide = getGuideSection(actualSection);

        // 크기 제한 적용
        let outputText = guide;
        if (outputText.length > MAX_OUTPUT_SIZE) {
          outputText = outputText.substring(0, MAX_OUTPUT_SIZE) +
            `\n\n... (truncated ${outputText.length - MAX_OUTPUT_SIZE} characters)\n\nNote: Guide was truncated due to size limits. Request a specific section for full content.`;
          debugLog(`⚠️  Guide truncated: ${outputText.length} → ${MAX_OUTPUT_SIZE} chars`);
        }

        return {
          content: [
            {
              type: "text",
              text: outputText,
            },
          ],
        };
      }

      case "compile_uih": {
        const {
          uih_code,
          target = "react",
          interactive = false,
          features,
          output_file,
        } = args as {
          uih_code: string;
          target?: string;
          interactive?: boolean;
          features?: string[];
          output_file?: string;
        };

        debugLog(
          `⚛️  Compiling UIH to ${target}${interactive ? " (interactive)" : ""}...`
        );

        // Parse UIH with improved error handling
        let ast;
        try {
          ast = parse(uih_code);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);

          // 파싱 에러에서 라인/컬럼 추출 시도
          const lineMatch = errorMsg.match(/line (\d+)/i);
          const colMatch = errorMsg.match(/column (\d+)/i);

          let detailedError = `Failed to parse UIH code:\n${errorMsg}`;
          if (lineMatch || colMatch) {
            detailedError += `\n\nLocation: `;
            if (lineMatch) detailedError += `Line ${lineMatch[1]}`;
            if (colMatch) detailedError += `, Column ${colMatch[1]}`;
          }

          throw new Error(detailedError);
        }

        // Get plugin for target framework with fallback
        const plugin = pluginRegistry.get(target);
        if (!plugin) {
          // pluginRegistry.getAvailablePlugins() 메서드 존재 확인
          const availableTargets = typeof pluginRegistry.getAvailablePlugins === 'function'
            ? pluginRegistry.getAvailablePlugins()
            : ['react', 'vue', 'svelte']; // fallback

          throw new Error(
            `Unknown framework: ${target}. Available: ${availableTargets.join(", ")}`
          );
        }

        // Generate code with options (features는 유효할 때만 전달)
        const generateOptions: any = { interactive };

        if (features && Array.isArray(features) && features.length > 0) {
          generateOptions.features = features;
          debugLog(`Using features: ${features.join(', ')}`);
        }

        const code = await plugin.generate(ast, generateOptions);

        // Save to file if requested
        if (output_file) {
          const dir = dirname(output_file);
          mkdirSync(dir, { recursive: true });
          writeFileSync(output_file, code, "utf8");
          debugLog(`✅ Saved ${target} code to: ${output_file}`);
        }

        // 크기 제한 적용
        let outputCode = code;
        if (outputCode.length > MAX_OUTPUT_SIZE) {
          outputCode = outputCode.substring(0, MAX_OUTPUT_SIZE) +
            `\n\n/* ... (truncated ${code.length - MAX_OUTPUT_SIZE} characters) */`;
          debugLog(`⚠️  Output truncated: ${code.length} → ${MAX_OUTPUT_SIZE} chars`);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  target,
                  code: outputCode,
                  output_file: output_file || null,
                  message: output_file
                    ? `Compiled to ${target} and saved to ${output_file}`
                    : `Compiled to ${target} (not saved to file)`,
                  truncated: code.length > MAX_OUTPUT_SIZE,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    debugLog(`❌ Error in ${name}: ${errorMessage}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: errorMessage,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  debugLog("UIH MCP Server running on stdio");
  debugLog(`Debug mode: ${DEBUG ? 'enabled' : 'disabled'} (set DEBUG=true or UIH_DEBUG=true to enable)`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
