import type { TextNode, RichSpan } from "@/lib/types/caseStudy";

function renderSpan(span: RichSpan, i: number) {
  if (typeof span === "string") return span;
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
