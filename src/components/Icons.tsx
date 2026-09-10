// Note: the original Figma vector artwork couldn't be downloaded (temporary
// asset URLs aren't reachable from this sandbox's network). These are
// hand-drawn equivalents at the exact dimensions Figma specified, using
// currentColor so they theme automatically with the button/link they sit in.

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" className={className} aria-hidden="true">
      <path
        d="M0 5.5h12.5M8 1l4.5 4.5L8 10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="21" viewBox="0 0 16 21" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 1h8l4 4v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M10 1v4h4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className={className} aria-hidden="true">
      <rect x="0.5" y="0.5" width="29" height="29" rx="4.5" stroke="currentColor" />
      <path
        d="M9.5 12.2h2.6V21H9.5v-8.8Zm1.3-4.2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14.3 12.2h2.5v1.2h.03c.35-.66 1.2-1.36 2.47-1.36 2.64 0 3.13 1.74 3.13 4v5h-2.6v-4.43c0-1.06-.02-2.42-1.47-2.42-1.48 0-1.71 1.16-1.71 2.34V21h-2.6v-8.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BehanceIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="33" height="24" viewBox="0 0 33 24" fill="none" className={className} aria-hidden="true">
      <text
        x="16.5"
        y="18"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
        fontFamily="Inter, sans-serif"
      >
        Be
      </text>
    </svg>
  );
}

// MobileNav — matches Figma's MobileNav component (53.875 x 51.140625),
// a simple 3-line hamburger icon.
export function MobileNavIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 1h24M0 9h24M0 17h24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
