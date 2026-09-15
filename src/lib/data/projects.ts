import fs from "node:fs";
import path from "node:path";
import type { ProjectWidgetData } from "@/components/ProjectWidget";
import type { Block } from "@/lib/types/caseStudy";

export type CaseStudy = ProjectWidgetData & {
  // Groups sibling case studies (UI/UX, Branding, Development) that belong
  // to the same underlying project, so the case-study page can tab between
  // them. Defaults to the case study's own slug when a project only has
  // one case study, so existing single-case-study projects need no change.
  projectId: string;
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
  { slug: "project-one", projectId: "project-one", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-two", projectId: "project-two", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-three", projectId: "project-three", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-four", projectId: "project-four", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-five", projectId: "project-five", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development", blocks: PLACEHOLDER_BLOCKS },
  { slug: "project-six", projectId: "project-six", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development", blocks: PLACEHOLDER_BLOCKS },
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
    .map((file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8")) as CaseStudy)
    // Older JSON generated before PROJECT-ID existed won't have projectId —
    // fall back to the case study's own slug so it still behaves as a
    // standalone project instead of crashing the tab-lookup logic.
    .map((project) => ({ ...project, projectId: project.projectId || project.slug }));
}

function mergeProjects(placeholders: CaseStudy[], real: CaseStudy[]): CaseStudy[] {
  const merged = [...placeholders];
  for (const project of real) {
    const existingIndex = merged.findIndex((p) => p.slug === project.slug);
    if (existingIndex >= 0) merged[existingIndex] = project;
    else merged.push(project);
  }

  // Guard against two case studies in the same project accidentally sharing
  // a category — the tab UI can only show one case study per category, so
  // the second one would be unreachable from the subnav.
  const seen = new Map<string, string>();
  for (const project of merged) {
    const key = `${project.projectId}:${project.category}`;
    const clashingSlug = seen.get(key);
    if (clashingSlug) {
      console.warn(
        `[projects] "${clashingSlug}" and "${project.slug}" share projectId "${project.projectId}" and category "${project.category}" — only one will be reachable from the case-study tabs.`
      );
    }
    seen.set(key, project.slug);
  }

  return merged;
}

export const projects: CaseStudy[] = mergeProjects(placeholderProjects, loadRealCaseStudies());

export function getProject(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}

// Canonical left-to-right order for the case-study tabs, independent of
// whatever order projects happen to appear in the data.
const CATEGORY_ORDER: CaseStudy["category"][] = ["Product Design", "Branding", "Development"];

// All case studies belonging to the same underlying project (i.e. sharing
// projectId), ordered for display in the case-study page's subnav tabs.
export function getProjectCaseStudies(projectId: string): CaseStudy[] {
  return projects
    .filter((p) => p.projectId === projectId)
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
}

// One card per project for the homepage's featured-projects grid — a
// project with multiple case studies (UI/UX, Branding, Development)
// collapses to a single widget instead of one per case study. The widget
// links to the canonical (first in CATEGORY_ORDER) case study, shows the
// union of every sibling's tags, and lists every sibling's category via
// caseStudyCategories so ProjectWidget's auto tag pills (like /DEV) cover
// the whole group, not just the representative case study.
export function getFeaturedProjects(): CaseStudy[] {
  const seenProjectIds = new Set<string>();
  const featured: CaseStudy[] = [];

  for (const project of projects) {
    if (seenProjectIds.has(project.projectId)) continue;
    seenProjectIds.add(project.projectId);

    const siblings = getProjectCaseStudies(project.projectId);
    if (siblings.length === 1) {
      featured.push(project);
      continue;
    }

    const primary = siblings[0];
    const mergedTags = [...new Set(siblings.flatMap((s) => s.tags))];
    featured.push({
      ...primary,
      tags: mergedTags,
      caseStudyCategories: siblings.map((s) => s.category),
    });
  }

  return featured;
}
