import Link from "next/link";

export type ProjectWidgetData = {
  slug: string;
  name: string;
  oneLiner: string;
  tags: string[];
};

const SIZE_CLASSES = {
  default: { maxWidth: "max-w-[347px]", notchRadius: 22 },
  lg: { maxWidth: "max-w-[386px]", notchRadius: 24 },
};

export default function ProjectWidget({
  project,
  size = "default",
}: {
  project: ProjectWidgetData;
  size?: "default" | "lg";
}) {
  const { maxWidth, notchRadius } = SIZE_CLASSES[size];

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group flex w-full flex-col gap-4 ${maxWidth}`}
    >
      {/*
        folder / folder_lg — same 350:255 aspect ratio at both sizes.
        Reconstructed as two layers (folder_back + folder_cover) with a
        circular notch cut into the cover's top edge, matching the real
        Figma folder shape. Placeholder colors stand in for the illustrated
        artwork (Figma's asset URLs aren't reachable from this sandbox) —
        swap folder_back's gradient for a real project image per project.
      */}
      <div className="relative aspect-[350/255] w-full overflow-hidden rounded-md border border-border-hairline transition-transform group-hover:-translate-y-1">
        {/* folder_back — full-bleed illustration layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f28fb0] via-[#8fe3c0] to-[#a988e8]" />

        {/* folder_cover — bottom flap with a circular notch cut from its top edge */}
        <div
          className="absolute inset-x-0 bottom-0 h-[36%] bg-surface-bg-alt"
          style={{
            maskImage: `radial-gradient(circle ${notchRadius}px at 50% 0%, transparent ${notchRadius}px, black ${notchRadius + 0.5}px)`,
            WebkitMaskImage: `radial-gradient(circle ${notchRadius}px at 50% 0%, transparent ${notchRadius}px, black ${notchRadius + 0.5}px)`,
          }}
        />

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
