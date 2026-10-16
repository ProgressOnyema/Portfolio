import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getProject, projects } from "@/lib/data/projects";
import type { CoverImageBlock } from "@/lib/types/caseStudy";

// Per-case-study Open Graph image. When the case study has a cover image
// (its first top-level `coverImage` block, e.g. [COVER-IMAGE] in the
// content .txt) that file from public/ is served as-is. Otherwise — no
// cover, a remote URL, or an unreadable file — it falls back to the
// generated text card (name, one-liner, category on the dark card), so a
// new case study always gets a preview.
//
// `contentType` below is the fallback card's type. A served cover keeps
// its own type in the response's Content-Type header (covers are .webp
// today); only the og:image:type meta tag can disagree with it, which
// scrapers ignore in favour of the header.
export const alt = "Case study preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const MIME_BY_EXT: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

// Reads the case study's cover from public/. Returns null (so the caller
// falls back to the text card) for anything that isn't a readable local
// image under public/.
async function readCover(
  cover: CoverImageBlock | undefined
): Promise<{ data: Uint8Array; mime: string } | null> {
  if (!cover?.src?.startsWith("/")) return null;

  const mime = MIME_BY_EXT[path.extname(cover.src).toLowerCase()];
  if (!mime) return null;

  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.join(publicDir, decodeURIComponent(cover.src));
  // Stay inside public/ even if a src contains "..".
  if (!filePath.startsWith(publicDir + path.sep)) return null;

  try {
    return { data: new Uint8Array(await readFile(filePath)), mime };
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  const cover = await readCover(
    project?.blocks.find((b): b is CoverImageBlock => b.type === "coverImage")
  );
  if (cover) {
    return new Response(cover.data, { headers: { "Content-Type": cover.mime } });
  }

  const name = project?.name ?? "Case study";
  const oneLiner = project?.oneLiner ?? "";
  const category = project?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0b0b0b",
          color: "#f5f5f5",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, color: "#9a9a9a" }}>
          {category ? `${category.toUpperCase()} CASE STUDY` : "CASE STUDY"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 112, fontWeight: 700 }}>{name}</div>
          {oneLiner ? (
            <div style={{ display: "flex", fontSize: 44, color: "#bdbdbd", marginTop: 16 }}>
              {oneLiner}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9a9a9a" }}>Onyema Miracle</div>
      </div>
    ),
    { ...size }
  );
}
