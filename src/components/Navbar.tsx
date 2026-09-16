"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import ThemeToggle from "./ThemeToggle";
import { MobileNavIcon } from "./Icons";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Me" },
  { href: "/work", label: "Work" },
];

const CONTACT_HREF = "mailto:progressonyema5@gmail.com";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-surface-bg">
      <nav className="mx-auto flex h-[106px] max-w-[1440px] items-center justify-end px-5 sm:px-6 lg:px-[88px]">
        {/* Desktop links — centered, gap-12 (48px). Theme toggle is now
            part of this same row, not separately positioned. */}
        <div className="hidden items-center gap-12 sm:flex">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              <NavItem label={label} active={isActive(href)} />
            </Link>
          ))}
          <a href={CONTACT_HREF}>
            <NavItem label="Contact" />
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile: real MobileNav component (53.875 x 51.140625). Figma's
            MobileNavCollasped shows the same hamburger icon in the open
            state too — it doesn't swap to an X — so this button doesn't
            either; only its aria-expanded state and the panel below
            change. */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="flex h-[51px] w-[54px] items-center justify-center text-text-primary sm:hidden"
        >
          <MobileNavIcon />
        </button>
      </nav>

      {/* Mobile dropdown — matches Figma's MobileNavCollasped component:
          Home/Me/Work/Contact at Headings/H2 size (not the compact
          desktop nav size), gap-3 (12px), active item bold. */}
      {mobileOpen && (
        <div className="flex flex-col items-start gap-3 border-t border-border-hairline bg-surface-bg px-6 py-6 sm:hidden">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <NavItem label={label} active={isActive(href)} size="lg" />
            </Link>
          ))}
          <a href={CONTACT_HREF} onClick={() => setMobileOpen(false)}>
            <NavItem label="Contact" size="lg" />
          </a>
          <div className="mt-2">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
