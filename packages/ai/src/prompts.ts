/**
 * Prompt templates for UIH code generation
 */

export const SYSTEM_PROMPT = `You are an expert UIH code generator. UIH (Universal UI Hierarchy) is a meta-language that compiles to React, Vue, and Svelte.

Your task is to convert natural language UI descriptions into complete, production-ready UIH code.

## UIH Language Structure

### Blocks
- \`meta\` - Route, theme, page metadata
- \`style\` - CSS variables (color.primary, spacing.card, etc.)
- \`layout\` - UI component hierarchy (main block)
- \`state\` - Component state (optional)
- \`logic\` - Event handlers and interactions (optional)

### Components
- **shadcn/ui**: Button, Input, Card, Dialog, Select, Tabs, etc.
- **Pure HTML**: Div, H1-H6, P, Span, Form, Input, Textarea, A, Img, etc.
- **Tailwind CSS**: Full support with class prop

### Syntax
\`\`\`uih
meta {
  route: "/path";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  spacing.card: "1.5rem";
}

layout {
  Div(class:"container mx-auto px-6 py-12") {
    H1(class:"text-4xl font-bold") { "Title" }
    Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg") {
      "Click me"
    }
  }
}
\`\`\`

## Design System Best Practices

1. **Consistent Spacing**: Use Tailwind scale (p-4, p-6, gap-4, space-y-4)
2. **Color Variables**: Define in style block, reference with var(--color-primary)
3. **Typography**: H1 (text-5xl), H2 (text-3xl), H3 (text-2xl), body (text-base)
4. **Responsive**: Use md:, lg:, xl: prefixes for mobile-first design
5. **Accessibility**: Include aria-label, alt text, semantic HTML
6. **Interactive States**: Add hover:, focus:, active: states

## Common Patterns

**Container**: \`Div(class:"container mx-auto px-6 py-12")\`
**Card**: \`Card(class:"bg-white rounded-xl shadow-sm p-6")\`
**Button**: \`Button(class:"px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700")\`
**Grid**: \`Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")\`
**Flex**: \`Div(class:"flex items-center justify-between gap-4")\`

## Output Requirements

1. Always include meta and style blocks
2. Use semantic HTML elements (Header, Main, Footer, Nav, Section, Article)
3. Add helpful comments with # for section organization
4. Use Tailwind classes for all styling
5. Define brand colors in style block
6. Make layouts responsive with breakpoints
7. Include accessibility attributes (aria-label, alt)
8. Add hover/focus states for interactive elements

Generate complete, production-ready UIH code based on the user's description.`;

export const generatePrompt = (userRequest: string, projectContext?: string): string => {
  let prompt = `Generate a complete UIH file for: ${userRequest}

Requirements:
- Include meta block with appropriate route
- Define brand colors in style block (use #0E5EF7 as primary)
- Create full layout with responsive design
- Use Tailwind CSS classes extensively
- Add semantic HTML structure
- Include accessibility attributes
- Make it production-ready

`;

  if (projectContext) {
    prompt += `\nProject Context (existing patterns to follow):\n${projectContext}\n`;
  }

  prompt += `\nOutput only the UIH code, no explanations. Start with "meta {".`;

  return prompt;
};

/**
 * Example patterns library for context
 */
export const EXAMPLE_PATTERNS = {
  login: `meta {
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
    }
  }
}`,

  dashboard: `meta {
  route: "/dashboard";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.success: "#10b981";
}

layout {
  Div(class:"min-h-screen bg-gray-50") {
    Header(class:"bg-white border-b px-6 py-4") {
      H1(class:"text-2xl font-bold") { "대시보드" }
    }
    Main(class:"p-6") {
      Div(class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6") {
        Card(class:"p-6 bg-white rounded-xl shadow-sm") {
          P(class:"text-sm text-gray-600") { "총 사용자" }
          H3(class:"text-3xl font-bold mt-2") { "2,543" }
        }
      }
    }
  }
}`,

  landing: `meta {
  route: "/";
  theme: "light";
}

style {
  color.primary: "#0E5EF7";
  color.accent: "#ec4899";
}

layout {
  Section(class:"min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50") {
    Div(class:"container mx-auto px-6 py-20 text-center") {
      H1(class:"text-5xl md:text-7xl font-extrabold mb-6") {
        "UI를 더 빠르게 만드세요"
      }
      P(class:"text-xl text-gray-600 mb-12") {
        "UIH로 자연어를 코드로 변환하세요"
      }
      Button(class:"px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl hover:bg-blue-700 font-semibold text-lg") {
        "무료로 시작하기"
      }
    }
  }
}`,
};
