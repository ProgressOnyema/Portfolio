"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import ThemeToggle from "./ThemeToggle";
import { MobileNavIcon, CloseIcon } from "./Icons";

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
    <>
      {/* Dark overlay behind the mobile nav, covering the full page below
          the header so the open menu reads as modal. Sits under the
          header's own z-50 (the dropdown itself is a header child, so it
          stays un-dimmed) but above the page content. Clicking it closes
          the menu, same as picking a link. */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="fixed top-0 left-0 z-50 w-full bg-surface-bg/80 backdrop-blur-lg sm:bg-surface-bg sm:backdrop-blur-none">
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
              state too, but the icon is swapped to an X here per direct
              instruction, so the toggle reads clearly as open/close. */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="relative z-50 flex h-[51px] w-[54px] items-center justify-center text-text-primary sm:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MobileNavIcon />}
          </button>
        </nav>

        {/* Mobile dropdown — matches Figma's MobileNavCollasped component:
            Home/Me/Work/Contact at Headings/H2 size (not the compact
            desktop nav size), gap-3 (12px), active item bold. No
            background of its own — it's a child of <header>, which
            already provides the translucent, blurred surface; painting a
            solid bg here would sit on top of that and hide the blur for
            this whole region, so the header's own background just shows
            through underneath it instead. */}
        {mobileOpen && (
          <div className="flex flex-col items-start gap-4 px-6 pt-1 pb-6 sm:hidden">
            <div className="flex flex-col items-start gap-8 py-3">
              {LINKS.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                  <NavItem label={label} active={isActive(href)} size="lg" />
                </Link>
              ))}
              <a href={CONTACT_HREF} onClick={() => setMobileOpen(false)}>
                <NavItem label="Contact" size="lg" />
              </a>
            </div>

            <div>
              <ThemeToggle />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
