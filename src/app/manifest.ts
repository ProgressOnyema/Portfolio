import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";
import { SURFACE_BG } from "@/lib/theme";

const description =
  "I conceptualize, ideate, and design brand identities from the ground up, then bring that same attention to detail into product design and code.";

// Dark is the site default (see globals.css / ThemeInitScript). The HTML
// <meta name="theme-color"> is updated at runtime when the user toggles
// light/dark; the manifest itself can only ship one static pair.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description,
    start_url: "/",
    display: "standalone",
    background_color: SURFACE_BG.dark,
    theme_color: SURFACE_BG.dark,
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
