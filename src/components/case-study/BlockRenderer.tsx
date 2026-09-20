import type { Block } from "@/lib/types/caseStudy";
import TextBlock from "./TextBlock";
import ImageGrid from "./ImageGrid";
import MarqueeGrid from "./MarqueeGrid";
import MetaBlockView from "./MetaBlock";
import MediaText from "./MediaText";
import GridBlockView from "./GridBlock";
import VideoBlockView from "./VideoBlock";
import StatRow from "./StatRow";
import CoverImage from "./CoverImage";
import Quote from "./Quote";
import Cta from "./Cta";

// Dispatches a single block to its component. Shared by BlockRenderer (the
// top-level list) and GridBlock (which renders arbitrary nested blocks),
// so the switch logic isn't duplicated between them.
export function renderBlock(block: Block, key: number | string) {
  switch (block.type) {
    case "text":
      return <TextBlock key={key} block={block} />;
    case "imageGrid":
      return <ImageGrid key={key} block={block} />;
    case "marqueeGrid":
      return <MarqueeGrid key={key} block={block} />;
    case "meta":
      return <MetaBlockView key={key} block={block} />;
    case "mediaText":
      return <MediaText key={key} block={block} />;
    case "grid":
      return <GridBlockView key={key} block={block} />;
    case "video":
      return <VideoBlockView key={key} block={block} />;
    case "stats":
      return <StatRow key={key} block={block} />;
    case "coverImage":
      return <CoverImage key={key} block={block} />;
    case "quote":
      return <Quote key={key} block={block} />;
    case "cta":
      return <Cta key={key} block={block} />;
    default:
      return null;
  }
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-16">
      {blocks.map((block, i) => {
        const content = renderBlock(block, i);
        // Top-level text sections only (prose reads better narrower and
        // centered on wide screens) — everything else (images, grids,
        // video, stats, etc.) still runs the full column width. A text
        // block nested inside a `grid` block (see GridBlock.tsx, which
        // calls renderBlock() directly rather than going through this
        // map) is untouched, since it needs to fill its own grid column
        // alongside whatever it's paired with, not shrink further.
        if (block.type === "text") {
          return (
            <div key={i} className="sm:mx-auto sm:w-3/4">
              {content}
            </div>
          );
        }
        return content;
      })}
    </div>
  );
}
