import type { Metadata } from "next";
import { BlogList } from "@/components/BlogList";
import { EmptyBlog } from "@/components/BlogCard";
import { getMediumPosts, mediumProfileUrl } from "@/lib/medium";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on software development, published on Medium.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getMediumPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Thoughts on software, tools and lessons learned. Articles are published on{" "}
        <a href={mediumProfileUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          Medium
        </a>
        .
      </p>

      <div className="mt-10">
        {posts.length === 0 ? <EmptyBlog profileUrl={mediumProfileUrl} /> : <BlogList posts={posts} />}
      </div>

      {posts.length > 0 && (
        <a
          href={mediumProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold transition hover:border-accent"
        >
          View all on Medium ↗
        </a>
      )}
    </div>
  );
}
