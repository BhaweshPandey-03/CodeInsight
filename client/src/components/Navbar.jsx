import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="surface fixed inset-x-0 top-0 z-20 border-b border-subtle backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded bg-blue-600 text-sm font-bold text-white">
            CI
          </span>
          <span className="text-primary text-sm font-semibold tracking-wide">
            CodeInsight AI
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className="text-secondary transition hover:text-primary"
              >
                Dashboard
              </NavLink>
              <ThemeToggle />
              <button
                type="button"
                onClick={logout}
                className="rounded border border-subtle px-3 py-2 text-secondary transition hover:border-strong hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-secondary transition hover:text-primary"
              >
                Login
              </NavLink>
              <ThemeToggle />
              <NavLink
                to="/register"
                className="rounded bg-active px-3 py-2 font-medium text-on-active transition hover:opacity-90"
              >
                Get started
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
