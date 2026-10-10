import { ArrowUpRight, CalendarDays, Database, Download, Mail, Server, Smartphone } from "lucide-react";
import { experience, profile, projects, skills } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Reveal } from "./Reveal";
import { Section, Tag } from "./Section";

const skillIcons = { mobile: Smartphone, backend: Server, data: Database };
const pad = (n: number) => String(n).padStart(2, "0");

export function About() {
  const [first, ...rest] = profile.about;
  return (
    <Section
      id="about"
      index="01"
      label="About"
      title={
        <>
          Mobile first, <em className="accent-serif">full-stack</em> throughout.
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <Reveal>
          <p className="text-2xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl">{first}</p>
        </Reveal>
        <Reveal delay={120} className="space-y-5 leading-relaxed text-muted">
          {rest.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      label="Skills"
      title={
        <>
          The <em className="accent-serif">toolkit</em>.
        </>
      }
      intro="From the widget tree to the database: the tools I reach for to ship and scale."
    >
      <div className="grid overflow-hidden rounded-2xl border border-border md:grid-cols-3">
        {skills.map((group, gi) => {
          const Icon = skillIcons[group.icon];
          return (
            <Reveal
              key={group.category}
              delay={gi * 100}
              className={`card-glow p-6 sm:p-8 ${gi > 0 ? "border-t border-border md:border-t-0 md:border-l" : ""}`}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-mono text-xs text-faint">{pad(gi + 1)}</span>
              </div>
              <h3 className="mb-5 text-xl font-semibold tracking-tight">{group.category}</h3>
              <ul className="divide-y divide-border border-t border-border">
                {group.items.map((s) => (
                  <li key={s} className="py-2.5 text-sm text-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      label="Projects"
      title={
        <>
          Selected <em className="accent-serif">work</em>.
        </>
      }
      intro="Products I've designed, built and shipped across fintech, payments and secure messaging, plus open source."
    >
      <ol className="space-y-5">
        {projects.map((p, i) => (
          <Reveal
            as="li"
            key={p.title}
            delay={i * 80}
            className="group card-glow grid gap-8 rounded-2xl border border-border p-6 transition-colors hover:border-faint sm:p-10 md:grid-cols-[1fr_1fr]"
          >
            <div className="flex flex-col">
              <span className="font-mono text-xs text-faint">
                {pad(i + 1)}
                {p.company && <span className="text-muted"> · {p.company}</span>}
              </span>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{p.title}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-muted">{p.problem}</p>
              {(p.repo || p.live) && (
                <div className="mt-auto flex flex-wrap gap-3 pt-8 text-sm font-medium">
                  {p.repo && (
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 transition hover:border-foreground"
                    >
                      <GithubIcon className="h-4 w-4" /> Repository
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-accent-contrast transition hover:opacity-85"
                    >
                      {p.liveLabel ?? "Live Demo"} <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between gap-8">
              {p.highlights.length > 0 && (
                <div>
                  <p className="mb-3 font-mono text-[11px] tracking-widest text-faint uppercase">Highlights</p>
                  <ul className="divide-y divide-border border-y border-border">
                    {p.highlights.map((h, hi) => (
                      <li key={hi} className="flex gap-4 py-3 text-sm">
                        <span className="font-mono text-xs text-faint">{pad(hi + 1)}</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <ul className="flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      index="04"
      label="Experience"
      title={
        <>
          Where I&apos;ve <em className="accent-serif">worked</em>.
        </>
      }
    >
      <ol className="border-t border-border">
        {experience.map((job, i) => (
          <Reveal
            as="li"
            key={`${job.company}-${job.role}`}
            delay={i * 80}
            className="grid gap-3 border-b border-border py-8 md:grid-cols-[200px_1fr_1fr] md:gap-10"
          >
            <p className="font-mono text-xs tracking-wide text-muted uppercase md:pt-1.5">{job.period}</p>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{job.role}</h3>
              <p className="mt-1 text-muted">{job.company}</p>
            </div>
            <p className="leading-relaxed text-muted">{job.summary}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <div className="card-glow relative isolate overflow-hidden rounded-3xl border border-border px-6 py-16 text-center sm:px-12 sm:py-24">
          <div className="bg-dots absolute inset-0 -z-10 opacity-70" aria-hidden />
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            <span className="text-foreground">06</span> / Contact
          </p>
          <h2
            id="contact-title"
            className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl"
          >
            Let&apos;s build something <em className="accent-serif">together</em>.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-muted">
            Have a mobile product, backend system or collaboration in mind?{" "}
            {profile.calendlyUrl ? "Book a call or send me an email." : "Email is the fastest way to reach me."}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {profile.calendlyUrl && (
              <a
                href={profile.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-contrast transition hover:opacity-85"
              >
                <CalendarDays className="h-4 w-4" aria-hidden />
                Book a call
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition ${
                profile.calendlyUrl
                  ? "border border-border bg-background/60 hover:border-foreground"
                  : "bg-accent text-accent-contrast hover:opacity-85"
              }`}
            >
              <Mail className="h-4 w-4" aria-hidden />
              {profile.email}
            </a>
          </div>
          <div className="mt-8 flex justify-center gap-6 font-mono text-xs text-muted">
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
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download="Ajibola-Akinmosin-Resume.pdf"
                className="inline-flex items-center gap-2 transition hover:text-foreground"
              >
                <Download className="h-4 w-4" aria-hidden /> Résumé
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
