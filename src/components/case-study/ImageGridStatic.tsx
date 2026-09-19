import Image from "next/image";
import type { ImageGridStaticBlock as ImageGridStaticBlockData } from "@/lib/types/caseStudy";

const COLUMN_CLASSES = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

// The classic static layout ImageGrid used before it became a marquee —
// kept as its own block/component (imageGridStatic) so both remain
// available as authoring options. A real CSS grid: one column on
// mobile regardless of block.columns, then the requested column count
// at sm+.
export default function ImageGridStatic({ block }: { block: ImageGridStaticBlockData }) {
  return (
    <div className={`grid gap-4 ${COLUMN_CLASSES[block.columns]}`}>
      {block.images.map((image, i) => (
        <figure key={i} className="flex flex-col gap-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-surface-bg-alt">
            <Image src={image.src} alt={image.alt} fill className="object-cover" />
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
