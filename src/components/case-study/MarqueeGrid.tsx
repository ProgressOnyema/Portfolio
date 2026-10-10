import type { CSSProperties } from "react";
import Image from "next/image";
import type { MarqueeGridBlock as MarqueeGridBlockData } from "@/lib/types/caseStudy";

// Renders as a continuously auto-scrolling horizontal marquee at every
// breakpoint.
//
// Images go through next/image whenever the parser could read their pixel
// size (it does, at build time, for any local file — see
// scripts/parse-case-study.mjs). That matters on phones: authored images
// are often huge (3840px-wide diagrams, 14+ megapixels) but tiny as files,
// and a plain <img> makes the browser decode every one at full size — a
// single marquee can add up to hundreds of MB of decoded bitmaps, which
// mobile browsers (iOS Safari especially) respond to by dropping images,
// so they vanish when scrolled into view and never show. next/image
// serves each one resized to roughly its on-screen size instead.
//
// Images without known dimensions (a remote URL, an unreadable file) fall
// back to a plain <img>, which uses the file's own natural size capped by
// max-h/max-w. See ImageGrid.tsx for the classic static-grid alternative;
// both remain available as separate block types (marqueeGrid / imageGrid).
// block.columns is intentionally unused here — kept only for
// type/tag-argument parity with ImageGridBlock.

// Each image sits in a box that fits within MAX_W x MAX_H (the height cap
// is 280px on mobile, 360px from sm up), keeping its aspect ratio.
const MAX_W = 600;
const MAX_H_MOBILE = 280;
const MAX_H_DESKTOP = 360;

function fit(aspect: number, maxH: number) {
  const w = Math.min(MAX_W, maxH * aspect);
  return { w: Math.round(w), h: Math.round(w / aspect) };
}

export default function MarqueeGrid({ block }: { block: MarqueeGridBlockData }) {
  // The image list is rendered twice back-to-back so the CSS animation
  // (globals.css, .animate-marquee) can loop seamlessly at a -50%
  // translateX instead of snapping back to the start. The second copy
  // is aria-hidden with empty alt text so screen readers don't announce
  // every image twice.
  const renderImages = (copy: "a" | "b") =>
    block.images.map((image, i) => {
      const known = image.width && image.height;
      const aspect = known ? image.width! / image.height! : 1;
      const mobile = fit(aspect, MAX_H_MOBILE);
      const desktop = fit(aspect, MAX_H_DESKTOP);

      return (
        <figure key={`${copy}-${i}`} className="flex w-auto shrink-0 flex-col gap-2">
          <div className="flex max-h-[280px] max-w-[600px] items-center justify-center overflow-hidden rounded-md bg-surface-bg-alt sm:max-h-[360px]">
            {known ? (
              <Image
                src={image.src}
                alt={copy === "a" ? image.alt : ""}
                width={image.width}
                height={image.height}
                // The slot is exactly the fitted size at each breakpoint,
                // so the browser picks a srcset candidate for that size
                // (and the screen's pixel density), not the original.
                sizes={`(min-width: 640px) ${desktop.w}px, ${mobile.w}px`}
                className="h-(--mh) w-(--mw) object-contain sm:h-(--dh) sm:w-(--dw)"
                style={
                  {
                    "--mw": `${mobile.w}px`,
                    "--mh": `${mobile.h}px`,
                    "--dw": `${desktop.w}px`,
                    "--dh": `${desktop.h}px`,
                  } as CSSProperties
                }
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- dimensions unknown for this image (see comment above)
              <img
                src={image.src}
                alt={copy === "a" ? image.alt : ""}
                loading="lazy"
                className="max-h-[280px] max-w-[600px] object-contain sm:max-h-[360px]"
              />
            )}
          </div>
          {copy === "a" && image.caption && (
            <figcaption className="text-mono-caption text-text-muted">
              {image.caption}
            </figcaption>
          )}
        </figure>
      );
    });

  return (
    // Full-bleed to the actual viewport edge on every breakpoint, not just
    // to the edge of Grid's own max-w-1440 column — the standard
    // "break out of a centered container" trick (relative + left/right
    // 1/2 + a viewport-wide negative margin), since a plain negative
    // margin sized to Grid's padding would only cancel the gutter and
    // still stop at the 1440 cap on wide screens.
    <div className="relative left-1/2 right-1/2 mx-[-50vw] w-screen overflow-hidden">
      <div className="animate-marquee flex w-max gap-4 hover:[animation-play-state:paused]">
        {renderImages("a")}
        <div className="flex gap-4" aria-hidden="true">
          {renderImages("b")}
        </div>
      </div>
    </div>
  );
}
