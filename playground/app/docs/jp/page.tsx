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
                    {"UIHドキュメント"}
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
                    className="px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-medium"
                    href="/docs/jp"
                  >
                    {"日本語"}
                  </a>
                  <a
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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
                  {"React、Vue、Svelte向けの統合UIメタ言語"}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                    href="/editor"
                  >
                    {"エディタで始める →"}
                  </a>
                  <a
                    className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 transition-all"
                    href="https://github.com/LeeJaeBae/uih"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {"GitHubで見る"}
                  </a>
                </div>
              </section>
              <section className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {"✨ 主な機能"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"🎨"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"完全なTailwind CSSサポート"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {
                        "すべてのTailwindユーティリティクラスとCSS変数をサポート。"
                      }
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"🔄"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"マルチフレームワーク"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"React、Vue、Svelteに同時にコンパイル可能。"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"⚡"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"インタラクティブテンプレート"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"state、バリデーション、APIロジックを自動生成。"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-4xl mb-4">{"🤖"}</div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"AI対応"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"Claude Codeと統合し、自然言語でUI生成。"}
                    </p>
                  </div>
                </div>
              </section>
              <section className="mb-16">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {"🚀 クイックスタート"}
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                        {"1"}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {"インストール"}
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
                        {"UIHファイルを作成"}
                      </h4>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{`meta {
  route: "/hello";
}

layout {
  Card(class:"p-6") {
    H1 { "こんにちは！" }
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
                        {"コンパイル"}
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
                  {"📝 基本構文"}
                </h3>
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {"Metaブロック"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"ページのメタデータを定義。"}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{`meta {
  route: "/about";
  title: "について";
  theme: "light";
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {"Styleブロック"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"CSS変数を定義。"}
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
                      {"Layoutブロック"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {"UI構造を定義。"}
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{`layout {
  Div(class:"container") {
    H1 { "タイトル" }
    P { "コンテンツ" }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {"🔗 詳細情報"}
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
                      {"ソースコードと課題トラッカー"}
                    </p>
                  </a>
                  <a
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                    href="/editor"
                  >
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {"プレイグラウンド"}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {"ブラウザで今すぐ試す"}
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
                      {"パッケージとインストールガイド"}
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
