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
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © {year} {profile.name}. All rights reserved.
        </p>
        <SocialLinks size="h-4 w-4" />
      </div>
    </footer>
  );
}
