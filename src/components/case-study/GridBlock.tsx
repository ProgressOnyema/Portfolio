import type { CSSProperties } from "react";
import type { GridBlock as GridBlockData } from "@/lib/types/caseStudy";
import { renderBlock } from "./BlockRenderer";

export default function GridBlock({ block }: { block: GridBlockData }) {
  const style = {
    "--grid-cols": `repeat(${block.columns}, minmax(0, 1fr))`,
  } as CSSProperties;

  return (
    <div
      className="grid grid-cols-1 gap-8 sm:gap-12 sm:[grid-template-columns:var(--grid-cols)]"
      style={style}
    >
      {block.items.map((item, i) => (
        <div key={i}>{renderBlock(item, i)}</div>
      ))}
    </div>
  );
}
