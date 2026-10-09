import type { TextNode, RichSpan } from "@/lib/types/caseStudy";
import { ArrowIcon } from "@/components/Icons";

// Source links: a pill with a hairline border that sits inline with the
// text around it. Colors are the theme tokens, so it adapts to light/dark;
// hover mirrors the site's Button (fills with the inverse surface, corners
// tighten 5px -> 3px). `!` on the transition utility is required: the
// unlayered `body, body * { transition: ... }` rule in globals.css would
// otherwise beat Tailwind's layered classes (same reason as Button.tsx).
const SOURCE_PILL =
  "mx-0.5 inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border-hairline px-2 text-mono-caption text-text-muted no-underline !transition-[background-color,border-color,color,border-radius] !duration-300 !ease-in-out hover:rounded-[3px] hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-muted";

function renderSpan(span: RichSpan, i: number) {
  if (typeof span === "string") return span;
  if (span.href) {
    return (
      <a key={i} href={span.href} target="_blank" rel="noopener noreferrer" className={SOURCE_PILL}>
        {span.text}
        <ArrowIcon className="-rotate-45" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }
  return span.emphasis ? <em key={i}>{span.text}</em> : <span key={i}>{span.text}</span>;
}

export default function RichText({
  paragraphs,
  className = "text-body-reg-base text-text-body",
}: {
  paragraphs: TextNode[];
  className?: string;
}) {
  return (
    <>
      {paragraphs.map((node, i) => {
        // Paragraph is a bare RichSpan[] array; ListBlock is a plain
        // object - see TextNode's comment in caseStudy.ts for why that's
        // enough to tell them apart here.
        if (Array.isArray(node)) {
          return (
            <p key={i} className={className}>
              {node.map((span, j) => renderSpan(span, j))}
            </p>
          );
        }

        const ListTag = node.ordered ? "ol" : "ul";
        return (
          <ListTag
            key={i}
            className={`flex flex-col gap-1 pl-5 ${node.ordered ? "list-decimal" : "list-disc"} ${className}`}
          >
            {node.items.map((item, j) => (
              <li key={j}>{item.map((span, k) => renderSpan(span, k))}</li>
            ))}
          </ListTag>
        );
      })}
    </>
  );
}
