import { servePageMirror } from "@/lib/pageMirrors";

/** /openness-index.md — the markdown mirror of /openness-index (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/openness-index");
}
