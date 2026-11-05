import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/ble-gatt-explorer.md — the markdown mirror of /tools/ble-gatt-explorer (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/ble-gatt-explorer");
}
