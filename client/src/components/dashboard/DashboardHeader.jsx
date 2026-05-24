import { Link, useLocation } from "react-router-dom";
import { History, LogOut } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import ThemeToggle from "../ThemeToggle";

export default function DashboardHeader({
  user,
  language,
  setLanguage,
  logout,
}) {
  const location = useLocation();

  const isHistoryPage = location.pathname === "/history";

  return (
    <header className="surface sticky top-0 z-50 border-b border-subtle backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-8">
          {/* BRANDING */}
          <div>
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <h1 className="text-lg font-semibold tracking-tight text-primary transition hover:opacity-90">
                  CodeInsight AI
                </h1>
              </Link>

              {/* GITHUB REPO */}
              <a
                href="https://github.com/BhaweshPandey-03/CodeInsight"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center rounded-lg border border-subtle bg-control/40 px-2.5 py-1 text-xs font-medium text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-strong hover:bg-control hover:text-primary active:translate-y-0"
              >
                <FaGithub className="h-3.5 w-3.5 transition-all duration-200 group-hover:scale-165 group-hover:rotate-6" />

                <span className="ml-1 transition-all duration-200 group-hover:ml-2">
                  GitHub
                </span>
              </a>
            </div>

            <p className="text-xs text-muted">
              AI-powered code review workspace
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">
          {/* DAILY USAGE */}
          {user?.usage && (
            <div className="hidden rounded-xl border border-subtle bg-control/40 px-3 py-2 md:block">
              <p className="text-[11px] text-muted">Daily Usage</p>

              <p className="text-xs font-medium text-primary">
                {user.usage.dailyReviewCount}/{user.usage.dailyReviewLimit}
              </p>
            </div>
          )}
          {/* MAIN NAVIGATION */}
          <nav className="hidden items-center gap-3 md:flex">
            {/* HISTORY */}
            <Link
              to="/history"
              className={`group flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isHistoryPage
                  ? "border-strong bg-control text-primary shadow-sm"
                  : "border-subtle bg-control/40 text-secondary hover:border-strong hover:bg-control hover:text-primary"
              }`}
            >
              <History className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />

              <span>History</span>
            </Link>
          </nav>

          {/* LANGUAGE SELECT */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field rounded-xl border border-subtle bg-control px-3 py-2 text-sm transition focus:border-strong"
          >
            <option value="javascript">JavaScript</option>

            <option value="python">Python</option>

            <option value="java">Java</option>
          </select>

          {/* THEME TOGGLE */}
          <ThemeToggle />

          {/* USER INFO */}
          <div className="hidden text-right lg:block">
            <p className="text-sm font-medium text-primary">
              {user?.name || "Developer"}
            </p>

            <p className="text-xs text-muted">{user?.email}</p>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={logout}
            title="Logout"
            className="group rounded-xl border border-subtle p-2 text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-500 active:translate-y-0"
          >
            <LogOut className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
