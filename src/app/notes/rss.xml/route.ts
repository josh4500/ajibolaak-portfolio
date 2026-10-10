import { getNotes } from "@/lib/notes";
import { profile, site } from "@/data/profile";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getNotes()
    .map(
      (n) => `    <item>
      <title>${escape(n.title)}</title>
      <link>${site.url}/notes/${n.slug}</link>
      <guid>${site.url}/notes/${n.slug}</guid>
      <pubDate>${new Date(n.date).toUTCString()}</pubDate>
      <description>${escape(n.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Notes · ${escape(profile.name)}</title>
    <link>${site.url}/notes</link>
    <description>Notes on mobile engineering, Flutter and backend systems.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
