import { Reveal } from "./Reveal";

/** Section shell with a numbered mono label ("01 / About") and a large headline. */
export function Section({
  id,
  index,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <div className="mb-12 flex flex-col gap-6 border-t border-border pt-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 font-mono text-xs tracking-widest text-muted uppercase">
              <span className="text-foreground">{index}</span> / {label}
            </p>
            <h2 id={`${id}-title`} className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {title}
            </h2>
          </div>
          {intro && <p className="max-w-sm text-muted md:text-right">{intro}</p>}
        </div>
      </Reveal>
      {children}
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted">{children}</span>
  );
}
