import fs from "node:fs";
import path from "node:path";
import type { ProjectWidgetData } from "@/components/ProjectWidget";
import type { Block } from "@/lib/types/caseStudy";

export type CaseStudy = ProjectWidgetData & {
  blocks: Block[];
};

// Placeholder blocks — used for any project that doesn't have a real case
// study JSON yet (see src/lib/data/case-studies/). Swap in real content by
// running scripts/parse-case-study.mjs on a written .txt file, which
// writes a JSON file there matching the project's slug.
const PLACEHOLDER_BLOCKS: Block[] = [
  {
    type: "coverImage",
    src: "/folder-assets/folder_image1.png",
    alt: "Project cover",
    caption: "Placeholder cover image caption.",
  },
  {
    type: "grid",
    columns: 2,
    items: [
      {
        type: "meta",
        fields: [
          { label: "Industry", value: "Placeholder industry / category" },
          { label: "What I did", value: "Brand Identity, Digital Experience" },
          { label: "Platform", value: "Mobile app + Web" },
        ],
      },
      {
        type: "text",
        heading: "A placeholder heading goes here",
        body: [
          [
            "A placeholder overview of the project — the problem it solved, who it was for, and the approach taken. This sentence has ",
            { text: "inline emphasis", emphasis: true },
            " to show rich text support.",
          ],
          [
            "This is a second paragraph, on its own line, replacing the earlier single-string body with real multi-paragraph support.",
          ],
        ],
      },
    ],
  },
  {
    type: "imageGrid",
    columns: 2,
    images: [
      { src: "/folder-assets/folder_image1.png", alt: "Project visual" },
      { src: "/folder-assets/folder_image2.png", alt: "Project visual" },
    ],
  },
  {
    type: "mediaText",
    image: { src: "/folder-assets/folder_image1.png", alt: "Project visual" },
    heading: "Image + text in one unit",
    body: [["A placeholder paragraph pairing directly with the image beside it."]],
    imagePosition: "left",
  },
  {
    type: "video",
    src: "/folder-assets/placeholder-video.mp4",
    variant: "contained",
  },
  {
    type: "stats",
    items: [
      { value: "40%", label: "Increase in signups" },
      { value: "2.3x", label: "Faster checkout" },
      { value: "12", label: "Weeks to launch" },
    ],
  },
  {
    type: "quote",
    body: [["This placeholder testimonial shows how a client quote with attribution renders."]],
    attribution: { name: "Jane Doe", role: "Founder, Placeholder Co." },
  },
  {
    type: "text",
    variant: "pullQuote",
    body: [["A standout line or key result from the project goes here."]],
  },
  {
    type: "cta",
    label: "View live site",
    href: "https://example.com",
    style: "primary",
  },
];

// Placeholder entries matching the 6 folder slots in Figma.
const placeholderProjects: CaseStudy[] = [
  { slug: "project-one", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-two", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-three", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-four", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-five", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-six", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development", blocks: PLACEHOLDER_BLOCKS },
];

// Load any real case study JSON files (written by scripts/parse-case-study.mjs)
// from src/lib/data/case-studies/. Each one overrides the placeholder with
// the matching slug, or gets appended as a new project if the slug is new.
function loadRealCaseStudies(): CaseStudy[] {
  const dir = path.join(process.cwd(), "src/lib/data/case-studies");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as CaseStudy);
}

function mergeProjects(placeholders: CaseStudy[], real: CaseStudy[]): CaseStudy[] {
  const merged = [...placeholders];
  for (const project of real) {
    const existingIndex = merged.findIndex((p) => p.slug === project.slug);
    if (existingIndex >= 0) merged[existingIndex] = project;
    else merged.push(project);
  }
  return merged;
}

export const projects: CaseStudy[] = mergeProjects(placeholderProjects, loadRealCaseStudies());

export function getProject(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}
