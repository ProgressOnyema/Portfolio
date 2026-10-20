"use client";

import { useRef } from "react";
import type { ProjectWidgetData } from "./ProjectWidget";
import ProjectWidgetV2 from "./ProjectWidgetV2";
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
    // No horizontal padding on this wrapper on purpose: the scroll row
    // below must span the full viewport width so cards slide off the
    // actual screen edge. (The left inset used to live here, which
    // shrank the scroll box and clipped cards at the inset, 88px in from
    // the edge, instead of at the viewport.) The inset now sits inside
    // the scroll row as padding, and the arrow row sets its own right
    // inset since it doesn't bleed.
    <div className="pt-24 sm:pt-32">
      {/* Prev/next controls, right-aligned. Right inset matches Grid's
          own right margin. */}
      <div className="flex items-center justify-end gap-3 pb-6 pr-5 sm:pr-6 lg:pr-[max(88px,calc((100vw-1440px)/2+88px))]">
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
          cropped at the page's own column width. The scroll box is the
          full viewport width; Grid's left inset is padding *inside* it
          (pl-*), so at rest the first card lines up with the page and
          while scrolling cards slide off the true screen edge.
          scroll-pl-5 keeps the mobile snap point at that same inset.
          No right padding, so scrolling runs to the actual viewport
          edge; the trailing spacer gives the last card breathing room
          on the way out. hideMeta drops the logo/name/one-liner row —
          the tag pills already carry the category, and clicking through
          is the point, not reading a second description here. */}
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory scroll-pl-5 gap-6 overflow-x-auto pb-2 pl-5 sm:snap-none sm:pl-6 lg:pl-[max(88px,calc((100vw-1440px)/2+88px))]"
      >
        {projects.map((project) => (
          <div
            key={project.slug}
            data-carousel-card
            // Mobile width leaves a peek of the next card: 100vw minus
            // the 20px left inset, the 24px gap and a 48px peek
            // (20 + 24 + 48 = 92), so a sliver of the next project shows
            // beside the main one and invites a swipe. From sm up the
            // card is a fixed 405.5px, and the next card naturally shows
            // as a peek at the right edge (whatever doesn't fit).
            className="w-[calc(100vw-92px)] shrink-0 snap-start sm:w-[405.5px]"
          >
            {/* swipe off: the row itself scrolls horizontally by touch, so
                the card must not claim that gesture (see ProjectWidgetV2). */}
            <ProjectWidgetV2 project={project} hideMeta swipe={false} />
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
