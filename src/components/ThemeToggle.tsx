"use client";

import { useSyncExternalStore } from "react";
import { DarkModeIcon, LightModeIcon } from "./Icons";
import { getServerThemeSnapshot, getThemeSnapshot, setTheme, subscribeToTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle color theme"
      className="flex items-center justify-center p-2 text-text-muted transition-colors hover:text-text-primary"
    >
      {theme === "light" ? (
        <DarkModeIcon className="h-6 w-6 sm:h-4 w-4" />
      ) : (
        <LightModeIcon className="h-8 w-auto sm:h-4 w-auto" />
      )}
    </button>
  );
}
