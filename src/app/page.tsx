import AppLink from "@/components/Link";
import Grid from "@/components/Grid";
import ListItem from "@/components/ListItem";
import ProjectWidget from "@/components/ProjectWidget";
import ContactSection from "@/components/ContactSection";
import { getFeaturedProjects } from "@/lib/data/projects";

const HERO_TAGS = ["Strategy", "Brand Design", "UX/UI Design", "Interaction", "Frontend Development"];

const STATS = ["3+ Years Experience", "10+ Projects Completed", "4+ Design Systems"];
const CREDENTIALS = ["'23 Google UX Design Professional Certificate", "'20 Diploma in Web Design & Development"];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — box + text as a flex row within one full-width grid cell,
          so the fixed-width decorative box never overflows a grid track */}
      <Grid className="items-start pt-16 sm:pt-24">
        <div className="col-span-4 flex flex-col items-start gap-8 sm:col-span-12 sm:flex-col sm:gap-12">
          <div className="h-[104px] w-[123px] shrink-0 rounded-[5px] border-6 border-border-hairline bg-surface-bg-alt" />
          <div className="flex w-full max-w-[763px] flex-col items-start gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-h1-bold">
                Product and Brand designer
              </h1>
              <p className="text-h3 text-text-primary">
                Onyema Miracle —— has worked across product design,
                branding, and front-end development building visually
                compelling, high-performing web and mobile experiences.
              </p>
              <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
                {HERO_TAGS.map((tag) => (
                  <p key={tag} className="text-body-reg-base text-text-muted">
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Grid>

      {/* Featured projects — heading spans full width; widgets live in
          their own container grid with a tighter internal gap than the
          space between the heading and the container itself */}
      <Grid className="gap-y-16 pt-24 sm:gap-y-12 sm:pt-40">
        <div className="col-span-4 flex items-center justify-between sm:col-span-12">
          <h2 className="text-body-lg-strong sm:text-h3-bold">Featured Projects</h2>
          <AppLink variant="view-work" href="/work">All</AppLink>
        </div>
        <div className="col-span-4 grid grid-cols-1 gap-y-12 sm:col-span-12 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12">
          {getFeaturedProjects().map((project) => (
            <ProjectWidget key={project.projectId} project={project} size="full" />
          ))}
        </div>
      </Grid>

      {/* Stats + credentials — 4:8 column ratio matches the 350:703 short:long widths */}
      <Grid className="gap-y-8 pt-24 sm:pt-40">
        <div className="col-span-4 flex flex-col gap-4">
          {STATS.map((stat) => (
            <ListItem key={stat} type="short">{stat}</ListItem>
          ))}
        </div>
        <div className="col-span-4 flex flex-col gap-4 sm:col-span-8">
          {CREDENTIALS.map((credential) => (
            <ListItem key={credential} type="long">{credential}</ListItem>
          ))}
        </div>
      </Grid>

      <ContactSection />
    </main>
  );
}
