import type { Block } from "@/lib/types/caseStudy";
import TextBlock from "./TextBlock";
import ImageGrid from "./ImageGrid";

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-12">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={i} block={block} />;
          case "imageGrid":
            return <ImageGrid key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
