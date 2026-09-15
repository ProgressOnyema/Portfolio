import type { CSSProperties } from "react";
import type { GridBlock as GridBlockData } from "@/lib/types/caseStudy";
import { renderBlock } from "./BlockRenderer";

export default function GridBlock({ block }: { block: GridBlockData }) {
  const style = {
    "--grid-cols": `repeat(${block.columns}, minmax(0, 1fr))`,
  } as CSSProperties;

  // On mobile the grid collapses to a single stacked column (see
  // grid-cols-1 below), and a text block reads better before its meta
  // block rather than after it, even though meta is usually authored
  // first so it sits to the left in the sm+ side-by-side layout. Scoped
  // narrowly to the exact meta+text pairing so it can't affect any other
  // grid combination. `order` only applies within this grid, and
  // sm:order-none drops back to natural (authored) order once the sm+
  // multi-column layout kicks in, so desktop is unaffected either way.
  const isMetaTextPair =
    block.items.length === 2 &&
    block.items.some((item) => item.type === "meta") &&
    block.items.some((item) => item.type === "text");

  function orderClass(type: string) {
    if (!isMetaTextPair) return "";
    if (type === "text") return "order-1 sm:order-none";
    if (type === "meta") return "order-2 sm:order-none";
    return "";
  }

  return (
    <div
      className="grid grid-cols-1 gap-8 sm:gap-12 sm:[grid-template-columns:var(--grid-cols)]"
      style={style}
    >
      {block.items.map((item, i) => (
        <div key={i} className={orderClass(item.type)}>
          {renderBlock(item, i)}
        </div>
      ))}
    </div>
  );
}
