"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { compileUIH, type TargetFramework } from "@/app/lib/compiler";
import { examples } from "@/app/data/examples";

interface CodeEditorProps {
  defaultValue: string;
}

export default function CodeEditor({ defaultValue }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState(defaultValue);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"react" | "vue" | "svelte">("react");
  const [error, setError] = useState<string | null>(null);

  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });
  }, []);

  const compileCode = useCallback(async (sourceCode: string, target: TargetFramework) => {
    try {
      const result = await compileUIH(sourceCode, target);
      setOutput(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "컴파일 오류");
      setOutput("");
    }
  }, []);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      compileCode(value, activeTab);
    }
  }, [activeTab, compileCode]);

  // 초기 컴파일
  useEffect(() => {
    compileCode(code, activeTab);
  }, [code, activeTab, compileCode]);

  const handleTabChange = useCallback((tab: "react" | "vue" | "svelte") => {
    setActiveTab(tab);
    compileCode(code, tab);
  }, [code, compileCode]);

  const handleExampleSelect = useCallback((exampleId: string) => {
    const example = examples.find((ex) => ex.id === exampleId);
    if (example) {
      setCode(example.code);
      if (editorRef.current) {
        editorRef.current.setValue(example.code);
      }
    }
  }, []);

  return (
    <div className="flex-1 flex">
      {/* 왼쪽: UIH 에디터 */}
      <div className="flex-1 border-r border-gray-200 dark:border-gray-800">
        <div className="h-full flex flex-col">
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <span className="text-sm font-medium">UIH 입력</span>
            <select
              onChange={(e) => handleExampleSelect(e.target.value)}
              className="text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              defaultValue=""
            >
              <option value="" disabled>
                예제 선택...
              </option>
              {examples.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              defaultValue={defaultValue}
              theme="vs-dark"
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* 오른쪽: 출력 미리보기 */}
      <div className="flex-1 flex flex-col">
        {/* 탭 */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => handleTabChange("react")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "react"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            React
          </button>
          <button
            onClick={() => handleTabChange("vue")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "vue"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            Vue
          </button>
          <button
            onClick={() => handleTabChange("svelte")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "svelte"
                ? "text-orange-600 dark:text-orange-400 border-b-2 border-orange-600 dark:border-orange-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            Svelte
          </button>
        </div>

        {/* 출력 */}
        <div className="flex-1">
          {error ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <pre className="text-sm">{error}</pre>
            </div>
          ) : (
            <Editor
              height="100%"
              language={activeTab === "vue" ? "vue" : activeTab === "svelte" ? "html" : "typescript"}
              value={output}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
