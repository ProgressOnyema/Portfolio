import type { ReactNode } from "react";

type BaseProps = {
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  className?: string;
};

/**
 * BtnPrimary — matches Figma exactly:
 * default: bordered, bg-surface-bg, 20px bold text, px-32/py-8, radius-5
 * hover: no border, bg-inverse-surface, radius-3, scaled to 0.75x from center
 * (scale via the CSS `scale` property, not padding, so layout/siblings never
 * shift — Tailwind v4's `scale-*` utilities set `scale`, not `transform`, so
 * `scale` is what must be listed in `transition-[...]` for it to animate)
 */
export function ButtonPrimary({
  children,
  href,
  onClick,
  target,
  rel,
  className = "",
}: BaseProps & { children: ReactNode }) {
  // The hit target (`group`) never resizes — only its inner visual layer
  // scales via `group-hover`. Scaling the same element that owns `:hover`
  // shrinks its own hit box, so the cursor falls outside it, hover drops,
  // it snaps back, the cursor re-enters, and it flickers/jitters in a loop.
  const outerClasses = `group inline-flex items-center justify-center ${className}`;
  const innerClasses =
    "inline-flex origin-center transform-gpu will-change-[scale] items-center justify-center gap-2 rounded-[5px] border border-border-hairline bg-surface-bg px-8 py-2 transition-[scale,border-radius,border-color,background-color] duration-300 ease-in-out group-hover:scale-[0.75] group-hover:rounded-[3px] group-hover:border-transparent group-hover:bg-inverse-surface-bg";
  const textClasses =
    "text-body-reg-strong sm:text-body-lg-strong text-text-primary transition-colors duration-300 ease-in-out group-hover:text-inverse-text-primary";

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={outerClasses}>
        <span className={innerClasses}>
          <span className={textClasses}>{children}</span>
        </span>
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={outerClasses}>
      <span className={innerClasses}>
        <span className={textClasses}>{children}</span>
      </span>
    </button>
  );
}

/**
 * BtnSocial — matches Figma exactly:
 * default: 79x69, bordered, bg-surface-bg
 * hover: scaled to 0.75x (59.25x51.75) from center, no border, bg-inverse-surface
 * (icon inverts via currentColor). Scale via the CSS `scale` property, not
 * width/height, so the box stays 79x69 in layout and neighboring elements
 * never shift. (Tailwind v4's `scale-*` sets `scale`, not `transform` — that's
 * what must be listed in `transition-[...]` for the change to animate.)
 */
export function ButtonSocial({
  children,
  href,
  target,
  rel,
  className = "",
}: BaseProps & { children: ReactNode }) {
  // Same hit-target/visual split as ButtonPrimary, and for the same reason:
  // the outer 79x69 box (`group`) stays fixed so its hover hit area never
  // shrinks; only the inner layer scales via `group-hover`.
  const outerClasses = `group flex h-[69px] w-[79px] items-center justify-center ${className}`;
  const innerClasses =
    "flex h-full w-full origin-center transform-gpu will-change-[scale] items-center justify-center rounded-[5px] border border-border-hairline bg-surface-bg text-text-primary transition-[scale,border-radius,border-color,background-color,color] duration-300 ease-in-out group-hover:scale-[0.75] group-hover:rounded-[3px] group-hover:border-transparent group-hover:bg-inverse-surface-bg group-hover:text-inverse-text-primary";

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={outerClasses}>
        <span className={innerClasses}>{children}</span>
      </a>
    );
  }
  return (
    <button type="button" className={outerClasses}>
      <span className={innerClasses}>{children}</span>
    </button>
  );
}
