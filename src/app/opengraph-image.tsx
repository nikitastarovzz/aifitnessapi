import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Default social-share card for the whole site. Next.js applies this
 * opengraph-image to every route that doesn't define its own, so every page
 * (home, pillars, all spokes) gets a consistent branded card instead of a bare
 * text link when shared. 1200×630 is the standard OG size.
 */
export const alt = site.title;
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
          background:
            "radial-gradient(60% 60% at 50% 0%, #064e3b 0%, #0a0a0a 55%, #0a0a0a 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            color: "#34d399",
            fontSize: "30px",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #34d399, #059669)",
            }}
          />
          {site.name}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              color: "#f5f5f5",
              fontSize: "68px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "980px",
            }}
          >
            {site.tagline}
          </div>
          <div style={{ color: "#a3a3a3", fontSize: "30px", maxWidth: "900px" }}>
            {site.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#6ee7b7",
            fontSize: "24px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Health · Wellness · Fitness Tech
        </div>
      </div>
    ),
    { ...size },
  );
}
