import Image from "next/image";
import type { CoverImageBlock } from "@/lib/types/caseStudy";

export default function CoverImage({ block }: { block: CoverImageBlock }) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-surface-bg-alt">
        <Image src={block.src} alt={block.alt} fill className="object-cover" />
      </div>
    </figure>
  );
}
