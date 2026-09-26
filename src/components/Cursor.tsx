"use client";

import { useEffect, useRef } from "react";

/* A circular cursor with a white fill and mix-blend-mode: difference.
   Difference computes |source - backdrop| per pixel, so white against
   dark areas stays bright and against light areas inverts to dark —
   always visible without a gradient.

   Grows when the pointer is over a clickable target (links, buttons,
   form controls, etc.). Native hand/pointer cursors are suppressed in
   globals.css under the same media query so only this circle shows.

   Only active on devices with a real mouse (hover: hover and
   pointer: fine, matched in both this component and the cursor: none
   rule in globals.css) - on touch devices there's no cursor to
   replace, and the effect wouldn't mean anything.

   Position (and scale) are smoothed with a simple lerp toward the real
   mouse each frame, rather than snapping 1:1, for a slight trailing
   feel - not gated behind prefers-reduced-motion since it only moves in
   direct response to the user's own mouse input, unlike Lenis's
   autoplaying inertia (SmoothScroll.tsx) which continues after input
   stops. */

const CLICKABLE =
  'a, button, input, select, textarea, label, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let targetX = 0;
    let targetY = 0;
    let targetScale = 1;
    let x = 0;
    let y = 0;
    let scale = 1;
    let hasMoved = false;
    let frameId: number;

    function isClickable(target: EventTarget | null) {
      return target instanceof Element && Boolean(target.closest(CLICKABLE));
    }

    function handleMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
      targetScale = isClickable(e.target) ? 2 : 1;
      if (!hasMoved) {
        // Jump to position on the very first move instead of lerping in
        // from wherever x/y defaulted to (0,0), so there's no visible
        // dash across the screen before the cursor is first seen.
        x = targetX;
        y = targetY;
        hasMoved = true;
      }
      // Always restore — handleLeave sets opacity to 0 when the pointer
      // leaves the document (browser chrome, another window, iframes),
      // and without this the cursor stayed hidden after coming back
      // because the opacity=1 write used to live only inside !hasMoved.
      dot!.style.opacity = "1";
    }

    function handleLeave() {
      // Hide when the pointer leaves the viewport (e.g. to browser
      // chrome or another monitor) instead of leaving it stuck at the
      // last known position.
      dot!.style.opacity = "0";
      targetScale = 1;
    }

    function raf() {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      scale += (targetScale - scale) * 0.2;
      dot!.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
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
      className="pointer-events-none fixed top-0 left-0 z-[100] size-6 rounded-full bg-white opacity-0 mix-blend-difference transition-opacity duration-200"
    />
  );
}
