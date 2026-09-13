import { notFound } from "next/navigation";
import Grid from "@/components/Grid";
import Subnav from "@/components/Subnav";
import ContactSection from "@/components/ContactSection";
import BlockRenderer from "@/components/case-study/BlockRenderer";
import { getProject, projects } from "@/lib/data/projects";

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

  return (
    <main className="flex flex-1 flex-col">
      <Grid className="items-center gap-y-6 pt-16 text-center sm:pt-24">
        <h1 className="col-span-4 text-h1-bold sm:col-span-12">{project.name}</h1>
        <div className="col-span-4 sm:col-span-12">
          <Subnav active={project.category} />
        </div>
      </Grid>

      <Grid className="pt-16 sm:pt-24">
        <div className="col-span-4 sm:col-span-12">
          <BlockRenderer blocks={project.blocks} />
        </div>
      </Grid>

      <ContactSection />
    </main>
  );
}
