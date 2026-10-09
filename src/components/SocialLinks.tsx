import { Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

const links = [
  { label: "GitHub", href: profile.github, Icon: GithubIcon, external: true },
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinIcon, external: true },
  { label: "Email", href: `mailto:${profile.email}`, Icon: Mail, external: false },
];

export function SocialLinks({ size = "h-5 w-5" }: { size?: string }) {
  return (
    <ul className="flex items-center gap-1">
      {links.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            title={label}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className="inline-flex rounded-md p-2 text-muted transition hover:bg-accent-soft hover:text-foreground"
          >
            <Icon className={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
