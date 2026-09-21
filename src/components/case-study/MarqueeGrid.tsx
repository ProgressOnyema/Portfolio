import type { MarqueeGridBlock as MarqueeGridBlockData } from "@/lib/types/caseStudy";

// Renders as a continuously auto-scrolling horizontal marquee at every
// breakpoint. A plain <img>, not next/image, on purpose: content-authored
// images have no known width/height (they're referenced by path from a
// .txt file, not statically imported), so next/image would need either
// `fill` (forcing a crop into a fixed box) or authored dimensions per
// image. A plain <img> lets the browser use each file's own natural size,
// just capped by max-h/max-w so no single image can dominate the strip.
// See ImageGrid.tsx for the classic static-grid alternative; both remain
// available as separate block types (marqueeGrid / imageGrid).
// block.columns is intentionally unused here — kept only for
// type/tag-argument parity with ImageGridBlock.
export default function MarqueeGrid({ block }: { block: MarqueeGridBlockData }) {
  // The image list is rendered twice back-to-back so the CSS animation
  // (globals.css, .animate-marquee) can loop seamlessly at a -50%
  // translateX instead of snapping back to the start. The second copy
  // is aria-hidden with empty alt text so screen readers don't announce
  // every image twice.
  const renderImages = (copy: "a" | "b") =>
    block.images.map((image, i) => (
      <figure key={`${copy}-${i}`} className="flex w-auto shrink-0 flex-col gap-2">
        <div className="flex max-h-[280px] max-w-[600px] items-center justify-center overflow-hidden rounded-md bg-surface-bg-alt sm:max-h-[360px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- see comment above: dimensions are unknown at authoring time */}
          <img
            src={image.src}
            alt={copy === "a" ? image.alt : ""}
            loading="lazy"
            className="max-h-[280px] max-w-[600px] object-contain sm:max-h-[360px]"
          />
        </div>
        {copy === "a" && image.caption && (
          <figcaption className="text-body-sm-base text-text-muted">
            {image.caption}
          </figcaption>
        )}
      </figure>
    ));

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
