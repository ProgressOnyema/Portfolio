"use client";

import { useEffect, useState } from "react";
import { DarkModeIcon, LightModeIcon } from "./Icons";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border-hairline bg-surface-bg text-text-primary transition-colors hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary"
    >
      {theme === "light" ? (
        <DarkModeIcon className="h-4 w-4" />
      ) : (
        <LightModeIcon className="h-3.5 w-auto" />
      )}
    </button>
  );
}
