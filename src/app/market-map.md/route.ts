import { servePageMirror } from "@/lib/pageMirrors";

/** /market-map.md — the markdown mirror of /market-map (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/market-map");
}
