import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeInitScript } from "@/components/ThemeInitScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onyema Miracle — Portfolio",
  description:
    "I conceptualize, ideate, and design brand identities from the ground up, then bring that same attention to detail into product design and code.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <ThemeInitScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
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
