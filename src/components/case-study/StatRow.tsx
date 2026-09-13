import type { StatsBlock } from "@/lib/types/caseStudy";

export default function StatRow({ block }: { block: StatsBlock }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 text-center">
      {block.items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2">
          <p className="text-h1-bold">{item.value}</p>
          <p className="text-body-reg-base text-text-muted">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
