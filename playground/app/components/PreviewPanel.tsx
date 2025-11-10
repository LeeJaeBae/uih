"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import { useEffect, useState } from "react";

interface PreviewPanelProps {
  code: string;
  framework: "react" | "vue" | "svelte";
}

export default function PreviewPanel({ code, framework }: PreviewPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">로딩 중...</p>
      </div>
    );
  }

  // React만 지원 (Vue/Svelte는 Sandpack에서 제한적 지원)
  if (framework !== "react") {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            🚧 미리보기는 React만 지원합니다
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vue와 Svelte 미리보기는 추후 추가 예정입니다.
          </p>
        </div>
      </div>
    );
  }

  // 코드가 없으면 안내 메시지
  if (!code.trim()) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          UIH 코드를 입력하면 여기에 미리보기가 표시됩니다
        </p>
      </div>
    );
  }

  // Sandpack 설정
  const files = {
    "/App.tsx": code,
    "/index.tsx": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);`,
  };

  return (
    <div className="h-full overflow-auto">
      <Sandpack
        template="react-ts"
        files={files}
        theme="dark"
        options={{
          showNavigator: false,
          showTabs: false,
          showLineNumbers: false,
          editorHeight: "100%",
          editorWidthPercentage: 0, // 에디터 숨기기 (미리보기만)
        }}
      />
    </div>
  );
}
