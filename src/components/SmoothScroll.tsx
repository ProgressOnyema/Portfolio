"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/* Site-wide smooth (inertial) scrolling, via Lenis. Renders nothing of its
   own — it just drives the browser's native scroll position from a
   requestAnimationFrame loop, so it can live once in RootLayout above
   {children} rather than wrapping the whole page in an extra DOM node.

   Skips entirely under prefers-reduced-motion: reduce. Lenis's inertia is
   exactly the kind of motion that setting exists to opt out of, and the
   native scroll behavior underneath is already perfectly accessible on
   its own — there's no degraded fallback needed, just "don't smooth it."

   Hash links: there are no same-page #hash links, so Lenis's `anchors`
   option isn't needed. The one hash link is the case-study "Back" link,
   which goes to /#work from another route; Next.js performs that scroll
   natively on arrival and Lenis follows native scroll events. If that
   ever jumps or snaps back (check desktop and mobile), wire up Lenis's
   `anchors` option or a manual `lenis.scrollTo` for it. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
