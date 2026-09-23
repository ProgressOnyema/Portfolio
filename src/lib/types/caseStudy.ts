// Rich text: a paragraph is an array of spans, each either plain text or
// text with inline emphasis (italics). No markdown parser/library needed -
// content is authored directly in this structured shape.
export type RichSpan = string | { text: string; emphasis?: boolean };
export type Paragraph = RichSpan[];

// A bullet or numbered list, authored as a sibling to Paragraph within a
// body's TextNode[] rather than a Paragraph variant - it needs its own
// shape (a plain object, not a bare array) so RichText.tsx can tell a
// list apart from an ordinary paragraph at render time with a simple
// Array.isArray check (see RichText.tsx's renderNode).
export type ListBlock = {
  type: "list";
  ordered: boolean;
  items: RichSpan[][];
};

// What a text body is made of: any mix of paragraphs and lists, in
// authored order. TextBlock/MediaTextBlock/QuoteBlock's `body` is this,
// not Paragraph[] - a rename would ripple further than it's worth, so
// the field is still called `body` everywhere it's used.
export type TextNode = Paragraph | ListBlock;

export type TextBlock = {
  type: "text";
  heading?: string;
  body: TextNode[];
  variant?: "default" | "pullQuote";
};

export type ImageGridImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ImageGridBlock = {
  type: "imageGrid";
  columns: 1 | 2 | 3;
  images: ImageGridImage[];
};

// Same shape as ImageGridBlock, rendered as a continuously
// auto-scrolling horizontal marquee instead of a static grid — kept as
// a separate block type (rather than a variant flag on ImageGridBlock)
// so both remain available as distinct authoring options. `columns` is
// carried over for parity/tag-argument compatibility with ImageGridBlock
// but is intentionally unused by MarqueeGrid.tsx.
export type MarqueeGridBlock = {
  type: "marqueeGrid";
  columns: 1 | 2 | 3;
  images: ImageGridImage[];
};

// Label/value content (Industry, What I did, Platform, etc.) - just
// content like any other block, no built-in layout/positioning of its own.
export type MetaField = {
  label: string;
  value: string;
};

export type MetaBlock = {
  type: "meta";
  logo?: { src: string; alt: string };
  fields: MetaField[];
};

// Image + heading + body as one cohesive unit.
export type MediaTextBlock = {
  type: "mediaText";
  image: { src: string; alt: string };
  heading?: string;
  body: TextNode[];
  imagePosition?: "left" | "right" | "top";
};

// Embedded/looping video.
export type VideoBlock = {
  type: "video";
  src: string;
  poster?: string;
  variant?: "fullWidth" | "contained";
  /** Background-style: muted, looped, autoplaying. Otherwise click-to-play with controls. */
  autoplay?: boolean;
};

// A row of key metrics/results.
export type StatItem = {
  value: string;
  label: string;
};

export type StatsBlock = {
  type: "stats";
  items: StatItem[];
};

// A single full-bleed hero/cover image, distinct from ImageGridBlock which
// implies a multi-image layout.
export type CoverImageBlock = {
  type: "coverImage";
  src: string;
  alt: string;
  caption?: string;
};

// A testimonial/quote from someone else, with attribution - distinct from
// TextBlock's pullQuote variant (which is just your own emphasized text).
export type QuoteAttribution = {
  name: string;
  role?: string;
  avatar?: string;
};

export type QuoteBlock = {
  type: "quote";
  body: TextNode[];
  attribution: QuoteAttribution;
};

// A button or link pointing to a live site, prototype, or repo.
export type CtaBlock = {
  type: "cta";
  label: string;
  href: string;
  style?: "primary" | "link";
};

export type Block =
  | TextBlock
  | ImageGridBlock
  | MarqueeGridBlock
  | MetaBlock
  | MediaTextBlock
  | GridBlock
  | VideoBlock
  | StatsBlock
  | CoverImageBlock
  | QuoteBlock
  | CtaBlock;

// Generic layout wrapper: arranges any set of child blocks into columns.
// Defined after Block so it can reference it (a grid's items can be any
// block type, including another grid).
export type GridBlock = {
  type: "grid";
  columns: number;
  items: Block[];
};
