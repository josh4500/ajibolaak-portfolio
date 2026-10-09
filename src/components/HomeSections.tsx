import { ArrowUpRight, Check, Database, Mail, Server, Smartphone } from "lucide-react";
import { experience, profile, projects, skills } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { Section, Tag } from "./Section";

const skillIcons = { mobile: Smartphone, backend: Server, data: Database };

const card = "rounded-xl border border-border bg-surface transition hover:border-muted";

export function About() {
  return (
    <Section id="about" eyebrow="About" title="Mobile first, full-stack throughout">
      <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
        {profile.about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Tools I work with">
      <div className="grid gap-5 md:grid-cols-3">
        {skills.map((group) => {
          const Icon = skillIcons[group.icon];
          return (
            <div key={group.category} className={`${card} p-6`}>
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-semibold">{group.category}</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted">
                {group.items.map((s) => (
                  <li key={s} className="flex items-center gap-2.5">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="Featured work">
      <ul className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.title} className={`${card} flex flex-col p-6`}>
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.problem}</p>

            {p.highlights.length > 0 && (
              <ul className="mt-5 flex-1 space-y-2 text-sm">
                {p.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            <ul className="mt-5 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>

            {(p.repo || p.live) && (
              <div className="mt-5 flex gap-5 border-t border-border pt-4 text-sm font-medium">
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline">
                    <GithubIcon className="h-4 w-4" /> Repository
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                    Live Demo <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <ol className="relative max-w-3xl space-y-10 border-l border-border pl-8">
        {experience.map((job) => (
          <li key={`${job.company}-${job.role}`} className="relative">
            <span
              className="absolute top-1.5 -left-[37px] h-2.5 w-2.5 rounded-full bg-foreground ring-4 ring-background"
              aria-hidden
            />
            <p className="text-sm text-muted">{job.period}</p>
            <h3 className="mt-1 text-lg font-semibold">
              {job.role} <span className="font-normal text-muted">· {job.company}</span>
            </h3>
            <p className="mt-2 leading-relaxed text-muted">{job.summary}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="Let's build something together">
      <div className={`${card} p-8 sm:p-12`}>
        <p className="max-w-xl text-lg leading-relaxed text-muted">
          Have a mobile product, backend system or collaboration in mind? I&apos;d like to hear about it. Email is the
          fastest way to reach me.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast transition hover:opacity-90"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {profile.email}
        </a>
        <div className="mt-6 flex gap-5 text-sm text-muted">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-foreground">
            <GithubIcon className="h-4 w-4" /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-foreground">
            <LinkedinIcon className="h-4 w-4" /> LinkedIn
          </a>
        </div>
      </div>
    </Section>
  );
}
