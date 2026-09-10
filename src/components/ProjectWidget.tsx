import Link from "next/link";

export type ProjectWidgetData = {
  slug: string;
  name: string;
  oneLiner: string;
  tags: string[];
};

const SIZE_CLASSES = {
  default: "max-w-[347px]",
  lg: "max-w-[386px]",
};

export default function ProjectWidget({
  project,
  size = "default",
}: {
  project: ProjectWidgetData;
  size?: "default" | "lg";
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group flex w-full flex-col gap-4 ${SIZE_CLASSES[size]}`}
    >
      {/*
        folder / folder_lg — same 350:255 aspect ratio at both sizes.
        Placeholder gradient in place of the real illustrated cover art
        (Figma's asset URLs aren't reachable from this sandbox). Swap the
        gradient div below for a real <Image> per project when ready.
      */}
      <div className="relative aspect-[350/255] w-full overflow-hidden rounded-md border border-border-hairline bg-gradient-to-br from-[#f28fb0] via-[#8fe3c0] to-[#a988e8] transition-transform group-hover:-translate-y-1">
        <div className="absolute bottom-4 left-4 flex gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-label rounded-[5px] bg-surface-bg px-2 py-1 text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* project_meta */}
      <div className="flex h-[47px] items-center gap-2">
        <div className="size-[39px] shrink-0 rounded-[12px] bg-surface-bg-alt" />
        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          <p className="text-body-reg-strong truncate">{project.name}</p>
          <p className="text-body-sm-base truncate text-text-muted">
            {project.oneLiner}
          </p>
        </div>
      </div>
    </Link>
  );
}
