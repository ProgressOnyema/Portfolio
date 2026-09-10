import { ButtonPrimary, ButtonSocial } from "@/components/Button";
import AppLink from "@/components/Link";
import ListItem from "@/components/ListItem";
import ProjectWidget, { type ProjectWidgetData } from "@/components/ProjectWidget";
import { LinkedInIcon, BehanceIcon } from "@/components/Icons";

const FEATURED_PROJECTS: ProjectWidgetData[] = [
  { slug: "project-one", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-two", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
  { slug: "project-three", name: "Project Name", oneLiner: "One liner describing project", tags: ["UX/UI", "Brand"] },
];

const STATS = ["3+ Years Experience", "10+ Projects Completed", "4+ Design Systems"];
const CREDENTIALS = ["'23 Google UX Design Professional Certificate", "'20 Diploma in Web Design & Development"];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-12 px-5 pt-16 sm:flex-row sm:px-6 sm:pt-24">
        <div className="h-[104px] w-[123px] shrink-0 rounded-[5px] border-6 border-border-hairline bg-surface-bg-alt" />
        <div className="flex w-full max-w-[763px] flex-col items-start gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-h1-bold">
              Onyema Miracle,
              <br />a Product and Brand designer
            </h1>
            <p className="text-h3 text-text-primary">
              For over 3 years, I&apos;ve worked across product design,
              branding, and front-end development to build visually
              compelling, high-performing web and mobile experiences.
            </p>
          </div>
          <ButtonPrimary href="/about">More about me</ButtonPrimary>
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-5 pt-24 sm:gap-12 sm:px-6 sm:pt-40">
        <div className="flex items-center justify-between">
          <h2 className="text-body-lg-strong sm:text-h3-bold">Featured Projects</h2>
          <AppLink variant="view-work" href="/work" />
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectWidget key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* Stats + credentials */}
      <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 pt-24 sm:flex-row sm:gap-6 sm:px-6 sm:pt-40">
        <div className="flex flex-col gap-4">
          {STATS.map((stat) => (
            <ListItem key={stat} type="short">{stat}</ListItem>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {CREDENTIALS.map((credential) => (
            <ListItem key={credential} type="long">{credential}</ListItem>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto flex w-full max-w-[996px] flex-col items-start gap-8 px-5 py-24 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-40">
        <div className="flex flex-col gap-12">
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

        <div className="flex items-center gap-[15px]">
          <ButtonSocial href="https://linkedin.com" target="_blank" rel="noreferrer">
            <LinkedInIcon />
          </ButtonSocial>
          <ButtonSocial href="https://behance.net" target="_blank" rel="noreferrer">
            <BehanceIcon />
          </ButtonSocial>
        </div>
      </section>
    </main>
  );
}
