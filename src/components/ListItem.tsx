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
   *  this row's layout or pushes sibling rows — it overlays the row
   *  itself, vertically centered against it, folding open/closed
   *  (scaleY) rather than fading. */
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  const { maxWidth, text } = TYPE_STYLES[type];

  return (
    <div
      className={`group relative ${text} w-full ${maxWidth} border-b border-border-hairline px-2 py-4 text-text-primary !transition-colors !duration-300 !ease-out hover:bg-surface-bg-alt ${
        active ? "bg-surface-bg-alt" : "bg-surface-bg"
      } ${className}`}
    >
      {children}
      {image && (
        <div
          className="pointer-events-none absolute top-1/2 right-0 z-10 origin-center -translate-y-1/2 scale-y-0 !transition-[scale] !duration-200 !ease-out group-hover:scale-y-100"
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
            className="h-[100px] w-auto border border-border-hairline shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
