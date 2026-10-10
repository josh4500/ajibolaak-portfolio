import { experience, profile, site, skills } from "@/data/profile";
import type { NoteMeta } from "@/lib/notes";

export const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

// Current roles are the ones still running ("Present").
const currentEmployers = experience
  .filter((job) => /present/i.test(job.period))
  .map((job) => ({ "@type": "Organization", name: job.company }));

/** Who the site is about: helps Google connect searches for your name to this site and your profiles. */
export function personGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        url: site.url,
        jobTitle: profile.role,
        description: profile.intro,
        email: `mailto:${profile.email}`,
        address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Federal University Lokoja" },
        worksFor: currentEmployers,
        knowsAbout: skills.flatMap((group) => group.items),
        sameAs: [
          profile.linkedin,
          profile.github,
          `https://medium.com/@${profile.mediumHandle}`,
          profile.calendlyUrl,
        ].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: profile.name,
        description: `${profile.role}. ${profile.intro}`,
        publisher: { "@id": personId },
        inLanguage: "en",
      },
      {
        "@type": "ProfilePage",
        url: site.url,
        name: `${profile.name} · ${profile.role}`,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
    ],
  };
}

/** A single note as an article, credited to you, with its publish date. */
export function noteGraph(note: NoteMeta) {
  const url = `${site.url}/notes/${note.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    description: note.description,
    datePublished: note.date,
    dateModified: note.date,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    keywords: note.tags.join(", "),
    author: { "@type": "Person", "@id": personId, name: profile.name, url: site.url },
    publisher: { "@type": "Person", "@id": personId, name: profile.name },
    inLanguage: "en",
  };
}
