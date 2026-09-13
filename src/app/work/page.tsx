import Grid from "@/components/Grid";
import Subnav from "@/components/Subnav";
import ProjectWidget from "@/components/ProjectWidget";
import ContactSection from "@/components/ContactSection";
import { projects } from "@/lib/data/projects";

export default function Work() {
  return (
    <main className="flex flex-1 flex-col">
      <Grid className="items-center gap-y-6 pt-16 text-center sm:pt-24">
        <h1 className="col-span-4 text-h1-bold sm:col-span-12">Work</h1>
        <div className="col-span-4 sm:col-span-12">
          <Subnav />
        </div>
      </Grid>

      <Grid className="gap-y-12 pt-16 sm:pt-24">
        <div className="col-span-4 grid grid-cols-1 justify-items-center gap-x-6 gap-y-12 sm:col-span-12 sm:grid-cols-3">
          {projects.map((project) => (
            <ProjectWidget key={project.slug} project={project} size="lg" />
          ))}
        </div>
      </Grid>

      <ContactSection />
    </main>
  );
}
