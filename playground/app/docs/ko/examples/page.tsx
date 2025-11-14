import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Page() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root {
  --color-primary: #0E5EF7;
  --color-secondary: #6B7280;
  --color-success: #10B981;
  --color-warning: #F59E0B;
}`,
        }}
      />
      <div className="container mx-auto p-6">
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{"E"}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {"UIH 예제 갤러리"}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="/docs/ko"
                  >
                    {"문서"}
                  </Link>
                  <Link
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    href="/docs/ko/guide"
                  >
                    {"가이드"}
                  </Link>
                  <Link
                    className="px-3 py-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 font-medium"
                    href="/editor"
                  >
                    {"에디터"}
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <section className="mb-16 text-center">
                <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                  {"실전 UIH 예제"}
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  {"다양한 UI 패턴을 UIH로 구현한 예제 모음"}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                    href="#forms"
                  >
                    {"폼"}
                  </a>
                  <a
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
                    href="#cards"
                  >
                    {"카드"}
                  </a>
                  <a
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    href="#navigation"
                  >
                    {"네비게이션"}
                  </a>
                  <a
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    href="#data"
                  >
                    {"데이터 표시"}
                  </a>
                </div>
              </section>
              <section id="forms" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"📝 Form 예제"}
                  </h2>
                  <p className="text-purple-100 text-lg">
                    {"로그인, 회원가입, 연락처 폼 등"}
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"로그인 폼"}
                      </h3>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 rounded-full text-sm font-medium">
                        {"Basic"}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
                      <div className="max-w-sm mx-auto">
                        <h4 className="text-xl font-bold mb-4 text-center">
                          {"로그인"}
                        </h4>
                        <form className="space-y-4">
                          <Input
                            placeholder="이메일"
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                          <Input
                            placeholder="비밀번호"
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                          <Button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                            {"로그인"}
                          </Button>
                        </form>
                      </div>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre">
                      <code>{`layout {
  Card(class:"p-6") {
    H2 { "로그인" }
    Form {
      Input(type:"email")
      Input(type:"password")
      Button { "로그인" }
    }
  }
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {"회원가입 폼"}
                      </h3>
                      <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-900 dark:text-pink-100 rounded-full text-sm font-medium">
                        {"Advanced"}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
                      <div className="max-w-sm mx-auto">
                        <h4 className="text-xl font-bold mb-4 text-center">
                          {"회원가입"}
                        </h4>
                        <form className="space-y-3">
                          <Input
                            placeholder="이름"
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                          <Input
                            placeholder="이메일"
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                          <Input
                            placeholder="비밀번호"
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                          <div className="flex items-center space-x-2">
                            <Input type="checkbox" className="w-4 h-4" />
                            <Label className="text-sm text-gray-600">
                              {"약관에 동의합니다"}
                            </Label>
                          </div>
                          <Button className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700">
                            {"가입하기"}
                          </Button>
                        </form>
                      </div>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre">
                      <code>{`state {
  agreed: false;
}

layout {
  Form {
    Input(type:"email")
    Checkbox { "약관 동의" }
    Button { "가입" }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>
              <section id="cards" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"🎴 Card 예제"}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {"프로필 카드, 상품 카드, 통계 카드 등"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                        {"👤"}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {"홍길동"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {"프론트엔드 개발자"}
                      </p>
                      <div className="flex justify-center space-x-2">
                        <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                          {"팔로우"}
                        </Button>
                        <Button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                          {"메시지"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {"총 사용자"}
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {"12,345"}
                        </h3>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-2xl">
                        {"📈"}
                      </div>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {"↑ 23% 지난 달 대비"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 shadow-lg text-white">
                    <h3 className="text-xl font-bold mb-2">
                      {"프리미엄 플랜"}
                    </h3>
                    <p className="text-purple-100 mb-4">
                      {"모든 기능 무제한 사용"}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{"$29"}</span>
                      <span className="text-purple-200">{"/월"}</span>
                    </div>
                    <Button className="w-full bg-white text-purple-600 py-2 rounded-lg font-bold hover:bg-purple-50">
                      {"시작하기"}
                    </Button>
                  </div>
                </div>
              </section>
              <section id="navigation" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"🧭 Navigation 예제"}
                  </h2>
                  <p className="text-orange-100 text-lg">
                    {"헤더, 사이드바, 탭 네비게이션"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {"헤더 네비게이션"}
                    </h3>
                    <nav className="bg-gray-900 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">
                          {"Brand"}
                        </span>
                        <div className="flex space-x-6">
                          <a
                            className="text-gray-300 hover:text-white"
                            href="#"
                          >
                            {"홈"}
                          </a>
                          <a
                            className="text-gray-300 hover:text-white"
                            href="#"
                          >
                            {"소개"}
                          </a>
                          <a
                            className="text-gray-300 hover:text-white"
                            href="#"
                          >
                            {"서비스"}
                          </a>
                          <a
                            className="text-gray-300 hover:text-white"
                            href="#"
                          >
                            {"연락"}
                          </a>
                        </div>
                        <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                          {"시작"}
                        </Button>
                      </div>
                    </nav>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre">
                      <code>{`Nav {
  Div {
    Span { "Logo" }
    A(href:"/") { "Home" }
    Button { "CTA" }
  }
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {"탭 네비게이션"}
                    </h3>
                    <div className="mb-6">
                      <div className="flex border-b border-gray-200">
                        <Button className="px-6 py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
                          {"개요"}
                        </Button>
                        <Button className="px-6 py-3 text-gray-600 hover:text-gray-900">
                          {"상세정보"}
                        </Button>
                        <Button className="px-6 py-3 text-gray-600 hover:text-gray-900">
                          {"리뷰"}
                        </Button>
                        <Button className="px-6 py-3 text-gray-600 hover:text-gray-900">
                          {"설정"}
                        </Button>
                      </div>
                      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                        <p className="text-gray-600 dark:text-gray-300">
                          {"탭 컨텐츠가 여기에 표시됩니다."}
                        </p>
                      </div>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre">
                      <code>{`state {
  activeTab: 0;
}

layout {
  Div {
    Button { "Tab 1" }
    Button { "Tab 2" }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>
              <section id="data" className="mb-20 scroll-mt-20">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 shadow-xl">
                  <h2 className="text-4xl font-extrabold text-white mb-2">
                    {"📊 Data 표시 예제"}
                  </h2>
                  <p className="text-green-100 text-lg">
                    {"테이블, 리스트, 그리드 레이아웃"}
                  </p>
                </div>
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {"데이터 테이블"}
                    </h3>
                    <div className="overflow-x-auto mb-6">
                      <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                              {"이름"}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                              {"이메일"}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                              {"상태"}
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                              {"액션"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="px-6 py-4">{"홍길동"}</td>
                            <td className="px-6 py-4">{"hong@example.com"}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {"활성"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button className="text-blue-600 hover:underline text-sm">
                                {"편집"}
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="px-6 py-4">{"김철수"}</td>
                            <td className="px-6 py-4">{"kim@example.com"}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                {"대기"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Button className="text-blue-600 hover:underline text-sm">
                                {"편집"}
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre">
                      <code>{`data {
  fetch users from "/api/users";
}

layout {
  Table {
    Thead { Tr { Th } }
    Tbody { Tr { Td } }
  }
}`}</code>
                    </pre>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {"그리드 레이아웃"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                        <p className="text-sm text-blue-100 mb-2">{"방문자"}</p>
                        <h4 className="text-3xl font-bold">{"2,543"}</h4>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                        <p className="text-sm text-green-100 mb-2">{"매출"}</p>
                        <h4 className="text-3xl font-bold">{"$12.5K"}</h4>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                        <p className="text-sm text-purple-100 mb-2">{"주문"}</p>
                        <h4 className="text-3xl font-bold">{"147"}</h4>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                        <p className="text-sm text-orange-100 mb-2">
                          {"전환율"}
                        </p>
                        <h4 className="text-3xl font-bold">{"3.2%"}</h4>
                      </div>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre">
                      <code>{`layout {
  Div(class:"grid grid-cols-4") {
    Card { H3 { "2,543" } }
    Card { H3 { "$12.5K" } }
    Card { H3 { "147" } }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4">
                  {"🎨 더 많은 예제를 만들어보세요!"}
                </h2>
                <p className="text-indigo-100 text-lg mb-8">
                  {"UIH Playground에서 직접 실험하고 공유하세요"}
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    href="/editor"
                  >
                    {"Playground 열기 →"}
                  </Link>
                  <a
                    className="px-8 py-4 bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-800 transition-all"
                    href="https://github.com/LeeJaeBae/uih/tree/main/examples"
                  >
                    {"GitHub 예제 보기"}
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
                    className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
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
