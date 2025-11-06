import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            UIH Playground
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Universal UI Hierarchy - 하나의 정의로 React, Vue, Svelte 코드 생성
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FeatureCard
            emoji="⚡"
            title="실시간 미리보기"
            description="코드를 작성하는 즉시 결과를 확인하세요"
          />
          <FeatureCard
            emoji="🎨"
            title="다중 프레임워크"
            description="React, Vue, Svelte로 즉시 변환"
          />
          <FeatureCard
            emoji="📚"
            title="예제 갤러리"
            description="10개 이상의 실전 예제 제공"
          />
        </div>

        <div className="pt-8">
          <Link
            href="/editor"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            시작하기 →
          </Link>
        </div>

        <div className="pt-12 text-sm text-gray-500 dark:text-gray-600">
          <p>Made with ❤️ by LeeJaeWon</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
