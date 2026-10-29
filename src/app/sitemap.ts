import type { MetadataRoute } from "next";
import { site } from "@/data/profile";
import { getNotes } from "@/lib/notes";
import { getMediumPosts } from "@/lib/medium";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // /blog redirects to /notes until Medium has posts, so list it only once it has some.
  const hasBlog = (await getMediumPosts()).length > 0;
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...(hasBlog ? [{ url: `${site.url}/blog`, changeFrequency: "weekly" as const, priority: 0.8 }] : []),
    { url: `${site.url}/notes`, changeFrequency: "weekly", priority: 0.8 },
    ...getNotes().map((n) => ({ url: `${site.url}/notes/${n.slug}`, lastModified: n.date, priority: 0.6 })),
  ];
}
