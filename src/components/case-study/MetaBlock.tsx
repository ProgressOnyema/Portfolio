import Image from "next/image";
import type { MetaBlock as MetaBlockData } from "@/lib/types/caseStudy";

export default function MetaBlock({ block }: { block: MetaBlockData }) {
  return (
    <div className="flex flex-col gap-6">
      {block.logo && (
        <div className="relative size-12 shrink-0 overflow-hidden rounded-[12px] bg-surface-bg-alt">
          <Image src={block.logo.src} alt={block.logo.alt} fill className="object-contain p-2" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {block.fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <p className="text-body-reg-strong">{field.label}</p>
            <p className="text-body-reg-base text-text-body">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
