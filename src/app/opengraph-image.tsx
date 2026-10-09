import { ImageResponse } from "next/og";
import { logoPath } from "@/components/LogoMark";
import { profile } from "@/data/profile";

export const alt = `${profile.name} · ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#09090b",
          color: "#fafafa",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="#fafafa">
          <path d={logoPath} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ fontSize: 40, color: "#a1a1aa", marginTop: 12 }}>{profile.role}</div>
          <div style={{ fontSize: 28, color: "#71717a", marginTop: 36 }}>ajibolaak.dev</div>
        </div>
      </div>
    ),
    size,
  );
}
