import { useState, useRef } from "react";
import { reviewCode } from "../services/api";
import Editor from "@monaco-editor/react";
import { DiffEditor } from "@monaco-editor/react";
import toast from "react-hot-toast";
import ScoreBar from "../components/ScoreBar";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";

export default function Dashboard() {
  const { user, logout, resendVerification, updateUser } = useAuth();
  const { theme } = useTheme();
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("issues");
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationLink, setVerificationLink] = useState("");
  const decorationRef = useRef([]);
  const editorRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  const handleReview = async () => {
    try {
      setLoading(true);
      const res = await reviewCode({ code, language });

      if (res.success) {
        setResult(res.data);
        if (res.usage) {
          updateUser({ usage: res.usage });
        }
        setActiveTab("issues");
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

  const handleResendVerification = async () => {
    try {
      setResendingVerification(true);
      const response = await resendVerification();

      if (response.devVerificationUrl) {
        setVerificationLink(response.devVerificationUrl);
      }

      toast.success(response.message || "Verification email sent");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to resend verification email",
      );
    } finally {
      setResendingVerification(false);
    }
  };

  const highlightLine = (lineNumber) => {
    const editor = editorRef.current;
    if (!editor) return;

    // clear previous timeout (VERY IMPORTANT)
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    editor.revealLineInCenter(lineNumber);
    editor.setPosition({ lineNumber, column: 1 });

    // apply new highlight
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
          className: "line-highlight",
        },
      },
    ]);

    // schedule removal (ONLY ONE ACTIVE TIMER)
    highlightTimeoutRef.current = setTimeout(() => {
      if (!editorRef.current) return;

      decorationRef.current = editorRef.current.deltaDecorations(
        decorationRef.current,
        [],
      );

      highlightTimeoutRef.current = null;
    }, 2500);
  };

  return (
    <div className="app-gradient flex h-screen flex-col">
      {/* HEADER */}
      <div className="surface flex items-center justify-between border-b border-subtle px-6 py-4 backdrop-blur">
        {/* LEFT */}
        <div>
          <h1 className="text-primary text-lg font-semibold">CodeInsight AI</h1>
          <p className="text-muted text-xs">
            AI-powered code review & refactoring
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <span className="text-muted hidden text-xs sm:inline">
            {user?.name || user?.email}
          </span>

          {user?.usage && (
            <span className="text-muted hidden text-xs md:inline">
              {user.usage.dailyReviewCount}/{user.usage.dailyReviewLimit} today
            </span>
          )}

          {/* GitHub link */}
          <a
            href="https://github.com/BhaweshPandey-03/CodeInsight"
            target="_blank"
            rel="noreferrer"
            className="text-secondary text-xs transition hover:text-primary"
          >
            GitHub
          </a>

          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field rounded border px-3 py-1 text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <ThemeToggle />

          <button
            type="button"
            onClick={logout}
            className="rounded border border-subtle px-3 py-1 text-xs text-secondary transition hover:border-strong hover:text-primary"
          >
            Logout
          </button>
        </div>
      </div>

      {/* {!user?.isEmailVerified && (
        <div className="surface-muted border-b border-yellow-500/30 px-6 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Verify your email to unlock AI reviews.
              </p>
              <p className="text-xs text-muted">
                We sent a verification link to {user?.email}. Reviews and usage
                limits activate after verification.
              </p>
              {verificationLink && (
                <a
                  href={verificationLink}
                  className="mt-2 inline-block text-xs font-medium text-blue-400"
                >
                  Open local verification link
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="rounded bg-active px-3 py-2 text-xs font-semibold text-on-active transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendingVerification ? "Sending..." : "Resend email"}
            </button>
          </div>
        </div>
      )} */}

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
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
            // disabled={loading || !user?.isEmailVerified}
            className="rounded-lg bg-blue-600 py-2 font-medium transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Analyzing..."
              : //: user?.isEmailVerified
                //? "Review Code"
                // : "Verify email to review"}
                "Review Code"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex w-1/2 flex-col overflow-hidden p-4">
          {!result ? (
            <div className="text-muted flex h-full items-center justify-center">
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
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-red-400">
                            {issue.type.toUpperCase()}
                          </span>
                          <span className="text-muted text-xs">
                            Line {issue.line}
                          </span>
                        </div>

                        <p className="text-primary text-sm">
                          {issue.description}
                        </p>

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
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-secondary text-sm">
                        Refactored Code
                      </h2>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
