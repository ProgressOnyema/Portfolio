"use client";

import type { ProjectCategory } from "./ProjectWidget";

const CATEGORIES: ProjectCategory[] = ["Product Design", "Branding", "Development"];

export default function Subnav({
  active,
  onSelect,
}: {
  active: ProjectCategory;
  onSelect?: (category: ProjectCategory) => void;
}) {
  return (
    <div className="text-body-reg-base flex flex-wrap items-start justify-center gap-3">
      {CATEGORIES.map((category, i) => {
        const isActive = active === category;
        const className = `transition-colors ${
          isActive ? "text-text-primary text-body-reg-strong" : "text-text-muted hover:text-text-primary"
        }`;

        return (
          <span key={category} className="flex items-center gap-3">
            {onSelect ? (
              <button type="button" onClick={() => onSelect(category)} aria-pressed={isActive} className={`${className} hover:text-text-primary`}>
                {category}
              </button>
            ) : (
              <span className={className}>{category}</span>
            )}
            {i < CATEGORIES.length - 1 && <span className="text-text-muted">/</span>}
          </span>
        );
      })}
    </div>
  );
}
