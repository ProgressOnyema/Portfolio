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

   No anchor-link / in-page hash handling here: nothing on the site links
   to a same-page #hash today (see Subnav, ContactSection), so there's
   nothing for Lenis to intercept. If that changes, Lenis's own
   `anchors` option (or a manual `lenis.scrollTo`) needs to be wired up
   too, or clicking such a link will desync Lenis's virtual scroll
   position from the browser's real one. */
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
