import Image from "next/image";
import type { ImageGridBlock as ImageGridBlockData } from "@/lib/types/caseStudy";

// Renders as a continuously auto-scrolling horizontal marquee at every
// breakpoint, per direct instruction — no longer a real CSS grid despite
// the block/type name (see ImageGridStatic for the classic layout,
// still available as a separate block type). `columns` is intentionally
// unused now (kept only so older content that still specifies it
// continues to validate).
export default function ImageGrid({ block }: { block: ImageGridBlockData }) {
  // The image list is rendered twice back-to-back so the CSS animation
  // (globals.css, .animate-marquee) can loop seamlessly at a -50%
  // translateX instead of snapping back to the start. The second copy
  // is aria-hidden with empty alt text so screen readers don't announce
  // every image twice.
  const renderImages = (copy: "a" | "b") =>
    block.images.map((image, i) => (
      <figure key={`${copy}-${i}`} className="flex w-[360px] shrink-0 flex-col gap-2 sm:w-[480px]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-surface-bg-alt">
          <Image
            src={image.src}
            alt={copy === "a" ? image.alt : ""}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 480px, 360px"
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
