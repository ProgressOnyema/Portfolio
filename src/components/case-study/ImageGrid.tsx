import type { ImageGridBlock as ImageGridBlockData } from "@/lib/types/caseStudy";

const COLUMN_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

// The classic static layout — a real CSS grid, one column on mobile
// regardless of block.columns, then the requested column count at sm+.
// A plain <img>, not next/image, on purpose: content-authored images have
// no known width/height (they're referenced by path from a .txt file, not
// statically imported), so next/image would need either `fill` (forcing a
// crop into a fixed box) or authored dimensions per image. A plain <img>
// lets the browser use each file's own natural size, just capped by
// max-h/max-w so one huge or oddly-shaped image can't break the grid.
// See MarqueeGrid.tsx for the auto-scrolling alternative; both remain
// available as separate block types (imageGrid / marqueeGrid).
export default function ImageGrid({ block }: { block: ImageGridBlockData }) {
  return (
    <div className={`grid gap-4 ${COLUMN_CLASSES[block.columns]}`}>
      {block.images.map((image, i) => (
        <figure key={i} className="flex flex-col gap-2">
          <div className="flex w-full items-center justify-center overflow-hidden rounded-md bg-surface-bg-alt">
            {/* eslint-disable-next-line @next/next/no-img-element -- see comment above: dimensions are unknown at authoring time */}
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="max-h-[500px] max-w-full object-contain"
            />
          </div>
          {image.caption && (
            <figcaption className="text-body-sm-base text-text-muted">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
