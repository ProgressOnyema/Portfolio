import Image from "next/image";
import type { CoverImageBlock } from "@/lib/types/caseStudy";

export default function CoverImage({ block }: { block: CoverImageBlock }) {
  return (
    <figure className="flex flex-col gap-3">
      {/* Full-bleed on mobile only: the negative margin + extra width
          cancel out Grid's own px-5 mobile gutter so the image touches
          both screen edges below sm. At sm+ it reverts to filling its
          column like every other block (mx-0/w-full), rounded corners
          included — rounding a full-bleed edge-to-edge image would look
          wrong, so that's mobile-only too. */}
      <div className="relative -mx-5 aspect-[16/9] w-[calc(100%+2.5rem)] overflow-hidden bg-surface-bg-alt sm:mx-0 sm:w-full sm:rounded-md">
        <Image src={block.src} alt={block.alt} fill className="object-cover" />
      </div>
    </figure>
  );
}
