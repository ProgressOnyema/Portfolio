import { notFound } from "next/navigation";
import Grid from "@/components/Grid";
import Subnav from "@/components/Subnav";
import ContactSection from "@/components/ContactSection";
import BlockRenderer from "@/components/case-study/BlockRenderer";
import ProjectWidget, { type ProjectCategory } from "@/components/ProjectWidget";
import { getOtherProjects, getProject, getProjectCaseStudies, projects } from "@/lib/data/projects";

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

  // What to show the visitor once they're done with this case study: every
  // other project, not just one pick. Empty for a single-project site.
  const otherProjects = getOtherProjects(project.projectId);

  return (
    <main className="flex flex-1 flex-col">
      <Grid className="pt-8 sm:pt-12">
        <div className="col-span-4 flex flex-col gap-2 sm:col-span-12">
          <h1 className="text-h1-bold">{project.name}</h1>
          {/* .text-project-oneliner, not the shared .text-h3 (used by
              Home/About): this one drops to Body Regular/Base (16px) on
              mobile rather than Body Large/Base (20px), per the
              ProjectDetail - Mobile frame. */}
          {project.oneLiner && (
            <p className="text-text-primary text-project-oneliner">
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

      {otherProjects.length > 0 && (
        <Grid className="gap-y-8 pt-24 sm:pt-32">
          <h3 className="col-span-4 text-h3-bold sm:col-span-12">Next Project</h3>
          <div className="col-span-4 sm:col-span-12">
            {/* Horizontal list of every other project — scrolls on any
                viewport where the cards don't all fit, mobile included
                (snap-x makes that scroll land cleanly on a card). Cards
                hide their name/logo row (hideMeta) since the tag pills
                already identify the category and clicking through is the
                point, not reading a second description here. */}
            <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 sm:snap-none">
              {otherProjects.map((otherProject) => (
                <div
                  key={otherProject.slug}
                  className="w-[260px] shrink-0 snap-start sm:w-[405.5px]"
                >
                  <ProjectWidget project={otherProject} size="lg" hideMeta />
                </div>
              ))}
            </div>
          </div>
        </Grid>
      )}

      <ContactSection />
    </main>
  );
}
