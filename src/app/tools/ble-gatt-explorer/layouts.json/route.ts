import { BT_GATT_SOURCE } from "@/data/bluetoothGatt";
import { explorerLayouts } from "@/lib/bleTools";
import { absoluteUrl, site } from "@/lib/site";

/**
 * Every decodable characteristic layout the GATT explorer knows, compiled at
 * build time from src/data/bluetoothGatt.ts by src/lib/gattDecode.mjs. The
 * explorer fetches this file when it needs a decoder, so the page itself
 * stays light. Written once per build; no server code runs per request.
 */
export const dynamic = "force-static";

export function GET() {
  const layouts = explorerLayouts();
  const body = {
    name: "Bluetooth GATT characteristic layouts",
    publisher: `${site.name} (${site.url})`,
    page: absoluteUrl("/tools/ble-gatt-explorer"),
    source: { repository: BT_GATT_SOURCE.repository, commit: BT_GATT_SOURCE.commit },
    note: "Compiled from the Bluetooth SIG's GATT Specification Supplement YAML files (Copyright © Bluetooth SIG, Inc.; this site is not affiliated with the SIG). Byte order little-endian. A field marked unsupported stops decoding.",
    count: layouts.length,
    layouts,
  };
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
