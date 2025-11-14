import Link from "next/link";

export default function Page() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root {
  --color-primary: #0E5EF7;
  --color-secondary: #6B7280;
  --color-accent: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
}`,
        }}
      />
      <div className="container mx-auto p-6">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{"U"}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {"UIH 완벽 가이드"}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="/"
                  >
                    {"홈"}
                  </Link>
                  <Link
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="/editor"
                  >
                    {"에디터"}
                  </Link>
                  <a
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="https://github.com/LeeJaeBae/uih"
                  >
                    {"GitHub"}
                  </a>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-6 py-12">
            <div className="max-w-5xl mx-auto">
              <section className="mb-20">
                <div className="text-center mb-12">
                  <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                    {"UIH 완벽 가이드"}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    {"UIH의 모든 기능을 배우고 마스터하세요"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    href="#syntax"
                  >
                    <div className="text-4xl mb-3">{"📝"}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"기본 문법"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"meta, layout, style, logic 블록 완벽 정복"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    href="#components"
                  >
                    <div className="text-4xl mb-3">{"🧩"}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"컴포넌트"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"Core vs Shadcn 레지스트리 이해하기"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    href="#cli"
                  >
                    <div className="text-4xl mb-3">{"⚡"}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"CLI 사용법"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"컴파일, watch, AI 생성 명령어"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    href="#playground"
                  >
                    <div className="text-4xl mb-3">{"🎮"}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"Playground"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"라이브 에디터 및 프리뷰 사용하기"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    href="#hello-world"
                  >
                    <div className="text-4xl mb-3">{"🚀"}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"Hello World"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"첫 UIH 프로젝트 시작하기"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    href="#advanced"
                  >
                    <div className="text-4xl mb-3">{"🎓"}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"고급 기능"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"Data, State, Motion 블록 활용"}
                    </p>
                  </a>
                </div>
              </section>
              <section id="syntax" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"📝 UIH 기본 문법"}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {"UIH는 5가지 핵심 블록으로 구성됩니다"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{"1️⃣"}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"Meta 블록"}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {
                        "페이지의 라우트, 제목, 테마 등 메타데이터를 정의합니다."
                      }
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`meta {
  route: "/about";
  title: "소개 페이지";
  theme: "light";
  description: "우리 회사를 소개합니다";
}`}</code>
                    </pre>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-blue-900 dark:text-blue-200 font-medium">
                        {
                          "💡 Tip: route는 Next.js 라우팅에, title은 SEO에 활용됩니다"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{"2️⃣"}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"Style 블록"}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"CSS 변수를 정의하여 디자인 시스템을 구축합니다."}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`style {
  color.primary: "#0E5EF7";
  color.secondary: "#6B7280";
  color.accent: "#10B981";
  spacing.unit: "8px";
  font.heading: "Inter, sans-serif";
}`}</code>
                    </pre>
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-green-900 dark:text-green-200 font-medium">
                        {
                          "✨ Tailwind에서 var(--color-primary)로 사용 가능합니다"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{"3️⃣"}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"Layout 블록"}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"실제 UI 구조를 정의하는 핵심 블록입니다."}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`layout {
  Div(class:"container mx-auto p-6") {
    Header(class:"mb-8") {
      H1(class:"text-4xl font-bold") { "환영합니다" }
      P(class:"text-gray-600") { "UIH로 빌드하세요" }
    }
    
    Section(class:"grid grid-cols-2 gap-4") {
      Card(class:"p-6") {
        H2 { "기능 1" }
        P { "설명" }
      }
      Card(class:"p-6") {
        H2 { "기능 2" }
        P { "설명" }
      }
    }
  }
}`}</code>
                    </pre>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded">
                      <p className="text-purple-900 dark:text-purple-200 font-medium">
                        {
                          "🎨 모든 Tailwind CSS 유틸리티 클래스를 사용할 수 있습니다"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{"4️⃣"}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"Logic 블록"}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {
                        "버튼 클릭, 폼 제출 등 이벤트 핸들러를 선언적으로 정의합니다."
                      }
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`logic {
  on submit {
    call "/api/login" method:"POST";
    toast "로그인 성공!";
    navigate "/dashboard";
  }
  
  on cancel {
    navigate "/";
  }
}`}</code>
                    </pre>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-yellow-900 dark:text-yellow-200 font-medium">
                        {
                          "⚡ Interactive 모드에서 자동으로 실제 로직으로 변환됩니다"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{"5️⃣"}</span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"State & Data 블록"}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"컴포넌트 상태와 API 데이터를 정의합니다."}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`state {
  count: 0;
  isOpen: false;
  username: "";
}

data {
  fetch users from "/api/users";
  fetch posts from "/api/posts";
}`}</code>
                    </pre>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 p-4 rounded">
                      <p className="text-indigo-900 dark:text-indigo-200 font-medium">
                        {"🔄 자동으로 useState, useEffect로 변환됩니다 (React)"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="components" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"🧩 컴포넌트 레지스트리"}
                  </h2>
                  <p className="text-purple-100 text-lg">
                    {"Core vs Shadcn - 프레임워크별 컴포넌트 이해하기"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🎯 Core Registry (42개 컴포넌트)"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {
                        "모든 프레임워크(React, Vue, Svelte)에서 사용 가능한 순수 HTML 컴포넌트입니다."
                      }
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                          {"📄 레이아웃 & 구조"}
                        </h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre">
                          <code>{`Div, Span, Section, Article
Header, Footer, Nav, Main
Aside`}</code>
                        </pre>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                          {"📝 텍스트 & 제목"}
                        </h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre">
                          <code>{`H1, H2, H3, H4, H5, H6
P, Pre, Code, Text`}</code>
                        </pre>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                          {"📋 폼 요소"}
                        </h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre">
                          <code>{`Form, Input, Button
Textarea, Select, Option
Checkbox, Label
Fieldset, Legend`}</code>
                        </pre>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                          {"📊 테이블 & 리스트"}
                        </h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre">
                          <code>{`Table, Thead, Tbody, Tfoot
Tr, Td, Th
Ul, Ol, Li`}</code>
                        </pre>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-blue-900 dark:text-blue-200 font-medium">
                        {"✅ 프레임워크 독립적 - Vue, Svelte도 동일하게 작동"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"⚛️ Shadcn Registry (28개 컴포넌트)"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {
                        "React 전용 shadcn/ui 컴포넌트 - 고급 UI를 빠르게 구축합니다."
                      }
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                          {"🎨 UI 컴포넌트"}
                        </h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre">
                          <code>{`Button, Input, Card
Badge, Avatar, Alert
Skeleton, Progress`}</code>
                        </pre>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                          {"🔀 인터랙션"}
                        </h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre">
                          <code>{`Dialog, Tooltip, Tabs
Switch, Checkbox
Select, Separator`}</code>
                        </pre>
                      </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded mb-4">
                      <p className="text-orange-900 dark:text-orange-200 font-medium">
                        {
                          "⚠️ React에서만 작동 - Vue/Svelte는 Core Registry 사용"
                        }
                      </p>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre">
                      <code>{`// React: Core + Shadcn 병합
layout {
  Card(class:"p-6") {  // shadcn Card 사용
    Button(variant:"default") { "클릭" }
  }
}

// Vue/Svelte: Core만 사용
layout {
  Div(class:"border rounded-lg p-6") {  // HTML div
    Button(class:"bg-blue-500") { "클릭" }
  }
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🔧 레지스트리 병합 전략"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`// React Plugin
const registry = {
  ...coreRegistry,    // 42개 순수 HTML
  ...shadcnRegistry   // 28개 shadcn/ui (오버라이드)
};

// Vue/Svelte Plugin
const registry = coreRegistry;  // 42개만 사용`}</code>
                    </pre>
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-green-900 dark:text-green-200 font-medium">
                        {
                          "💡 React는 Button이 shadcn, Vue는 <button> 태그로 컴파일"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="cli" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"⚡ CLI 사용법"}
                  </h2>
                  <p className="text-green-100 text-lg">
                    {"명령줄에서 UIH를 컴파일하고 관리하세요"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"📦 설치"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`# npm으로 전역 설치
npm install -g uih-cli

# pnpm 사용 시
pnpm add -g uih-cli

# 버전 확인
uih --version`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🔨 기본 컴파일"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`# React로 컴파일 (기본값)
uih compile input.uih output

# Vue로 컴파일
uih compile input.uih output --target vue

# Svelte로 컴파일
uih compile input.uih output --target svelte`}</code>
                    </pre>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded mt-4">
                      <p className="text-blue-900 dark:text-blue-200 font-medium">
                        {"📂 output 폴더에 컴파일된 파일이 생성됩니다"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"👁️ Watch 모드"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`# 파일 변경 감지 및 자동 재컴파일
uih compile input.uih output --watch

# 또는 -w 플래그
uih compile input.uih output -w`}</code>
                    </pre>
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-green-900 dark:text-green-200 font-medium">
                        {"🔄 개발 중 실시간으로 변경사항 확인 가능"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🤖 AI 생성"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`# 자연어로 UIH 생성 (Claude Code 필요)
uih ai "login form" > login.uih

# 또는 MCP 서버 사용 (권장)
# ~/.claude/mcp_settings.json 설정 필요`}</code>
                    </pre>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded">
                      <p className="text-purple-900 dark:text-purple-200 font-medium">
                        {"✨ Claude Code가 UIH를 직접 생성하고 컴파일합니다"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🎯 Interactive 모드"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`# Logic 자동 구현 템플릿 생성
uih compile form.uih output --interactive

# 생성된 코드에 TODO 주석이 추가되고
# Claude Code가 자동으로 로직 구현`}</code>
                    </pre>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                      <p className="text-yellow-900 dark:text-yellow-200 font-medium">
                        {"⚡ validation, API call, state 관리 자동 생성"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="playground" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"🎮 Playground 사용법"}
                  </h2>
                  <p className="text-pink-100 text-lg">
                    {"브라우저에서 UIH를 실시간으로 편집하고 미리보기"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🌐 온라인 Playground"}
                    </h3>
                    <div className="mb-6">
                      <Link
                        className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all text-lg"
                        href="/editor"
                      >
                        {"🚀 Playground 열기 →"}
                      </Link>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{"1️⃣"}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            {"코드 작성"}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {"왼쪽 에디터에서 UIH 코드를 작성합니다"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{"2️⃣"}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            {"실시간 미리보기"}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {"오른쪽에서 렌더링 결과를 즉시 확인합니다"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{"3️⃣"}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            {"프레임워크 선택"}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {
                              "React, Vue, Svelte 중 타겟 프레임워크를 선택합니다"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">{"4️⃣"}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            {"코드 다운로드"}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {"완성된 컴포넌트를 프로젝트에 복사합니다"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"💻 로컬 Playground"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`# 프로젝트 클론
git clone https://github.com/LeeJaeBae/uih.git
cd uih

# 의존성 설치
pnpm install

# Playground 실행
cd playground
pnpm dev

# http://localhost:3000/editor 접속`}</code>
                    </pre>
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-green-900 dark:text-green-200 font-medium">
                        {"🔧 로컬에서 실행하면 파일 시스템에 직접 저장 가능"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="hello-world" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"🚀 Hello World 튜토리얼"}
                  </h2>
                  <p className="text-yellow-100 text-lg">
                    {"5분 안에 첫 UIH 프로젝트 완성하기"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <span className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                        {"1"}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"hello.uih 파일 생성"}
                      </h3>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre">
                      <code>{`meta {
  route: "/hello";
  title: "Hello UIH";
}

style {
  color.primary: "#0E5EF7";
}

layout {
  Div(class:"min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100") {
    Div(class:"text-center") {
      H1(class:"text-6xl font-extrabold text-gray-900 mb-4") {
        "Hello, UIH! 👋"
      }
      P(class:"text-xl text-gray-600 mb-8") {
        "React, Vue, Svelte를 위한 통합 UI 언어"
      }
      Button(class:"px-8 py-3 bg-[var(--color-primary)] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all") {
        "시작하기 →"
      }
    }
  }
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <span className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                        {"2"}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"React로 컴파일"}
                      </h3>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>
                        {"uih compile hello.uih output --target react"}
                      </code>
                    </pre>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-blue-900 dark:text-blue-200 font-medium">
                        {"📂 output/hello.tsx 파일이 생성됩니다"}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <span className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                        {"3"}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"프로젝트에 추가"}
                      </h3>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`// Next.js app/page.tsx
import HelloComponent from './output/hello';

export default function Page() {
  return <HelloComponent />;
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                      <span className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                        {"4"}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"실행 확인"}
                      </h3>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 whitespace-pre">
                      <code>{`npm run dev
# http://localhost:3000 접속`}</code>
                    </pre>
                    <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-green-900 dark:text-green-200 font-medium">
                        {"🎉 축하합니다! 첫 UIH 컴포넌트를 완성했습니다"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section id="advanced" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"🎓 고급 기능"}
                  </h2>
                  <p className="text-indigo-100 text-lg">
                    {"Motion, Data, State 블록으로 인터랙티브한 UI 만들기"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"✨ Motion 블록"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"CSS 애니메이션을 선언적으로 정의합니다."}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre">
                      <code>{`motion {
  .card on hover {
    scale: 1.05;
    duration: "200ms";
  }
  
  .button on active {
    scale: 0.95;
    opacity: 0.8;
  }
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🌐 Data 블록"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"API 데이터 페칭을 자동화합니다."}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre">
                      <code>{`data {
  fetch users from "/api/users";
  fetch posts from "/api/posts";
}

layout {
  Div {
    // users 변수 자동 생성
    // usersLoading, usersError도 생성됨
  }
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"💾 State 블록"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"컴포넌트 상태를 정의합니다."}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre">
                      <code>{`state {
  count: 0;
  isModalOpen: false;
  username: "";
  items: [];
}

// React: useState 자동 생성
// Vue: ref 자동 생성
// Svelte: let 변수 생성`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {"🔗 종합 예제"}
                    </h3>
                    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre">
                      <code>{`meta {
  route: "/dashboard";
}

style {
  color.primary: "#0E5EF7";
}

state {
  searchQuery: "";
}

data {
  fetch users from "/api/users";
}

motion {
  .user-card on hover {
    scale: 1.02;
    duration: "150ms";
  }
}

layout {
  Div(class:"container mx-auto p-6") {
    Input(
      placeholder:"검색...",
      class:"mb-4 px-4 py-2 border rounded"
    )
    
    Div(class:"grid grid-cols-3 gap-4") {
      // users 데이터 렌더링
      Card(class:"user-card p-4") {
        H3 { "사용자 이름" }
      }
    }
  }
}

logic {
  on search {
    call "/api/search";
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-12 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4">
                  {"🎉 이제 시작해보세요!"}
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  {"UIH로 더 빠르고 일관성 있는 UI를 만들어보세요"}
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all"
                    href="/editor"
                  >
                    {"Playground 시작 →"}
                  </Link>
                  <a
                    className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-lg shadow-lg transition-all"
                    href="https://github.com/LeeJaeBae/uih"
                  >
                    {"GitHub 보기"}
                  </a>
                </div>
              </div>
            </div>
          </main>
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
            <div className="container mx-auto px-6 py-8">
              <div className="text-center text-gray-600 dark:text-gray-400">
                <p>{"© 2024 UIH. MIT License."}</p>
                <p className="mt-2">
                  <span>{"Made with ❤️ by "}</span>
                  <a
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    href="https://github.com/LeeJaeBae"
                  >
                    {"LeeJaeWon"}
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
