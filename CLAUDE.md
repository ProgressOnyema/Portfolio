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

Typography is a set of plain CSS classes (`.text-h1-bold`, `.text-h3`,
etc.) rather than Tailwind's default type scale, since the design uses a
fixed named scale (Figma text styles) instead of arbitrary sizes. There's
a mobile override block (`max-width: 640px`) for `.text-h3`/`.text-h3-bold`
specifically — on mobile these swap to the *Body Large Base/Strong*
metrics (a different named Figma style), not a scaled-down H3. This was
confirmed against the real mobile frame, not guessed. H1 does **not**
scale down on mobile (confirmed: stays 48px).

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
the same link row, not positioned separately. Mobile: a real hamburger
icon (`MobileNavIcon`, pulled from a Figma component that was added
mid-build — don't hand-roll this) that toggles a dropdown.
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
when omitted, it renders as read-only text (used on the project detail
page, where it shouldn't act as a filter).
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
it in each project's `tags` array.
- `**Icons.tsx`** — every icon (LinkedIn, Behance, arrow/chevron,
document/PDF, hamburger, dark/light mode) is inlined as a React
component with `fill="currentColor"`, not referenced via `<img src>`.
This is deliberate: an externally-loaded SVG can't inherit `currentColor`
from the page, which breaks theme/hover adaptation. The original Figma
assets were hardcoded to specific hex colors (that happened to match
one theme's token value) and were patched to `currentColor` before
being inlined. `EafcIcon.tsx` is separate (too complex to retype as
clean JSX) — it stores the raw SVG markup as a string and renders via
`dangerouslySetInnerHTML`.
- `**ContactSection.tsx**` — shared between Home and About (identical
pattern in Figma), rather than duplicated.
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
`notFound()` for unknown slugs.

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

**10 block types:** `text` (rich — `body` is `Paragraph[]`, each paragraph
an array of spans that are either plain strings or `{ text, emphasis }`
for italics), `imageGrid`, `meta` (label/value pairs, e.g. Industry/What I
did/Platform), `grid` (generic layout wrapper — arranges any other blocks,
including nested grids, into N columns; this is what lets a `meta` block
sit beside a `text` block instead of stacking), `mediaText` (image +
heading + body as one unit), `video`, `stats`, `coverImage`, `quote`
(testimonial with attribution — distinct from `text`'s `pullQuote`
variant, which is just your own emphasized text), `cta`.

`BlockRenderer.tsx` exports a `renderBlock()` dispatch function used both
by itself (top-level list) and by `GridBlock.tsx` (nested items) — the two
files import from each other. **This is intentional and safe** (a
standard recursive-tree-renderer pattern); it works because both modules
only reference each other's exports at render time, not at module-eval
time. Don't "fix" this into a single file without reason.

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