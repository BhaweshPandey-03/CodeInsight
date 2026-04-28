import { useEffect, useState, useRef } from "react";
import { reviewCode } from "../services/api";
import Editor from "@monaco-editor/react";
import { DiffEditor } from "@monaco-editor/react";
import toast from "react-hot-toast";
import ScoreMeter from "../components/ScoreMeter";
import ScoreBar from "../components/ScoreBar";

export default function Home() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("issues");
  const decorationRef = useRef([]);
  const editorRef = useRef(null);

  useEffect(() => {
    if (result) setActiveTab("issues");
  }, [result]);

  const handleReview = async () => {
    try {
      setLoading(true);
      const res = await reviewCode({ code, language });

      if (res.success) {
        setResult(res.data);
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result?.refactoredCode || "");
    setCopied(true);
    toast.success("Copied to clipboard!");

    setTimeout(() => setCopied(false), 1500);
  };

  const highlightLine = (lineNumber) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.revealLineInCenter(lineNumber);
    editor.setPosition({ lineNumber, column: 1 });

    decorationRef.current = editor.deltaDecorations(decorationRef.current, [
      {
        range: {
          startLineNumber: lineNumber,
          endLineNumber: lineNumber,
          startColumn: 1,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "highlightLine_editor",
        },
      },
    ]);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#0d1117] to-[#0b0f14] text-gray-200">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur">
        {/* LEFT */}
        <div>
          <h1 className="text-lg font-semibold">CodeInsight AI</h1>
          <p className="text-xs text-gray-500">
            AI-powered code review & refactoring
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* GitHub link */}
          <a
            href="https://github.com/BhaweshPandey-03/CodeInsight"
            target="_blank"
            className="text-xs text-gray-400 hover:text-white transition"
          >
            GitHub
          </a>

          {/* Language selector */}
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
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-1/2 border-r border-gray-800 flex flex-col p-4 gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-gray-400">Editor</h2>
          </div>

          <div className="flex-1 border border-gray-800 rounded-xl overflow-hidden">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={(editor) => (editorRef.current = editor)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
                smoothScrolling: true,
              }}
            />
          </div>

          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Review Code"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 flex flex-col p-4 overflow-hidden">
          {!result ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Run a review to see AI insights
            </div>
          ) : (
            <>
              {/* <div className="flex justify-between items-center mb-3">
                <ScoreMeter score={result.score} />
              </div> */}

              <div className="mb-3">
                <ScoreBar score={result.score} />
              </div>

              {/* TABS */}
              <div className="flex gap-2 mb-3 border-b border-gray-800 pb-2">
                {["issues", "diff", "code"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs rounded-md transition ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-[#1a1f2a]"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div className="flex-1 overflow-auto pr-2">
                {/* ISSUES */}
                {activeTab === "issues" && (
                  <div className="space-y-3">
                    {result.issues?.map((issue, i) => (
                      <div
                        key={i}
                        onClick={() => highlightLine(issue.line)}
                        className="p-3 rounded-lg border border-gray-800 bg-[#0f141b] hover:border-blue-500 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-red-400">
                            {issue.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            Line {issue.line}
                          </span>
                        </div>

                        <p className="text-sm text-gray-200">
                          {issue.description}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          💡 {issue.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* DIFF */}
                {activeTab === "diff" && (
                  <div className="h-[500px] border border-gray-800 rounded-xl overflow-hidden">
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

                {/* CODE */}
                {activeTab === "code" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm text-gray-400">Refactored Code</h2>

                      <button
                        onClick={handleCopy}
                        className={`text-xs px-3 py-1 rounded-md transition ${
                          copied
                            ? "bg-green-600"
                            : "bg-gray-800 hover:bg-gray-700"
                        }`}
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <pre className="bg-[#0f141b] border border-gray-800 p-4 rounded-lg text-sm overflow-auto">
                      {result.refactoredCode}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
