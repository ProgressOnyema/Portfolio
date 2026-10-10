// Hard-coded rather than detected: browser geolocation needs a permission
// prompt and would show each visitor *their own* location, not mine.
const LOCATION = "Lagos, Nigeria";

export default function LocationPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border-hairline bg-surface-bg-alt/60 px-3 py-1.5">
      {/* Green dot with a soft ping ring — the ring is decorative only. */}
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span className="text-mono-caption whitespace-nowrap text-text-muted">
        {LOCATION}
      </span>
    </div>
  );
}
