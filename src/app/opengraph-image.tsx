import { readFile } from "node:fs/promises";
import path from "node:path";

// Default Open Graph image for the site (used for link previews on
// LinkedIn, WhatsApp, X, etc.): the designed image in
// public/open_graph_img.webp, served as-is. This used to be a generated,
// text-only card (next/og).
//
// Why this file still exists instead of a plain <meta> in layout.tsx: in
// the App Router an opengraph-image file always overrides
// `openGraph.images` from metadata, so a leftover generated one would
// hide the real image. Serving the file from here keeps one source of
// truth. To replace the image, overwrite public/open_graph_img.webp and
// update `size` below to its new dimensions. If you move to a .png/.jpg,
// delete this file and drop it in as src/app/opengraph-image.png instead.
export const alt = "Onyema Miracle — Brand + Product Designer";
export const size = { width: 2528, height: 1174 };
export const contentType = "image/webp";

export default async function Image() {
  const file = await readFile(path.join(process.cwd(), "public", "open_graph_img.webp"));
  return new Response(new Uint8Array(file), {
    headers: { "Content-Type": contentType },
  });
}
