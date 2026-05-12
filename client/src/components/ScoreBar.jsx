import { useState } from "react";

export default function ScoreBar({ score = 0 }) {
  const [hover, setHover] = useState(false);

  const getColor = () => {
    if (score <= 3) return "bg-red-500";
    if (score <= 6) return "bg-yellow-500";
    if (score <= 8) return "bg-blue-500";
    return "bg-green-500";
  };

  const getLabel = () => {
    if (score <= 3) return "Poor";
    if (score <= 6) return "Average";
    if (score <= 8) return "Good";
    return "Excellent";
  };

  return (
    <div className="relative w-full">
      {/* SCORE CARD */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="surface-muted w-full cursor-pointer rounded-lg border border-subtle p-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted text-xs">AI Code Score</span>

          <span
            className={`text-xs font-semibold ${
              score <= 3
                ? "text-red-400"
                : score <= 6
                  ? "text-yellow-400"
                  : score <= 8
                    ? "text-blue-400"
                    : "text-green-400"
            }`}
          >
            {getLabel()} ({score}/10)
          </span>
        </div>

        {/* BAR */}
        <div className="surface h-2 w-full overflow-hidden rounded-full">
          <div
            className={`h-full transition-all duration-700 ${getColor()}`}
            style={{ width: `${score * 10}%` }}
          />
        </div>
      </div>

      {/* TOOLTIP */}
      {hover && (
        <div className="surface shadow-app absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-subtle p-3 text-xs text-secondary">
          <p className="text-primary mb-2 font-semibold">
            What does this score mean?
          </p>

          <ul className="space-y-1">
            <li>
              <span className="text-red-400">0–3:</span> Poor (buggy / unsafe
              code)
            </li>
            <li>
              <span className="text-yellow-400">4–6:</span> Average (works,
              needs improvement)
            </li>
            <li>
              <span className="text-blue-400">7–8:</span> Good (clean, minor
              issues)
            </li>
            <li>
              <span className="text-green-400">9–10:</span> Excellent
              (production-ready)
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
