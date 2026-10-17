import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { BT_FETCHED, btTotals } from "@/data/btPages";

/** The counts and date are read from the generated data at build time. */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Bluetooth GATT characteristics for fitness and health devices";

export default function Image() {
  const t = btTotals();
  return new ImageResponse(
    ogCard({
      eyebrow: "Reference · Bluetooth GATT",
      title: "Bluetooth GATT Characteristics for Fitness Devices",
      line: `${t.characteristics} characteristics · ${t.pages} byte layouts · read from the Bluetooth SIG's YAML ${BT_FETCHED}`,
    }),
    { ...OG_SIZE },
  );
}
