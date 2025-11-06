import CodeEditor from "@/app/components/CodeEditor";
import { ThemeToggle } from "@/app/components/ThemeToggle";

const defaultCode = `meta {
  route: "/hello";
  theme: "light";
}

layout "centered" {
  Card(id:"welcome") { "Hello, UIH!" }
  Input(id:"name", placeholder:"Enter your name")
  Button(variant:"primary"){ "Submit" }
}`;

export default function EditorPage() {
  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">UIH Playground</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="https://github.com/LeeJaeBae/uih"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/uih-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              npm
            </a>
          </div>
        </div>
      </header>
      <CodeEditor defaultValue={defaultCode} />
    </div>
  );
}
