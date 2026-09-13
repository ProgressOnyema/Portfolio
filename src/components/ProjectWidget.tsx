import Image from "next/image";
import Link from "next/link";
import { FolderBackIcon, FolderCoverIcon } from "./Icons";

export type ProjectWidgetData = {
  slug: string;
  name: string;
  oneLiner: string;
  tags: string[];
};

const SIZE_CLASSES = {
  default: "sm:max-w-[347px]",
  lg: "sm:max-w-[405.5px]",
  full: "",
};

// Layer positions as percentages of the folder container, so the same
// layout scales correctly across all widget sizes. Values re-derived from
// the confirmed ProjectWidgetLg spec (405.5x295.5) — same aspect ratio as
// the original 350x255 spec, just fresher/more precise source numbers.
const IMAGE2_STYLE = {
  top: `${(25 / 295.5) * 100}%`,
  height: `${(179 / 295.5) * 100}%`,
  width: `${(373 / 405.5) * 100}%`,
};
const IMAGE1_STYLE = {
  top: `${(62 / 295.5) * 100}%`,
  height: `${(176 / 295.5) * 100}%`,
  width: `${(373 / 405.5) * 100}%`,
};
const COVER_STYLE = {
  top: `${(179 / 295.5) * 100}%`,
  height: `${(117 / 295.5) * 100}%`,
};

export default function ProjectWidget({
  project,
  size = "default",
}: {
  project: ProjectWidgetData;
  size?: "default" | "lg" | "full";
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group flex w-full flex-col gap-4 ${SIZE_CLASSES[size]}`}
    >
      {/* folder / folder_lg — real layered artwork: folder_back, two
          overlapping paint-texture images, then folder_cover on top */}
      <div className="relative aspect-[350/255] w-full overflow-hidden rounded-md transition-transform group-hover:-translate-y-1">
        {/* folder_back — theme-aware (color/surface/bg-alt), not a static image */}
        <div className="absolute inset-0 text-surface-bg-alt">
          <FolderBackIcon className="h-full w-full" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2" style={IMAGE2_STYLE}>
          <Image src="/folder-assets/folder_image2.png" alt="" fill className="object-contain" sizes="400px" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2" style={IMAGE1_STYLE}>
          <Image src="/folder-assets/folder_image1.png" alt="" fill className="object-contain" sizes="400px" />
        </div>
        {/* folder_cover — theme-aware (color/surface/bg-alt), not a static image */}
        <div className="absolute inset-x-0 text-surface-bg-alt" style={COVER_STYLE}>
          <FolderCoverIcon className="h-full w-full" />
        </div>

        <div className="absolute bottom-4 left-4 z-10 flex gap-1">
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
        {/* project logo — placeholder using the same folder artwork until
            each project has a real logo */}
        <div className="relative size-[39px] shrink-0 overflow-hidden rounded-[12px] bg-surface-bg-alt">
          <Image
            src="/folder-assets/folder_image1.png"
            alt=""
            fill
            className="object-cover"
            sizes="39px"
          />
        </div>
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
