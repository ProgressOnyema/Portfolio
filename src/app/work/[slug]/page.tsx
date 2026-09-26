import { notFound } from "next/navigation";
import Grid from "@/components/Grid";
import Subnav from "@/components/Subnav";
import ContactSection from "@/components/ContactSection";
import BlockRenderer from "@/components/case-study/BlockRenderer";
import { type ProjectCategory } from "@/components/ProjectWidget";
import NextProjectsCarousel from "@/components/NextProjectsCarousel";
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
          <div className="flex items-center gap-3">
            {/* logoAlternate — a second, distinct logo slot from the small
                one in ProjectWidget's own meta row (see its type comment).
                Optional with no placeholder fallback, so most projects
                simply won't show one here. Plain <img>, not next/image:
                this is authored as an SVG, and next/image's optimizer
                refuses to serve SVGs unless dangerouslyAllowSVG is set in
                next.config.ts (a site-wide security setting, not worth
                enabling for one field). object-contain, not object-cover
                like the other two logo/thumbnail images on this type —
                those are photos meant to fill their box; this is a logo
                mark, which should never get cropped. */}
            <h1 className="text-h2-bold sm:text-h1-bold">{project.name}</h1>
          </div>
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

      <Grid className="gap-y-8 pt-8 sm:pt-16">
        <div className="col-span-4 sm:col-span-12">
          <Subnav active={project.category} hrefs={siblingHrefs} />
        </div>
        <div className="col-span-4 sm:col-span-12 sm:pt-16">
          <BlockRenderer blocks={project.blocks} />
        </div>
      </Grid>

      {otherProjects.length > 0 && <NextProjectsCarousel projects={otherProjects} />}

      <ContactSection />
    </main>
  );
}
