import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { HC_RELEASES, HC_RELEASES_FETCHED_ON } from "@/data/hcReleases";

/** Counts and versions are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Health Connect SDK releases: every connect-client version";

export default function Image() {
  const stable = HC_RELEASES.filter((r) => r.stage === "stable").sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  )[0];
  return new ImageResponse(
    ogCard({
      eyebrow: "Release tracker",
      title: "Health Connect SDK Releases",
      line: `${HC_RELEASES.length} connect-client releases${stable ? ` · latest stable ${stable.version}` : ""} · read ${HC_RELEASES_FETCHED_ON}`,
    }),
    { ...OG_SIZE },
  );
}
