"use client";

import { useEffect, useRef, useState } from "react";
import { CopyIcon } from "./NounProjectIcons";
import { EMAIL } from "@/lib/site";

type Status = "idle" | "copied" | "failed";

// navigator.clipboard only exists in secure contexts (https / localhost)
// and can reject without a user gesture or permission; fall back to the
// old execCommand path before giving up.
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

// Copy-to-clipboard button for the contact email, shown beside the mailto
// link in ContactSection. A short "Copied" label confirms the copy and is
// announced to screen readers through the polite live region.
export default function CopyEmailButton() {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    const ok = await copyText(EMAIL);
    setStatus(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <span className="flex items-center gap-2">
      {/* `!transition-colors`: globals.css has an unlayered
          `body, body * { transition: ... }` rule that otherwise beats
          Tailwind's layered transition utilities. */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy email address"
        className="grid size-6 place-items-center text-text-muted !transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      >
        <CopyIcon className="size-5" />
      </button>
      <span role="status" aria-live="polite" className="text-label text-text-muted">
        {status === "copied" ? "Copied" : status === "failed" ? "Couldn't copy" : ""}
      </span>
    </span>
  );
}
