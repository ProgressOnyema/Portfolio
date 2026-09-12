import Image from "next/image";
import Grid from "@/components/Grid";
import AppLink from "@/components/Link";
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
        <div className="col-span-4 flex flex-col items-start gap-8 sm:col-span-12 sm:flex-row sm:gap-12">
          <div className="h-[104px] w-[123px] shrink-0 rounded-[5px] border-6 border-border-hairline bg-surface-bg-alt" />
          <div className="flex w-full max-w-[763px] flex-col gap-4">
            <h1 className="text-h1-bold">
              I brand,
              <br />
              design
              <br />
              and code
            </h1>
            <p className="text-h3 text-text-primary">
              I conceptualize, ideate, and design brand identities from the
              ground up, then bring that same attention to detail into
              product design and code by building components for design
              systems. Understanding not just how something is perceived,
              but how it&apos;s built, lets me design with implementation in
              mind.
            </p>
          </div>
        </div>
      </Grid>

      {/* Fun facts — one flowing sentence mixing text and inline icons */}
      <Grid className="pt-24 sm:pt-40">
        <div className="col-span-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center sm:col-span-10 sm:col-start-2">
          <p className="text-h2-bold sm:text-h1-bold">I am a 6&apos;2&quot; gorgeous male.</p>
          <p className="text-h2-bold sm:text-h1-bold">I always look out for blues</p>
          <Image src="/about_page_assets/theBlues.png" alt="Chelsea FC" width={50} height={50} className="rounded-full" />
          <p className="text-h2-bold sm:text-h1-bold">when I&apos;m not playing, either physically</p>
          <Image
            src="/about_page_assets/fifaBall.png"
            alt="Football"
            width={50}
            height={51}
            className="scale-x-[-1] rounded-full"
          />
          <p className="text-h2-bold sm:text-h1-bold">or digitally</p>
          <EafcIcon className="h-[47px] w-[95px] text-text-primary" />
          <p className="text-h2-bold sm:text-h1-bold">I also enjoy reading</p>
          <div className="flex items-center">
            {BOOKS.map((book, i) => (
              <Image
                key={book}
                src={`/about_page_assets/${book}.png`}
                alt=""
                width={28}
                height={35}
                className="-mr-1"
                style={{ transform: `rotate(${(i - 1.5) * 6}deg)` }}
              />
            ))}
          </div>
          <p className="text-h2-bold sm:text-h1-bold">, watching</p>
          <div className="flex items-center">
            {FILMS.map((film, i) => (
              <Image
                key={film}
                src={`/about_page_assets/${film}.png`}
                alt=""
                width={26}
                height={35}
                className="-mr-1"
                style={{ transform: `rotate(${(i - 1.5) * 7}deg)` }}
              />
            ))}
          </div>
          <p className="text-h2-bold sm:text-h1-bold">, and listening</p>
          <div className="flex items-center">
            {ARTISTS.map((artist) => (
              <Image
                key={artist}
                src={`/about_page_assets/${artist}.png`}
                alt=""
                width={32}
                height={32}
                className="-mr-2 rounded-full"
              />
            ))}
          </div>
          <p className="text-h2-bold sm:text-h1-bold">to others&apos; perspectives.</p>
        </div>
      </Grid>

      {/* Skills */}
      <Grid className="gap-y-8 pt-24 sm:pt-40">
        <div className="col-span-4 flex flex-col gap-8 sm:col-span-8 sm:col-start-4">
          <h2 className="text-h1-bold">Skills</h2>
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
            {SKILLS.map((skill) => (
              <p key={skill} className="text-h3 text-text-primary">
                {skill}
              </p>
            ))}
          </div>
          <AppLink variant="open-resume" href="/resume.pdf" />
        </div>
      </Grid>

      <ContactSection />
    </main>
  );
}
