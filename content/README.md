# Adding a case study

Write the case study as a plain `.txt` file in `content/`, then run the
parser to generate the JSON the site actually reads.

## 1. Write the .txt file

Use the tags below. Every block needs an opening `[TAG]` and a matching
`[/TAG]`. See `content/buy-and-bite/buy-and-bite.txt` for a full working
example.

**Where the file goes:**

- **One case study for this project?** A flat file works fine:
  `content/your-slug.txt`.
- **More than one case study for the same project** (see "Multiple case
  studies per project" below)? Put them together in a folder named after
  the project: `content/<project-id>/<slug>.txt`. The parser mirrors
  whatever folder structure you use in `content/` into
  `src/lib/data/case-studies/`, so `content/buy-and-bite/buy-and-bite-brand.txt`
  produces `src/lib/data/case-studies/buy-and-bite/buy-and-bite-brand.json` —
  keeping a project's generated JSON grouped the same way as its source.
  It's fine to start a project flat and move its files into a folder
  later once it grows a second case study; just delete the old flat
  `.json` after moving the `.txt` so a stale copy doesn't linger.

**Top-level metadata** (anywhere in the file, order doesn't matter):

```
[SLUG: project-slug]
[PROJECT-ID: project-slug]  (optional — see "Multiple case studies per project" below)
[NAME: Project Name]
[ONE-LINER: One sentence describing the project]
[CATEGORY: Product Design]   (must be exactly: Product Design, Branding, or Development — this also drives the widget card's tag pill: UX/UI, BRAND, or /DEV. There is no separate tags field.)
[THUMBNAIL-1: /case-studies/project-slug/thumbnail-1.jpg]  (optional — both are needed together, or neither is used)
[THUMBNAIL-2: /case-studies/project-slug/thumbnail-2.jpg]  (the widget card shows these as two overlapping layers, same as the placeholder illustration; without them, the placeholder is used)
[LOGO: /case-studies/project-slug/logo.png]                (optional — the small logo next to the name on the widget card; without it, a placeholder is used)
[LOGO-ALTERNATE: /case-studies/project-slug/logo-alt.svg]   (optional, separate from LOGO above — shown beside the project name on the ProjectDetail page header itself, not on the widget card. No placeholder fallback: omit it and the header just shows the plain name. Typically an SVG; rendered with a plain <img>, not next/image, since next/image won't optimize SVGs without a site-wide config change.)
```

**Blocks** (in the order you want them to appear on the page):

- `[COVER-IMAGE] ... [/COVER-IMAGE]` — fields: `src`, `alt`, `caption` (optional)
- `[GRID: 2] ... [/GRID]` — put any other blocks inside; they become that many columns
- `[META] ... [/META]` — one `Label: Value` per line
- `[TEXT] ... [/TEXT]` or `[TEXT: pullQuote] ... [/TEXT]` — optional `Heading:` line, then `Body:` followed by your paragraphs (blank line = new paragraph, `*word*` = italic emphasis, lists as below). Same `Body:` syntax is shared by `MEDIA-TEXT` and `QUOTE` further down.
- `[IMAGE-GRID: 2] ... [/IMAGE-GRID]` — static grid layout, `columns` (1/2/3) controls how many columns at `sm+` (always 1 on mobile); each image on its own line: `- src: ... | alt: ... | caption: ...`
- `[MARQUEE-GRID] ... [/MARQUEE-GRID]` — same image-line syntax as `IMAGE-GRID`, but renders as a continuously auto-scrolling horizontal marquee at every breakpoint instead of a static grid (an argument like `: 2` is accepted for consistency but ignored — there's no column count in a marquee)
- `[MEDIA-TEXT] ... [/MEDIA-TEXT]` or `[MEDIA-TEXT: right]` / `[MEDIA-TEXT: top]` — fields `src`, `alt`, optional `Heading:`, then `Body:`
- `[VIDEO] ... [/VIDEO]` — fields: `src`, `variant` (fullWidth/contained), `autoplay` (true/false)
- `[STATS] ... [/STATS]` — one stat per line: `40% | Increase in signups`
- `[QUOTE] ... [/QUOTE]` — `Body:`, `Name:`, `Role:` (optional), `Avatar:` (optional)
- `[CTA] ... [/CTA]` — `Label:`, `Href:`, `Style:` (primary/link)

**Lists inside a `Body:`** (TEXT, MEDIA-TEXT, QUOTE all share this): a line starting with `- ` is a bullet item, a line starting with `1. ` (any digit) is a numbered item — consecutive lines of the same marker style become one list; a blank line, a plain paragraph line, or switching marker style (bullet <-> numbered) ends it. Unlike paragraphs, list items don't wrap — keep each one to a single line.

```
Body:
Some intro text.

- First point
- Second point

1. Step one
2. Step two
```

## 2. Add the real images

Drop them in `public/case-studies/<slug>/...` and reference that path
(e.g. `/case-studies/buy-and-bite/cover.jpg`) in the `src:` fields above.

## 3. Run the parser

```
node scripts/parse-case-study.mjs content/your-file.txt
```

This writes the matching `.json` file under `src/lib/data/case-studies/`,
mirroring whatever folder `your-file.txt` is in under `content/` (flat
stays flat, `content/<project-id>/...` becomes
`src/lib/data/case-studies/<project-id>/...`). It also warns (but doesn't
fail) if any referenced image path doesn't exist yet in `public/`.

`npm run parse-content` (or just `npm run dev` / `npm run build`, which
run it automatically via `predev`/`prebuild`) re-parses every `.txt` file
under `content/`, at any depth, in one go.

## 4. Preview and ship

`npm run dev`, check `/work/<slug>`, then commit and push as usual. If the
slug matches one of the 6 placeholder projects, it replaces it; otherwise
it's added as a new project automatically.

## Multiple case studies per project

A project can have more than one case study — e.g. Buy and Bite has a
Product Design, a Branding, and a Development write-up, grouped together
in `content/buy-and-bite/`:

```
content/buy-and-bite/buy-and-bite.txt        [SLUG: buy-and-bite]        [CATEGORY: Product Design]
content/buy-and-bite/buy-and-bite-brand.txt  [SLUG: buy-and-bite-brand]  [CATEGORY: Branding]
content/buy-and-bite/buy-and-bite-dev.txt    [SLUG: buy-and-bite-dev]    [CATEGORY: Development]
```

...each with `[PROJECT-ID: buy-and-bite]`. That's what makes the subnav
tabs on the case-study page link to each other instead of sitting there
inert. Rules:

- Every case study for the same project uses the **same `[PROJECT-ID]`**
  (pick one slug and stick with it, usually the first case study's slug
  — it doesn't have to match the folder name, but it's clearest if it does).
- Each one still needs a **different `[CATEGORY]`** — one Product Design,
  one Branding, one Development. Two case studies with the same
  `PROJECT-ID` and the same `CATEGORY` will both parse, but only one is
  reachable from the tabs (the parser logs a warning at build time if this
  happens).
- `[PROJECT-ID]` is optional. Leave it out and it defaults to that case
  study's own `[SLUG]`, which is exactly the old single-case-study
  behavior — nothing to change for existing case studies.
- You don't need all three categories — one or two is fine. Categories
  with no matching case study are simply left out of the tabs instead of
  showing as inert, greyed-out text.
- The homepage's featured-projects grid shows one card per project, not
  one per case study — it links to the first case study in Product
  Design / Branding / Development order. Its tag pills, and every other
  card for this project on `/work` under any tab, show every category
  the project has a case study for (e.g. Buy and Bite's card always shows
  all three: UX/UI, BRAND, /DEV), not just the category of that one card.
- Grouping into a folder (`content/<project-id>/`) is purely
  organizational — it's `[PROJECT-ID]` that actually links the case
  studies together, not the folder. But keeping them in one folder is
  what keeps `content/` and `src/lib/data/case-studies/` browsable once
  you have more than a couple of multi-case-study projects.

## Notes

- Keep the source document single-column when drafting (Google Docs/Word
  before exporting) — this is a plain-text convention, so anything that
  relies on visual layout (tables, side-by-side columns) won't survive.
- If you'd rather draft in a PDF and export to `.txt`/copy-paste the text
  out, that works too, as long as the tags end up on their own lines.
