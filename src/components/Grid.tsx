import type { ReactNode } from "react";

/**
 * Standard page grid: 4 columns / 16px gutter on mobile, 12 columns / 24px
 * gutter on sm+ screens, capped at 1440px and auto-centered beyond that.
 * Every page section should be built from this rather than ad-hoc
 * max-width + flex centering.
 */
export default function Grid({
  children,
  className = "",
  gap = "gap-4 sm:gap-6",
}: {
  children: ReactNode;
  className?: string;
  /** Override the default gutter (e.g. a tighter gap for a specific row). */
  gap?: string;
}) {
  return (
    <div
      className={`mx-auto grid w-full max-w-[1440px] grid-cols-4 ${gap} px-5 sm:grid-cols-12 sm:px-6 lg:px-[88px] ${className}`}
    >
      {children}
    </div>
  );
}
