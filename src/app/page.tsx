import Link from "next/link";
import { Hero } from "@/components/Hero";
import { About, Contact, Experience, Projects, Skills } from "@/components/HomeSections";
import { Section } from "@/components/Section";
import { BlogCard, EmptyBlog } from "@/components/BlogCard";
import { getMediumPosts, mediumProfileUrl } from "@/lib/medium";

async function LatestWriting() {
  const posts = (await getMediumPosts()).slice(0, 3);
  return (
    <Section
      id="writing"
      index="05"
      label="Blog"
      title={
        <>
          Latest <em className="accent-serif">writing</em>.
        </>
      }
      intro="Notes on mobile, backend and the craft of shipping software, published on Medium."
    >
      {posts.length === 0 ? (
        <EmptyBlog profileUrl={mediumProfileUrl} />
      ) : (
        <>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.link}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-foreground"
          >
            All articles →
          </Link>
        </>
      )}
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <LatestWriting />
      <Contact />
    </>
  );
}
