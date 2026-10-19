import { readFile } from "node:fs/promises";
import path from "node:path";

// Default Open Graph image for the site (used for link previews on
// LinkedIn, WhatsApp, X, etc.): the designed image in
// public/open_graph_img.jpg, served as-is. It's the JPEG on purpose:
// LinkedIn and some other scrapers don't read WebP (open_graph_img.png and
// .webp sit beside it). This used to be a generated, text-only card
// (next/og).
//
// Why this file still exists instead of a plain <meta> in layout.tsx: in
// the App Router an opengraph-image file always overrides
// `openGraph.images` from metadata, so a leftover generated one would
// hide the real image. Serving the file from here keeps one source of
// truth. To replace the image, overwrite public/open_graph_img.jpg and
// update `size` below to its new dimensions. If you'd rather use the
// file convention directly, delete this file and drop the image in as
// src/app/opengraph-image.jpg (or .png) instead.
export const alt = "Onyema Miracle — Brand + Product Designer";
export const size = { width: 2528, height: 1174 };
export const contentType = "image/jpeg";

export default async function Image() {
  const file = await readFile(path.join(process.cwd(), "public", "open_graph_img.jpg"));
  return new Response(new Uint8Array(file), {
    headers: { "Content-Type": contentType },
  });
}
