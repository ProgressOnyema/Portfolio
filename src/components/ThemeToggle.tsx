"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./NounProjectIcons";
import { getServerThemeSnapshot, getThemeSnapshot, setTheme, subscribeToTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle color theme"
      className="flex items-center justify-center text-text-muted transition-colors hover:text-text-primary"
    >
      {/* Shows the theme you'd switch TO: moon while light, sun while dark
          (same as the icons it replaced). The pixel-art glyphs sit on a 6px
          grid in a 100px box, so 24px / 20px keep the squares near whole
          pixels. */}
      {theme === "light" ? (
        <MoonIcon className="size-6 sm:size-5" />
      ) : (
        <SunIcon className="size-6 sm:size-5" />
      )}
    </button>
  );
}
