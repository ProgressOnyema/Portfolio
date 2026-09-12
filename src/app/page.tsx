import { ButtonPrimary, ButtonSocial } from "@/components/Button";
import AppLink from "@/components/Link";
import Grid from "@/components/Grid";
import ListItem from "@/components/ListItem";
import ProjectWidget, { type ProjectWidgetData } from "@/components/ProjectWidget";
import { LinkedInIcon, BehanceIcon } from "@/components/Icons";

const FEATURED_PROJECTS: ProjectWidgetData[] = [
  { slug: "project-one", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-two", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-three", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-four", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-five", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-six", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
];

const HERO_TAGS = ["Strategy", "Brand Design", "UX/UI Design", "Interaction", "Frontend Development"];

const STATS = ["3+ Years Experience", "10+ Projects Completed", "4+ Design Systems"];
const CREDENTIALS = ["'23 Google UX Design Professional Certificate", "'20 Diploma in Web Design & Development"];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — box + text as a flex row within one full-width grid cell,
          so the fixed-width decorative box never overflows a grid track */}
      <Grid className="items-start pt-16 sm:pt-24">
        <div className="col-span-4 flex flex-col items-start gap-8 sm:col-span-12 sm:flex-row sm:gap-12">
          <div className="h-[104px] w-[123px] shrink-0 rounded-[5px] border-6 border-border-hairline bg-surface-bg-alt" />
          <div className="flex w-full max-w-[763px] flex-col items-start gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-h1-bold">
                Onyema Miracle,
                <br />-  Product and Brand designer
              </h1>
              <p className="text-h3 text-text-primary">
                For over 3 years, I&apos;ve worked across product design,
                branding, and front-end development to build visually
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
            {/* <ButtonPrimary href="/about">More about me</ButtonPrimary> */}
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
        <div className="col-span-4 grid grid-cols-1 gap-12 sm:col-span-12 sm:grid-cols-3 sm:gap-4">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectWidget key={project.slug} project={project} size="full" />
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

      {/* Contact — content: cols 1-8, socials: cols 9-12 aligned right */}
      <Grid className="items-end gap-y-8 py-24 sm:py-40">
        <div className="col-span-4 flex flex-col gap-12 sm:col-span-8">
          <p className="text-body-lg-strong sm:text-h3-bold">
            Available for
            <br />
            projects
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-body-lg-base sm:text-h3" style={{ color: "#858585" }}>
              Write to me
            </p>
            <AppLink variant="email" href="progressonyema5@gmail.com" />
          </div>
        </div>

        <div className="col-span-4 flex items-center gap-[15px] sm:col-span-4 sm:justify-end">
          <ButtonSocial href="https://linkedin.com" target="_blank" rel="noreferrer">
            <LinkedInIcon />
          </ButtonSocial>
          <ButtonSocial href="https://behance.net" target="_blank" rel="noreferrer">
            <BehanceIcon />
          </ButtonSocial>
        </div>
      </Grid>
    </main>
  );
}
