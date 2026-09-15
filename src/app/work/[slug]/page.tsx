import Image from "next/image";
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
      <Grid className="items-start pt-16 sm:pt-24">
        <div className="col-span-4 flex flex-col items-start gap-4 sm:col-span-12">
          <div className="flex items-center gap-3">
            {project.logo && (
              <Image src={project.logo} alt={`${project.name} logo`} width={100} height={100} className="h-10 w-10" />
            )}
            <h1 className="text-h1-bold">{project.name}</h1>
          </div>
          {project.oneLiner && <p className="max-w-[763px] text-h3 text-text-primary">{project.oneLiner}</p>}
        </div>
      </Grid>

      <Grid className="pt-16 sm:pt-48">
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
