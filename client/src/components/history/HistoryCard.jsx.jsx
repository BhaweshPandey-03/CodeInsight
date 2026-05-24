import { useNavigate } from "react-router-dom";

export default function HistoryCard({ review, onDelete }) {
  const navigate = useNavigate();

  const issueCount = review.result?.issues?.length || 0;

  const score = review.result?.score || 0;

  // const summary = review.result?.summary || "AI review completed";
const generateSessionTitle = () => {
  const summary = review.result?.summary?.trim();

  if (summary) {
    // clean long summaries
    if (summary.length > 55) {
      return summary.slice(0, 55) + "...";
    }

    return summary;
  }

  const issues = review.result?.issues || [];

  if (issues.length === 0) {
    return "Clean Code Review";
  }

  const issueTypes = issues.map((issue) => issue.type?.toLowerCase());

  if (issueTypes.includes("security")) {
    return "Security Improvements Detected";
  }

  if (issueTypes.includes("performance")) {
    return "Performance Optimization Review";
  }

  if (issueTypes.includes("style")) {
    return "Code Style Refactoring";
  }

  return "AI Code Review";
};

  const getRelativeTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: "y", seconds: 31536000 },
      { label: "mo", seconds: 2592000 },
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);

      if (count >= 1) {
        return `${count}${interval.label} ago`;
      }
    }

    return "Just now";
  };

  const getScoreColor = () => {
    if (score >= 8) {
      return "text-emerald-400";
    }

    if (score >= 6) {
      return "text-blue-400";
    }

    if (score >= 4) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  const handleOpenReview = () => {
    navigate("/dashboard", {
      state: {
        restoredReview: review,
      },
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();

    onDelete(review._id);
  };

  return (
    <button
      onClick={handleOpenReview}
      className="group surface-muted relative overflow-hidden rounded-2xl border border-subtle p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      {/* TOP ROW */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {review.language}
          </p>

          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-primary">
            {generateSessionTitle()}
          </h3>
        </div>

        <div className={`text-lg font-bold ${getScoreColor()}`}>{score}</div>
      </div>

      {/* ISSUE STATS */}
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-full border border-subtle px-2 py-1 text-xs text-secondary">
          {issueCount} issues
        </div>

        <div className="rounded-full border border-subtle px-2 py-1 text-xs text-secondary">
          AI Reviewed
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          {getRelativeTime(review.createdAt)}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="text-xs text-red-400 opacity-0 transition-all duration-200 hover:text-red-300 group-hover:opacity-100 hover:cursor-pointer"
          >
            Delete
          </button>

          <span className="text-xs text-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-200 hover:text-blue-300 hover:cursor-pointer">
            Open Review →
          </span>
        </div>
      </div>

      {/* GLOW EFFECT */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
}
