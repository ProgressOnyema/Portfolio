type ListItemType = "short" | "small" | "long";

const TYPE_STYLES: Record<ListItemType, { maxWidth: string; text: string }> = {
  short: { maxWidth: "sm:max-w-[350px]", text: "text-body-lg-strong" },
  long: { maxWidth: "sm:max-w-[703px]", text: "text-body-lg-strong" },
  small: { maxWidth: "sm:max-w-[356px]", text: "text-body-reg-base" },
};

export default function ListItem({
  children,
  type = "short",
  active = false,
  className = "",
}: {
  children: React.ReactNode;
  type?: ListItemType;
  active?: boolean;
  className?: string;
}) {
  const { maxWidth, text } = TYPE_STYLES[type];

  return (
    <div
      className={`${text} w-full ${maxWidth} border-b border-border-hairline px-2 py-3 text-text-primary ${
        active ? "bg-surface-bg-alt" : "bg-surface-bg"
      } ${className}`}
    >
      {children}
    </div>
  );
}
