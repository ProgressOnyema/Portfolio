const CATEGORIES = ["Product Design", "Branding", "Development"];

export default function Subnav({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div className="text-body-reg-strong flex flex-wrap items-start justify-center gap-3">
      {CATEGORIES.map((category, i) => (
        <span key={category} className="flex items-center gap-3">
          <span className={i === activeIndex ? "text-text-primary" : "text-text-muted"}>
            {category}
          </span>
          {i < CATEGORIES.length - 1 && <span className="text-text-muted">/</span>}
        </span>
      ))}
    </div>
  );
}
