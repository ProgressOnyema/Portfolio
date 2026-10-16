import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeInitScript } from "@/components/ThemeInitScript";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { SURFACE_BG } from "@/lib/theme";
import "./globals.css";

const title = "Onyema Miracle — Brand + Product Designer";
const description =
  "I build products from the ground up, taking ideas from initial research through design to shipping 🚀 — strategy, branding, UX/UI, interaction, and full stack development.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  // The Open Graph image comes from src/app/opengraph-image.tsx, which
  // serves public/open_graph_img.webp (a file-based image always wins over
  // `openGraph.images`). Twitter/X gets the same file explicitly.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/open_graph_img.webp",
        width: 2528,
        height: 1174,
        alt: title,
      },
    ],
  },
};

// Default (dark) surface; ThemeInitScript / applyThemeColor overwrite the
// single theme-color meta to match the active light/dark choice.
export const viewport: Viewport = {
  themeColor: SURFACE_BG.dark,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <ThemeInitScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly, etc.)
          inject attributes like data-gr-ext-installed onto <body> before
          React hydrates, which React otherwise flags as a hydration
          mismatch even though nothing is actually wrong. Attribute-only,
          and scoped to this one element — doesn't suppress mismatches
          anywhere else in the tree, including real ones on this page. */}
      <body
        className="min-h-full flex flex-col bg-surface-bg text-text-primary pt-[106px]"
        suppressHydrationWarning
      >
        <SmoothScroll />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
