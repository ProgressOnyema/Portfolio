import type { VideoBlock as VideoBlockData } from "@/lib/types/caseStudy";

export default function VideoBlock({ block }: { block: VideoBlockData }) {
  const isContained = block.variant === "contained";

  return (
    <div className={`overflow-hidden rounded-md ${isContained ? "mx-auto max-w-[689px]" : "w-full"}`}>
      {block.autoplay ? (
        <video
          src={block.src}
          poster={block.poster}
          className="aspect-video w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <video
          src={block.src}
          poster={block.poster}
          className="aspect-video w-full object-cover"
          controls
          playsInline
        />
      )}
    </div>
  );
}
