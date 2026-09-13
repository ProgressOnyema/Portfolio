import WorkGrid from "@/components/WorkGrid";
import ContactSection from "@/components/ContactSection";
import { projects } from "@/lib/data/projects";

export default function Work() {
  return (
    <main className="flex flex-1 flex-col">
      <WorkGrid projects={projects} />
      <ContactSection />
    </main>
  );
}
