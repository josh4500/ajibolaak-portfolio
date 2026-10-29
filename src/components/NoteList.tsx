import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { dateFormat, type NoteMeta } from "@/lib/notes";
import { Reveal } from "./Reveal";
import { PAGE_TRANSITION } from "./PageTransition";

/** Notes as dated rows, on /notes and in the homepage's writing section. */
export function NoteList({ notes, heading: Heading = "h2" }: { notes: NoteMeta[]; heading?: "h2" | "h3" }) {
  return (
    // `notes-list` keeps the rows visible during page transitions (globals.css).
    <ol className="notes-list border-t border-border">
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
                <Heading className="text-xl font-semibold tracking-tight underline-offset-4 group-hover:underline sm:text-2xl">
                  {note.title}
                </Heading>
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
  );
}
