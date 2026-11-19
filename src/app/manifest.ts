import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { SURFACE_BG } from "@/lib/theme";

// Dark is the site default (see globals.css / ThemeInitScript). The HTML
// <meta name="theme-color"> is updated at runtime when the user toggles
// light/dark; the manifest itself can only ship one static pair.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
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
