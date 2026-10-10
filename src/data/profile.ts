// Everything on the site comes from this file. Content mirrors the résumé (resume/resume.html) — keep them in sync.
// Only add real projects, companies and numbers — empty `repo`/`live` fields simply hide those links.

export const site = {
  url: "https://ajibolaak.dev",
};

export const profile = {
  name: "Ajibola Akinmosin",
  role: "Senior Mobile & Full-Stack Engineer",
  intro:
    "I build cross-platform mobile apps with Flutter and Dart, and the secure, scalable backends behind them in C# and TypeScript.",
  location: "Lagos, Nigeria",
  email: "hello@ajibolaak.dev",
  github: "https://github.com/josh4500",
  linkedin: "https://www.linkedin.com/in/ajibolaak",
  mediumHandle: "ajibolaak",
  // Your Calendly booking link, e.g. "https://calendly.com/your-name/30min". Leave empty to hide the "Book a call" options.
  calendlyUrl: "https://calendly.com/ajibolaak",
  // Generated from resume/resume.html with `npm run resume`. Leave empty to hide the Résumé buttons.
  resumeUrl: "/resume.pdf",
  about: [
    "I'm a mobile and full-stack engineer with 5+ years of experience building fintech, payments and secure communication products, currently shipping mobile at Busha and Yousend.",
    "My focus is mobile client engineering: cross-platform Flutter apps built on clean architecture, predictable BLoC/Cubit state management, and features that feel native on iOS and Android. On the server side I build secure, scalable services in C# (ASP.NET Core) and TypeScript (NestJS).",
    "I studied Computer Science at Federal University Lokoja, where coursework in algorithms, machine learning and cryptography laid the groundwork for the work I enjoy most: end-to-end encrypted messaging and compliant, high-volume payment systems.",
  ],
};

export const skills: { category: string; icon: "mobile" | "backend" | "data"; items: string[] }[] = [
  {
    category: "Mobile",
    icon: "mobile",
    items: [
      "Flutter & Dart",
      "State Management (BLoC/Cubit)",
      "Clean Architecture & Dependency Injection",
      "iOS & Android Platform Integrations",
      "Biometric Auth & KYC Flows",
    ],
  },
  {
    category: "Backend & APIs",
    icon: "backend",
    items: [
      "C# / ASP.NET Core",
      "TypeScript / NestJS",
      "REST APIs",
      "MQTT Real-Time Messaging",
      "JWT / SSO Authentication",
    ],
  },
  {
    category: "Databases & Cloud",
    icon: "data",
    items: ["PostgreSQL, MongoDB, MySQL", "Cassandra", "AWS & Google Cloud", "Docker & Linux", "Git"],
  },
];

export type Project = {
  title: string;
  company?: string;
  problem: string;
  tech: string[];
  highlights: string[];
  repo?: string;
  live?: string;
  // Text for the `live` link; defaults to "Live Demo".
  liveLabel?: string;
};

// Products built in professional roles (from the résumé). Add personal or open-source projects with repo/live links.
export const projects: Project[] = [
  {
    title: "screenshot_shield",
    company: "Open source · Flutter plugin",
    problem:
      "A Flutter plugin for protecting sensitive screens: it detects screenshots and screen recordings, blanks captures of a whole screen or a single region, and hides the app in the app switcher.",
    tech: ["Flutter", "Dart", "Kotlin", "Swift", "C++"],
    highlights: [
      "Published on pub.dev, with native implementations for Android, iOS, Windows and Linux",
      "Built on Android 14/15 screen-capture and recording APIs and iOS per-scene capture state",
      "Keeps a single region out of iOS recordings with a live, capture-excluded copy",
      "Route-aware guards that count their claims, plus app-switcher privacy",
    ],
    repo: "https://github.com/josh4500/screenshot_guard",
    live: "https://pub.dev/packages/screenshot_shield",
    liveLabel: "pub.dev",
  },
  {
    title: "Cross-Border Payments App",
    company: "Yousend Inc.",
    problem:
      "Fast, reliable money transfers across currencies on iOS and Android, built so several payment teams can ship in parallel.",
    tech: ["Flutter", "Dart", "BLoC/Cubit", "Clean Architecture"],
    highlights: [
      "Real-time currency conversion and cross-border flows with a 99.9% success rate",
      "Payment processing latency down 25% through optimised state management",
      "Mono-repo with clean architecture layers, cutting code duplication by 30%",
      "Crash rates down 20%; 85% test coverage on critical payment paths",
    ],
  },
  {
    title: "End-to-End Encrypted Messenger",
    company: "Presence Inc.",
    problem: "Private real-time chat, calls and media sharing where only the people in the conversation can read it.",
    tech: ["Flutter", "Dart", "Signal Protocol", "MQTT"],
    highlights: [
      "End-to-end encryption with the Signal Protocol and RSA",
      "MQTT message relaying that cut messaging latency by 70%",
      "Encrypted audio/video calling and secure image/video transfer",
    ],
  },
  {
    title: "Fintech Remittance Platform",
    company: "Centiiv",
    problem:
      "Sending money at scale, for individuals and businesses, across borders and in line with financial regulations.",
    tech: ["Flutter", "Dart", "NestJS", "TypeScript"],
    highlights: [
      "Built end to end: Flutter client and NestJS backend",
      "Backend services scaled for secure, high-volume transactions",
      "B2B bulk transfers, corporate payments and real-time FX rate handling",
    ],
  },
  {
    title: "Enterprise SSO & Search",
    company: "Opus Technology",
    problem: "Secure sign-on and faster data retrieval for internal applications used across a large employee base.",
    tech: ["C#", "ASP.NET Core", "React", "JWT"],
    highlights: [
      "SSO middleware with JWT validation and payload extraction",
      "Redirect logic optimised to cut latency by 1,500 ms",
      "10+ critical React UI issues fixed, halving user-reported bugs",
    ],
  },
];

export const experience: { role: string; company: string; period: string; summary: string }[] = [
  {
    role: "Mobile Engineer",
    company: "Busha",
    period: "Aug 2025 – Present",
    summary:
      "Building and maintaining core Flutter features for crypto and financial transactions, with scalable UI components and robust API workflows across iOS and Android.",
  },
  {
    role: "Senior Software Developer",
    company: "Yousend Inc.",
    period: "Aug 2025 – Present",
    summary:
      "Architected a clean-architecture mono-repo for 3+ payment teams and shipped cross-border flows with a 99.9% success rate, 40% faster feature delivery and 20% fewer crashes.",
  },
  {
    role: "Software Engineer",
    company: "Opus Technology",
    period: "May 2024 – Mar 2025",
    summary:
      "Built secure SSO middleware in .NET Core, improved enterprise search, cut redirect latency by 1,500 ms and halved user-reported React UI bugs.",
  },
  {
    role: "Lead Software Engineer",
    company: "Presence Inc.",
    period: "Mar 2022 – Mar 2024",
    summary:
      "Led a Flutter end-to-end encrypted messenger with Signal Protocol, encrypted calls and media, and MQTT relaying that cut latency by 70%.",
  },
  {
    role: "Lead Engineer",
    company: "Centiiv",
    period: "Oct 2020 – Feb 2022",
    summary:
      "Built a fintech remittance platform end to end in Flutter and NestJS, extending it to B2B bulk payments and cross-border transfers with real-time FX.",
  },
];
