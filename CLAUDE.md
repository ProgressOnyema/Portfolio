@AGENTS.md

# Project context for agents

This file exists so any agent (Claude Code or otherwise) picking up this
repo can get oriented quickly without re-deriving decisions made across a
long build history. Read this before making changes. Where this doc gives
a value that might drift (colors, sizes), the source file is the ground
truth — this doc tells you which file and why it's shaped that way.

## What this is

A personal portfolio site for a product/brand designer (Onyema Miracle).
Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React 19. Built by
translating a Figma design into code, component-by-component, then
composing pages from those components — not by scaffolding pages first.

## Figma source

File: `https://www.figma.com/design/Pkqy6d7PGhiWdyyifOrChv/Website`

**The file has three canvases and they are not interchangeable:**

- **Wireframe** — early rough drafts. Mostly superseded, don't trust it.
- **Hi-fi** (node `47:2`) — the authoritative, fully-composed design using
real component instances. This is what pages should match. Key frames:
Home desktop `67:75`, Home mobile `157:473`, About `67:133`, Work/
Project_list `67:239`, Project_detail `67:301`.
- **Components** (node `67:317`) — the actual component library (Navbar,
Btn, Link, ListItem, ProjectWidget, Subnav, ExperienceDesc, MobileNav,
Icons, etc.). Always check this page for a component before hand-
rolling markup — several early mistakes in this build came from not
knowing this page existed and re-deriving styles from a page frame
instead of the canonical component.

**Important: the design has changed multiple times during this build.**
Home, About, and Work were each significantly restructured more than once
after initial implementation (e.g. About lost its entire Experience/
Certifications section; Home gained a hero tag row and grew from 3 to 6
featured projects; ProjectWidgetLg's width changed from 386px to
405.5px). **Never assume a past fetch is still current — re-fetch via the
Figma MCP tools before implementing or trusting old assumptions,
including the ones in this document.**

`Project_detail` (`67:301`) has never had real content designed in
Figma — it's just a title + Subnav + one empty placeholder frame. The
case study block system (below) was designed independently to fill that
gap, not extracted from a Figma spec.

## Design tokens — `src/app/globals.css`

Color tokens are CSS variables, dark theme in `:root`, light theme under
`[data-theme="light"]`, both mapped into Tailwind via `@theme inline` (so
`bg-surface-bg`, `text-text-muted`, etc. are real Tailwind utilities, not
arbitrary values). **Both themes' colors are real values pulled from the
Figma file's own variable definitions** (found by inspecting light-mode
component instances), not estimated equivalents.

**`text-body`** (`--color-text-body`, light `#3c3c3c` / dark `#d8d8d8`)
is the one exception — it has no Figma variable behind it. Added per
direct instruction as a third text color, alongside (not replacing)
`text-primary`/`text-muted`: `text-primary` reads too
stark/high-contrast for running body copy at that size, and `text-muted`
is too desaturated/grey. The dark-mode value isn't a mirrored hex — it's
derived to sit at the same *relative position* between `text-primary`
and `text-muted` as `#3c3c3c` does in light mode (roughly 48% of the way
from primary toward muted in HSL lightness; within half a point of that
same fraction in contrast-ratio terms too — light: 10.75:1 vs primary's
17.78 and muted's 5.39; dark: 12.8:1 vs primary's 17.78 and muted's
8.83) — a straight mirror doesn't work here since `text-primary` and
`text-muted` themselves aren't mirrored between the two themes either
(confirmed against this file's own values: muted sits at 40% lightness
in light mode but 70% in dark, not the ~60% a mirror would give).
Applied to actual content copy — `RichText.tsx`'s default paragraph
color (so a plain `text` block's body and `mediaText`'s body pick it up
for free), `MetaBlock` field values, `StatRow`/`Quote` labels, image
captions (`ImageGrid`/`MarqueeGrid`), `ProjectWidget`'s one-liner, and
the footer copyright line. Left alone: headings, hero taglines and any
other heading-scale (`text-h3`+) text, and UI chrome where
`text-muted`/`text-primary` signal interactive state (nav links, Subnav
tabs, ThemeToggle, tag pills) rather than content — those keep their
existing colors.

Typography is a set of plain CSS classes (`.text-h1-bold`, `.text-h3`,
etc.) rather than Tailwind's default type scale, since the design uses a
fixed named scale (Figma text styles) instead of arbitrary sizes. There's
a mobile override block (`max-width: 640px`) for `.text-h3`/`.text-h3-bold`
specifically — on mobile these swap to the *Body Large Base/Strong*
metrics (a different named Figma style), not a scaled-down H3. This was
confirmed against the real mobile frame, not guessed. H1 does **not**
scale down on mobile (confirmed: stays 48px). `.text-project-oneliner`
(the Project Detail page's subtitle) is its own token for the same
reason as `.text-subnav` below — it shares `.text-h3`'s desktop metrics
but drops further, to *Body Regular/Base* (16px), on mobile, which
`.text-h3` itself doesn't do.

Font: Inter, loaded via a `<link>` tag in `layout.tsx`, not `next/font`.
This was a build-environment workaround (the original dev sandbox
couldn't reach Google Fonts at build time) but works identically in any
real environment — no need to change it, though switching to
`next/font/google` for self-hosting is a fine one-line swap if wanted.

## Theme system

Dark is the default/native theme; light is toggled via a `data-theme`
attribute on `<html>`.

- `src/components/ThemeInitScript.tsx` — inline `<script>` in `<head>`
that sets `data-theme` from `localStorage` before hydration, avoiding a
flash of the wrong theme.
- `src/lib/theme.ts` — a shared subscribe/getSnapshot store (module-level
`Set` of listeners + a `setTheme()` that mutates the DOM attribute and
notifies listeners).
- `src/components/ThemeToggle.tsx` — reads the store via
`**useSyncExternalStore`**, not `useState`+`useEffect`. This is
deliberate: the effect-based version caused a React "cascading renders"
warning (setting state right after mount forces an extra render pass on
top of hydration). `useSyncExternalStore` is the correct tool for
external mutable state like a DOM attribute and also keeps multiple
toggle instances (desktop nav + mobile dropdown) in sync for free.
Styled as a plain nav item (muted text, hover to primary) — explicitly
*not* a bordered button, per direct instruction.

## Layout system — `src/components/Grid.tsx`

The standard layout primitive every page section should use instead of
ad-hoc `flex` + `justify-center` centering (an earlier approach that had
real bugs — see "Known deviations" below).

- 4 columns / 16px gutter below the `sm` breakpoint (640px)
- 12 columns / 24px gutter at `sm` and up
- 24px side margin at `sm`, **88px at `lg*`* (1024px+)

**The 88px margin is a deliberate deviation from Figma's 96px**, per
explicit instruction — don't "fix" it back to 96 without checking with
the person first.

`Grid` takes an optional `gap` prop to override the default gutter for a
specific section (e.g. Home's Featured Projects uses a tighter gap than
the page default).

## Component library — `src/components/`

All pulled from the Figma Components page unless noted:

- `**Navbar` + `NavItem`** — fixed to the top (`position: fixed`). Desktop
links are right-aligned (not centered — an explicit later change).
Labels: Home, **Me** (routes to `/about` — relabeled from "About"),
Work, Contact (`mailto:`, not a NavItem). `ThemeToggle` sits inline in
the same link row, not positioned separately. The header's
translucent + blurred surface (`bg-surface-bg/80 backdrop-blur-lg`) is
active at every breakpoint, per direct instruction — it used to switch
to a solid `bg-surface-bg` with no blur at `sm+` (blur was mobile-only,
matching the git history's "Add a subtle backdrop blur to the mobile
navbar"), but that distinction has been removed; don't reintroduce it
without checking first. Mobile: a real hamburger icon (`MobileNavIcon`,
pulled from a Figma component that was added mid-build — don't
hand-roll this) that toggles a dropdown. **Deviates from Figma's
`MobileNavCollasped`** (which shows the same hamburger in the open
state) **per direct instruction**: the icon swaps to a `CloseIcon` (X,
in `Icons.tsx`) while open, and a fixed full-page overlay (`bg-black/50`,
`z-40`, sits under the header's `z-50`) renders behind the dropdown,
dimming the rest of the page and closing the menu on click.
- `**Button.tsx`** — `ButtonPrimary` and `ButtonSocial`. Real hover
states from Figma (e.g. `ButtonSocial` literally shrinks 79×69 →
59.25×51.75 on hover, not just a color change).
- `**Link.tsx**` (`AppLink`) — `view-work` / `open-resume` / `email`
variants. The Figma source's ImageLeft/ImageRight hover states appear
to have a variant-wiring bug (hover renders the wrong content type) —
implemented consistent behavior (hover just mutes the color) instead of
replicating that.
- `**Subnav.tsx**` — **this is an interactive tab component, not a
breadcrumb.** Clicking a category (Product Design / Branding /
Development) filters the visible projects. `onSelect` is optional —
when omitted (tab mode, used on the project detail page), it renders as
read-only links via `hrefs` instead of a filter, and **only shows the
categories a project actually has a case study for** — a
single-case-study project shows just its own category, not the other
two grayed out. `onSelect` mode (`/work`) always shows all three, since
it's filtering across every project rather than describing one
project's own categories.
- `**ListItem.tsx`** — Short/Small/Long width variants x active/inactive
background state.
- `**ExperienceDesc.tsx**` — not currently used anywhere (About's
Experience section was removed from the design), but built and kept in
case it returns.
- `**ProjectWidget.tsx**` — the project "folder" card. Sizes: `default`
(347px), `lg` (405.5px — **not 386px**, a spec correction applied late
in the build), `full` (fills its grid column, used on Home). Internally
it's a real layered illustration: `FolderBackIcon` + two overlapping
"paint texture" images + `FolderCoverIcon`, all positioned by
percentage so the layout scales across sizes. `**folder_back` and
`folder_cover` are theme-aware inline SVG components** bound to
`surface-bg-alt` via `currentColor` (their fill was originally assumed
to be a static color; it's actually the theme token, so they invert
with dark/light mode) — not static `<img>` assets. Supports optional
per-project overrides: `thumbnails: [string, string]` (two real images
in the same two-layer position — **not one flat image**, matches the
placeholder's two-layer arrangement) and `logo` (the small 39x39 image
next to the name). Development-category projects automatically get a
third tag chip, `"DEV"`, derived from `category` rather than requiring
it in each project's `tags` array. `hideMeta` (default `false`) hides
the logo/name/one-liner row below the folder artwork — used by the
case-study page's "Next Project" list.
- `**Icons.tsx`** — every icon (LinkedIn, Behance, arrow/chevron,
document/PDF, hamburger, close/X, dark/light mode) is inlined as a React
component with `fill="currentColor"`, not referenced via `<img src>`.
This is deliberate: an externally-loaded SVG can't inherit `currentColor`
from the page, which breaks theme/hover adaptation. The original Figma
assets were hardcoded to specific hex colors (that happened to match
one theme's token value) and were patched to `currentColor` before
being inlined. `CloseIcon` is the exception — it has no Figma source
(added directly for the mobile nav's open state) and uses `stroke`
rather than `fill`. `EafcIcon.tsx` is separate (too complex to retype as
clean JSX) — it stores the raw SVG markup as a string and renders via
`dangerouslySetInnerHTML`.
- `**ContactSection.tsx**` — shared between Home and About (identical
pattern in Figma), rather than duplicated. Also doubles as the site's
footer — since it renders at the bottom of every page — and now carries
a `© {year} Onyema Miracle. All rights reserved.` line beneath the main
contact content (`.text-label`, `text-text-muted`). There's no separate
`Footer.tsx`; this is deliberate rather than a gap.
- `**WorkGrid.tsx**` — client component owning the Subnav tab state and
the filtered project grid together, since they need to share state
across what would otherwise be two separate page sections.

## Pages

- `**/**` (Home) — Hero (with a hero tag row: Strategy, Brand Design,
UX/UI Design, Interaction, Frontend Development), Featured Projects (6
widgets, `size="full"`, tighter gap than the page default — **a
deliberate deviation from Figma's fixed-width `lg` cards**, to be
ported back into the Figma file once confirmed), stats/credentials
(`ListItem` short/long columns), `ContactSection`.
- `**/about`** — Bio, then one flowing paragraph mixing text and inline
icon images ("Fun Facts" — no heading, just prose; see below), Skills
tags (now inline in the hero section, not a separate block — moved
there directly by the project owner), `ContactSection`. No Experience
or Certifications section (removed from the design).
- `**/work**` — heading, `WorkGrid` (Subnav tabs + filtered
`ProjectWidget` grid, `size="lg"`), `ContactSection`.
- `**/work/[slug]**` — case study detail page. Statically generated via
`generateStaticParams` from `src/lib/data/projects.ts`. Real 404 via
`notFound()` for unknown slugs. Ends with a "Next Project" list before
`ContactSection`: every *other* project (`getOtherProjects()` in
`src/lib/data/projects.ts` — same one-card-per-project order as
`getFeaturedProjects()`, current project filtered out; renders nothing
for a single-project site), in `ProjectWidget`s with `hideMeta` set
(hides the logo/name/one-liner row — the tag pills already carry the
category, and clicking through is the point). **No heading** and
**genuinely full-bleed**, both per direct instruction: this section
does not sit inside `<Grid>` (which caps at `max-w-1440` and centers),
so the row can scroll edge-to-edge instead of being cropped at the
page's own column width. Left padding matches `Grid`'s *effective* left
inset, not just its raw `88px` gutter at `lg`: `lg:pl-[max(88px,
calc((100vw-1440px)/2+88px))]` — the same value `Grid` itself arrives
at once `mx-auto` starts centering its `max-w-1440` box on screens
wider than 1440px, so the first card lines up with the rest of the page
at *any* width, not just below the 1440px cap (a plain `lg:pl-[88px]`
would drift out of alignment on wide monitors). No right padding, so
scrolling runs to the actual viewport edge, and the row ends with a
spacer div using that same `max()`/`calc()` value so the last card gets
equivalent breathing room on the way out. It also carries
`.no-scrollbar` (a small utility in `globals.css`) so the row stays
scrollable — drag, trackpad, touch swipe — without showing the
browser's own scrollbar chrome. No Figma frame exists for this section
(see "Project_detail has never had real content designed in Figma"
above) — it was designed independently, same as the rest of the
case-study block system.

**About's "Fun Facts" paragraph** (`src/app/about/page.tsx`) is built as
one real `<p>` with inline-block images mixed directly into the text
flow, not separate flex-wrapped blocks — the earlier flex-block version
looked "scattered" because each phrase/icon-group wrapped as its own
rigid unit instead of reflowing like real prose. If you need to touch
this section, keep it as inline content, not flex items.

## Case study block system

Since Figma has no real Project_detail design, case studies are built
from a block schema designed independently (types in
`src/lib/types/caseStudy.ts`, components in `src/components/case-study/`).

**11 block types:** `text` (rich — `body` is `Paragraph[]`, each paragraph
an array of spans that are either plain strings or `{ text, emphasis }`
for italics), `imageGrid`, `marqueeGrid`, `meta` (label/value pairs,
e.g. Industry/What I did/Platform), `grid` (generic layout wrapper —
arranges any other blocks, including nested grids, into N columns; this
is what lets a `meta` block sit beside a `text` block instead of
stacking), `mediaText` (image + heading + body as one unit), `video`,
`stats`, `coverImage`, `quote` (testimonial with attribution — distinct
from `text`'s `pullQuote` variant, which is just your own emphasized
text), `cta`.

`BlockRenderer.tsx` exports a `renderBlock()` dispatch function used both
by itself (top-level list) and by `GridBlock.tsx` (nested items) — the two
files import from each other. **This is intentional and safe** (a
standard recursive-tree-renderer pattern); it works because both modules
only reference each other's exports at render time, not at module-eval
time. Don't "fix" this into a single file without reason.

`BlockRenderer`'s own top-level `.map()` (not `renderBlock()` itself)
wraps a `text` block in `sm:mx-auto sm:w-3/4`, per direct instruction —
prose reads better narrower and centered on wide screens; every other
block type keeps the full column width. This is deliberately scoped to
the top-level map rather than into `TextBlock.tsx` itself, so a `text`
block nested inside a `grid` block (see the meta+text pairing above —
`GridBlock.tsx` calls `renderBlock()` directly, bypassing this wrapper)
still fills its own grid column instead of shrinking further.

**`coverImage`** — full-bleed on mobile only, per direct instruction: a
negative margin + extra width (`-mx-5 w-[calc(100%+2.5rem)]`, reverting
to `mx-0 w-full` at `sm+`) cancels out `Grid`'s own `px-5` mobile gutter
so the image touches both screen edges below `sm`. Rounded corners are
`sm:rounded-md` only, for the same reason — rounding a full-bleed edge
would look wrong. `coverImage` is always a top-level block in the real
content (never nested inside a `grid` block's columns), so this doesn't
fight with any column layout.

**`imageGrid`** (`ImageGrid.tsx`) — the classic static layout: a real
CSS grid, `grid-cols-1` on mobile regardless of `columns`, then the
requested column count (1/2/3) at `sm+`. This is the block the
`[IMAGE-GRID]` content tag produces (`scripts/parse-case-study.mjs`) —
**don't repoint that tag at the marquee**; `[MARQUEE-GRID]` is the tag
for that (see `content/README.md`). `imageGrid`/`imageGridStatic` were
swapped back and forth once already during development — if older
commit messages or comments mention "imageGrid is the marquee," they
predate this naming and are wrong; `imageGrid` = static, `marqueeGrid` =
marquee, full stop.

**`marqueeGrid`** (`MarqueeGrid.tsx`) — continuously auto-scrolling
horizontal marquee at every breakpoint (`.animate-marquee` in
`globals.css`, paused on hover via
`hover:[animation-play-state:paused]`), with large images (360px
mobile / 480px `sm+`) that scroll genuinely edge-to-edge on any
viewport — not just to the edge of `Grid`'s own `max-w-1440` column.
That needs the standard "break out of a centered container" trick
(`relative left-1/2 right-1/2 mx-[-50vw] w-screen`), not a plain
negative margin sized to `Grid`'s padding — a plain negative margin
only cancels the local gutter and would still stop at the 1440 cap on
wide screens. `block.columns` (`1 | 2 | 3`) exists only for
type/tag-argument parity with `ImageGridBlock` — it's intentionally
unused by the component itself; there's no column count in a marquee.
The image list renders twice back-to-back so the CSS animation can loop
seamlessly at `-50%` `translateX` instead of snapping back to the
start; the second copy is `aria-hidden` with empty `alt` so screen
readers don't announce every image twice.

## Content authoring pipeline

Real case studies are **not** hand-written as TypeScript — they're
authored as tagged plain-text files and parsed into JSON:

1. Write `content/<slug>.txt` using the tag syntax in `content/README.md`
  (full grammar reference — read it before writing a new case study).
2. Put real images in `public/case-studies/<slug>/`.
3. `scripts/parse-case-study.mjs` (a hand-written recursive-descent
  parser, no dependencies) turns the `.txt` into
   `src/lib/data/case-studies/<slug>.json`.
4. `scripts/parse-all-case-studies.mjs` batch-runs the parser over every
  `.txt` in `content/`, wired as `predev`/`prebuild` npm hooks — JSON
   regenerates automatically, editing the `.txt` is the only manual step.
5. `src/lib/data/projects.ts` loads every JSON file in
  `src/lib/data/case-studies/` at build time (via `fs`, safe because this
   only runs in server/build context) and merges it into the placeholder
   project list — a matching `slug` overrides a placeholder, a new slug
   gets appended.

`content/buy-and-bite.txt` is a real working example (transcribed from a
reference screenshot, verified end-to-end: parses, builds, and renders
correctly at `/work/buy-and-bite`) — use it as a template.

The parser warns (doesn't fail the build) about any referenced image path
that doesn't exist yet under `public/`.

## Known deviations from Figma (intentional — don't "fix" without asking)

- 88px wide-screen margin instead of Figma's 96px.
- Mobile nav icon swaps hamburger → X (`CloseIcon`) when open, plus a
dark full-page overlay behind the dropdown — Figma's
`MobileNavCollasped` keeps the hamburger icon in both states and has no
overlay. Per direct instruction; don't revert to match Figma.
- Navbar's translucent/blurred surface is active at every breakpoint —
it was originally mobile-only (solid `bg-surface-bg`, no blur, at
`sm+`). Per direct instruction; don't reintroduce the desktop-solid
fallback without checking first.
- Home's Featured Projects widgets use `size="full"` with a tight 12px/
16px gap, filling the grid row edge-to-edge — Figma currently shows
fixed-width `lg` cards there. Figma is meant to be updated to match
this once confirmed, not the other way around.
- `folder_image1.png`/`folder_image2.png` (the placeholder paint-texture
illustration) are generic assets, not exported from Figma per se —
the real illustrated artwork couldn't be downloaded from Figma's
temporary asset URLs in the original build sandbox. Icons *were*
eventually supplied as real exports and are wired in correctly; the
folder illustration textures were not.

## Known gaps / not-yet-done

- Only one real case study exists (`buy-and-bite`); the other 6 projects
in `src/lib/data/projects.ts` are full placeholders (name, one-liner,
tags, blocks — all generic).
- The placeholder `video` block references a path with no real video file
behind it — renders structurally fine, just won't play anything.
- Vercel has not been connected — deployment is explicitly on hold per
direct instruction ("we are still building"). Pushing to GitHub does
not currently put anything live.
- About's Fun Facts text size on mobile (scales H1 down to H2 size) is an
own-judgment call — no mobile Figma frame exists for that section to
confirm against.
- About's Skills section grid position (`col-start-4`/`span-8`) is an
approximation — Figma's pixel offset for that section doesn't map
cleanly onto the 12-column grid.

## Git workflow notes

Repo: `https://github.com/ProgressOnyema/Portfolio`. The project owner
also edits and pushes directly to `main` sometimes (not just this agent),
so **always pull before pushing** and expect occasional non-fast-forward
rejections — rebase, don't force-push. Commit messages in this repo's
history are written to explain *why*, especially for anything in the
"deviations" list above — read recent `git log` before assuming current
behavior is a bug.

## Environment quirks worth knowing

- Figma MCP tools sometimes need a literal fresh fetch — cached
`get_variable_defs`/`get_design_context` results can lag behind very
recent Figma edits by a short window.
- `get_metadata`/`get_variable_defs` on some canvas-level or Components-
page node IDs can fail with "nothing selected" — this means the tool
wants a live Figma desktop app selection; retry with a specific child
frame's node ID instead of the canvas root.