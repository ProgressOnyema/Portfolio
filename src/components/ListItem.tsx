import Image from "next/image";

type ListItemType = "short" | "small" | "long";

const TYPE_STYLES: Record<ListItemType, { maxWidth: string; text: string }> = {
  short: { maxWidth: "sm:max-w-[350px]", text: "text-body-lg-strong" },
  long: { maxWidth: "sm:max-w-full", text: "text-body-lg-strong" },
  small: { maxWidth: "sm:max-w-[356px]", text: "text-body-reg-base" },
};

export default function ListItem({
  children,
  type = "short",
  active = false,
  image,
  imageAlt = "",
  className = "",
}: {
  children: React.ReactNode;
  type?: ListItemType;
  active?: boolean;
  /** Credential preview image, shown on hover. Absolutely positioned
   *  (against this item's own `relative`) so revealing it never affects
   *  this row's layout or pushes sibling rows — it just overlaps them,
   *  above the row, while hovered. */
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  const { maxWidth, text } = TYPE_STYLES[type];

  return (
    <div
      className={`group relative ${text} w-full ${maxWidth} border-b border-border-hairline px-2 py-3 text-text-primary !transition-colors !duration-300 !ease-in-out hover:bg-surface-bg-alt ${
        active ? "bg-surface-bg-alt" : "bg-surface-bg"
      } ${className}`}
    >
      {children}
      {image && (
        <div
          className="pointer-events-none absolute top-0 right-0 z-10 origin-top-right scale-95 opacity-0 !transition-[opacity,scale] !duration-300 !ease-in-out group-hover:scale-100 group-hover:opacity-100"
          aria-hidden="true"
        >
          {/* No `fill`/fixed aspect box here on purpose: credential
              documents vary in orientation (a landscape certificate vs.
              a tall portrait diploma), so height is fixed and width left
              to `auto` — the browser sizes it from each image's own
              natural aspect ratio once loaded, rather than cropping
              every credential into one shape. */}
          <Image
            src={image}
            alt={imageAlt}
            width={400}
            height={300}
            className="h-[100px] w-auto rounded-md border border-border-hairline shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
