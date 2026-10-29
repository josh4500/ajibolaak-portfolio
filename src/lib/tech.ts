import {
  siAndroid,
  siApachecassandra,
  siApple,
  siDart,
  siDocker,
  siDotnet,
  siFlutter,
  siGit,
  siGooglecloud,
  siJsonwebtokens,
  siKotlin,
  siLinux,
  siMongodb,
  siMqtt,
  siMysql,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siReact,
  siRevenuecat,
  siSupabase,
  siSwift,
  siTypescript,
} from "simple-icons";

type Tech = { name: string; icon: { slug: string; path: string } };

// Only tools from the skills, experience and projects on this site. Logos are Simple Icons (CC0); AWS has no
// Simple Icons logo, so it stays in the skills list only. Shapes are served once from /tech-icons.svg.
export const techRows: { label: string; items: Tech[] }[] = [
  {
    label: "Mobile",
    items: [
      { name: "Flutter", icon: siFlutter },
      { name: "Dart", icon: siDart },
      { name: "Swift", icon: siSwift },
      { name: "Kotlin", icon: siKotlin },
      { name: "iOS", icon: siApple },
      { name: "Android", icon: siAndroid },
      { name: "RevenueCat", icon: siRevenuecat },
    ],
  },
  {
    label: "Backend, data and cloud",
    items: [
      { name: "C# / .NET", icon: siDotnet },
      { name: "TypeScript", icon: siTypescript },
      { name: "NestJS", icon: siNestjs },
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "PostgreSQL", icon: siPostgresql },
      { name: "Supabase", icon: siSupabase },
      { name: "MongoDB", icon: siMongodb },
      { name: "MySQL", icon: siMysql },
      { name: "Cassandra", icon: siApachecassandra },
      { name: "MQTT", icon: siMqtt },
      { name: "JWT", icon: siJsonwebtokens },
      { name: "Docker", icon: siDocker },
      { name: "Linux", icon: siLinux },
      { name: "Git", icon: siGit },
      { name: "Google Cloud", icon: siGooglecloud },
    ],
  },
];
