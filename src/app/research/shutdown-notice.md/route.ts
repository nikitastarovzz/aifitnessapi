import { servePageMirror } from "@/lib/pageMirrors";

/** /research/shutdown-notice.md — the markdown mirror of /research/shutdown-notice (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/research/shutdown-notice");
}
