"use client";

import { useEffect } from "react";

/** The hero's entrance (globals.css) runs once per visit: after it ends, this stops it replaying. */
export function HeroIntroSeen() {
  useEffect(() => {
    const done = setTimeout(() => document.documentElement.setAttribute("data-intro-seen", ""), 1500);
    return () => clearTimeout(done);
  }, []);
  return null;
}
