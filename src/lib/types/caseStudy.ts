export type TextBlock = {
  type: "text";
  heading?: string;
  body: string;
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

export type Block = TextBlock | ImageGridBlock;
