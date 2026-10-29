import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { dateFormat, getAllNoteSlugs, getNote, getNotes } from "@/lib/notes";
import { profile } from "@/data/profile";
import { JsonLd } from "@/components/JsonLd";
import { ListenToNote } from "@/components/ListenToNote";
import { noteGraph } from "@/lib/structured-data";
import { PAGE_TRANSITION, PageTransition } from "@/components/PageTransition";

export function generateStaticParams() {
  // Includes drafts so the route always has at least one page to prerender; drafts 404 in production.
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.description,
    alternates: { canonical: `/notes/${slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.description,
      publishedTime: note.date,
      authors: [profile.name],
      tags: note.tags,
      url: `/notes/${slug}`,
      // The page's openGraph replaces the layout's, so repeat the site name.
      siteName: profile.name,
    },
  };
}

// Every note is listed by generateStaticParams, so params is awaited outside any <Suspense>: each page is
// prerendered whole, with the article in the initial HTML for importers (Medium) and scrapers that don't
// run JavaScript. An unknown slug blocks on the server and 404s instead of streaming into a shell.
export const instant = false;

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();
  // Unique per note: Next keeps recently visited routes mounted (hidden), so several notes can be in the DOM.
  const bodyId = `note-body-${slug}`;
  const hasOtherNotes = getNotes().some((n) => n.slug !== slug);

  return (
    <PageTransition>
      <article className="note-page mx-auto max-w-3xl px-4 pt-36 pb-20 sm:px-6 sm:pt-40">
        <JsonLd data={noteGraph(note)} />
        {/* Fills as the reader moves through the body; pure CSS (globals.css). */}
        <div className="reading-progress" aria-hidden />
        <Link
          href="/notes"
          transitionTypes={PAGE_TRANSITION}
          className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted uppercase transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          All notes
        </Link>

        <header className="mt-10 border-b border-border pb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs tracking-wide text-muted uppercase">
            {note.date && <time dateTime={note.date}>{dateFormat.format(new Date(note.date))}</time>}
            <span aria-hidden>·</span>
            <span>{note.readingMinutes} min read</span>
            <ListenToNote
              bodyId={bodyId}
              title={note.title}
              description={note.description}
              listenMinutes={note.listenMinutes}
            />
            {note.draft && <span className="rounded-full border border-border px-2 py-0.5 normal-case">draft</span>}
          </div>
          <ViewTransition
            name={`note-title-${note.slug}`}
            share={{ page: "note-title", default: "none" }}
            default="none"
          >
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
              {note.title}
            </h1>
          </ViewTransition>
          {note.description && <p className="mt-5 text-lg leading-relaxed text-muted">{note.description}</p>}
          {note.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {note.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* Note HTML is rendered from Markdown files in this repo at build time. */}
        <div id={bodyId} className="note-body prose-note mt-10" dangerouslySetInnerHTML={{ __html: note.html }} />

        {/* Notes are often a visitor's first page, so end with who wrote it and how to get in touch. */}
        <footer className="card-glow mt-16 rounded-2xl border border-border p-6 sm:p-8">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">Written by</p>
          <p className="mt-3 text-xl font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">{profile.role}</p>
          <p className="mt-3 inline-flex items-center gap-2 font-mono text-xs tracking-wide text-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden />
            {profile.availability} · {profile.timezone}
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{profile.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
            {profile.calendlyUrl && (
              <a
                href={profile.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-accent-contrast transition hover:opacity-85"
              >
                <CalendarDays className="h-4 w-4" aria-hidden /> Book a call
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 transition hover:border-foreground"
            >
              <Mail className="h-4 w-4" aria-hidden /> Email
            </a>
            <Link
              href="/#projects"
              transitionTypes={PAGE_TRANSITION}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 transition hover:border-foreground"
            >
              See my work
            </Link>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 transition hover:border-foreground"
              >
                Résumé <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            )}
          </div>
          {hasOtherNotes && (
            <Link
              href="/notes"
              transitionTypes={PAGE_TRANSITION}
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-wide text-muted uppercase transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> More notes
            </Link>
          )}
        </footer>
      </article>
    </PageTransition>
  );
}
