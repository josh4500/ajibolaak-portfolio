import { experience, profile, projects, skills } from "@/data/profile";
import { Section, Tag } from "./Section";

export function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
        <div className="space-y-4 text-muted leading-relaxed">
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="space-y-5">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="mb-2 text-sm font-semibold">{group.category}</h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <li key={s}>
                    <Tag>{s}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li
            key={p.title}
            className="flex flex-col rounded-xl border border-border bg-surface p-5 transition hover:border-accent"
          >
            <h3 className="font-semibold">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">{p.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <li key={t}>
                  <Tag>{t}</Tag>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-4 text-sm font-medium">
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Code ↗
                </a>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Live ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="relative space-y-10 border-l border-border pl-6">
        {experience.map((job) => (
          <li key={`${job.company}-${job.role}`} className="relative">
            <span className="absolute top-1.5 -left-[29px] h-3 w-3 rounded-full border-2 border-background bg-accent" aria-hidden />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-semibold">
                {job.role} <span className="text-muted">· {job.company}</span>
              </h3>
              <p className="text-sm text-muted">{job.period}</p>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {job.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Contact() {
  return (
    <Section id="contact" title="Get in touch">
      <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
        <p className="max-w-xl text-muted">
          I&apos;m open to new opportunities, collaborations and interesting conversations. The fastest way to reach me
          is by email.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 dark:text-zinc-950"
        >
          {profile.email}
        </a>
        <ul className="mt-6 flex flex-wrap gap-4 text-sm">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
