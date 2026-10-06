import { ImageResponse } from "next/og";

// Default Open Graph image for the site (used for link previews on
// LinkedIn, WhatsApp, X, etc.). Generated at build time, text-only, so
// there is no binary asset to maintain. Replace with a designed image by
// dropping an opengraph-image.png in this folder instead.
export const alt = "Onyema Miracle — Brand + Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0b0b0b",
          color: "#f5f5f5",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#9a9a9a" }}>
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700 }}>Onyema Miracle</div>
          <div style={{ display: "flex", fontSize: 44, color: "#bdbdbd", marginTop: 16 }}>
            Brand + Product Designer
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9a9a9a" }}>
          Strategy · Branding · UX/UI · Interaction · Full Stack
        </div>
      </div>
    ),
    { ...size }
  );
}
