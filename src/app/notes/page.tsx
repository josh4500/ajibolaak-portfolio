import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { dateFormat, getNotes } from "@/lib/notes";
import { Reveal } from "@/components/Reveal";
import { PAGE_TRANSITION, PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short notes on mobile engineering, Flutter, backend systems and the craft of shipping software.",
  alternates: { canonical: "/notes", types: { "application/rss+xml": "/notes/rss.xml" } },
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

        <ol className="notes-list mt-14 border-t border-border">
          {notes.length === 0 && <li className="py-10 text-muted">The first notes are on their way.</li>}
          {notes.map((note, i) => (
            <Reveal as="li" key={note.slug} delay={Math.min(i, 6) * 60} className="border-b border-border">
              <Link
                href={`/notes/${note.slug}`}
                transitionTypes={PAGE_TRANSITION}
                className="group grid gap-2 py-7 transition-colors md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-8"
              >
                <time dateTime={note.date} className="font-mono text-xs tracking-wide text-muted uppercase">
                  {note.date ? dateFormat.format(new Date(note.date)) : ""}
                  {note.draft && (
                    <span className="ml-2 rounded-full border border-border px-2 py-0.5 normal-case">draft</span>
                  )}
                </time>
                <div>
                  {/* Glides into the note's heading (same name in notes/[slug]/page.tsx). */}
                  <ViewTransition
                    name={`note-title-${note.slug}`}
                    share={{ page: "note-title", default: "none" }}
                    default="none"
                  >
                    <h2 className="text-xl font-semibold tracking-tight underline-offset-4 group-hover:underline sm:text-2xl">
                      {note.title}
                    </h2>
                  </ViewTransition>
                  {note.description && <p className="mt-2 max-w-2xl leading-relaxed text-muted">{note.description}</p>}
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted transition group-hover:text-foreground">
                  {note.readingMinutes} min
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </PageTransition>
  );
}
