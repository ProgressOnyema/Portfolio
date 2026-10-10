import { SURFACE_BG } from "@/lib/theme";

export function ThemeInitScript() {
  const code = `
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        if (theme === "light") {
          document.documentElement.setAttribute("data-theme", "light");
        }
        var color = theme === "light" ? "${SURFACE_BG.light}" : "${SURFACE_BG.dark}";
        var meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "theme-color");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", color);
      } catch (e) {}
    })();
  `;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
