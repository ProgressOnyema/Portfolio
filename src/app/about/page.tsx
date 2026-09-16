import Image from "next/image";
import Grid from "@/components/Grid";
import ContactSection from "@/components/ContactSection";
import { EafcIcon } from "@/components/EafcIcon";

const SKILLS = ["Strategy", "Branding", "UX/UI Design", "Interaction", "Frontend Development"];

const BOOKS = ["book01", "book02", "book03", "book04"];
const FILMS = ["film01", "film02", "film03", "film04"];
const ARTISTS = ["artist01", "artist02", "artist03", "artist04", "artist05"];

export default function About() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Bio */}
      <Grid className="items-start pt-16 sm:pt-24">
        <div className="col-span-4 flex flex-col items-start gap-8 sm:col-span-12 sm:flex-col sm:gap-12">
          <div className="h-[104px] w-[123px] shrink-0 rounded-[5px] border-6 border-border-hairline bg-surface-bg-alt" />
          <div className="flex w-full max-w-[763px] flex-col gap-4">
            <h1 className="text-h1-bold">
              I brand, design and code
            </h1>
            <p className="text-h3 text-text-primary">
              I conceptualize, ideate, and design brand identities from the
              ground up, then bring that same attention to detail into
              product design and code by building components for design
              systems. Understanding not just how something is perceived,
              but how it&apos;s built, lets me design with implementation in
              mind.
            </p>
            <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2 pt-4">
              {SKILLS.map((skill) => (
                <p key={skill} className="text-h3 text-text-muted">
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
          instead of reflowing together like real prose) */}
      <Grid className="pt-24 sm:pt-40">
        <p className="col-span-4 text-h1-bold sm:text-h2-bold lg:text-center sm:text-left [text-wrap:pretty] sm:col-span-10 sm:col-start-2">
          I am a 6&apos;2&quot; gorgeous male. I always look out for blues{" "}
          <Image
            src="/about_page_assets/theBlues.png"
            alt="Chelsea FC"
            width={40}
            height={40}
            className="inline-block align-middle rounded-full mx-1 sm:w-[50px] sm:h-[50px]"
          />{" "}
          when I&apos;m not playing, either physically{" "}
          <Image
            src="/about_page_assets/fifaBall.png"
            alt="Football"
            width={40}
            height={41}
            className="inline-block align-middle scale-x-[-1] rounded-full mx-1 sm:w-[50px] sm:h-[51px]"
          />{" "}
          or digitally{" "}
          <EafcIcon className="inline-block align-middle mx-1 h-[34px] w-[69px] text-text-primary sm:h-[44px] sm:w-[89px]" />{" "}
          I also enjoy reading{" "}
          {BOOKS.map((book, i) => (
            <Image
              key={book}
              src={`/about_page_assets/${book}.png`}
              alt=""
              width={18}
              height={25}
              className="inline-block align-middle -mr-1 sm:w-[28px] sm:h-[35px]"
              style={{ transform: `rotate(${(i - 1.5) * 6}deg)` }}
            />
          ))}
          , watching{" "}
          {FILMS.map((film, i) => (
            <Image
              key={film}
              src={`/about_page_assets/${film}.png`}
              alt=""
              width={16}
              height={25}
              className="inline-block align-middle -mr-1 sm:w-[26x] sm:h-[35px]"
              style={{ transform: `rotate(${(i - 1.5) * 7}deg)` }}
            />
          ))}
          , and listening{" "}
          {ARTISTS.map((artist) => (
            <Image
              key={artist}
              src={`/about_page_assets/${artist}.png`}
              alt=""
              width={22}
              height={22}
              className="inline-block align-middle rounded-full -mr-2 sm:w-[32px] sm:h-[32px]"
            />
          ))}
          {" "}to others&apos; perspectives.
        </p>
      </Grid>

      <ContactSection />
    </main>
  );
}
