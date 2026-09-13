import type { ProjectWidgetData } from "@/components/ProjectWidget";

// Placeholder entries matching the 6 folder slots in Figma. Swap in real
// project data (name, one-liner, tags) as case studies are written.
export const projects: ProjectWidgetData[] = [
  { slug: "project-one", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-two", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-three", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-four", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-five", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-six", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
];

export function getProject(slug: string): ProjectWidgetData | undefined {
  return projects.find((p) => p.slug === slug);
}
