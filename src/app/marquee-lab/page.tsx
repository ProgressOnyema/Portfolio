import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { MarqueeGridBlock } from "@/lib/types/caseStudy";
import MarqueeLab from "./MarqueeLab";

// Temporary diagnostics page for the "marquee images vanish on iPhone"
// bug. Not linked anywhere, not in the sitemap, noindex. Delete once the
// real marquee is fixed.
export const metadata: Metadata = {
  title: "Marquee lab",
  robots: { index: false, follow: false },
};

export default function MarqueeLabPage() {
  const file = path.join(process.cwd(), "src/lib/data/case-studies/talkam/talkam-uxui.json");
  const study = JSON.parse(fs.readFileSync(file, "utf-8")) as { blocks: { type: string }[] };
  const block = study.blocks.find((b) => b.type === "marqueeGrid") as unknown as MarqueeGridBlock;
  return <MarqueeLab block={block} />;
}
