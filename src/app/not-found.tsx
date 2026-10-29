import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { PAGE_TRANSITION } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Page not found",
};

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-foreground";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-36 pb-28 sm:px-6 sm:pt-40">
      <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">
        <span className="text-foreground">404</span> / Not found
      </p>
      <h1 className="text-5xl leading-[0.95] font-semibold tracking-[-0.04em] sm:text-7xl">
        This page <em className="accent-serif">doesn&apos;t</em> exist.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        The link may be old or mistyped. Here&apos;s where to find my work instead.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          transitionTypes={PAGE_TRANSITION}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast transition hover:opacity-85"
        >
          Home
        </Link>
        <Link href="/#projects" transitionTypes={PAGE_TRANSITION} className={linkClass}>
          Projects
        </Link>
        <Link href="/notes" transitionTypes={PAGE_TRANSITION} className={linkClass}>
          Notes
        </Link>
        {profile.resumeUrl && (
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Résumé <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
