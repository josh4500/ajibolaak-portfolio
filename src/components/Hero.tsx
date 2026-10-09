import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

export function Hero() {
  return (
    <section id="home" className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-32 sm:pb-24">
      <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        Flutter · Dart · Go · C#
      </p>
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
        {profile.role}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted text-pretty sm:text-xl">
        Hi, I&apos;m {profile.name}. {profile.intro}
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast transition hover:opacity-90"
        >
          View Projects
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </a>
        <a
          href="#contact"
          className="rounded-lg border border-border px-5 py-3 text-sm font-semibold transition hover:border-foreground"
        >
          Get in Touch
        </a>
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-5 py-3 text-sm font-semibold text-muted transition hover:text-foreground"
          >
            Résumé ↗
          </a>
        )}
      </div>

      <div className="mt-10 flex gap-5 text-sm text-muted">
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-foreground">
          <GithubIcon className="h-4 w-4" /> GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-foreground">
          <LinkedinIcon className="h-4 w-4" /> LinkedIn
        </a>
      </div>
    </section>
  );
}
