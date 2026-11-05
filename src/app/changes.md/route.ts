import { servePageMirror } from "@/lib/pageMirrors";

/** /changes.md — the markdown mirror of /changes (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/changes");
}
