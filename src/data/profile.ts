// Everything on the site comes from this file. Replace the TODO values with your own.

export const site = {
  url: "https://ajibolaak.dev",
};

export const profile = {
  name: "Ajibola", // TODO: your full name
  title: "Software Developer", // TODO: e.g. "Full-Stack Engineer"
  pitch:
    "I build fast, reliable web applications and enjoy turning complex problems into simple, well-crafted products.", // TODO
  location: "Lagos, Nigeria", // TODO
  email: "hello@ajibolaak.dev", // TODO: an address you actually check
  // Path or URL to your résumé, e.g. "/resume.pdf" after dropping the file in /public. Leave empty to hide the button.
  resumeUrl: "",
  mediumHandle: "ajibolaak",
  about: [
    "TODO: A short paragraph about who you are, what you work on, and what you care about as an engineer.",
    "TODO: A second paragraph about your background, current focus, or what you're looking for next.",
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/ajibolaak" }, // TODO: confirm handles
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ajibolaak" },
    { label: "Medium", href: "https://medium.com/@ajibolaak" },
    { label: "X", href: "https://x.com/ajibolaak" },
  ],
};

export const skills: { category: string; items: string[] }[] = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "HTML & CSS"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "REST APIs", "GraphQL"] },
  { category: "Tools", items: ["Git", "Docker", "Vercel", "CI/CD"] },
];

export type Project = {
  title: string;
  description: string;
  tech: string[];
  repo?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    title: "Project One", // TODO
    description: "What it does, who it's for, and the most interesting problem you solved building it.",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    repo: "https://github.com/ajibolaak",
    live: "https://ajibolaak.dev",
  },
  {
    title: "Project Two", // TODO
    description: "A short, outcome-focused summary. Numbers help: users, speed-ups, revenue, stars.",
    tech: ["React", "Node.js", "Docker"],
    repo: "https://github.com/ajibolaak",
  },
  {
    title: "Project Three", // TODO
    description: "Side projects, open-source contributions and experiments all count.",
    tech: ["Python", "FastAPI"],
    repo: "https://github.com/ajibolaak",
  },
];

export const experience: {
  role: string;
  company: string;
  period: string;
  points: string[];
}[] = [
  {
    role: "Software Developer", // TODO
    company: "Company Name",
    period: "2024 — Present",
    points: [
      "Shipped a feature that improved something measurable by X%.",
      "Owned the architecture of a key service used by N customers.",
    ],
  },
  {
    role: "Junior Developer", // TODO
    company: "Previous Company",
    period: "2022 — 2024",
    points: ["Built and maintained internal tools used across the team."],
  },
];
