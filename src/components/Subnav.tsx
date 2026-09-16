"use client";

import Link from "next/link";
import type { ProjectCategory } from "./ProjectWidget";

const CATEGORIES: ProjectCategory[] = ["Product Design", "Branding", "Development"];

export default function Subnav({
  active,
  onSelect,
  hrefs,
}: {
  active: ProjectCategory;
  // Filter mode (used on /work): clicking a category re-filters the grid
  // in place. Mutually exclusive with `hrefs` — if both are passed,
  // onSelect wins.
  onSelect?: (category: ProjectCategory) => void;
  // Tab mode (used on a case-study page): each entry links to the sibling
  // case study for that category. A category with no entry here has no
  // case study for this project and renders inert.
  hrefs?: Partial<Record<ProjectCategory, string>>;
}) {
  return (
    <div className="text-subnav flex flex-wrap items-start gap-3">
      {CATEGORIES.map((category, i) => {
        const isActive = active === category;
        // Weight (Semi Bold) and size are uniform across the whole row —
        // set once on the container above via .text-subnav — only color
        // distinguishes the active tab from the rest.
        const className = `transition-colors ${
          isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
        }`;
        const href = hrefs?.[category];

        return (
          <span key={category} className="flex items-center gap-3">
            {onSelect ? (
              <button type="button" onClick={() => onSelect(category)} aria-pressed={isActive} className={`${className} hover:text-text-primary`}>
                {category}
              </button>
            ) : isActive ? (
              <span className={className} aria-current="page">
                {category}
              </span>
            ) : href ? (
              <Link href={href} className={className}>
                {category}
              </Link>
            ) : (
              <span className={`${className} cursor-default opacity-40 hover:text-text-muted`} aria-disabled="true">
                {category}
              </span>
            )}
            {i < CATEGORIES.length - 1 && <span className="text-text-muted">/</span>}
          </span>
        );
      })}
    </div>
  );
}
