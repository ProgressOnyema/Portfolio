"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./Icons";
import type { ProjectCategory } from "./ProjectWidget";

export type ProjectWidgetV2Data = {
  slug: string;
  name: string;
  category: ProjectCategory;
  /** Same meaning as on ProjectWidgetData: every category a merged
   *  multi-case-study card represents, so all of its tag pills show. */
  caseStudyCategories?: ProjectCategory[];
  /** The UI screens that slide inside the card, in slide order (the Figma
   *  design has four). Use raw screen exports — the phone bezel is drawn
   *  here, so images shouldn't carry their own frame. */
  screens: string[];
};

// Same tag logic as ProjectWidget.tsx (not exported there, so mirrored
// here): pills come strictly from category, ordered UX/UI, BRAND, /DEV.
const CATEGORY_ORDER: ProjectCategory[] = ["Product Design", "Branding", "Development"];
const CATEGORY_PILL: Record<ProjectCategory, string> = {
  "Product Design": "UX/UI",
  Branding: "BRAND",
  Development: "/DEV",
};

// Figma ProjectWidget_v2 (node 280:2150) is a 411x641 card. Everything
// inside it is positioned in percentages / container-query units of that
// width, so the card scales with its grid column the same way
// ProjectWidget's folder does.
const CARD_W = 411;
const cqw = (px: number) => `calc(100cqw * ${px / CARD_W})`;

// Hover-only controls fade in with the card's hover or keyboard focus.
// `!` on the transition utilities is required: globals.css has an
// unlayered `body, body * { transition: ... }` rule that otherwise beats
// Tailwind's layered utilities (same reason as ProjectWidget/Button).
// On touch devices there is no hover, so controls stay visible.
const REVEAL =
  "opacity-0 !transition-opacity !duration-200 group-hover/card:opacity-100 group-focus-within/card:opacity-100 [@media(hover:none)]:opacity-100";

const ARROW_BUTTON =
  "absolute z-10 grid place-items-center rounded-full bg-surface-bg text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:invisible";

const SWIPE_THRESHOLD = 40;

export default function ProjectWidgetV2({ project }: { project: ProjectWidgetV2Data }) {
  const { screens } = project;
  const count = screens.length;
  const last = count - 1;

  const [index, setIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.min(Math.max(next, 0), last));

  const categories = project.caseStudyCategories ?? [project.category];
  const displayTags = CATEGORY_ORDER.filter((c) => categories.includes(c)).map((c) => CATEGORY_PILL[c]);

  // Controls scale down with the card but never below a tappable size.
  const arrowSize = "clamp(28px, 9.73cqw, 40px)";
  const arrowInset = "clamp(8px, 5.84cqw, 24px)";

  return (
    // The container wrapper exists so the card itself can use cqw units
    // (a container's own query units resolve against its ancestors).
    <div className="w-full [container-type:inline-size]">
      <div
        className="group/card relative aspect-[411/641] w-full touch-pan-y overflow-hidden bg-surface-bg-alt"
        style={{ borderRadius: cqw(30) }}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${project.name} screens`}
        onPointerDown={(e) => {
          if (e.pointerType === "touch") swipeStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeStartX.current === null) return;
          const dx = e.clientX - swipeStartX.current;
          swipeStartX.current = null;
          if (Math.abs(dx) > SWIPE_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          swipeStartX.current = null;
        }}
      >
        {/* Sliding track: one full-card-wide slide per screen. */}
        <div
          className="absolute inset-0 flex !transition-transform !duration-500 !ease-in-out motion-reduce:!transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {screens.map((src, i) => (
            <div
              key={src}
              className="relative h-full w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              {/* Phone frame: 245x529.7 with a 5.671px #131314 border,
                  28.357px radius and a soft drop shadow (Figma
                  "List of counsellors"). */}
              <div
                className="absolute left-1/2 top-1/2 w-[59.61%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border-solid border-[#131314] bg-white shadow-[0px_13.611px_24.954px_0px_rgba(0,0,0,0.25)]"
                style={{
                  aspectRatio: "245.001 / 529.7",
                  borderWidth: cqw(5.671),
                  borderRadius: cqw(28.357),
                }}
              >
                <Image
                  src={src}
                  alt={`${project.name} screen ${i + 1} of ${count}`}
                  fill
                  sizes="(min-width: 640px) 260px, 60vw"
                  loading={i <= 1 ? "eager" : "lazy"}
                  className="object-cover object-top"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Whole-card link (stretched-link pattern) so the slider buttons
            below aren't nested inside an anchor. */}
        <Link href={`/work/${project.slug}`} className="absolute inset-0 z-[1]">
          <span className="sr-only">{project.name}</span>
        </Link>

        {/* Tags — top-left, 24px / 20px in the 411x641 frame. */}
        <div
          className="pointer-events-none absolute z-[2] flex gap-1"
          style={{ left: "5.84%", top: "3.12%" }}
        >
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="text-label rounded-[5px] bg-surface-bg px-2 py-1 text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        {count > 1 && (
          <>
            {/* Pagination dots — top-right, aligned with the tags. Each
                dot is 8px; the button's padding widens the tap target
                without changing the 4px visual gap. */}
            <div
              className={`absolute z-10 flex ${REVEAL}`}
              style={{ right: "calc(8.03% - 2px)", top: "calc(4.06% - 2px)" }}
            >
              {screens.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show screen ${i + 1} of ${count}`}
                  aria-current={i === index}
                  className="p-[2px] focus-visible:outline-2 focus-visible:outline-text-primary"
                >
                  <span
                    className={`block size-2 rounded-full !transition-colors ${
                      i === index ? "bg-text-primary" : "bg-text-muted/60"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Next — right edge, 40px circle, shown on hover. */}
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === last}
              aria-label="Next screen"
              className={`${ARROW_BUTTON} ${REVEAL}`}
              style={{ right: arrowInset, top: "49.15%", width: arrowSize, height: arrowSize }}
            >
              <ArrowIcon />
            </button>

            {/* Previous — mirror of Next; only present once there's a
                previous screen (the Figma hover state shows Next only,
                on the first screen). */}
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous screen"
              className={`${ARROW_BUTTON} ${REVEAL}`}
              style={{ left: arrowInset, top: "49.15%", width: arrowSize, height: arrowSize }}
            >
              <ArrowIcon className="rotate-180" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
