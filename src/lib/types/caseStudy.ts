// Rich text: a paragraph is an array of spans, each either plain text or
// text with inline emphasis (italics). No markdown parser/library needed -
// content is authored directly in this structured shape.
export type RichSpan = string | { text: string; emphasis?: boolean };
export type Paragraph = RichSpan[];

export type TextBlock = {
  type: "text";
  heading?: string;
  body: Paragraph[];
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
  body: Paragraph[];
  imagePosition?: "left" | "right" | "top";
};

export type Block = TextBlock | ImageGridBlock | MetaBlock | MediaTextBlock | GridBlock;

// Generic layout wrapper: arranges any set of child blocks into columns.
// Defined after Block so it can reference it (a grid's items can be any
// block type, including another grid).
export type GridBlock = {
  type: "grid";
  columns: number;
  items: Block[];
};
