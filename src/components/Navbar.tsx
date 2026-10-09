"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

const initials = profile.name
  .split(/\s+/)
  .map((w) => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the drawer on Escape and stop the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
          <Link
            href="/#home"
            className="flex items-center gap-2.5 font-semibold tracking-tight"
            aria-label={`${profile.name}, home`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-sm font-bold text-accent-contrast">
              {initials}
            </span>
            <span className="hidden sm:inline">{profile.name}</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm text-muted transition hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <div className="hidden md:block">
              <SocialLinks size="h-[18px] w-[18px]" />
            </div>
            <span className="mx-1 hidden h-5 w-px bg-border md:block" aria-hidden />
            <ThemeToggle />
            <button
              type="button"
              className="rounded-md p-2 text-muted transition hover:bg-accent-soft hover:text-foreground lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer — outside <header>, whose backdrop-blur would otherwise trap these fixed elements. */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col overflow-y-auto border-l border-border bg-background p-6 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-widest text-muted">Menu</span>
          <button
            type="button"
            className="rounded-md p-2 text-muted transition hover:bg-accent-soft hover:text-foreground"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <ul className="mt-6 flex-1 space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3 text-lg text-muted transition hover:bg-accent-soft hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-border pt-4">
          <SocialLinks />
        </div>
      </div>
    </>
  );
}
