export function ThemeInitScript() {
  const code = `
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        if (theme === "light") {
          document.documentElement.setAttribute("data-theme", "light");
        }
      } catch (e) {}
    })();
  `;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
