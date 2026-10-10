import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { dateFormat, getAllNoteSlugs, getNote } from "@/lib/notes";
import { profile } from "@/data/profile";
import { JsonLd } from "@/components/JsonLd";
import { noteGraph } from "@/lib/structured-data";

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
      url: `/notes/${slug}`,
    },
  };
}

async function NoteContent({ params }: Pick<PageProps<"/notes/[slug]">, "params">) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pt-36 pb-20 sm:px-6 sm:pt-40">
      <JsonLd data={noteGraph(note)} />
      <Link
        href="/notes"
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
          {note.draft && <span className="rounded-full border border-border px-2 py-0.5 normal-case">draft</span>}
        </div>
        <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl">
          {note.title}
        </h1>
        {note.description && <p className="mt-5 text-lg leading-relaxed text-muted">{note.description}</p>}
        {note.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {note.tags.map((t) => (
              <li key={t} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted">
                {t}
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Note HTML is rendered from Markdown files in this repo at build time. */}
      <div className="prose-note mt-10" dangerouslySetInnerHTML={{ __html: note.html }} />

      <footer className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Written by <span className="text-foreground">{profile.name}</span>
        </p>
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> More notes
        </Link>
      </footer>
    </article>
  );
}

// The URL is read inside <Suspense> so navigation can show the page shell instantly.
export default function NotePage({ params }: PageProps<"/notes/[slug]">) {
  return (
    <Suspense fallback={<NoteSkeleton />}>
      <NoteContent params={params} />
    </Suspense>
  );
}

function NoteSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 pt-36 pb-20 sm:px-6 sm:pt-40" aria-hidden>
      <div className="h-3 w-24 rounded bg-accent-soft" />
      <div className="mt-12 h-3 w-40 rounded bg-accent-soft" />
      <div className="mt-6 h-12 w-4/5 rounded bg-accent-soft" />
      <div className="mt-4 h-5 w-3/5 rounded bg-accent-soft" />
      <div className="mt-14 space-y-3">
        <div className="h-4 rounded bg-accent-soft" />
        <div className="h-4 rounded bg-accent-soft" />
        <div className="h-4 w-2/3 rounded bg-accent-soft" />
      </div>
    </div>
  );
}
