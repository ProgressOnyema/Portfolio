import type { SVGProps } from "react";

// Inline versions of the Noun Project SVGs in public/icons (sun.svg,
// moon.svg, copy_icon.svg), recoloured with currentColor so they follow
// the theme and hover states, same reason as Icons.tsx.
//
// The source files are exported sprite sheets: sun.svg and moon.svg each
// hold a dozen display:none layers plus the visible glyph, and every file
// has a baked-in credit <text> below the artwork (viewBox 0 0 100 125).
// Only the visible glyph is kept here, in a square 0 0 100 100 viewBox.
//
// Attribution (Noun Project, CC BY unless a licence was bought):
//   sun / moon — Ilaria Bernareggi, from the Noun Project
//   copy       — Skye Selbiger, from the Noun Project
// Dropping the credit text from the SVGs does not remove the credit
// requirement; add it somewhere on the site if these are the free licence.

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

// Pixel-art sun (6px grid, so keep rendered size a multiple of ~16px for
// crisp squares; crispEdges stops the pixels blurring).
export function SunIcon(props: IconProps) {
  return (
    <Base shapeRendering="crispEdges" {...props}>
      <polygon points="83,47 83,41 89,41 95,41 95,35 89,35 83,35 77,35 77,41 77,47 77,53 77,59 77,65 83,65 89,65 95,65 95,59 89,59 83,59 83,53" />
      <polygon points="23,53 23,47 23,41 23,35 17,35 11,35 5,35 5,41 11,41 17,41 17,47 17,53 17,59 11,59 5,59 5,65 11,65 17,65 23,65 23,59" />
      <polygon points="47,23 53,23 59,23 65,23 65,17 65,11 65,5 59,5 59,11 59,17 53,17 47,17 41,17 41,11 41,5 35,5 35,11 35,17 35,23 41,23" />
      <polygon points="53,77 47,77 41,77 35,77 35,83 35,89 35,95 41,95 41,89 41,83 47,83 53,83 59,83 59,89 59,95 65,95 65,89 65,83 65,77 59,77" />
      <polygon points="71,29 71,35 77,35 77,29 77,23 71,23 65,23 65,29" />
      <rect x="77" y="17" width="6" height="6" />
      <rect x="83" y="11" width="6" height="6" />
      <polygon points="29,71 29,65 23,65 23,71 23,77 29,77 35,77 35,71" />
      <rect x="17" y="77" width="6" height="6" />
      <rect x="11" y="83" width="6" height="6" />
      <polygon points="29,29 35,29 35,23 29,23 23,23 23,29 23,35 29,35" />
      <rect x="17" y="17" width="6" height="6" />
      <rect x="11" y="11" width="6" height="6" />
      <polygon points="71,71 65,71 65,77 71,77 77,77 77,71 77,65 71,65" />
      <rect x="77" y="77" width="6" height="6" />
      <rect x="83" y="83" width="6" height="6" />
    </Base>
  );
}

// Pixel-art crescent moon, same 6px grid as the sun.
export function MoonIcon(props: IconProps) {
  return (
    <Base shapeRendering="crispEdges" {...props}>
      <rect x="44" y="59" width="6" height="6" />
      <rect x="50" y="65" width="6" height="6" />
      <rect x="50" y="29" width="6" height="6" />
      <polygon points="62,89 56,89 50,89 44,89 38,89 38,95 44,95 50,95 56,95 62,95 68,95 74,95 74,89 68,89" />
      <polygon points="50,11 56,11 62,11 68,11 74,11 74,5 68,5 62,5 56,5 50,5 44,5 38,5 38,11 44,11" />
      <polygon points="62,77 68,77 74,77 80,77 86,77 86,83 92,83 92,77 92,71 86,71 80,71 74,71 68,71 62,71 56,71 56,77" />
      <polygon points="74,83 74,89 80,89 86,89 86,83 80,83" />
      <rect x="20" y="77" width="6" height="6" />
      <rect x="20" y="17" width="6" height="6" />
      <polygon points="86,17 86,23 80,23 74,23 68,23 62,23 56,23 56,29 62,29 68,29 74,29 80,29 86,29 92,29 92,23 92,17" />
      <polygon points="20,65 14,65 14,71 14,77 20,77 20,71" />
      <polygon points="20,29 20,23 14,23 14,29 14,35 20,35" />
      <polygon points="14,53 14,47 14,41 14,35 8,35 8,41 8,47 8,53 8,59 8,65 14,65 14,59" />
      <polygon points="38,47 38,53 38,59 44,59 44,53 44,47 44,41 38,41" />
      <rect x="44" y="35" width="6" height="6" />
      <polygon points="32,83 26,83 26,89 32,89 38,89 38,83" />
      <polygon points="80,17 86,17 86,11 80,11 74,11 74,17" />
      <polygon points="38,17 38,11 32,11 26,11 26,17 32,17" />
    </Base>
  );
}

// Two overlapping documents, used beside the email address.
export function CopyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M70,37.5L57.5,25l-3-3h-4.2H31h-3h-8.5c-3,0-5.5,2.5-5.5,5.5v64c0,3,2.5,5.5,5.5,5.5h47.9c3,0,5.5-2.5,5.5-5.5V75v-3V44.6 v-4.1L70,37.5z M54.7,26.4l14.8,14.8H57.2c-1.4,0-2.5-1.1-2.5-2.5V26.4z M70,72v3v16.5c0,1.4-1.1,2.5-2.5,2.5H19.5 c-1.4,0-2.5-1.1-2.5-2.5v-64c0-1.4,1.1-2.5,2.5-2.5H28h3h20.7v13.7c0,3,2.5,5.5,5.5,5.5H70V72z" />
      <path d="M83,18.4L70.6,6l-3-3h-4.2H32.5c-3,0-5.5,2.5-5.5,5.5V16h0c0,0.8,0.7,1.5,1.5,1.5c0.8,0,1.5-0.6,1.5-1.5l0,0 c0,0,0-7.5,0-7.5C30,7.1,31.2,6,32.5,6h32.2v13.7c0,3,2.5,5.5,5.5,5.5H83v47.3c0,1.4-1.1,2.5-2.5,2.5l-2,0c-0.8,0-1.5,0.7-1.5,1.5 c0,0.8,0.7,1.5,1.5,1.5l2,0c3,0,5.5-2.5,5.5-5.5v-47v-4.1L83,18.4z M70.2,22.1c-1.4,0-2.5-1.1-2.5-2.5V7.3l14.8,14.8H70.2z" />
    </Base>
  );
}
