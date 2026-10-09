import { cacheLife } from "next/cache";
import { XMLParser } from "fast-xml-parser";
import { profile } from "@/data/profile";

export type MediumPost = {
  title: string;
  link: string;
  date: string; // ISO string
  tags: string[];
  thumbnail: string | null;
  excerpt: string;
};

export const mediumProfileUrl = `https://medium.com/@${profile.mediumHandle}`;
const feedUrl = `https://medium.com/feed/@${profile.mediumHandle}`;

type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  category?: string[];
  "content:encoded"?: string;
};

const parser = new XMLParser({
  ignoreAttributes: true,
  isArray: (name) => name === "item" || name === "category",
});

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function toExcerpt(html: string, length = 200) {
  const text = decodeEntities(
    html
      .replace(/<figure[\s\S]*?<\/figure>/g, " ")
      .replace(/<h[1-6][\s\S]*?<\/h[1-6]>/, " ") // Medium repeats the title as the first heading
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, "")}…` : text;
}

function stripTracking(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.delete("source");
    return u.toString();
  } catch {
    return url;
  }
}

/** Latest posts from Medium's RSS feed (Medium only exposes the 10 most recent). Cached for an hour. */
export async function getMediumPosts(): Promise<MediumPost[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(feedUrl, { headers: { "User-Agent": "ajibolaak.dev" } });
    if (!res.ok) return [];
    const xml = parser.parse(await res.text());
    const items: FeedItem[] = xml?.rss?.channel?.item ?? [];

    return items.map((item) => {
      const html = item["content:encoded"] ?? "";
      const img = html.match(/<img[^>]+src="([^"]+)"/);
      return {
        title: decodeEntities(String(item.title ?? "Untitled")),
        link: stripTracking(String(item.link ?? mediumProfileUrl)),
        date: new Date(item.pubDate ?? 0).toISOString(),
        tags: (item.category ?? []).map(String),
        // Medium appends a 1x1 tracking pixel ("/_/stat") to every post; ignore it.
        thumbnail: img && !img[1].includes("/_/stat") ? img[1] : null,
        excerpt: toExcerpt(html),
      };
    });
  } catch {
    return [];
  }
}
