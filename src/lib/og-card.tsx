import type { ReactElement } from "react";

/** Shared 1200×630 OG card layout, used by per-page opengraph-image routes so a
 *  shared page shows its own title (better social CTR than one static card). */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function ogCard({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}): ReactElement {
  return (
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
        AIFitnessAPI
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            color: "#6ee7b7",
            fontSize: "26px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            color: "#f5f5f5",
            fontSize: title.length > 55 ? "56px" : "68px",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: "flex", color: "#a3a3a3", fontSize: "26px" }}>
        aifitnessapi.com
      </div>
    </div>
  );
}
