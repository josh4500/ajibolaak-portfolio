import { ViewTransition } from "react";

/** Passed to every in-site <Link> so the page fades instead of swapping. */
export const PAGE_TRANSITION = ["page"];

/**
 * Fades the current page out and the next one in (styles in globals.css). Only navigations from
 * links tagged with PAGE_TRANSITION animate: browser back/forward carries no type and swaps
 * instantly, so it never doubles up with Safari's own swipe-back animation.
 * Wrap each page in this, not the layout: layouts persist, so they never enter or exit.
 * `children` should be a single element, so the page is captured as one snapshot.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ page: "page-in", default: "none" }}
      exit={{ page: "page-out", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
