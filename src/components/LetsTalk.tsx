"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { PAGE_TRANSITION } from "./PageTransition";

const pill =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-contrast transition hover:opacity-85";

/** Navbar CTA: a menu with "Book a call" and "Send an email", or a plain link to #contact without Calendly. */
export function LetsTalk() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!profile.calendlyUrl) {
    return (
      <Link href="/#contact" transitionTypes={PAGE_TRANSITION} className={pill}>
        Let&apos;s talk <ArrowUpRight className="h-4 w-4" aria-hidden />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={pill}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="lets-talk-menu"
        onClick={() => setOpen((o) => !o)}
      >
        Let&apos;s talk
        <ArrowUpRight className={`h-4 w-4 transition-transform ${open ? "rotate-45" : ""}`} aria-hidden />
      </button>

      {open && (
        <div
          id="lets-talk-menu"
          role="menu"
          className="absolute top-full -right-12 mt-3 w-72 overflow-hidden sm:right-0 rounded-2xl border border-border bg-background/95 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          <ContactOptions onSelect={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

/** The two ways to get in touch, as menu rows. Shared by the navbar menu and the mobile drawer. */
export function ContactOptions({ onSelect }: { onSelect?: () => void }) {
  const options = [
    ...(profile.calendlyUrl
      ? [
          {
            href: profile.calendlyUrl,
            Icon: CalendarDays,
            title: "Book a call",
            detail: "Pick a time on Calendly",
            external: true,
          },
        ]
      : []),
    { href: `mailto:${profile.email}`, Icon: Mail, title: "Send an email", detail: profile.email, external: false },
  ];

  return options.map(({ href, Icon, title, detail, external }) => (
    <a
      key={title}
      href={href}
      role="menuitem"
      onClick={onSelect}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-accent-soft"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-surface">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block truncate font-mono text-[11px] text-muted">{detail}</span>
      </span>
      <ArrowUpRight
        className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
        aria-hidden
      />
    </a>
  ));
}
