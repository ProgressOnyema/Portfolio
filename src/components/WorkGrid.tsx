"use client";

import { useState } from "react";
import Grid from "./Grid";
import Subnav from "./Subnav";
import ProjectWidget, { type ProjectCategory, type ProjectWidgetData } from "./ProjectWidget";

export default function WorkGrid({ projects }: { projects: ProjectWidgetData[] }) {
  const [active, setActive] = useState<ProjectCategory>("Product Design");
  const filtered = projects.filter((project) => project.category === active);

  return (
    <>
      <Grid className="items-center gap-y-6 pt-16 text-center sm:pt-24">
        <h1 className="col-span-4 text-h1-bold sm:col-span-12">Work</h1>
        <div className="col-span-4 sm:col-span-12">
          <Subnav active={active} onSelect={setActive} />
        </div>
      </Grid>

      <Grid className="gap-y-12 pt-16 sm:pt-24">
        <div className="col-span-4 grid grid-cols-1 justify-items-center gap-x-6 gap-y-12 sm:col-span-12 sm:grid-cols-3">
          {filtered.map((project) => (
            <ProjectWidget key={project.slug} project={project} size="lg" />
          ))}
        </div>
      </Grid>
    </>
  );
}
