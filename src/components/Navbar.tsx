"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
];

const CONTACT_HREF = "mailto:progressonyema5@gmail.com";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="w-full bg-surface-bg">
      <nav className="relative mx-auto flex h-[106px] max-w-[1440px] items-center justify-between px-6 sm:justify-center">
        {/* Desktop links — centered, gap-12 (48px), matches Figma exactly */}
        <div className="hidden items-center gap-12 sm:flex">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href}>
              <NavItem label={label} active={isActive(href)} />
            </Link>
          ))}
          <a href={CONTACT_HREF}>
            <NavItem label="Contact" />
          </a>
        </div>

        {/* Mobile: brand mark + hamburger (no Figma mobile spec — own judgment) */}
        <p className="text-body-reg-strong sm:hidden">Menu</p>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="flex size-9 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <span
            className={`h-px w-5 bg-text-primary transition-transform ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-5 bg-text-primary transition-transform ${mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 sm:block">
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="flex flex-col items-start gap-2 border-t border-border-hairline px-6 py-6 sm:hidden">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <NavItem label={label} active={isActive(href)} />
            </Link>
          ))}
          <a href={CONTACT_HREF} onClick={() => setMobileOpen(false)}>
            <NavItem label="Contact" />
          </a>
          <div className="mt-2">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
