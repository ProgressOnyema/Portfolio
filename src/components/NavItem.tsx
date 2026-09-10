export default function NavItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <p
      className={`text-body-reg-strong p-2 transition-colors ${
        active ? "text-text-primary" : "text-text-muted hover:text-text-primary"
      }`}
    >
      {label}
    </p>
  );
}
