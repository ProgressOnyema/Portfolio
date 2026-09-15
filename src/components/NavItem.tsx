export default function NavItem({
  label,
  active = false,
  size = "sm",
}: {
  label: string;
  active?: boolean;
  // "lg" matches the MobileNavCollasped component (Home/Me/Work/Contact
  // at Headings/H2 size) — the expanded mobile menu, not the compact
  // desktop navbar links this component was originally built for.
  size?: "sm" | "lg";
}) {
  if (size === "lg") {
    return (
      <p
        className={`transition-colors ${
          active ? "text-h2-bold text-text-primary" : "text-h2 text-text-muted hover:text-text-primary"
        }`}
      >
        {label}
      </p>
    );
  }

  return (
    <p
      className={`p-2 transition-colors ${
        active ? "text-text-primary text-body-reg-strong" : "text-text-muted text-body-reg-base hover:text-text-primary"
      }`}
    >
      {label}
    </p>
  );
}
