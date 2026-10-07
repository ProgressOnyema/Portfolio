// Site-wide constants shared across components and metadata routes.

export const SITE_NAME = "Onyema Miracle";
export const EMAIL = "progressonyema5@gmail.com";

// Absolute origin used for metadataBase, the sitemap, robots.txt and the
// generated Open Graph images. Set NEXT_PUBLIC_SITE_URL to the production
// domain (e.g. https://yourname.com) in the hosting dashboard. On Vercel it
// falls back to the project's production domain automatically, and to
// localhost during local development.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
