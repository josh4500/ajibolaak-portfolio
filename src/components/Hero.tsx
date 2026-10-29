import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { ParticleField } from "./ParticleField";
import { HeroIntroSeen } from "./HeroIntroSeen";

const facts = [
  { label: "Focus", value: "Mobile engineering" },
  { label: "Mobile", value: "Flutter · Dart" },
  { label: "Backend", value: "C# · NestJS" },
  { label: "Based", value: profile.location },
];

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden">
      <HeroIntroSeen />
      <div className="bg-dots absolute inset-0 -z-10" aria-hidden />
      {/* Soft spotlight behind the headline */}
      <div
        className="absolute top-[-20%] left-1/2 -z-10 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[min(100svh,60rem)] max-w-6xl items-center px-4 pt-32 pb-16 sm:px-6 lg:pt-28">
        <div className="relative z-10 max-w-4xl">
          <p className="hero-intro mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 font-mono text-[11px] tracking-widest text-muted uppercase backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" aria-hidden />
            {profile.role}
          </p>

          <h1 className="text-5xl leading-[0.95] font-semibold tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">
            {/* One block per line so each can rise on its own. */}
            <span className="hero-intro block">
              Crafting <em className="accent-serif whitespace-nowrap">mobile apps</em>
            </span>{" "}
            <span className="hero-intro block text-faint" style={{ "--intro-step": 1 } as React.CSSProperties}>
              &amp; the systems behind them.
            </span>
          </h1>

          <p
            className="hero-intro mt-8 max-w-xl text-lg leading-relaxed text-muted text-pretty"
            style={{ "--intro-step": 2 } as React.CSSProperties}
          >
            Hi, I&apos;m {profile.name}. {profile.intro}
          </p>

          <div
            className="hero-intro mt-10 flex flex-wrap items-center gap-3"
            style={{ "--intro-step": 3 } as React.CSSProperties}
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition hover:opacity-85"
            >
              View Projects
              <ArrowDownRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-medium backdrop-blur transition hover:border-foreground"
            >
              Get in Touch
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download="Ajibola-Akinmosin-Resume.pdf"
                className="group inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-muted transition hover:text-foreground"
              >
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
                Download résumé
              </a>
            )}
          </div>

          <div
            className="hero-intro mt-8 flex gap-5 font-mono text-xs text-muted"
            style={{ "--intro-step": 4 } as React.CSSProperties}
          >
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-foreground"
            >
              <GithubIcon className="h-4 w-4" /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-foreground"
            >
              <LinkedinIcon className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>

        {/* Particle sphere: floats to the right on desktop, a faint backdrop on small screens. */}
        <div className="hero-intro-fade pointer-events-none absolute top-24 left-1/2 aspect-square w-[110vw] max-w-[640px] -translate-x-1/2 opacity-30 lg:top-1/2 lg:right-0 lg:left-auto lg:w-[560px] lg:translate-x-[8%] lg:-translate-y-1/2 lg:opacity-70">
          <ParticleField className="h-full w-full" />
        </div>
      </div>

      <dl
        className="hero-intro mx-auto grid max-w-6xl grid-cols-2 border-y border-border sm:px-6 md:grid-cols-4 md:border-x-0"
        style={{ "--intro-step": 5 } as React.CSSProperties}
      >
        {facts.map((f, i) => (
          <div
            key={f.label}
            className={`border-border px-4 py-5 sm:px-6 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} ${i === 1 ? "md:border-r" : ""}`}
          >
            <dt className="font-mono text-[11px] tracking-widest text-faint uppercase">{f.label}</dt>
            <dd className="mt-1.5 text-sm font-medium">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
