import { techRows } from "@/lib/tech";

/**
 * Two rows of tech logos drifting in opposite directions (styles in globals.css). Each row holds its list twice
 * so the loop is seamless; the copy is hidden from screen readers. It pauses on hover and stands still, wrapped,
 * for reduced motion. Logo shapes come from the /tech-icons.svg sprite.
 */
export function TechMarquee() {
  return (
    <div className="tech-marquee mb-10 space-y-3">
      {techRows.map((row, ri) => (
        <div
          key={row.label}
          className="tech-marquee-row"
          data-reverse={ri % 2 === 1 ? "" : undefined}
          // Longer rows get longer loops, so every row drifts at the same speed.
          style={{ "--marquee-duration": `${row.items.length * 3.5}s` } as React.CSSProperties}
        >
          <ul aria-label={row.label} className="tech-marquee-track">
            {[...row.items, ...row.items].map((t, i) => (
              <li
                key={i}
                aria-hidden={i >= row.items.length ? true : undefined}
                className="inline-flex items-center gap-2.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm text-muted transition-colors hover:border-faint hover:text-foreground"
              >
                <svg className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden>
                  <use href={`/tech-icons.svg#${t.icon.slug}`} />
                </svg>
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
