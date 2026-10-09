import Image from "next/image";
import type { MediumPost } from "@/lib/medium";
import { Tag } from "./Section";

const dateFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export function BlogCard({ post }: { post: MediumPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent"
    >
      {post.thumbnail && (
        <div className="relative aspect-[16/9] overflow-hidden bg-accent-soft">
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <time dateTime={post.date} className="text-xs text-muted">
          {dateFormat.format(new Date(post.date))}
        </time>
        <h3 className="mt-1 font-semibold group-hover:text-accent">{post.title}</h3>
        {post.excerpt && <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        <span className="mt-4 text-sm font-medium text-accent">
          Read on Medium <span aria-hidden>↗</span>
        </span>
      </div>
    </a>
  );
}

export function EmptyBlog({ profileUrl }: { profileUrl: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <p className="text-muted">New articles are on the way.</p>
      <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-medium text-accent hover:underline">
        Follow me on Medium ↗
      </a>
    </div>
  );
}
