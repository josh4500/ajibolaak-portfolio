import { techRows } from "@/lib/tech";

/** One SVG sprite holding every tech logo, so the page references each shape instead of inlining it. */
export function GET() {
  const symbols = techRows
    .flatMap((row) => row.items)
    .map(({ icon }) => `<symbol id="${icon.slug}" viewBox="0 0 24 24"><path d="${icon.path}"/></symbol>`)
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
}
