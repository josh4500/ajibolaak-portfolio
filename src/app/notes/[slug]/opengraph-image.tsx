import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { logoPath } from "@/components/LogoMark";
import { dateFormat, getAllNoteSlugs, getNote, getNotes } from "@/lib/notes";
import { profile } from "@/data/profile";

// The share card for a note: its title on the site's black background.
export const alt = `A note by ${profile.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  // Published notes only; the route needs at least one param, so fall back to every file.
  const published = getNotes().map((n) => ({ slug: n.slug }));
  return published.length ? published : getAllNoteSlugs().map((slug) => ({ slug }));
}

export default async function NoteOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();
  const details = [note.date && dateFormat.format(new Date(note.date)), `${note.readingMinutes} min read`].filter(Boolean);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#09090b",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="72" height="72" viewBox="0 0 100 100" fill="#fafafa">
            <path d={logoPath} />
          </svg>
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#a1a1aa" }}>NOTES</div>
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08 }}>
          {note.title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#71717a" }}>
          <div style={{ display: "flex" }}>{profile.name} · ajibolaak.dev</div>
          <div style={{ display: "flex" }}>{details.join(" · ")}</div>
        </div>
      </div>
    ),
    size,
  );
}
