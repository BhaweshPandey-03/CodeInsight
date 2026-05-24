import ThemeToggle from "../../components/ThemeToggle";

export default function DashboardHeader({
  user,
  logout,
  language,
  setLanguage,
}) {
  return (
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

        {/* GitHub */}
        <a
          href="https://github.com/BhaweshPandey-03/CodeInsight"
          target="_blank"
          rel="noreferrer"
          className="text-secondary text-xs transition hover:text-primary"
        >
          GitHub
        </a>

        {/* Language */}
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
  );
}
