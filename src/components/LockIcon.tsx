import type { SVGProps } from "react";

// Padlock for the "coming soon" chip on ProjectWidgetV2. Inlined with
// currentColor, same convention as Icons.tsx, so it follows the pill's
// text colour in both themes. Lives in its own file rather than Icons.tsx
// only because it was added without touching that file.
export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="4" y="10.5" width="16" height="11" rx="2.5" fill="currentColor" />
      <path
        d="M8 10.5V7.5a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default LockIcon;
