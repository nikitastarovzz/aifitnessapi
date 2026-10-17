import { ImageResponse } from "next/og";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";
import { BT_PAGES, btBySlug } from "@/data/btPages";

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Bluetooth GATT characteristic byte layout";

export function generateStaticParams() {
  return BT_PAGES.map((c) => ({ slug: c.slug }));
}

/** The name, UUID and field count are read from the generated data at build time. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = btBySlug(slug);
  const n = c?.gss?.structure.length ?? 0;
  return new ImageResponse(
    ogCard({
      eyebrow: c ? `Bluetooth GATT · ${c.uuid}` : "Bluetooth GATT reference",
      title: c?.name ?? "Bluetooth GATT reference",
      line: c ? `${n} ${n === 1 ? "field" : "fields"}${c.gss?.flagsFields.length ? " · Flags" : ""} · byte layout from the Bluetooth SIG's YAML` : undefined,
    }),
    { ...OG_SIZE },
  );
}
