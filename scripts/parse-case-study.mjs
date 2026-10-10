#!/usr/bin/env node
// Parses a tagged .txt case study file into a JSON file matching the
// CaseStudy/Block schema in src/lib/types/caseStudy.ts.
//
// Usage: node scripts/parse-case-study.mjs content/some-project.txt
// Writes: src/lib/data/case-studies/<slug>.json

import fs from "node:fs";
import path from "node:path";

const OPEN_TAG = /^\[([A-Z0-9-]+)(?::\s*(.*))?\]$/;
const CLOSE_TAG = /^\[\/([A-Z0-9-]+)\]$/;
const META_KEYS = ["SLUG", "PROJECT-ID", "NAME", "ONE-LINER", "CATEGORY", "THUMBNAIL-1", "THUMBNAIL-2", "LOGO"];
// [SCREEN-1] ... [SCREEN-N] — the UI screens that slide inside the
// ProjectWidgetV2 card. Numbered like THUMBNAIL-1/2, but open-ended.
const SCREEN_KEY = /^SCREEN-(\d+)$/;
const isMetaKey = (tag) => META_KEYS.includes(tag) || SCREEN_KEY.test(tag);

// Intrinsic pixel size of a local image, read straight from the file
// header (WebP, PNG, JPEG, GIF) so the parser stays dependency-free.
// Returns null for anything it can't read; callers treat that as
// "dimensions unknown" and the site falls back to a plain <img>.
function readImageSize(filePath) {
  let buf;
  try {
    buf = fs.readFileSync(filePath);
  } catch {
    return null;
  }
  try {
    if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
      const kind = buf.toString("ascii", 12, 16);
      if (kind === "VP8 ") {
        return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      }
      if (kind === "VP8L") {
        const bits = buf.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (kind === "VP8X") {
        return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
      }
      return null;
    }
    if (buf.readUInt32BE(0) === 0x89504e47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (buf.toString("ascii", 0, 3) === "GIF") {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
        if (isSof) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
  } catch {
    return null;
  }
  return null;
}

// Adds width/height (when the file is a local, readable image) so the
// site can render it with next/image at a properly sized resolution
// instead of shipping the original at full size.
function withDimensions(image) {
  if (!image.src || !image.src.startsWith("/")) return image;
  const size = readImageSize(path.join(process.cwd(), "public", image.src));
  return size ? { ...image, ...size } : image;
}

function fail(msg, lineNum) {
  console.error(`Parse error${lineNum ? ` (line ${lineNum})` : ""}: ${msg}`);
  process.exit(1);
}

// Split plain text into italic / plain spans on *asterisk* markers.
function parseEmphasis(text) {
  const spans = [];
  const parts = text.split(/\*(.+?)\*/g);
  parts.forEach((part, i) => {
    if (part === "") return;
    if (i % 2 === 1) spans.push({ text: part, emphasis: true });
    else spans.push(part);
  });
  return spans;
}

// [label](https://url) — a source link. Links are pulled out first so
// asterisks inside a URL are never read as emphasis; the text between
// them is then split on *asterisks* as before. URLs must be http(s) and
// can't contain spaces or ")" (encode a ")" as %29).
const LINK = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;

// Split plain text into RichSpan[]: plain text, *italic* emphasis, and
// [label](url) source links.
function parseSpans(text) {
  const spans = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    if (match.index > last) spans.push(...parseEmphasis(text.slice(last, match.index)));
    spans.push({ text: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) spans.push(...parseEmphasis(text.slice(last)));
  return spans;
}

// Split "Body:" free text into a TextNode[] - a mix of paragraphs
// (blank-line separated, wrapped lines within one joined together) and
// lists. A line starting with "- " begins/continues a bullet list; a
// line starting with "1. " (any digit) begins/continues a numbered one -
// standard Markdown-ish list markers, consistent with *asterisk*
// emphasis above. Unlike paragraphs, list items don't support wrapped
// continuation lines - each item is exactly one line - so keep them
// short or split into more items.
function parseParagraphs(bodyLines) {
  const nodes = [];
  let currentParagraph = [];
  let currentList = null;

  const flushParagraph = () => {
    if (currentParagraph.length) {
      nodes.push(currentParagraph.join(" "));
      currentParagraph = [];
    }
  };
  const flushList = () => {
    if (currentList) {
      nodes.push(currentList);
      currentList = null;
    }
  };

  for (const rawLine of bodyLines) {
    const line = rawLine.trim();
    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }
    const bulletMatch = line.match(/^-\s+(.*)$/);
    const numberedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (bulletMatch || numberedMatch) {
      flushParagraph();
      const ordered = Boolean(numberedMatch);
      const text = (bulletMatch ?? numberedMatch)[1];
      if (!currentList || currentList.ordered !== ordered) {
        // A new list starts if there wasn't one yet, or if the marker
        // style switched (bullet <-> numbered) - that's two lists, not
        // one mixed one.
        flushList();
        currentList = { ordered, items: [] };
      }
      currentList.items.push(text);
    } else {
      flushList();
      currentParagraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return nodes.map((node) =>
    typeof node === "string"
      ? parseSpans(node)
      : { type: "list", ordered: node.ordered, items: node.items.map(parseSpans) }
  );
}

// Collect "Label: value" fields from lines until we hit a line starting a
// new recognized field name (like "Body:") or run out of lines.
function parseFields(lines, stopAt = []) {
  const fields = {};
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^([A-Za-z][\w -]*):\s*(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    if (stopAt.includes(key)) break;
    fields[key] = match[2].trim();
  }
  return { fields, consumed: i };
}

class Parser {
  constructor(lines) {
    this.lines = lines;
    this.i = 0;
  }

  peek() {
    return this.lines[this.i];
  }

  next() {
    return this.lines[this.i++];
  }

  atEnd() {
    return this.i >= this.lines.length;
  }

  // Parses a sequence of blocks until EOF or a matching close tag for `until`.
  parseBlockList(until) {
    const blocks = [];
    while (!this.atEnd()) {
      const line = this.peek().trim();
      if (line === "") {
        this.next();
        continue;
      }
      const close = line.match(CLOSE_TAG);
      if (close) {
        if (until && close[1] === until) {
          this.next();
          return blocks;
        }
        fail(`Unexpected closing tag [/${close[1]}]`, this.i + 1);
      }
      const open = line.match(OPEN_TAG);
      if (!open) {
        fail(`Expected a block tag, got: "${line}"`, this.i + 1);
      }
      const [, tag, arg] = open;
      if (isMetaKey(tag)) {
        // Top-level metadata line, not a block - skip here (handled separately)
        this.next();
        continue;
      }
      this.next();
      blocks.push(this.parseBlock(tag, arg));
    }
    if (until) fail(`Missing closing tag [/${until}]`);
    return blocks;
  }

  collectUntilClose(tag) {
    const collected = [];
    while (!this.atEnd()) {
      const line = this.peek();
      const close = line.trim().match(CLOSE_TAG);
      if (close && close[1] === tag) {
        this.next();
        return collected;
      }
      collected.push(this.next());
    }
    fail(`Missing closing tag [/${tag}]`);
  }

  parseBlock(tag, arg) {
    switch (tag) {
      case "COVER-IMAGE": {
        const body = this.collectUntilClose("COVER-IMAGE");
        const { fields } = parseFields(body);
        return { type: "coverImage", src: fields.src, alt: fields.alt ?? "", caption: fields.caption };
      }
      case "GRID": {
        const columns = Number(arg) || 2;
        const items = this.parseBlockList("GRID");
        return { type: "grid", columns, items };
      }
      case "META": {
        const body = this.collectUntilClose("META");
        const fields = body
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const m = l.match(/^([^:]+):\s*(.*)$/);
            return m ? { label: m[1].trim(), value: m[2].trim() } : null;
          })
          .filter(Boolean);
        return { type: "meta", fields };
      }
      case "TEXT": {
        const body = this.collectUntilClose("TEXT");
        const bodyIdx = body.findIndex((l) => /^Body:/i.test(l.trim()));
        const { fields } = parseFields(bodyIdx >= 0 ? body.slice(0, bodyIdx) : body, ["Body"]);
        const bodyLines = bodyIdx >= 0 ? [body[bodyIdx].replace(/^Body:\s*/i, ""), ...body.slice(bodyIdx + 1)] : [];
        const paragraphs = parseParagraphs(bodyLines);
        const block = { type: "text", body: paragraphs };
        if (fields.Heading) block.heading = fields.Heading;
        if (arg && arg.trim().toLowerCase() === "pullquote") block.variant = "pullQuote";
        return block;
      }
      case "IMAGE-GRID": {
        const columns = Number(arg) || 2;
        const body = this.collectUntilClose("IMAGE-GRID");
        const images = body
          .map((l) => l.trim())
          .filter((l) => l.startsWith("-"))
          .map((l) => {
            const raw = l.replace(/^-\s*/, "");
            const parts = Object.fromEntries(
              raw.split("|").map((p) => {
                const [k, ...rest] = p.split(":");
                return [k.trim().toLowerCase(), rest.join(":").trim()];
              })
            );
            return withDimensions({ src: parts.src, alt: parts.alt ?? "", caption: parts.caption });
          });
        return { type: "imageGrid", columns, images };
      }
      case "MARQUEE-GRID": {
        const columns = Number(arg) || 2;
        const body = this.collectUntilClose("MARQUEE-GRID");
        const images = body
          .map((l) => l.trim())
          .filter((l) => l.startsWith("-"))
          .map((l) => {
            const raw = l.replace(/^-\s*/, "");
            const parts = Object.fromEntries(
              raw.split("|").map((p) => {
                const [k, ...rest] = p.split(":");
                return [k.trim().toLowerCase(), rest.join(":").trim()];
              })
            );
            return withDimensions({ src: parts.src, alt: parts.alt ?? "", caption: parts.caption });
          });
        return { type: "marqueeGrid", columns, images };
      }
      case "MEDIA-TEXT": {
        const body = this.collectUntilClose("MEDIA-TEXT");
        const bodyIdx = body.findIndex((l) => /^Body:/i.test(l.trim()));
        const { fields } = parseFields(bodyIdx >= 0 ? body.slice(0, bodyIdx) : body, ["Body"]);
        const bodyLines = bodyIdx >= 0 ? [body[bodyIdx].replace(/^Body:\s*/i, ""), ...body.slice(bodyIdx + 1)] : [];
        const block = {
          type: "mediaText",
          image: { src: fields.src, alt: fields.alt ?? "" },
          body: parseParagraphs(bodyLines),
        };
        if (fields.Heading) block.heading = fields.Heading;
        if (arg) block.imagePosition = arg.trim().toLowerCase();
        return block;
      }
      case "VIDEO": {
        const body = this.collectUntilClose("VIDEO");
        const { fields } = parseFields(body);
        const block = { type: "video", src: fields.src };
        if (fields.variant) block.variant = fields.variant;
        if (fields.autoplay) block.autoplay = fields.autoplay.toLowerCase() === "true";
        return block;
      }
      case "STATS": {
        const body = this.collectUntilClose("STATS");
        const items = body
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const [value, label] = l.split("|").map((s) => s.trim());
            return { value, label };
          });
        return { type: "stats", items };
      }
      case "QUOTE": {
        const body = this.collectUntilClose("QUOTE");
        const bodyIdx = body.findIndex((l) => /^Body:/i.test(l.trim()));
        const { fields } = parseFields(bodyIdx >= 0 ? [...body.slice(0, bodyIdx), ...body.slice(bodyIdx + 1)] : body);
        const bodyLines = bodyIdx >= 0 ? [body[bodyIdx].replace(/^Body:\s*/i, "")] : [];
        return {
          type: "quote",
          body: parseParagraphs(bodyLines),
          attribution: { name: fields.Name, role: fields.Role, avatar: fields.Avatar },
        };
      }
      case "CTA": {
        const body = this.collectUntilClose("CTA");
        const { fields } = parseFields(body);
        const block = { type: "cta", label: fields.Label, href: fields.Href };
        if (fields.Style) block.style = fields.Style.toLowerCase();
        return block;
      }
      default:
        fail(`Unknown block type [${tag}]`);
    }
  }
}

function parseMeta(lines) {
  const meta = {};
  for (const line of lines) {
    const match = line.trim().match(OPEN_TAG);
    if (match && isMetaKey(match[1])) {
      meta[match[1]] = (match[2] ?? "").trim();
    }
  }
  return meta;
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error("Usage: node scripts/parse-case-study.mjs <input.txt>");
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, "utf-8");
  const lines = raw.split(/\r?\n/);

  const meta = parseMeta(lines);
  if (!meta.SLUG) fail("Missing required [SLUG: ...] tag");

  const parser = new Parser(lines);
  const blocks = parser.parseBlockList(null);

  if (meta["THUMBNAIL-1"] && !meta["THUMBNAIL-2"] || !meta["THUMBNAIL-1"] && meta["THUMBNAIL-2"]) {
    console.warn("Warning: both [THUMBNAIL-1] and [THUMBNAIL-2] are needed — only one was provided, so neither will be used (falls back to placeholder).");
  }

  // SCREEN-1..N in numeric order, skipping blanks.
  const screens = Object.keys(meta)
    .filter((key) => SCREEN_KEY.test(key) && meta[key])
    .sort((a, b) => Number(a.match(SCREEN_KEY)[1]) - Number(b.match(SCREEN_KEY)[1]))
    .map((key) => meta[key]);

  const caseStudy = {
    slug: meta.SLUG,
    // Groups sibling case studies (UI/UX, Branding, Development) that
    // belong to the same underlying project so the case-study page can
    // tab between them. Defaults to the slug itself, so a case study with
    // no siblings behaves exactly as before.
    projectId: meta["PROJECT-ID"] || meta.SLUG,
    name: meta.NAME ?? "",
    oneLiner: meta["ONE-LINER"] ?? "",
    category: meta.CATEGORY ?? "Product Design",
    ...(meta["THUMBNAIL-1"] && meta["THUMBNAIL-2"]
      ? { thumbnails: [meta["THUMBNAIL-1"], meta["THUMBNAIL-2"]] }
      : {}),
    ...(screens.length ? { screens } : {}),
    ...(meta.LOGO ? { logo: meta.LOGO } : {}),
    blocks,
  };

  const outDir = path.join(process.cwd(), "src/lib/data/case-studies");
  // Mirror content/'s folder structure: content/<project-id>/<slug>.txt
  // writes to src/lib/data/case-studies/<project-id>/<slug>.json, while a
  // flat content/<slug>.txt still writes flat, same as before.
  const contentDir = path.join(process.cwd(), "content");
  const relFromContent = path.relative(contentDir, path.resolve(inputPath));
  const relSubdir = path.dirname(relFromContent);
  const targetDir = relSubdir === "." || relSubdir.startsWith("..") ? outDir : path.join(outDir, relSubdir);
  fs.mkdirSync(targetDir, { recursive: true });
  const outPath = path.join(targetDir, `${meta.SLUG}.json`);
  fs.writeFileSync(outPath, JSON.stringify(caseStudy, null, 2) + "\n");

  // Warn about any referenced local asset paths that don't exist in public/
  // (matches src/thumbnail/screens/logo/avatar/poster fields — any
  // local path starting with "/", not an external URL).
  const publicDir = path.join(process.cwd(), "public");
  const jsonStr = JSON.stringify(caseStudy);
  const pathMatches = [
    ...jsonStr.matchAll(/"(?:src|thumbnails?|screens|logo|avatar|poster)":\s*(?:"(\/[^"]+)"|\[([^\]]+)\])/g),
  ]
    .flatMap((m) => (m[2] ? m[2].match(/"(\/[^"]+)"/g)?.map((s) => s.slice(1, -1)) ?? [] : [m[1]]))
    .filter(Boolean);
  for (const assetPath of pathMatches) {
    const filePath = path.join(publicDir, assetPath);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: referenced asset not found in public/: ${assetPath}`);
    }
  }

  console.log(`Wrote ${outPath}`);
}

main();
