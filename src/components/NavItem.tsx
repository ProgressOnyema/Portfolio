export default function NavItem({
  label,
  active = false,
  size = "sm",
}: {
  label: string;
  active?: boolean;
  // "lg" matches the MobileNavCollasped component (Home/Me/Work/Contact)
  // — the expanded mobile menu, not the compact desktop navbar links this
  // component was originally built for. JetBrains Mono at 28px (the old
  // Inter H2 was 32px; mono runs wider). Active uses weight 600, the
  // heaviest JetBrains Mono weight loaded in layout.tsx — 700 isn't
  // loaded and would be faux-bolded.
  size?: "sm" | "lg";
}) {
  if (size === "lg") {
    return (
      <p
        className={`font-mono text-[28px] leading-[1.25] transition-colors ${
          active ? "font-semibold text-text-primary" : "font-normal text-text-muted hover:text-text-primary"
        }`}
      >
        {label}
      </p>
    );
  }

  return (
    <p
      className={`p-2 transition-colors ${
        active ? "text-text-primary text-mono-nav-strong" : "text-text-muted text-mono-nav hover:text-text-primary"
      }`}
    >
      {label}
    </p>
  );
}
