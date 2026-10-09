"use client";

import Link from "next/link";
import { useState } from "react";
import { profile } from "@/data/profile";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="font-semibold tracking-tight">
          {profile.name}
          <span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-md px-3 py-2 text-sm text-muted transition hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md p-2 text-muted hover:text-foreground sm:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-border px-4 py-2 sm:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-2 py-3 text-muted hover:text-foreground">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
