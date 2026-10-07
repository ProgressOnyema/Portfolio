import type { Metadata } from "next";
import Link from "next/link";
import Grid from "@/components/Grid";
import ContactSection from "@/components/ContactSection";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Page not found — Onyema Miracle",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col">
      <Grid className="pt-4 sm:pt-8">
        <div className="col-span-4 flex flex-col items-start gap-8 sm:col-span-12">
          <p className="text-h3 text-text-primary">
            404 —— This page doesn&apos;t exist, or it has moved.
          </p>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-mono-nav text-text-muted transition-colors hover:text-text-primary"
          >
            <ArrowIcon className="rotate-180 transition-transform group-hover:-translate-x-0.5" />
            <span>Back home</span>
          </Link>
        </div>
      </Grid>
      <ContactSection />
    </main>
  );
}
