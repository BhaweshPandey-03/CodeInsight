import Editor from "@monaco-editor/react";

export default function EditorPanel({
  code,
  setCode,
  language,
  loading,
  handleReview,
  editorTheme,
  editorRef,
}) {
  return (
    <div className="flex w-1/2 flex-col gap-3 border-r border-subtle p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-secondary text-sm">Editor</h2>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-subtle">
        <Editor
          height="100%"
          theme={editorTheme}
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
        className="rounded-lg bg-blue-600 py-2 font-medium transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Review Code"}
      </button>
    </div>
  );
}
