import type { ImageGridBlock as ImageGridBlockData } from "@/lib/types/caseStudy";

const COLUMN_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

// Heavy GIFs that have a lightweight animated-WebP twin for phones.
// Keyed by file name; the WebP must live in the same folder as the GIF.
// Desktop (sm+, 640px) keeps the GIF; below that the browser uses the WebP.
// Only list a file here once its WebP is actually committed — a <source>
// that 404s does NOT fall back to the <img>, it just shows a broken image.
const MOBILE_WEBP: Record<string, string> = {
  "multi_leg.gif": "multi_leg_anim.webp",
};

function mobileSrcFor(src: string): string | null {
  const slash = src.lastIndexOf("/");
  const dir = src.slice(0, slash + 1);
  const file = src.slice(slash + 1).split("?")[0];
  const twin = MOBILE_WEBP[file];
  return twin ? `${dir}${twin}` : null;
}

// The classic static layout — a real CSS grid, one column on mobile
// regardless of block.columns, then the requested column count at sm+.
// A plain <img>, not next/image, on purpose: next/image re-encodes and
// would flatten animated GIFs, and a plain <img> lets the browser use
// each file's own natural size, just capped by max-h/max-w so one huge
// or oddly-shaped image can't break the grid.
// See MarqueeGrid.tsx for the auto-scrolling alternative; both remain
// available as separate block types (imageGrid / marqueeGrid).
//
// Mobile fix for animated GIFs: they were lazy-loaded into a box with no
// reserved height (the <img> had no width/height, so it collapsed to 0px
// until its bytes arrived), and a multi-MB GIF could stay blank on mobile.
// Now the intrinsic size from the content parser (when known) is passed
// as width/height so the browser reserves the correct aspect ratio up
// front, GIFs load eagerly instead of lazily, and phones get the much
// smaller animated WebP (see MOBILE_WEBP) via <picture>.
export default function ImageGrid({ block }: { block: ImageGridBlockData }) {
  return (
    <div className={`grid gap-4 ${COLUMN_CLASSES[block.columns]}`}>
      {block.images.map((image, i) => {
        const isGif = /\.gif($|\?)/i.test(image.src);
        const mobileSrc = isGif ? mobileSrcFor(image.src) : null;
        return (
          <figure key={i} className="flex flex-col gap-2">
            <div className="flex w-full items-center justify-center overflow-hidden rounded-md bg-surface-bg-alt">
              <picture>
                {mobileSrc && (
                  <source
                    media="(max-width: 639px)"
                    srcSet={mobileSrc}
                    type="image/webp"
                  />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element -- see comment above: plain <img> keeps animated GIFs animated */}
                <img
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading={isGif ? "eager" : "lazy"}
                  decoding="async"
                  className="h-auto max-h-[500px] w-auto max-w-full object-contain"
                />
              </picture>
            </div>
            {image.caption && (
              <figcaption className="text-mono-caption text-text-muted">
                {image.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
