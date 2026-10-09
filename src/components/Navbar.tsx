"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* Floating pill bar; gains a glassy surface once the page scrolls. */}
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          aria-label="Main"
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border pr-2 pl-2 transition-all duration-300 ${
            scrolled
              ? "border-border bg-background/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link href="/#home" className="flex items-center gap-2.5 pl-1" aria-label={`${profile.name}, home`}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-bold text-accent-contrast">
              {initials}
            </span>
            <span className="hidden font-semibold tracking-tight sm:inline">{profile.name}</span>
          </Link>

          <ul className="hidden items-center lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-full px-3.5 py-2 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <div className="hidden md:block">
              <SocialLinks size="h-[17px] w-[17px]" />
            </div>
            <ThemeToggle />
            <Link
              href="/#contact"
              className="ml-1 hidden items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition hover:opacity-85 sm:inline-flex"
            >
              Let&apos;s talk <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
            <button
              type="button"
              className="rounded-full p-2 text-muted transition hover:bg-accent-soft hover:text-foreground lg:hidden"
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

      {/* Mobile drawer — outside <header> so the blurred bar can't trap these fixed elements. */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex h-dvh w-80 max-w-[88vw] flex-col overflow-y-auto border-l border-border bg-background p-6 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest text-muted uppercase">Menu</span>
          <button
            type="button"
            className="rounded-full p-2 text-muted transition hover:bg-accent-soft hover:text-foreground"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <ol className="mt-8 flex-1">
          {links.map((l, i) => (
            <li key={l.href} className="border-b border-border">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-4 text-2xl font-medium tracking-tight transition hover:pl-1"
              >
                <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ol>
        <div className="pt-6">
          <SocialLinks />
        </div>
      </div>
    </>
  );
}
