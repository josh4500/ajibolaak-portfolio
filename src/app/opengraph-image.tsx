import { ImageResponse } from "next/og";
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
          justifyContent: "center",
          padding: 80,
          background: "#09090b",
          color: "#f4f4f5",
        }}
      >
        <div style={{ fontSize: 32, color: "#a1a1aa" }}>ajibolaak.dev</div>
        <div style={{ fontSize: 80, fontWeight: 700, marginTop: 16 }}>{profile.name}</div>
        <div style={{ fontSize: 40, color: "#a1a1aa", marginTop: 8 }}>{profile.role}</div>
      </div>
    ),
    size,
  );
}
