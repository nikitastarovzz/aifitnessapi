import { ImageResponse } from "next/og";

/**
 * Apple touch icon (iOS home-screen bookmark). Apple ignores the SVG favicon and
 * needs a raster PNG, so this generates a 180×180 branded tile — the emerald
 * rounded square with the "AF" monogram, matching icon.svg. Prerendered static.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#059669",
          color: "#ffffff",
          fontSize: 92,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        AF
      </div>
    ),
    { ...size },
  );
}
