import Link from "next/link";
import { Hero } from "@/components/Hero";
import { About, Contact, Experience, Projects, Skills } from "@/components/HomeSections";
import { Section } from "@/components/Section";
import { BlogCard } from "@/components/BlogCard";
import { NoteList } from "@/components/NoteList";
import { getMediumPosts } from "@/lib/medium";
import { getNotes } from "@/lib/notes";
import { JsonLd } from "@/components/JsonLd";
import { personGraph } from "@/lib/structured-data";
import { PAGE_TRANSITION, PageTransition } from "@/components/PageTransition";

async function LatestWriting() {
  const notes = getNotes().slice(0, 3);
  // Medium is optional: its posts appear here only once the feed has some.
  const posts = (await getMediumPosts()).slice(0, 3);
  if (notes.length === 0 && posts.length === 0) return null;

  return (
    <Section
      id="writing"
      index="05"
      label="Writing"
      title={
        <>
          Latest <em className="accent-serif">writing</em>.
        </>
      }
      intro="Notes on mobile, backend and the craft of shipping software."
    >
      {notes.length > 0 && (
        <>
          <NoteList notes={notes} heading="h3" />
          <Link
            href="/notes"
            transitionTypes={PAGE_TRANSITION}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-foreground"
          >
            All notes →
          </Link>
        </>
      )}
      {posts.length > 0 && (
        <div className={notes.length > 0 ? "mt-16" : ""}>
          {notes.length > 0 && <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">On Medium</p>}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.link}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
          <Link
            href="/blog"
            transitionTypes={PAGE_TRANSITION}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-foreground"
          >
            All articles →
          </Link>
        </div>
      )}
    </Section>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <div>
        <JsonLd data={personGraph()} />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <LatestWriting />
        <Contact />
      </div>
    </PageTransition>
  );
}
