import { servePageMirror } from "@/lib/pageMirrors";

/** /history.md — the markdown mirror of /history (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/history");
}
