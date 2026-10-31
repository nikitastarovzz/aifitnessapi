import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { dailyBank } from "@/lib/dailyBank";
import { QUESTIONS_PER_DAY, bankSizes } from "@/lib/dailyPuzzle";

/** Static card for /daily, drawn at build time like every other page card. It
 *  names no day's puzzle: the card is shared for weeks, the puzzle for a day. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AIFitnessAPI — the daily health-API developer puzzle";

export default function Image() {
  const s = bankSizes(dailyBank());
  const total = s.platform + s.translate + s.aggregation + s.keypoint;
  return new ImageResponse(
    ogCard({
      eyebrow: "Daily puzzle",
      title: "One health-API developer puzzle a day",
      line: `${QUESTIONS_PER_DAY} questions every UTC day · ${total} in the bank · share your grid`,
    }),
    { ...OG_SIZE },
  );
}
