export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      {eyebrow && <p className="mb-2 text-xs font-semibold tracking-widest text-muted uppercase">{eyebrow}</p>}
      <h2 id={`${id}-title`} className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-accent-soft px-2 py-0.5 font-mono text-xs text-foreground">
      {children}
    </span>
  );
}
