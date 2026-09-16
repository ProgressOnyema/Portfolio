import { notFound } from "next/navigation";
import Grid from "@/components/Grid";
import Subnav from "@/components/Subnav";
import ContactSection from "@/components/ContactSection";
import BlockRenderer from "@/components/case-study/BlockRenderer";
import type { ProjectCategory } from "@/components/ProjectWidget";
import { getProject, getProjectCaseStudies, projects } from "@/lib/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  // Sibling case studies (UI/UX, Branding, Development) sharing this
  // project's projectId, so the subnav can tab between them. A project
  // with only one case study gets an empty map here and the subnav
  // renders its other two categories as inert, same as before.
  const siblingHrefs: Partial<Record<ProjectCategory, string>> = {};
  for (const sibling of getProjectCaseStudies(project.projectId)) {
    siblingHrefs[sibling.category] = `/work/${sibling.slug}`;
  }

  return (
    <main className="flex flex-1 flex-col">
      <Grid className="pt-8 sm:pt-12">
        <div className="col-span-4 flex flex-col gap-2 sm:col-span-12">
          <h1 className="text-h1-bold">{project.name}</h1>
          {/* Distinct from the shared .text-h3 (used by Home/About): this
              one drops to Body Regular/Base (16px) on mobile rather than
              Body Large/Base (20px), per the ProjectDetail - Mobile frame. */}
          {project.oneLiner && (
            <p className="text-text-primary text-h3">
              {project.oneLiner}
            </p>
          )}
        </div>
      </Grid>

      <Grid className="gap-y-8 pt-16 sm:pt-24">
        <div className="col-span-4 sm:col-span-12">
          <Subnav active={project.category} hrefs={siblingHrefs} />
        </div>
        <div className="col-span-4 sm:col-span-12 sm:pt-16">
          <BlockRenderer blocks={project.blocks} />
        </div>
      </Grid>

      <ContactSection />
    </main>
  );
}
