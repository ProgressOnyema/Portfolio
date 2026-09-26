"use client";

import { useRef } from "react";
import ProjectWidget, { type ProjectWidgetData } from "./ProjectWidget";
import { ArrowIcon } from "./Icons";

export default function NextProjectsCarousel({
  projects,
}: {
  projects: ProjectWidgetData[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = 24; // gap-6
    const step = (card?.offsetWidth ?? scroller.clientWidth) + gap;
    scroller.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="pt-24 sm:pt-32">
      {/* Prev/next controls, top-left of the container, above the row */}
      <div className="flex items-center gap-3 pb-6 pl-5 sm:pl-6 lg:pl-[max(88px,calc((100vw-1440px)/2+88px))]">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous project"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-hairline text-text-primary !transition-colors !duration-300 !ease-in-out hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary"
        >
          <ArrowIcon className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next project"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border-hairline text-text-primary !transition-colors !duration-300 !ease-in-out hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary"
        >
          <ArrowIcon />
        </button>
      </div>

      {/* Full-bleed on purpose, per direct instruction — this doesn't
          sit inside <Grid> (which caps at max-w-1440 and centers), so
          the row can scroll genuinely edge-to-edge instead of being
          cropped at the page's own column width. Left padding still
          matches Grid's *effective* left inset — not just its 88px
          gutter, but max(88px, (100vw-1440px)/2 + 88px), the same
          value Grid arrives at once mx-auto starts centering it on
          screens wider than 1440px — so the first card lines up with
          the rest of the page at any width, not just below the
          1440px cap. No right padding, so scrolling runs to the
          actual viewport edge. The trailing spacer gives the last
          card that same breathing room on the way out. hideMeta
          drops the logo/name/one-liner row — the tag pills already
          carry the category, and clicking through is the point, not
          reading a second description here. */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pl-5 sm:snap-none sm:pl-6 lg:pl-[max(88px,calc((100vw-1440px)/2+88px))]"
      >
        {projects.map((project) => (
          <div
            key={project.slug}
            data-carousel-card
            // Mobile width leaves a visible peek of the next card at rest,
            // rather than exactly filling the viewport: 100vw minus Grid's
            // 20px side margin, minus roughly one more card's worth of
            // breathing room. On a 375px phone this works out to ~44px of
            // the next card showing past the right edge — enough to signal
            // "there's more" without relying only on the arrows above.
            className="w-[calc(100vw-96px)] shrink-0 snap-start sm:w-[405.5px]"
          >
            <ProjectWidget project={project} size="lg" hideMeta />
          </div>
        ))}
        <div
          className="w-5 shrink-0 sm:w-6 lg:w-[max(88px,calc((100vw-1440px)/2+88px))]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
