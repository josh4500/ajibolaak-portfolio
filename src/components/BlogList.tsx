"use client";

import { useState } from "react";
import type { MediumPost } from "@/lib/medium";
import { BlogCard } from "./BlogCard";

export function BlogList({ posts }: { posts: MediumPost[] }) {
  // Only the most-used tags, so the filter bar stays tidy.
  const counts = new Map<string, number>();
  posts.flatMap((p) => p.tags).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));
  const tags = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([t]) => t);
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  return (
    <>
      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
          {[null, ...tags].map((t) => (
            <button
              key={t ?? "all"}
              type="button"
              aria-pressed={active === t}
              onClick={() => setActive(t)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                active === t
                  ? "border-accent bg-accent text-accent-contrast"
                  : "border-border text-muted hover:border-muted hover:text-foreground"
              }`}
            >
              {t ?? "All"}
            </button>
          ))}
        </div>
      )}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => (
          <li key={post.link}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </>
  );
}
