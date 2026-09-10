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
 * hover: no border, bg-inverse-surface, 16px semibold text, px-24/py-6, radius-3
 */
export function ButtonPrimary({
  children,
  href,
  onClick,
  className = "",
}: BaseProps & { children: ReactNode }) {
  const classes = `group inline-flex items-center justify-center gap-2 rounded-[5px] border border-border-hairline bg-surface-bg px-8 py-2 transition-all hover:rounded-[3px] hover:border-transparent hover:bg-inverse-surface-bg hover:px-6 hover:py-1.5 ${className}`;
  const textClasses =
    "text-body-reg-strong sm:text-body-lg-strong text-text-primary transition-all group-hover:text-body-reg-strong group-hover:text-inverse-text-primary";

  if (href) {
    return (
      <a href={href} className={classes}>
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
 * hover: 59.25x51.75, no border, bg-inverse-surface (icon inverts via currentColor)
 */
export function ButtonSocial({
  children,
  href,
  target,
  rel,
  className = "",
}: BaseProps & { children: ReactNode }) {
  const classes = `flex h-[69px] w-[79px] items-center justify-center rounded-[5px] border border-border-hairline bg-surface-bg text-text-primary transition-all hover:h-[51.75px] hover:w-[59.25px] hover:rounded-[3px] hover:border-transparent hover:bg-inverse-surface-bg hover:text-inverse-text-primary ${className}`;

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
