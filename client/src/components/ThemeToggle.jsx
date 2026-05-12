import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="inline-flex h-9 items-center rounded border border-subtle bg-control p-1 text-xs font-medium text-secondary transition hover:text-primary"
    >
      <span
        className={`rounded px-2 py-1 transition ${
          theme === "light" ? "bg-active text-on-active" : ""
        }`}
      >
        Light
      </span>
      <span
        className={`rounded px-2 py-1 transition ${
          theme === "dark" ? "bg-active text-on-active" : ""
        }`}
      >
        Dark
      </span>
    </button>
  );
}
