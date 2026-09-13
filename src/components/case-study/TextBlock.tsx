import type { TextBlock as TextBlockData } from "@/lib/types/caseStudy";

export default function TextBlock({ block }: { block: TextBlockData }) {
  if (block.variant === "pullQuote") {
    return (
      <p className="text-h2-bold text-center">{block.body}</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {block.heading && <h3 className="text-h3-bold">{block.heading}</h3>}
      <p className="text-body-reg-base text-text-muted">{block.body}</p>
    </div>
  );
}
