export default function NavItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
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
