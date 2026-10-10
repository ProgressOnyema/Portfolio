// Shared theme store so every ThemeToggle instance (desktop nav, mobile
// dropdown) reads the same value via useSyncExternalStore instead of each
// keeping its own useState synced through an effect - the pattern that was
// causing the "cascading renders" warning (an effect setting state right
// after mount, forcing an extra render pass on top of hydration).

type Theme = "light" | "dark";

// `--color-surface-bg` from globals.css — keep in sync with those tokens.
// Used by the web app manifest, <meta name="theme-color">, and the
// theme toggle so browser chrome matches the page surface.
export const SURFACE_BG = {
  dark: "#161513",
  light: "#fcfcfb",
} as const;

const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function getThemeSnapshot(): Theme {
  return readTheme();
}

export function getServerThemeSnapshot(): Theme {
  // Matches the default in globals.css / ThemeInitScript before any
  // localStorage-derived override is applied.
  return "dark";
}

export function subscribeToTheme(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function applyThemeColor(theme: Theme) {
  const color = SURFACE_BG[theme];
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
}

export function setTheme(next: Theme) {
  if (next === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem("theme", next);
  applyThemeColor(next);
  listeners.forEach((callback) => callback());
}
