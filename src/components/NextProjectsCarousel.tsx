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
      {/* Prev/next controls, flush to the left edge of the container
          (not indented to match the card row below) */}
      <div className="flex items-center gap-3 pb-6">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous project"
          className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-border-hairline text-text-primary !transition-[border-radius,border-color,background-color,color] !duration-300 !ease-in-out hover:rounded-[3px] hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary"
        >
          <ArrowIcon className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next project"
          className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-border-hairline text-text-primary !transition-[border-radius,border-color,background-color,color] !duration-300 !ease-in-out hover:rounded-[3px] hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary"
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
            // Mobile width matches Home's Featured Projects card size
            // exactly: Home's card fills its Grid cell at full content
            // width (100vw minus Grid's 20px side margins, since it's
            // grid-cols-1 there). This row isn't inside <Grid>, so that
            // same width is reproduced directly with calc().
            className="w-[calc(100vw-40px)] shrink-0 snap-start sm:w-[405.5px]"
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
