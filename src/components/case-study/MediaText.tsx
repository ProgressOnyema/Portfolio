import Image from "next/image";
import type { MediaTextBlock } from "@/lib/types/caseStudy";
import RichText from "./RichText";

export default function MediaText({ block }: { block: MediaTextBlock }) {
  const position = block.imagePosition ?? "left";
  const isRow = position === "left" || position === "right";

  return (
    <div
      className={`flex flex-col gap-6 ${
        isRow ? "sm:flex-row sm:items-center sm:gap-12" : ""
      } ${position === "right" ? "sm:flex-row-reverse" : ""}`}
    >
      <div className="relative aspect-[4/3] w-full flex-1 overflow-hidden rounded-md bg-surface-bg-alt">
        <Image src={block.image.src} alt={block.image.alt} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {block.heading && <h3 className="text-h3-bold">{block.heading}</h3>}
        <div className="flex flex-col gap-4">
          <RichText paragraphs={block.body} />
        </div>
      </div>
    </div>
  );
}
