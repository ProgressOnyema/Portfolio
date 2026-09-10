import NextLink from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon, DocumentIcon } from "./Icons";

type LinkVariant = "view-work" | "open-resume" | "email";

export default function AppLink({
  variant,
  href,
  children,
  className = "",
}: {
  variant: LinkVariant;
  href: string;
  children?: ReactNode;
  className?: string;
}) {
  const baseClasses =
    "group inline-flex items-center gap-2 text-text-primary transition-colors hover:text-text-muted";

  if (variant === "view-work") {
    return (
      <NextLink href={href} className={`${baseClasses} text-body-reg-base ${className}`}>
        <span>{children ?? "View all work"}</span>
        <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
      </NextLink>
    );
  }

  if (variant === "open-resume") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${baseClasses} text-body-reg-base ${className}`}
      >
        <DocumentIcon />
        <span>{children ?? "Open Resume"}</span>
      </a>
    );
  }

  // email — Headings/H3 Bold (24px) on desktop, Body Large/Strong (20px) on
  // mobile per the confirmed mobile frame spec.
  return (
    <a href={`mailto:${href}`} className={`${baseClasses} text-body-lg-strong sm:text-h3-bold ${className}`}>
      {children ?? `@${href}`}
    </a>
  );
}
