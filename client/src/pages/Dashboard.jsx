import { useState, useRef } from "react";
import { reviewCode } from "../services/api";
import Editor from "@monaco-editor/react";
import { DiffEditor } from "@monaco-editor/react";
import toast from "react-hot-toast";
import ScoreBar from "../components/ScoreBar";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";
import EditorPanel from "../components/dashboard/workspace/EditorPanel";
import ResultPanel from "../components/dashboard/workspace/ResultPanel";
import { Link, useLocation } from "react-router-dom";
import { saveReviewHistory } from "../services/historyApi";
import { useEffect } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function Dashboard() {
  const { user, logout, resendVerification, updateUser } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
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

  useEffect(() => {
    const restoredReview = location.state?.restoredReview;

    if (!restoredReview) return;

    setCode(restoredReview.code || "");

    setLanguage(restoredReview.language || "javascript");

    setResult(restoredReview.result || null);

    setActiveTab("issues");
  }, [location.state]);


  const handleReview = async () => {
    try {
      setLoading(true);
      const res = await reviewCode({ code, language });

      
      if (res.success) {
        setResult(res.data);

        await saveReviewHistory({
          language,
          code,
          result: res.data,
        });

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
      <DashboardHeader
        user={user}
        language={language}
        setLanguage={setLanguage}
        logout={logout}
      />

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
        <EditorPanel
          code={code}
          setCode={setCode}
          language={language}
          loading={loading}
          handleReview={handleReview}
          editorTheme={editorTheme}
          editorRef={editorRef}
        />

        {/* RIGHT PANEL */}
        <ResultPanel
          result={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          highlightLine={highlightLine}
          code={code}
          language={language}
          editorTheme={editorTheme}
          handleCopy={handleCopy}
          copied={copied}
        />
      </div>
    </div>
  );
}
