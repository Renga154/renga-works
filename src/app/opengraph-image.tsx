import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Renga Works";

export default async function OpengraphImage() {
  const avatar = await readFile(join(process.cwd(), "public", "avatar.png"));
  const avatarSrc = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #0d2b22 0%, #0a0a0b 45%, #101a38 100%)",
          padding: "0 72px",
          color: "#ededef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 22,
              color: "#3fcf8e",
              letterSpacing: 4,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }} />
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#febc2e" }} />
            <span style={{ width: 12, height: 12, borderRadius: 6, background: "#28c840" }} />
            <span style={{ marginLeft: 12 }}>RENGA.WORKS</span>
          </div>

          {/* Satori needs an explicit display on any element with more than
              one child, so the two lines are separate flex children. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.25,
              marginTop: 28,
              letterSpacing: -1,
            }}
          >
            <div style={{ display: "flex" }}>作ったものと、</div>
            <div style={{ display: "flex" }}>その作り方</div>
          </div>

          <div
            style={{
              fontSize: 25,
              color: "#8a8a93",
              marginTop: 26,
              lineHeight: 1.5,
            }}
          >
            iOSアプリ・SaaS・OSS を本番まで
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 38,
              fontSize: 20,
              color: "#8a8a93",
            }}
          >
            {profile.socials.map((s) => (
              <span
                key={s.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 8,
                  padding: "7px 15px",
                }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <img
          src={avatarSrc}
          width={330}
          height={330}
          style={{
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.18)",
          }}
          alt=""
        />
      </div>
    ),
    size,
  );
}
