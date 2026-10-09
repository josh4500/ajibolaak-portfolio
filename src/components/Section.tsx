export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h2 id={`${id}-title`} className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">{children}</span>
  );
}
