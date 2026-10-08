"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./Icons";
import type { ProjectCategory, ProjectWidgetData } from "./ProjectWidget";

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

// Controls on hover-capable devices fade in with the widget's hover or
// keyboard focus. `!` on the transition utilities is required: globals.css
// has an unlayered `body, body * { transition: ... }` rule that otherwise
// beats Tailwind's layered utilities (same reason as ProjectWidget/Button).
const REVEAL =
  "opacity-0 !transition-opacity !duration-200 group-hover/card:opacity-100 group-focus-within/card:opacity-100";

const ARROW_BUTTON =
  "absolute z-10 grid place-items-center rounded-full bg-surface-bg text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:invisible";

const SWIPE_THRESHOLD = 40;

// Projects without [SCREEN-n] tags get this many empty phone frames in
// place of real screens, so the slider (dots, arrows, swipe) works and
// the card has its intended proportions until the real screens exist.
const DEFAULT_SCREEN_COUNT = 4;

function Dots({
  count,
  index,
  onSelect,
  className,
  style,
}: {
  count: number;
  index: number;
  onSelect: (i: number) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    // Each dot is 8px; the button's 2px padding widens the tap target
    // without changing the 4px visual gap between dots.
    <div className={className} style={style}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
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
  );
}

export default function ProjectWidgetV2({
  project,
  hideMeta = false,
}: {
  project: ProjectWidgetData;
  /** Hides the logo/name/one-liner row below the card, same as
   *  ProjectWidget's `hideMeta` (used by the case-study page's "Next
   *  Project" list). */
  hideMeta?: boolean;
}) {
  // Real screens when the project has [SCREEN-n] tags, otherwise empty
  // phone frames (null). THUMBNAIL-1/2 are ProjectWidget v1's two-layer
  // cover images and aren't suited to a portrait screen slot, so they're
  // deliberately not used here.
  const screens: (string | null)[] = project.screens?.length
    ? project.screens
    : Array.from({ length: DEFAULT_SCREEN_COUNT }, () => null);
  const count = screens.length;
  const last = count - 1;

  const [index, setIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);

  const go = (next: number) => setIndex(Math.min(Math.max(next, 0), last));

  const categories = project.caseStudyCategories ?? [project.category];
  const displayTags = CATEGORY_ORDER.filter((c) => categories.includes(c)).map((c) => CATEGORY_PILL[c]);

  // Arrows scale down with the card but never below a tappable size.
  const arrowSize = "clamp(28px, 9.73cqw, 40px)";
  const arrowInset = "clamp(8px, 5.84cqw, 24px)";

  return (
    // Hovering anywhere on the widget (card or meta row) reveals the
    // controls, matching ProjectWidget, whose hover animation also
    // triggers from the whole link.
    <div className="group/card relative flex w-full flex-col gap-4 [container-type:inline-size]">
      <div
        className="relative aspect-[411/641] w-full touch-pan-y overflow-hidden bg-surface-bg-alt"
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
              key={i}
              className="relative h-full w-full shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              {/* Phone frame (Figma "List of counsellors"): 245x529.7 of
                  the 411x641 card, centered, with a 5.671px #131314
                  bezel, 28.357px radius and a soft drop shadow. The bezel
                  is drawn here, so screen images should be raw exports
                  without their own device frame. With no screen supplied
                  the frame is simply empty (white). */}
              <div
                className="absolute left-1/2 top-1/2 w-[59.61%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border-solid border-[#131314] bg-white shadow-[0px_13.611px_24.954px_0px_rgba(0,0,0,0.25)]"
                style={{
                  aspectRatio: "245.001 / 529.7",
                  borderWidth: cqw(5.671),
                  borderRadius: cqw(28.357),
                }}
              >
                {src && (
                  <Image
                    src={src}
                    alt={`${project.name} screen ${i + 1} of ${count}`}
                    fill
                    sizes="(min-width: 640px) 260px, 60vw"
                    loading={i <= 1 ? "eager" : "lazy"}
                    className="object-cover object-top"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

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

        {/* Touch devices: no hover, so just the dots, inside the card at
            the bottom, centered in the gap under the phone frame. Swipe
            also works. Hidden entirely on hover-capable devices. */}
        {count > 1 && (
          <Dots
            count={count}
            index={index}
            onSelect={go}
            className="absolute left-1/2 z-10 flex -translate-x-1/2 [@media(hover:hover)]:hidden"
            style={{ bottom: "calc(3.4% - 2px)" }}
          />
        )}

        {/* Hover controls — only on devices that can hover (the Figma
            hover state): dots top-right and prev/next arrows. Touch
            devices get the dots at the bottom of the card instead,
            above. */}
        {count > 1 && (
          <div className="hidden [@media(hover:hover)]:block">
            <Dots
              count={count}
              index={index}
              onSelect={go}
              className={`absolute z-10 flex ${REVEAL}`}
              style={{ right: "calc(8.03% - 2px)", top: "calc(4.06% - 2px)" }}
            />

            {/* Next — right edge, 40px circle. */}
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

            {/* Previous — mirror of Next, hidden on the first screen (the
                Figma hover state shows Next only, on the first screen). */}
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
          </div>
        )}
      </div>

      {/* project_meta — identical to ProjectWidget's. */}
      {!hideMeta && (
        <div className="flex h-[47px] items-center gap-2">
          <div className="relative size-[39px] shrink-0 overflow-hidden rounded-csq">
            <Image
              src={project.logo ?? "/folder-assets/folder_image1.png"}
              alt=""
              fill
              className="rounded-md object-cover"
              sizes="39px"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center overflow-hidden">
            <p className="text-body-reg-strong truncate">{project.name}</p>
            <p className="text-body-sm-base truncate text-text-body">{project.oneLiner}</p>
          </div>
        </div>
      )}

      {/* Whole-widget link (stretched-link pattern) so the slider buttons
          aren't nested inside an anchor. Sits under the controls (z-10). */}
      <Link href={`/work/${project.slug}`} className="absolute inset-0 z-[1]">
        <span className="sr-only">{project.name}</span>
      </Link>
    </div>
  );
}
