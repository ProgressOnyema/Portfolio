import Image from "next/image";
import type { QuoteBlock } from "@/lib/types/caseStudy";
import RichText from "./RichText";

export default function Quote({ block }: { block: QuoteBlock }) {
  return (
    <div className="mx-auto flex max-w-[689px] flex-col gap-6">
      <div className="flex flex-col gap-4">
        <RichText paragraphs={block.body} className="text-h3 text-text-primary" />
      </div>
      <div className="flex items-center gap-3">
        {block.attribution.avatar && (
          <Image
            src={block.attribution.avatar}
            alt={block.attribution.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div className="flex flex-col text-left">
          <p className="text-body-reg-strong">{block.attribution.name}</p>
          {block.attribution.role && (
            <p className="text-body-sm-base text-text-muted">{block.attribution.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}
