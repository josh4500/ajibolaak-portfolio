"use client";

import { useEffect } from "react";

/** The hero's entrance (globals.css) runs once per visit: after it ends, this stops it replaying. */
export function HeroIntroSeen() {
  useEffect(() => {
    const mounted = performance.now();
    const markSeen = () => document.documentElement.setAttribute("data-intro-seen", "");
    const done = setTimeout(markSeen, 1500);
    return () => {
      clearTimeout(done);
      // Leaving home hides this route rather than unmounting it, and showing it again would restart
      // the animation, so leaving counts as seen. (The 100ms skips React's dev-only remount.)
      if (performance.now() - mounted > 100) markSeen();
    };
  }, []);
  return null;
}
