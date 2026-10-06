import { ImageResponse } from "next/og";
import { getProject, projects } from "@/lib/data/projects";

// Per-case-study Open Graph image: project name, one-liner and category on
// the same dark card as the site default. Text-only and generated at build
// time from the case-study data, so a new case study gets a preview image
// with no extra work.
export const alt = "Case study preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

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
