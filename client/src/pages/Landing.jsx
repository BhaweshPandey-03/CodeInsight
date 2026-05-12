import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import heroImage from "../assets/hero.png";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="app-bg min-h-screen">
      <Navbar />

      <section
        className="relative flex min-h-[88vh] items-center overflow-hidden bg-cover bg-center px-4 pt-20 sm:px-6 lg:px-8"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay absolute inset-0" />
        <div className="hero-accent absolute inset-0" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-blue-300">
              AI code review workspace
            </p>
            <h1 className="text-primary max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              CodeInsight AI
            </h1>
            <p className="text-secondary mt-6 max-w-2xl text-lg leading-8">
              Review code, inspect issues, compare AI refactors, and keep your
              engineering feedback loop inside one focused dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="rounded bg-active px-5 py-3 text-center text-sm font-semibold text-on-active transition hover:opacity-90"
              >
                Start reviewing
              </Link>
              <Link
                to="/login"
                className="rounded border border-subtle px-5 py-3 text-center text-sm font-semibold text-primary transition hover:border-strong"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="surface border-t border-subtle px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            ["Review", "Structured issues with line-level context."],
            ["Compare", "Monaco-powered diffs for AI refactors."],
            ["Ship", "A cleaner path from feedback to improved code."],
          ].map(([title, copy]) => (
            <div key={title} className="rounded border border-subtle p-5">
              <h2 className="text-primary text-sm font-semibold">{title}</h2>
              <p className="text-muted mt-2 text-sm leading-6">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
