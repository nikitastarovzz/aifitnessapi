import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { fmtDate, history } from "@/lib/historyView";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "A visual history of fitness and health APIs";

export default function Image() {
  const h = history();
  const first = h.marks[0];
  const ends = h.marks.filter((m) => m.kind === "end").length;
  return new ImageResponse(
    ogCard({
      eyebrow: "Fitness API history",
      title: `${first ? first.date.slice(0, 4) : ""}–${h.asOf.slice(0, 4)}: launches, changes, shutdowns`,
      line: `${h.marks.length} dated events, ${ends} shutdowns or deprecations, ${h.vendors.length} vendors · data as of ${fmtDate(h.asOf)}`,
    }),
    { ...OG_SIZE },
  );
}
