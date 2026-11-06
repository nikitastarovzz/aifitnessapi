import { servePageMirror } from "@/lib/pageMirrors";

/** /research/docs-drift.md — the markdown mirror of /research/docs-drift (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/research/docs-drift");
}
