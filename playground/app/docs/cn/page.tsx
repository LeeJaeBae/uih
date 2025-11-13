export default function Page() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root {
  --color-primary: #0E5EF7;
  --color-secondary: #6B7280;
  --color-accent: #10B981;
}`,
        }}
      />
      <div className="container mx-auto p-6">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{"U"}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {"UIH文档"}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="/docs/ko"
                  >
                    {"한국어"}
                  </a>
                  <a
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="/docs/en"
                  >
                    {"English"}
                  </a>
                  <a
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="/docs/jp"
                  >
                    {"日本語"}
                  </a>
                  <a
                    className="px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium"
                    href="/docs/cn"
                  >
                    {"中文"}
                  </a>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
              <section className="mb-16 text-center">
                <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                  {"Universal UI Hierarchy"}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  {"React、Vue和Svelte的统一UI元语言"}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                    href="/editor"
                  >
                    {"在编辑器中开始 →"}
                  </a>
                  <a
                    className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 transition-all"
                    href="https://github.com/LeeJaeBae/uih"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {"在GitHub上查看"}
                  </a>
                </div>
              </section>
              <section className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {"✨ 主要特性"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"🎨"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"完整的Tailwind CSS支持"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"支持所有Tailwind实用程序类和CSS变量。"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"🔄"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"多框架支持"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"可同时编译为React、Vue和Svelte。"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"⚡"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"交互式模板"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"自动生成state、验证和API逻辑。"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"🤖"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"AI友好"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"与Claude Code集成，可用自然语言生成UI。"}
                    </p>
                  </div>
                </div>
              </section>
              <section className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {"🚀 快速开始"}
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {"1"}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {"安装"}
                      </h4>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{"npm install -g uih-cli"}</code>
                    </pre>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {"2"}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {"编写UIH文件"}
                      </h4>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{`meta {
  route: "/hello";
}

layout {
  Card(class:"p-6") {
    H1 { "你好世界！" }
  }
}`}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {"3"}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {"编译"}
                      </h4>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{"uih compile hello.uih out --target react"}</code>
                    </pre>
                  </div>
                </div>
              </section>
              <section className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {"📝 基本语法"}
                </h3>
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {"Meta块"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"定义页面元数据。"}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{`meta {
  route: "/about";
  title: "关于";
  theme: "light";
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {"Style块"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"定义CSS变量。"}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{`style {
  color.primary: "#0E5EF7";
  color.secondary: "#6B7280";
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {"Layout块"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"定义UI结构。"}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{`layout {
  Div(class:"container") {
    H1 { "标题" }
    P { "内容" }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {"🔗 了解更多"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                    href="https://github.com/LeeJaeBae/uih"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"GitHub"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"源代码和问题跟踪"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                    href="/editor"
                  >
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"Playground"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"在浏览器中立即试用"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                    href="https://www.npmjs.com/package/uih-cli"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"NPM"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"包和安装指南"}
                    </p>
                  </a>
                </div>
              </section>
            </div>
          </main>
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
            <div className="container mx-auto px-6 py-8">
              <div className="text-center text-gray-600 dark:text-gray-400">
                <p>{"© 2024 UIH. MIT License."}</p>
                <p className="mt-2">
                  <span>{"Made with ❤️ by "}</span>
                  <a
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    href="https://github.com/LeeJaeBae"
                    target="_blank"
                    rel="noopener noreferrer"
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
