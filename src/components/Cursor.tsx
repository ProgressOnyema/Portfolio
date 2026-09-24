"use client";

import { useEffect, useRef } from "react";

/* A circular cursor with a rainbow gradient fill and mix-blend-mode:
   difference. Difference computes |source - backdrop| per pixel, so
   against black text (0,0,0) the gradient shows its true colors
   unchanged, and against a white background (255,255,255) it shows the
   inverted complementary colors - either way, the result is always a
   vivid, varying color, never invisible against its background the way
   a flat-color cursor could be.

   Only active on devices with a real mouse (hover: hover and
   pointer: fine, matched in both this component and the cursor: none
   rule in globals.css) - on touch devices there's no cursor to
   replace, and the effect wouldn't mean anything.

   Position is smoothed with a simple lerp toward the real mouse
   position each frame, rather than snapping 1:1, for a slight trailing
   feel - not gated behind prefers-reduced-motion since it only moves in
   direct response to the user's own mouse input, unlike Lenis's
   autoplaying inertia (SmoothScroll.tsx) which continues after input
   stops. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let hasMoved = false;
    let frameId: number;

    function handleMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        // Jump to position on the very first move instead of lerping in
        // from wherever x/y defaulted to (0,0), so there's no visible
        // dash across the screen before the cursor is first seen.
        x = targetX;
        y = targetY;
        hasMoved = true;
        dot!.style.opacity = "1";
      }
    }

    function handleLeave() {
      // Hide when the pointer leaves the viewport (e.g. to browser
      // chrome or another monitor) instead of leaving it stuck at the
      // last known position.
      dot!.style.opacity = "0";
    }

    function raf() {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      dot!.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frameId = requestAnimationFrame(raf);
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    frameId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] size-8 rounded-full opacity-0 mix-blend-difference transition-opacity duration-200"
      style={{
        background:
          "conic-gradient(from 0deg, #ff0000, #ff9900, #ffee00, #33ff00, #00fff9, #0066ff, #cc00ff, #ff0000)",
      }}
    />
  );
}
