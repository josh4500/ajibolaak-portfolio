// Everything on the site comes from this file. Replace every [bracketed] placeholder with your own details.
// Only add real projects, companies and numbers — empty `repo`/`live` fields simply hide those links.

export const site = {
  url: "https://ajibolaak.dev",
};

export const profile = {
  name: "Ajibola", // TODO: your full name — the logo initials are generated from it
  role: "Senior Mobile & Full-Stack Engineer",
  intro:
    "I build cross-platform mobile apps with Flutter and Dart, and the fast, reliable backends behind them in Go and C#.",
  email: "hello@ajibolaak.dev", // TODO: your professional email
  github: "https://github.com/josh4500",
  linkedin: "https://www.linkedin.com/in/ajibolaak", // TODO: confirm
  mediumHandle: "ajibolaak",
  // Your Calendly booking link, e.g. "https://calendly.com/your-name/30min". Leave empty to hide the "Book a call" options.
  calendlyUrl: "",
  // Path or URL to your résumé, e.g. "/resume.pdf" after dropping the file in /public. Leave empty to hide the button.
  resumeUrl: "",
  about: [
    "[A short overview of your background: how you got into software engineering and how long you've been building products.]",
    "My focus is mobile client engineering: cross-platform architecture in Flutter, predictable state management, and apps that feel native on every platform. On the server side I build concurrent, type-safe systems in Go and C# that keep those apps fast and dependable.",
    "[Your engineering philosophy in a sentence or two: what you value in code, teams and products.]",
  ],
};

export const skills: { category: string; icon: "mobile" | "backend" | "data"; items: string[] }[] = [
  {
    category: "Mobile",
    icon: "mobile",
    items: ["Flutter", "Dart", "Native Platform Channels", "State Management (Bloc/Cubit)", "Automated Testing"],
  },
  {
    category: "Backend & APIs",
    icon: "backend",
    items: ["Go", "C#", "RESTful APIs", "Microservices", "gRPC / Event-Driven Patterns"],
  },
  {
    category: "Databases & DevOps",
    icon: "data",
    items: ["PostgreSQL", "Redis", "Docker", "Git", "CI/CD Pipelines"],
  },
];

export type Project = {
  title: string;
  problem: string;
  tech: string[];
  highlights: string[];
  repo?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "[Project 1 Title]",
    problem: "[Short problem statement: what the project solves and for whom.]",
    tech: ["Flutter", "Go", "PostgreSQL"],
    highlights: ["[Key feature or highlight]", "[Key feature or highlight]"],
    repo: "", // e.g. "https://github.com/you/project"
    live: "",
  },
  {
    title: "[Project 2 Title]",
    problem: "[Short problem statement: what the project solves and for whom.]",
    tech: ["Flutter", "C#", "PostgreSQL"],
    highlights: ["[Key feature or highlight]", "[Key feature or highlight]"],
    repo: "",
    live: "",
  },
];

export const experience: { role: string; company: string; period: string; summary: string }[] = [
  {
    role: "[Role Title]",
    company: "[Company]",
    period: "[Dates]",
    summary: "[Brief summary of key achievements.]",
  },
];
