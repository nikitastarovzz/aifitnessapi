import { servePageMirror } from "@/lib/pageMirrors";

/** /2026.md — the markdown mirror of /2026 (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/2026");
}
