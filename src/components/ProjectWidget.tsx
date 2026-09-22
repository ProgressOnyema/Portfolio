import Image from "next/image";
import Link from "next/link";
import { FolderBackIcon, FolderCoverIcon } from "./Icons";

export type ProjectCategory = "Product Design" | "Branding" | "Development";

export type ProjectWidgetData = {
  slug: string;
  name: string;
  oneLiner: string;
  category: ProjectCategory;
  /** Real cover images for the widget card, in the same two-layer
   *  arrangement as the placeholder paint-texture illustration. Falls
   *  back to the placeholder when not provided. */
  thumbnails?: [string, string];
  /** Real logo shown next to the name/one-liner. Falls back to a
   *  placeholder image when not provided. */
  logo?: string;
  /** When a project has multiple case studies (UI/UX, Branding,
   *  Development) collapsed into one featured-projects card, this lists
   *  every category represented so the tag pills reflect all of them
   *  (e.g. the /DEV pill shows even though `category` itself is Product
   *  Design). Omit for a normal single-case-study widget. */
  caseStudyCategories?: ProjectCategory[];
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
  height: `${(183 / 295.5) * 100}%`,
  width: `${(373 / 405.5) * 100}%`,
};
const IMAGE1_STYLE = {
  top: `${(62 / 295.5) * 100}%`,
  height: `${(180 / 295.5) * 100}%`,
  width: `${(373 / 405.5) * 100}%`,
};
const COVER_STYLE = {
  bottom: 0,
  height: "33%",
};

const CATEGORY_ORDER: ProjectCategory[] = ["Product Design", "Branding", "Development"];

// Every widget's tag pills come strictly from category — never free-text
// tags — so only these three labels can ever appear.
const CATEGORY_PILL: Record<ProjectCategory, string> = {
  "Product Design": "UX/UI",
  Branding: "BRAND",
  Development: "/DEV",
};

export default function ProjectWidget({
  project,
  size = "default",
  hideMeta = false,
}: {
  project: ProjectWidgetData;
  size?: "default" | "lg" | "full";
  /** Hides the logo/name/one-liner row below the folder artwork — used
   *  by the case-study page's "Next Project" list, where the project
   *  name is redundant with the tag pills already shown on the card. */
  hideMeta?: boolean;
}) {
  // For a merged multi-case-study widget, caseStudyCategories carries every
  // category in the group, so e.g. the /DEV pill still shows even when the
  // representative case study itself isn't the Development one. Ordered and
  // deduped so pills are always UX/UI, then BRAND, then /DEV.
  const categories = project.caseStudyCategories ?? [project.category];
  const displayTags = CATEGORY_ORDER.filter((c) => categories.includes(c)).map((c) => CATEGORY_PILL[c]);

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group flex w-full flex-col gap-4 ${SIZE_CLASSES[size]}`}
    >
      {/* folder / folder_lg — real layered artwork: folder_back, two
          overlapping images, then folder_cover on top. When the project
          has real thumbnails, they replace the placeholder paint-texture
          images in the same two positions (folder_back stays as the
          base layer either way). Both layers use object-cover, not
          object-contain: IMAGE1_STYLE/IMAGE2_STYLE are precise pixel
          slots from the Figma spec (~2.04-2.07:1), and a real thumbnail
          (e.g. a 16:9 screenshot) won't naturally match that ratio.
          object-cover fills the exact intended slot, cropping any excess,
          instead of leaving letterboxed gaps down the sides. Matches the
          same treatment already used for the logo below. */}
      <div className="relative aspect-[350/255] w-full overflow-hidden rounded-md transition-transform group-hover:-translate-y-1">
        {/* folder_back — theme-aware (color/surface/bg-alt), not a static image */}
        <div className="absolute inset-0 text-surface-bg-alt">
          <FolderBackIcon className="h-full w-full" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2" style={IMAGE2_STYLE}>
          <Image
            src={project.thumbnails?.[1] ?? "/folder-assets/folder_image2.png"}
            alt=""
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2" style={IMAGE1_STYLE}>
          <Image
            src={project.thumbnails?.[0] ?? "/folder-assets/folder_image1.png"}
            alt=""
            fill
            className="object-cover"
            sizes="400px"
          />
        </div>
        {/* folder_cover — theme-aware (color/surface/bg-alt), not a static image */}
        <div className="absolute inset-x-0 text-surface-bg-alt" style={COVER_STYLE}>
          <FolderCoverIcon className="h-full w-full" />
        </div>

        <div className="absolute bottom-4 left-4 z-10 flex gap-1">
          {displayTags.map((tag) => (
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
      {!hideMeta && (
        <div className="flex h-[47px] items-center gap-2">
          {/* project logo — falls back to placeholder artwork until the
              project has a real logo */}
          <div className="relative size-[39px] shrink-0 overflow-hidden rounded-[12px] bg-surface-bg-alt">
            <Image
              src={project.logo ?? "/folder-assets/folder_image1.png"}
              alt=""
              fill
              className="object-cover"
              sizes="39px"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center overflow-hidden">
            <p className="text-body-reg-strong truncate">{project.name}</p>
            <p className="text-body-sm-base truncate text-text-body">
              {project.oneLiner}
            </p>
          </div>
        </div>
      )}
    </Link>
  );
}
