import Image from "next/image";
import type { MetaBlock as MetaBlockData } from "@/lib/types/caseStudy";

export default function MetaBlock({ block }: { block: MetaBlockData }) {
  return (
    <div className="flex flex-col gap-6">
      {block.logo && (
        <Image src={block.logo.src} alt={block.logo.alt} width={48} height={48} />
      )}
      <div className="flex flex-col gap-4">
        {block.fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <p className="text-body-reg-strong">{field.label}</p>
            <p className="text-body-reg-base text-text-muted">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
