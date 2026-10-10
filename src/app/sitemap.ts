import type { MetadataRoute } from "next";
import { site } from "@/data/profile";
import { getNotes } from "@/lib/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/notes`, changeFrequency: "weekly", priority: 0.8 },
    ...getNotes().map((n) => ({ url: `${site.url}/notes/${n.slug}`, lastModified: n.date, priority: 0.6 })),
  ];
}
