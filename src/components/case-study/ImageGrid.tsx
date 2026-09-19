import Image from "next/image";
import type { ImageGridBlock as ImageGridBlockData } from "@/lib/types/caseStudy";

// Renders as a continuously auto-scrolling horizontal marquee at every
// breakpoint, per direct instruction — no longer a real CSS grid despite
// the block/type name. `columns` is intentionally unused now (kept only
// so older content that still specifies it continues to validate).
export default function ImageGrid({ block }: { block: ImageGridBlockData }) {
  // The image list is rendered twice back-to-back so the CSS animation
  // (globals.css, .animate-marquee) can loop seamlessly at a -50%
  // translateX instead of snapping back to the start. The second copy
  // is aria-hidden with empty alt text so screen readers don't announce
  // every image twice.
  const renderImages = (copy: "a" | "b") =>
    block.images.map((image, i) => (
      <figure key={`${copy}-${i}`} className="flex w-[280px] shrink-0 flex-col gap-2 sm:w-[320px]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-surface-bg-alt">
          <Image
            src={image.src}
            alt={copy === "a" ? image.alt : ""}
            fill
            className="object-cover"
            sizes="320px"
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
    <div className="overflow-hidden">
      <div className="animate-marquee flex w-max gap-4 hover:[animation-play-state:paused]">
        {renderImages("a")}
        <div className="flex gap-4" aria-hidden="true">
          {renderImages("b")}
        </div>
      </div>
    </div>
  );
}
