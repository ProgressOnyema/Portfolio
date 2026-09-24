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

// Load any real case study JSON files (written by scripts/parse-case-study.mjs)
// from src/lib/data/case-studies/, at any depth — a project with multiple
// case studies groups them in src/lib/data/case-studies/<project-id>/,
// mirroring content/<project-id>/, while a single-case-study project can
// still sit flat as src/lib/data/case-studies/<slug>.json.
function collectJsonFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectJsonFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".json")) results.push(entryPath);
  }
  return results;
}

function loadRealCaseStudies(): CaseStudy[] {
  const dir = path.join(process.cwd(), "src/lib/data/case-studies");
  if (!fs.existsSync(dir)) return [];

  const projects = collectJsonFiles(dir)
    .map((filePath) => JSON.parse(fs.readFileSync(filePath, "utf-8")) as CaseStudy)
    // Older JSON generated before PROJECT-ID existed won't have projectId —
    // fall back to the case study's own slug so it still behaves as a
    // standalone project instead of crashing the tab-lookup logic.
    .map((project) => ({ ...project, projectId: project.projectId || project.slug }));

  // Guard against two case studies in the same project accidentally sharing
  // a category — the tab UI can only show one case study per category, so
  // the second one would be unreachable from the subnav.
  const seen = new Map<string, string>();
  for (const project of projects) {
    const key = `${project.projectId}:${project.category}`;
    const clashingSlug = seen.get(key);
    if (clashingSlug) {
      console.warn(
        `[projects] "${clashingSlug}" and "${project.slug}" share projectId "${project.projectId}" and category "${project.category}" — only one will be reachable from the case-study tabs.`
      );
    }
    seen.set(key, project.slug);
  }

  return projects;
}

// Canonical left-to-right order for tag pills and tabs, independent of
// whatever order projects happen to appear in the data.
const CATEGORY_ORDER: CaseStudy["category"][] = ["Product Design", "Branding", "Development"];

// Stamps every case study with the full set of categories its project has
// a case study for (caseStudyCategories), so any card showing that case
// study anywhere on the site — its own page, the /work grid under any
// category tab, or the homepage featured grid — shows all of that
// project's tag pills, not just the one matching the card's own category.
// A project with one case study just gets its own category back.
function withCaseStudyCategories(list: CaseStudy[]): CaseStudy[] {
  const categoriesByProjectId = new Map<string, CaseStudy["category"][]>();
  for (const project of list) {
    const existing = categoriesByProjectId.get(project.projectId) ?? [];
    existing.push(project.category);
    categoriesByProjectId.set(project.projectId, existing);
  }

  return list.map((project) => ({
    ...project,
    caseStudyCategories: CATEGORY_ORDER.filter((c) =>
      categoriesByProjectId.get(project.projectId)!.includes(c)
    ),
  }));
}

export const projects: CaseStudy[] = withCaseStudyCategories(loadRealCaseStudies());

export function getProject(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}

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
// links to the canonical (first in CATEGORY_ORDER) case study; its tag
// pills already cover the whole group via caseStudyCategories (see
// withCaseStudyCategories above).
export function getFeaturedProjects(): CaseStudy[] {
  const seenProjectIds = new Set<string>();
  const featured: CaseStudy[] = [];

  for (const project of projects) {
    if (seenProjectIds.has(project.projectId)) continue;
    seenProjectIds.add(project.projectId);
    featured.push(getProjectCaseStudies(project.projectId)[0]);
  }

  return featured;
}

// Every other project, for the horizontal "Next Project" list at the
// bottom of a case-study page — the whole set to browse, not one single
// pick. Same one-card-per-project order as getFeaturedProjects(), with
// the current project filtered out. Empty for a single-project site.
export function getOtherProjects(projectId: string): CaseStudy[] {
  return getFeaturedProjects().filter((p) => p.projectId !== projectId);
}
