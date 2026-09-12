// Shared theme store so every ThemeToggle instance (desktop nav, mobile
// dropdown) reads the same value via useSyncExternalStore instead of each
// keeping its own useState synced through an effect - the pattern that was
// causing the "cascading renders" warning (an effect setting state right
// after mount, forcing an extra render pass on top of hydration).

type Theme = "light" | "dark";

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

export function setTheme(next: Theme) {
  if (next === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem("theme", next);
  listeners.forEach((callback) => callback());
}
