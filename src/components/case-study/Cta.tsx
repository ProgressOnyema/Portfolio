import type { CtaBlock } from "@/lib/types/caseStudy";
import { ButtonPrimary } from "../Button";
import { ArrowIcon } from "../Icons";

export default function Cta({ block }: { block: CtaBlock }) {
  if (block.style === "link") {
    return (
      <div className="flex justify-center">
        <a
          href={block.href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 text-text-primary transition-colors hover:text-text-muted"
        >
          <span className="text-body-lg-strong">{block.label}</span>
          <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <ButtonPrimary href={block.href} target="_blank" rel="noreferrer">
        {block.label}
      </ButtonPrimary>
    </div>
  );
}
