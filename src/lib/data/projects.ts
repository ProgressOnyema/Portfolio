import type { ProjectWidgetData } from "@/components/ProjectWidget";

// Placeholder entries matching the 6 folder slots in Figma. Swap in real
// project data (name, one-liner, tags, category) as case studies are
// written. Category distribution below is a placeholder guess.
export const projects: ProjectWidgetData[] = [
  { slug: "project-one", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design" },
  { slug: "project-two", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Product Design" },
  { slug: "project-three", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding" },
  { slug: "project-four", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Branding" },
  { slug: "project-five", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development" },
  { slug: "project-six", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"], category: "Development" },
];

export function getProject(slug: string): ProjectWidgetData | undefined {
  return projects.find((p) => p.slug === slug);
}
