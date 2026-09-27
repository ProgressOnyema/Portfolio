"use client";

import { useState } from "react";
import Grid from "./Grid";
import Subnav from "./Subnav";
import ProjectWidget, { type ProjectCategory, type ProjectWidgetData } from "./ProjectWidget";

// Was the standalone /work page (its own h1 "Work /" page title, two
// separate <Grid> blocks with page-top spacing). Now lives as a section
// on the home page in place of what used to be "Featured Projects", so
// the heading has been downsized to match that section's h2 treatment
// and the two Grids merged into one with the home page's own section
// spacing (pt-24/pt-40, matching its sibling sections) instead of
// pt-8/pt-12 page-top spacing.
export default function WorkGrid({ projects }: { projects: ProjectWidgetData[] }) {
  const [active, setActive] = useState<ProjectCategory>("Product Design");
  const filtered = projects.filter((project) => project.category === active);

  return (
    <Grid className="gap-y-8 pt-24 sm:gap-y-12 sm:pt-40">
      <h2 className="col-span-4 text-body-lg-strong sm:col-span-12 sm:text-h3-bold">Work</h2>
      <div className="col-span-4 sm:col-span-12">
        <Subnav active={active} onSelect={setActive} />
      </div>
      <div className="col-span-4 grid grid-cols-1 gap-x-6 gap-y-12 sm:col-span-12 sm:grid-cols-3">
        {filtered.map((project) => (
          <ProjectWidget key={project.slug} project={project} size="lg" />
        ))}
      </div>
    </Grid>
  );
}
