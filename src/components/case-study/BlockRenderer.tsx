import type { Block } from "@/lib/types/caseStudy";
import TextBlock from "./TextBlock";
import ImageGrid from "./ImageGrid";
import MetaBlockView from "./MetaBlock";
import MediaText from "./MediaText";
import GridBlockView from "./GridBlock";

// Dispatches a single block to its component. Shared by BlockRenderer (the
// top-level list) and GridBlock (which renders arbitrary nested blocks),
// so the switch logic isn't duplicated between them.
export function renderBlock(block: Block, key: number | string) {
  switch (block.type) {
    case "text":
      return <TextBlock key={key} block={block} />;
    case "imageGrid":
      return <ImageGrid key={key} block={block} />;
    case "meta":
      return <MetaBlockView key={key} block={block} />;
    case "mediaText":
      return <MediaText key={key} block={block} />;
    case "grid":
      return <GridBlockView key={key} block={block} />;
    default:
      return null;
  }
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-12">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}
