import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-20 pb-12 sm:px-6 sm:pt-32 sm:pb-20">
      <p className="mb-4 text-sm font-medium text-accent">Hi, I&apos;m {profile.name} 👋</p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">{profile.title}</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">{profile.pitch}</p>
      <p className="mt-2 text-sm text-muted">📍 {profile.location}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href="#projects"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:text-zinc-950"
        >
          View projects
        </a>
        <a
          href="#contact"
          className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold transition hover:border-accent"
        >
          Get in touch
        </a>
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-muted transition hover:text-foreground"
          >
            Résumé ↗
          </a>
        )}
      </div>
    </section>
  );
}
