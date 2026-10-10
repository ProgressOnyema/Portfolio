"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import MarqueeGrid from "@/components/case-study/MarqueeGrid";
import type { ImageGridImage, MarqueeGridBlock } from "@/lib/types/caseStudy";

// Same fitted-box maths as the real MarqueeGrid, so every variant shows
// the same pictures at the same sizes; only the delivery differs.
const MAX_W = 600;
const fit = (aspect: number, maxH: number) => {
  const w = Math.min(MAX_W, maxH * aspect);
  return { w: Math.round(w), h: Math.round(w / aspect) };
};

function Fig({
  image,
  copy,
  eager,
  layer,
}: {
  image: ImageGridImage;
  copy: "a" | "b";
  eager: boolean;
  layer: boolean;
}) {
  const aspect = image.width! / image.height!;
  const m = fit(aspect, 280);
  const d = fit(aspect, 360);
  return (
    <figure
      className={`flex w-auto shrink-0 flex-col gap-2 ${layer ? "will-change-transform [transform:translateZ(0)]" : ""}`}
    >
      <div className="flex max-h-[280px] max-w-[600px] items-center justify-center overflow-hidden rounded-md bg-surface-bg-alt sm:max-h-[360px]">
        <Image
          src={image.src}
          alt={copy === "a" ? image.alt : ""}
          width={image.width}
          height={image.height}
          sizes={`(min-width: 640px) ${d.w}px, ${m.w}px`}
          loading={eager ? "eager" : "lazy"}
          className="h-(--mh) w-(--mw) object-contain sm:h-(--dh) sm:w-(--dw)"
          style={
            { "--mw": `${m.w}px`, "--mh": `${m.h}px`, "--dw": `${d.w}px`, "--dh": `${d.h}px` } as CSSProperties
          }
        />
      </div>
      {copy === "a" && image.caption && (
        <figcaption className="text-mono-caption text-text-muted">{image.caption}</figcaption>
      )}
    </figure>
  );
}

const BLEED = "relative left-1/2 right-1/2 mx-[-50vw] w-screen overflow-hidden";

// CSS-animated track, like the real marquee. `eager` / `layer` switch the
// two candidate fixes on or off.
function AnimatedTrack({
  images,
  eager,
  layer,
}: {
  images: ImageGridImage[];
  eager: boolean;
  layer: boolean;
}) {
  return (
    <div className={BLEED}>
      <div className="animate-marquee flex w-max gap-4">
        {images.map((im, i) => (
          <Fig key={`a${i}`} image={im} copy="a" eager={eager} layer={layer} />
        ))}
        <div className="flex gap-4" aria-hidden="true">
          {images.map((im, i) => (
            <Fig key={`b${i}`} image={im} copy="b" eager={eager} layer={layer} />
          ))}
        </div>
      </div>
    </div>
  );
}

// No CSS animation at all: a native horizontal scroller that a script
// nudges along (and that you can swipe). No giant animated layer.
function ScrollTrack({ images, auto }: { images: ImageGridImage[]; auto: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!auto) return;
    const el = ref.current!;
    let pos = el.scrollLeft;
    let lastSet = pos;
    let pausedUntil = 0;
    let last = performance.now();
    let raf = 0;
    const pause = () => {
      pausedUntil = performance.now() + 2500;
      pos = el.scrollLeft;
    };
    const onScroll = () => {
      // A scroll we didn't cause (finger / momentum): stand down for a bit.
      if (Math.abs(el.scrollLeft - lastSet) > 2) {
        pausedUntil = performance.now() + 1500;
        pos = el.scrollLeft;
      }
    };
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (now >= pausedUntil) {
        pos += 0.04 * dt;
        const half = el.scrollWidth / 2;
        if (pos >= half) pos -= half;
        el.scrollLeft = pos;
        lastSet = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("pointerdown", pause);
    el.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("scroll", onScroll);
    };
  }, [auto]);
  const list = auto ? [...images, ...images] : images;
  return (
    <div className={BLEED}>
      <div ref={ref} className="no-scrollbar overflow-x-auto">
        <div className="flex w-max gap-4">
          {list.map((im, i) => (
            <Fig key={i} image={im} copy={i < images.length ? "a" : "b"} eager layer={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Reports how many images in a section have actually loaded, so a
// screenshot shows whether the problem is loading or painting.
function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState("…");
  useEffect(() => {
    const read = () => {
      const imgs = [...(ref.current?.querySelectorAll("img") ?? [])];
      const ok = imgs.filter((i) => i.complete && i.naturalWidth > 0).length;
      setStatus(`${ok}/${imgs.length} images loaded`);
    };
    const t = setInterval(read, 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <section ref={ref} className="flex flex-col gap-3">
      <h2 className="text-body-lg-strong">
        {id} — {title}
      </h2>
      <p className="text-body-sm-base text-text-muted">{note}</p>
      <p className="text-mono-caption text-text-body">{status}</p>
      {children}
    </section>
  );
}

export default function MarqueeLab({ block }: { block: MarqueeGridBlock }) {
  const images = block.images;
  const [env, setEnv] = useState("");
  useEffect(() => {
    // Deferred so the first paint isn't blocked and no state is set
    // synchronously inside the effect.
    const t = setTimeout(
      () => setEnv(`${innerWidth}px wide · ${devicePixelRatio}x · ${navigator.userAgent.slice(0, 90)}`),
      0,
    );
    return () => clearTimeout(t);
  }, []);
  return (
    <main className="mx-auto flex max-w-[600px] flex-col gap-16 px-5 py-28">
      <header className="flex flex-col gap-3">
        <h1 className="text-h3-bold">Marquee lab</h1>
        <p className="text-body-reg-base text-text-body">
          Same five pictures, six ways of showing them. Scroll down slowly and watch each one for about
          a minute. For each letter, note whether the images show up, stay, or vanish.
        </p>
        <p className="text-mono-caption text-text-muted">{env}</p>
      </header>

      <Section
        id="A"
        title="Current site marquee"
        note="Exactly what the case-study pages use now. Control."
      >
        <MarqueeGrid block={block} />
      </Section>

      <Section
        id="B"
        title="Eager loading"
        note="Same animation, but images load immediately instead of waiting to scroll into view."
      >
        <AnimatedTrack images={images} eager layer={false} />
      </Section>

      <Section
        id="C"
        title="Eager + a separate layer per image"
        note="B, plus each picture gets its own GPU layer so Safari doesn't draw one giant layer."
      >
        <AnimatedTrack images={images} eager layer />
      </Section>

      <Section
        id="D"
        title="Script-driven scroller (no CSS animation)"
        note="A normal swipeable strip that a script nudges along. You can drag it."
      >
        <ScrollTrack images={images} auto />
      </Section>

      <Section
        id="E"
        title="Short track"
        note="Like A, but only the first two pictures, so the moving strip is short."
      >
        <AnimatedTrack images={images.slice(0, 2)} eager={false} layer={false} />
      </Section>

      <Section
        id="F"
        title="Static strip, no motion"
        note="All five pictures in a plain swipeable row. Tests whether the pictures themselves display."
      >
        <ScrollTrack images={images} auto={false} />
      </Section>
    </main>
  );
}
