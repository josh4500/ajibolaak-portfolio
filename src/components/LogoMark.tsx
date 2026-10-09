// The "A" mark. Fills with currentColor, so it follows the theme. Also used in app/icon.svg and app/opengraph-image.tsx.
export const logoPath =
  "M33.58 10.51L59.40 10.51L78.46 57.40L52.63 57.40ZM44.36 63.16L81.47 63.16L92.00 89.49L66.42 89.49ZM8.00 89.49C14.52 73.70 21.04 61.16 38.59 61.16L90.75 61.16L90.75 63.16L44.36 63.16L33.07 89.49Z";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden>
      <path d={logoPath} />
    </svg>
  );
}
