import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { MediumPost } from "@/lib/medium";
import { Tag } from "./Section";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function BlogCard({ post }: { post: MediumPost }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-glow flex h-full flex-col overflow-hidden rounded-2xl border border-border transition-colors hover:border-faint"
    >
      {post.thumbnail && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-accent-soft">
          <Image
            src={post.thumbnail}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={post.date} className="font-mono text-[11px] tracking-widest text-faint uppercase">
          {dateFormat.format(new Date(post.date))}
        </time>
        <h3 className="mt-3 text-lg leading-snug font-semibold tracking-tight underline-offset-4 group-hover:underline">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium">
          Read on Medium{" "}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </a>
  );
}
