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
          className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 aspect-video w-[240px] origin-bottom-right scale-95 opacity-0 !transition-[opacity,scale] !duration-300 !ease-in-out group-hover:scale-100 group-hover:opacity-100"
          aria-hidden="true"
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="240px"
            className="rounded-md border border-border-hairline object-cover shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
