import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/store-submission-checklist.md — the markdown mirror of /tools/store-submission-checklist (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/store-submission-checklist");
}
