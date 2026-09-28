import Grid from "@/components/Grid";
import ListItem from "@/components/ListItem";
import WorkGrid from "@/components/WorkGrid";
import ContactSection from "@/components/ContactSection";
import { projects } from "@/lib/data/projects";

const HERO_TAGS = ["Strategy", "Brand Design", "UX/UI Design", "Interaction", "Frontend Development"];

const STATS = ["3+ Years Experience", "10+ Projects Completed", "4+ Design Systems"];
// `image` is the credential's preview shown on hover (see ListItem).
const CREDENTIALS: { text: string; image?: string }[] = [
  { text: "'23 Google UX Design Professional Certificate", image: "/credentials/Google%20UX%20Design%20Certificate.jpg" },
  { text: "'20 Diploma in Web Design & Development", image: "/credentials/Diploma%20in%20web%20design.jpg" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero — box + text as a flex row within one full-width grid cell,
          so the fixed-width decorative box never overflows a grid track */}
      <Grid className="items-start pt-12 sm:pt-16">
        <div className="col-span-4 flex flex-col items-start gap-8 sm:col-span-12 sm:flex-col sm:gap-12">
          <div className="flex w-full max-w-[763px] flex-col items-start gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-h1-bold">
                Product and Brand designer
              </h1>
              <p className="text-h3 text-text-primary">
                Onyema Miracle —— I build products from the ground up, 
                taking ideas from initial research through design to prototyping.
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

      {/* Work — replaces the old "Featured Projects" preview. The
          standalone /work page has been dissolved; its full
          category-filterable project listing (WorkGrid) now lives here
          instead, so this is the site's one project listing rather than
          a preview linking out to a second one. scroll-mt offsets the
          fixed h-[106px] header so Navbar's "Work" link (/#work) lands
          below it, not underneath it. */}
      <div id="work" className="scroll-mt-[106px]">
        <WorkGrid projects={projects} />
      </div>

      {/* Stats + credentials — 4:8 column ratio matches the 350:703 short:long widths */}
      <Grid className="gap-y-8 pt-24 sm:pt-40">
        <div className="col-span-4 flex flex-col">
          {STATS.map((stat) => (
            <ListItem key={stat} type="short">{stat}</ListItem>
          ))}
        </div>
        <div className="col-span-4 flex flex-col sm:col-span-8">
          {CREDENTIALS.map((credential) => (
            <ListItem key={credential.text} type="long" image={credential.image} imageAlt={credential.text}>
              {credential.text}
            </ListItem>
          ))}
        </div>
      </Grid>

      <ContactSection />
    </main>
  );
}
