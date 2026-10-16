import type { Metadata } from "next";
import Image from "next/image";
import Grid from "@/components/Grid";
import ContactSection from "@/components/ContactSection";
import { EafcIcon } from "@/components/EafcIcon";

export const metadata: Metadata = {
  title: "About — Onyema Miracle",
  description:
    "I build products from the ground up, taking ideas from initial research through design to shipping 🚀 — strategy, branding, UX/UI, interaction, and full stack development.",
};

const SKILLS = ["Strategy", "Branding", "UX/UI Design", "Interaction", "Full Stack Dev."];

const BOOKS = ["dont_make_me_think", "design_of_everyday_things", "shape_of_design", "psychology_of_money"];
const FILMS = ["the_last_airbender", "naruto", "the_lucky_one", "vikings"];
const ARTISTS = ["thecavemen", "jcole", "kendricklamar", "fatai", "fireboy"];

export default function About() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Bio */}
      <Grid className="items-start pt-4 sm:pt-8">
        <div className="col-span-4 flex flex-col items-start gap-8 sm:col-span-12 sm:flex-col sm:gap-12">
          <div className="flex w-full max-w-[800px] flex-col items-start gap-4">
            <p className="text-h3 text-text-primary">
              I take <em>it</em> personal —— Whatever stage of the game the product is in, I guarantee
              to bring in a set of skills to contribute to its growth.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {SKILLS.map((skill) => (
                <p key={skill} className="text-mono-tag text-text-muted">
                  {skill}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Grid>

      {/* Fun facts — one flowing sentence: a single <p> with inline images,
          not separate flex blocks (which was the cause of the scattered
          look — each phrase/icon-group was wrapping as its own rigid unit
          instead of reflowing together like real prose).

          Accessibility: the icon groups are the nouns of the sentence, so
          each group is wrapped in a role="img" span with a short label
          (the individual images stay alt=""), which makes a screen reader
          read "reading books, watching films, and listening to others'
          perspectives". The artist icons sit right before "to others'
          perspectives" and would make the grammar wrong if labelled, so
          that group is aria-hidden. */}
      <Grid className="pt-24 sm:pt-40">
        <p className="col-span-4 text-h1-bold sm:text-h2-bold lg:text-center sm:text-left [text-wrap:pretty] sm:col-span-10 sm:col-start-2">
          Standing over 6 feet tall and well-put-together, I always look out for blues{" "}
          <Image
            src="/about_page_assets/theBlues.png"
            alt="Chelsea FC"
            width={40}
            height={40}
            className="inline-block h-10 w-10 align-middle rounded-full sm:h-[50px] sm:w-[50px]"
          />{" "}
          when I&apos;m not playing either physically{" "}
          <Image
            src="/about_page_assets/fifaBall.png"
            alt="Football"
            width={40}
            height={41}
            className="inline-block h-[41px] w-10 scale-x-[-1] align-middle rounded-full sm:h-[51px] sm:w-[50px]"
          />{" "}
          or digitally{" "}
          <span role="img" aria-label="EA Sports FC">
            <EafcIcon className="inline-block align-middle h-[34px] w-[69px] text-text-primary sm:h-[44px] sm:w-[89px]" />
          </span>{" "}
          I also enjoy reading{" "}
          <span role="img" aria-label="books">
            {BOOKS.map((book, i) => (
              <Image
                key={book}
                src={`/about_page_assets/${book}.png`}
                alt={book}
                width={28}
                height={35}
                className="inline-block h-[35px] w-7 -mr-1 align-middle sm:h-[45px] sm:w-[38px]"
                style={{ transform: `rotate(${(i - 1.5) * 6}deg)` }}
              />
            ))}
          </span>
          , watching{" "}
          <span role="img" aria-label="films">
            {FILMS.map((film, i) => (
              <Image
                key={film}
                src={`/about_page_assets/${film}.png`}
                alt={film}
                width={26}
                height={35}
                className="inline-block h-[35px] w-[26px] -mr-1 align-middle sm:h-[45px] sm:w-[36px]"
                style={{ transform: `rotate(${(i - 1.5) * 7}deg)` }}
              />
            ))}
          </span>
          , and listening{" "}
          <span aria-hidden="true">
            {ARTISTS.map((artist) => (
              <Image
                key={artist}
                src={`/about_page_assets/${artist}.png`}
                alt={artist}
                width={32}
                height={32}
                className="inline-block h-8 w-8 -mr-2 align-middle rounded-full sm:h-[42px] sm:w-[42px]"
              />
            ))}
          </span>
          {" "}to others&apos; perspectives.
        </p>
      </Grid>

      <ContactSection />
    </main>
  );
}
