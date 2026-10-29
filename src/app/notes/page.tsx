import type { Metadata } from "next";
import { getNotes } from "@/lib/notes";
import { profile } from "@/data/profile";
import { NoteList } from "@/components/NoteList";
import { PageTransition } from "@/components/PageTransition";

const description = "Short notes on mobile engineering, Flutter, backend systems and the craft of shipping software.";

export const metadata: Metadata = {
  title: "Notes",
  description,
  alternates: { canonical: "/notes", types: { "application/rss+xml": "/notes/rss.xml" } },
  // The page's openGraph replaces the layout's (share image included), so repeat what it needs.
  openGraph: {
    type: "website",
    title: "Notes",
    description,
    url: "/notes",
    siteName: profile.name,
    images: ["/opengraph-image"],
  },
};

export default function NotesPage() {
  const notes = getNotes();

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 pt-36 pb-20 sm:px-6 sm:pt-40">
        <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">
          <span className="text-foreground">Notes</span> / {notes.length} {notes.length === 1 ? "entry" : "entries"}
        </p>
        <h1 className="text-5xl leading-[0.95] font-semibold tracking-[-0.04em] sm:text-7xl">
          Field <em className="accent-serif">notes</em>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Short write-ups on mobile engineering, Flutter, backend systems and lessons from shipping software.
        </p>

        <div className="mt-14">
          {notes.length === 0 ? (
            <p className="border-t border-border py-10 text-muted">The first notes are on their way.</p>
          ) : (
            <NoteList notes={notes} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
