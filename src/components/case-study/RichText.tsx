import type { Paragraph, RichSpan } from "@/lib/types/caseStudy";

function renderSpan(span: RichSpan, i: number) {
  if (typeof span === "string") return span;
  return span.emphasis ? <em key={i}>{span.text}</em> : <span key={i}>{span.text}</span>;
}

export default function RichText({
  paragraphs,
  className = "text-body-reg-base text-text-muted",
}: {
  paragraphs: Paragraph[];
  className?: string;
}) {
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={className}>
          {paragraph.map((span, j) => renderSpan(span, j))}
        </p>
      ))}
    </>
  );
}
