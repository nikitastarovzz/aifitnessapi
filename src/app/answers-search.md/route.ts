import { servePageMirror } from "@/lib/pageMirrors";

/** /answers-search.md — the markdown mirror of /answers-search (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/answers-search");
}
