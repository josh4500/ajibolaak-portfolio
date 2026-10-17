import { cacheLife } from "next/cache";
import { profile } from "@/data/profile";
import { SocialLinks } from "./SocialLinks";

// Cached so the static page can include the year; it refreshes daily.
async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getYear();
  return (
    <footer className="site-footer overflow-hidden border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 py-8 font-mono text-xs text-muted sm:flex-row">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <SocialLinks size="h-4 w-4" />
        </div>
        {/* Oversized wordmark that bleeds off the bottom edge. */}
        <p
          className="-mb-[0.22em] text-center text-[19vw] leading-none font-semibold tracking-[-0.06em] text-accent-soft select-none lg:text-[13rem]"
          aria-hidden
        >
          ajibolaak
        </p>
      </div>
    </footer>
  );
}
