import { DiffEditor } from "@monaco-editor/react";
import ScoreBar from "../../ScoreBar";

export default function ResultPanel({
  result,
  activeTab,
  setActiveTab,
  highlightLine,
  code,
  language,
  editorTheme,
  handleCopy,
  copied,
}) {
  if (!result) {
    return (
      <div className="flex w-1/2 flex-col overflow-hidden p-4">
        <div className="text-muted flex h-full items-center justify-center">
          Run a review to see AI insights
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-1/2 flex-col overflow-hidden p-4">
      {/* SCORE */}
      <div className="mb-3">
        <ScoreBar score={result.score} />
      </div>

      {/* TABS */}
      <div className="mb-3 flex gap-2 border-b border-subtle pb-2">
        {["issues", "diff", "code"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-xs rounded-md transition ${
              activeTab === tab
                ? "bg-active text-on-active"
                : "text-secondary hover:bg-control hover:text-primary"
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
                className="surface-muted cursor-pointer rounded-lg border border-subtle p-3 transition hover:border-blue-500"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-400">
                    {issue.type.toUpperCase()}
                  </span>

                  <span className="text-muted text-xs">Line {issue.line}</span>
                </div>

                <p className="text-primary text-sm">{issue.description}</p>

                <p className="text-secondary mt-1 text-xs">
                  💡 {issue.suggestion}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* DIFF */}
        {activeTab === "diff" && (
          <div className="h-[500px] overflow-hidden rounded-xl border border-subtle">
            <DiffEditor
              height="100%"
              original={code || ""}
              modified={result.refactoredCode || ""}
              language={language}
              theme={editorTheme}
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
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-secondary text-sm">Refactored Code</h2>

              <button
                onClick={handleCopy}
                className={`text-xs px-3 py-1 rounded-md transition ${
                  copied
                    ? "bg-green-600"
                    : "bg-control text-secondary hover:text-primary"
                }`}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <pre className="surface-muted overflow-auto rounded-lg border border-subtle p-4 text-sm">
              {result.refactoredCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
