import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} · ${profile.title}`;
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
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)",
          color: "#f4f4f5",
        }}
      >
        <div style={{ fontSize: 32, color: "#818cf8" }}>ajibolaak.dev</div>
        <div style={{ fontSize: 80, fontWeight: 700, marginTop: 16 }}>{profile.name}</div>
        <div style={{ fontSize: 40, color: "#a1a1aa", marginTop: 8 }}>{profile.title}</div>
      </div>
    ),
    size,
  );
}
