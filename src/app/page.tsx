import Link from "next/link";
import { Hero } from "@/components/Hero";
import { About, Contact, Experience, Projects } from "@/components/HomeSections";
import { Section } from "@/components/Section";
import { BlogCard, EmptyBlog } from "@/components/BlogCard";
import { getMediumPosts, mediumProfileUrl } from "@/lib/medium";

async function LatestWriting() {
  const posts = (await getMediumPosts()).slice(0, 3);
  return (
    <Section id="writing" title="Latest writing">
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
          <Link href="/blog" className="mt-8 inline-block font-medium text-accent hover:underline">
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
      <Projects />
      <Experience />
      <LatestWriting />
      <Contact />
    </>
  );
}
