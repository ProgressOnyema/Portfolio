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
 * (scale via transform, not padding, so layout/siblings never shift)
 */
export function ButtonPrimary({
  children,
  href,
  onClick,
  target,
  rel,
  className = "",
}: BaseProps & { children: ReactNode }) {
  const classes = `group inline-flex origin-center transform-gpu will-change-transform items-center justify-center gap-2 rounded-[5px] border border-border-hairline bg-surface-bg px-8 py-2 transition-[transform,border-radius,border-color,background-color] duration-300 ease-out hover:scale-[0.75] hover:rounded-[3px] hover:border-transparent hover:bg-inverse-surface-bg ${className}`;
  const textClasses =
    "text-body-reg-strong sm:text-body-lg-strong text-text-primary transition-colors duration-300 ease-out group-hover:text-inverse-text-primary";

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        <span className={textClasses}>{children}</span>
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      <span className={textClasses}>{children}</span>
    </button>
  );
}

/**
 * BtnSocial — matches Figma exactly:
 * default: 79x69, bordered, bg-surface-bg
 * hover: scaled to 0.75x (59.25x51.75) from center, no border, bg-inverse-surface
 * (icon inverts via currentColor). Scale via transform, not width/height, so
 * the box stays 79x69 in layout and neighboring elements never shift.
 */
export function ButtonSocial({
  children,
  href,
  target,
  rel,
  className = "",
}: BaseProps & { children: ReactNode }) {
  const classes = `flex h-[69px] w-[79px] origin-center transform-gpu will-change-transform items-center justify-center rounded-[5px] border border-border-hairline bg-surface-bg text-text-primary transition-[transform,border-radius,border-color,background-color,color] duration-300 ease-out hover:scale-[0.75] hover:rounded-[3px] hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
