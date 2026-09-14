# Adding a case study

Write the case study as a plain `.txt` file in `content/`, then run the
parser to generate the JSON the site actually reads.

## 1. Write the .txt file

Use the tags below. Every block needs an opening `[TAG]` and a matching
`[/TAG]`. See `content/buy-and-bite.txt` for a full working example.

**Top-level metadata** (anywhere in the file, order doesn't matter):

```
[SLUG: project-slug]
[NAME: Project Name]
[ONE-LINER: One sentence describing the project]
[CATEGORY: Product Design]   (must be exactly: Product Design, Branding, or Development)
[TAGS: UX/UI, Brand]
[THUMBNAIL-1: /case-studies/project-slug/thumbnail-1.jpg]  (optional — both are needed together, or neither is used)
[THUMBNAIL-2: /case-studies/project-slug/thumbnail-2.jpg]  (the widget card shows these as two overlapping layers, same as the placeholder illustration; without them, the placeholder is used)
[LOGO: /case-studies/project-slug/logo.png]                (optional — the small logo next to the name on the widget card; without it, a placeholder is used)
```

**Blocks** (in the order you want them to appear on the page):

- `[COVER-IMAGE] ... [/COVER-IMAGE]` — fields: `src`, `alt`, `caption` (optional)
- `[GRID: 2] ... [/GRID]` — put any other blocks inside; they become that many columns
- `[META] ... [/META]` — one `Label: Value` per line
- `[TEXT] ... [/TEXT]` or `[TEXT: pullQuote] ... [/TEXT]` — optional `Heading:` line, then `Body:` followed by your paragraphs (blank line = new paragraph, `*word*` = italic emphasis)
- `[IMAGE-GRID: 2] ... [/IMAGE-GRID]` — each image on its own line: `- src: ... | alt: ... | caption: ...`
- `[MEDIA-TEXT] ... [/MEDIA-TEXT]` or `[MEDIA-TEXT: right]` / `[MEDIA-TEXT: top]` — fields `src`, `alt`, optional `Heading:`, then `Body:`
- `[VIDEO] ... [/VIDEO]` — fields: `src`, `variant` (fullWidth/contained), `autoplay` (true/false)
- `[STATS] ... [/STATS]` — one stat per line: `40% | Increase in signups`
- `[QUOTE] ... [/QUOTE]` — `Body:`, `Name:`, `Role:` (optional), `Avatar:` (optional)
- `[CTA] ... [/CTA]` — `Label:`, `Href:`, `Style:` (primary/link)

## 2. Add the real images

Drop them in `public/case-studies/<slug>/...` and reference that path
(e.g. `/case-studies/buy-and-bite/cover.jpg`) in the `src:` fields above.

## 3. Run the parser

```
node scripts/parse-case-study.mjs content/your-file.txt
```

This writes `src/lib/data/case-studies/<slug>.json`. It also warns (but
doesn't fail) if any referenced image path doesn't exist yet in `public/`.

## 4. Preview and ship

`npm run dev`, check `/work/<slug>`, then commit and push as usual. If the
slug matches one of the 6 placeholder projects, it replaces it; otherwise
it's added as a new project automatically.

## Notes

- Keep the source document single-column when drafting (Google Docs/Word
  before exporting) — this is a plain-text convention, so anything that
  relies on visual layout (tables, side-by-side columns) won't survive.
- If you'd rather draft in a PDF and export to `.txt`/copy-paste the text
  out, that works too, as long as the tags end up on their own lines.
