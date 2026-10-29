import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BlogList } from "@/components/BlogList";
import { getMediumPosts, mediumProfileUrl } from "@/lib/medium";
import { profile } from "@/data/profile";
import { PageTransition } from "@/components/PageTransition";

const description = "Articles on software development, published on Medium.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: { canonical: "/blog" },
  // The page's openGraph replaces the layout's (share image included), so repeat what it needs.
  openGraph: {
    type: "website",
    title: "Blog",
    description,
    url: "/blog",
    siteName: profile.name,
    images: ["/opengraph-image"],
  },
};

export default async function BlogPage() {
  const posts = await getMediumPosts();
  // Until Medium has posts, send visitors to the notes rather than an empty page.
  if (posts.length === 0) redirect("/notes");

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 pt-36 pb-20 sm:px-6 sm:pt-40">
        <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">
          <span className="text-foreground">Blog</span> / Writing
        </p>
        <h1 className="text-5xl leading-[0.95] font-semibold tracking-[-0.04em] sm:text-7xl">
          Notes &amp; <em className="accent-serif">articles</em>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Thoughts on software, tools and lessons learned. Articles are published on{" "}
          <a
            href={mediumProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Medium
          </a>
          .
        </p>

        <div className="mt-14 border-t border-border pt-10">
          <BlogList posts={posts} />
        </div>

        <a
          href={mediumProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-foreground"
        >
          View all on Medium ↗
        </a>
      </div>
    </PageTransition>
  );
}
