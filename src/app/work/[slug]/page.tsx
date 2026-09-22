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
            {project.logoAlternate && (
              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-csq bg-surface-bg-alt">
                {/* eslint-disable-next-line @next/next/no-img-element -- see comment above: SVG, next/image can't serve it without a site-wide config change */}
                <img src={project.logoAlternate} alt="" className="max-h-full max-w-full object-contain" />
              </div>
            )}
            <h1 className="text-h1-bold">{project.name}</h1>
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

      {otherProjects.length > 0 && (
        <div className="pt-24 sm:pt-32">
          {/* Full-bleed on purpose, per direct instruction — this doesn't
              sit inside <Grid> (which caps at max-w-1440 and centers), so
              the row can scroll genuinely edge-to-edge instead of being
              cropped at the page's own column width. Left padding still
              matches Grid's *effective* left inset — not just its 88px
              gutter, but max(88px, (100vw-1440px)/2 + 88px), the same
              value Grid arrives at once mx-auto starts centering it on
              screens wider than 1440px — so the first card lines up with
              the rest of the page at any width, not just below the
              1440px cap. No right padding, so scrolling runs to the
              actual viewport edge. The trailing spacer gives the last
              card that same breathing room on the way out. hideMeta
              drops the logo/name/one-liner row — the tag pills already
              carry the category, and clicking through is the point, not
              reading a second description here. */}
          <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 pl-5 sm:snap-none sm:pl-6 lg:pl-[max(88px,calc((100vw-1440px)/2+88px))]">
            {otherProjects.map((otherProject) => (
              <div
                key={otherProject.slug}
                className="w-[260px] shrink-0 snap-start sm:w-[405.5px]"
              >
                <ProjectWidget project={otherProject} size="lg" hideMeta />
              </div>
            ))}
            <div
              className="w-5 shrink-0 sm:w-6 lg:w-[max(88px,calc((100vw-1440px)/2+88px))]"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      <ContactSection />
    </main>
  );
}
