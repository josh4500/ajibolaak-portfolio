import Link from "next/link";
import { Hero } from "@/components/Hero";
import { About, Contact, Experience, Projects, Skills } from "@/components/HomeSections";
import { Section } from "@/components/Section";
import { BlogCard, EmptyBlog } from "@/components/BlogCard";
import { getMediumPosts, mediumProfileUrl } from "@/lib/medium";

async function LatestWriting() {
  const posts = (await getMediumPosts()).slice(0, 3);
  return (
    <Section id="writing" eyebrow="Blog" title="Latest writing">
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
          <Link href="/blog" className="mt-8 inline-block font-medium underline-offset-4 hover:underline">
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
