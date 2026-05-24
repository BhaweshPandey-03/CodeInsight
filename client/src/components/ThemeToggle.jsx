import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="group rounded-xl border border-subtle bg-control/40 p-2 text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-strong hover:bg-control hover:text-primary active:translate-y-0"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-all duration-200   group-hover:scale-110" />
      ) : (
        <Moon className="h-4 w-4 transition-all duration-200  group-hover:scale-110" />
      )}
    </button>
  );
}
