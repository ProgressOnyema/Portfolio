import type { ProjectWidgetData } from "@/components/ProjectWidget";
import type { Block } from "@/lib/types/caseStudy";

export type CaseStudy = ProjectWidgetData & {
  blocks: Block[];
};

// Placeholder blocks — same generic content for all 6 projects for now.
// Swap in real per-project writing and imagery as case studies are ready.
// Demonstrates the grid block reproducing a meta-sidebar-beside-text
// layout from generic, reusable primitives.
const PLACEHOLDER_BLOCKS: Block[] = [
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
    type: "text",
    variant: "pullQuote",
    body: [["A standout line or key result from the project goes here."]],
  },
];

// Placeholder entries matching the 6 folder slots in Figma. Swap in real
// project data (name, one-liner, tags, category, blocks) as case studies
// are written. Category distribution below is a placeholder guess.
export const projects: CaseStudy[] = [
  { slug: "project-one", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-two", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-three", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-four", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-five", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-six", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development", blocks: PLACEHOLDER_BLOCKS },
];

export function getProject(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}
