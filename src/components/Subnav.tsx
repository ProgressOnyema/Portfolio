"use client";

import type { ProjectCategory } from "./ProjectWidget";

const CATEGORIES: ProjectCategory[] = ["Product Design", "Branding", "Development"];

export default function Subnav({
  active,
  onSelect,
}: {
  active: ProjectCategory;
  onSelect: (category: ProjectCategory) => void;
}) {
  return (
    <div className="text-body-reg-base flex flex-wrap items-start justify-center gap-3">
      {CATEGORIES.map((category, i) => (
        <span key={category} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelect(category)}
            aria-pressed={active === category}
            className={`transition-colors ${
              active === category ? "text-text-primary text-body-reg-strong" : "text-text-muted hover:text-text-primary"
            }`}
          >
            {category}
          </button>
          {i < CATEGORIES.length - 1 && <span className="text-text-muted">/</span>}
        </span>
      ))}
    </div>
  );
}
