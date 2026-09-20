import type { TextBlock as TextBlockData } from "@/lib/types/caseStudy";
import RichText from "./RichText";

export default function TextBlock({ block }: { block: TextBlockData }) {
  if (block.variant === "pullQuote") {
    return (
      <div className="flex flex-col gap-3 text-left">
        <RichText paragraphs={block.body} className="text-h3 text-text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {block.heading && <h3 className="text-h3-bold">{block.heading}</h3>}
      <div className="flex flex-col gap-4">
        <RichText paragraphs={block.body} />
      </div>
    </div>
  );
}
