import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col bg-surface-bg text-text-primary">
        {children}
      </body>
    </html>
  );
}
