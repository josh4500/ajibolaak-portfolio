import fs from "node:fs";
import path from "node:path";
import { cacheLife } from "next/cache";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

/**
 * Notes are Markdown files in /content/notes. The file name is the URL:
 * content/notes/my-first-note.md → ajibolaak.dev/notes/my-first-note
 */
const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export type NoteMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date, e.g. "2026-10-10"
  tags: string[];
  draft: boolean;
  readingMinutes: number;
};

export type Note = NoteMeta & { html: string };

const showDrafts = process.env.NODE_ENV !== "production";

export const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function slugs() {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

function readNote(slug: string) {
  const file = ["md", "mdx"].map((ext) => path.join(NOTES_DIR, `${slug}.${ext}`)).find((f) => fs.existsSync(f));
  if (!file) return null;
  // Synchronous reads are part of the build-time prerender, so no extra caching is needed.
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const words = content.trim().split(/\s+/).length;
  const meta: NoteMeta = {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
  return { meta, content };
}

/** Every note file, drafts included — used to prerender pages (drafts 404 in production). */
export function getAllNoteSlugs() {
  return slugs();
}

/** Published notes, newest first. Drafts are listed only in local development. */
export function getNotes(): NoteMeta[] {
  return slugs()
    .map((s) => readNote(s)?.meta)
    .filter((n): n is NoteMeta => !!n && (showDrafts || !n.draft))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNote(slug: string): Promise<Note | null> {
  "use cache"; // rendering is deterministic per file, so cache it with the build
  cacheLife("max");
  const note = readNote(slug);
  if (!note || (note.meta.draft && !showDrafts)) return null;

  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: "wrap" })
      .use(rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark-dimmed" }, keepBackground: false })
      .use(rehypeStringify)
      .process(note.content),
  );
  return { ...note.meta, html };
}
