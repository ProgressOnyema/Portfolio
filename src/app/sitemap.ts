import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
