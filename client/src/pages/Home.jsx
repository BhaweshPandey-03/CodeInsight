import { useEffect, useState } from "react";
import { reviewCode } from "../services/api";
import Editor from "@monaco-editor/react";
import { DiffEditor } from "@monaco-editor/react";
import toast from "react-hot-toast";
import { useRef } from "react";


export default function Home() {

  // states 

  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  // const [view, setView] = useState("diff");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("issues");

  useEffect(() => {
    if (result) setActiveTab("issues");
  }, [result]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.refactoredCode);

    setCopied(true);
    toast.success("Code copied!");

    setTimeout(() => setCopied(false), 1500);
  };
  const handleReview = async () => {
    try {
      setLoading(true);

      const res = await reviewCode({ code, language });

      if (res.success) {
        setResult(res.data);
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const highlightLine = (lineNumber) => {
    const editor = editorRef.current;

    if (!editor) return;

    // Move cursor
    editor.revealLineInCenter(lineNumber);
    editor.setPosition({ lineNumber, column: 1 });

    // Add highlight
    editor.deltaDecorations(
      [],
      [
        {
          range: {
            startLineNumber: lineNumber,
            endLineNumber: lineNumber,
            startColumn: 1,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: "bg-yellow-500/20",
          },
        },
      ],
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">CODE INSIGHT</h1>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#161b22] border border-gray-700 rounded px-3 py-1 text-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-70px)]">
        {/* LEFT: Code Input */}
        <div className="p-4 border-r border-gray-800 flex flex-col">
          <h2 className="text-sm text-gray-400 mb-2">Your Code</h2>

          <div className="flex-1 border border-gray-800 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
              }}
            />
          </div>

          <button
            onClick={handleReview}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 transition py-2 rounded-lg font-medium"
          >
            {loading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        {/* RIGHT: Output */}

        <div className="overflow-y-auto h-full">
          {!result ? (
            <div className="text-gray-500 mt-10 text-center">
              Run a review to see results
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-800 mb-4">
                {["issues", "diff", "code"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm capitalize border-b-2 transition ${
                      activeTab === tab
                        ? "border-blue-500 text-white"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}

              {activeTab === "issues" && (
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div
                      key={i}
                      onClick={() => highlightLine(issue.line)}
                      className="bg-[#161b22] border border-gray-800 p-3 rounded-lg cursor-pointer hover:border-blue-500 transition"
                    >
                      <p className="text-sm">
                        <span className="text-red-400 font-semibold">
                          {issue.type.toUpperCase()}
                        </span>{" "}
                        — {issue.description}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Line: {issue.line} • 💡 {issue.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "diff" && (
                <div className="h-[400px] border border-gray-800 rounded-lg overflow-hidden">
                  <DiffEditor
                    height="100%"
                    original={code || ""}
                    modified={result.refactoredCode || ""}
                    language={language}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      renderSideBySide: true,
                    }}
                  />
                </div>
              )}

              {activeTab === "code" && (
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">Refactored Code</h2>

                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition ${
                        copied
                          ? "bg-green-600"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      {copied ? "✅ Copied" : "📋 Copy"}
                    </button>
                  </div>

                  <pre className="bg-[#0d1117] border border-gray-800 p-4 rounded-lg text-sm overflow-auto">
                    {result.refactoredCode}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
