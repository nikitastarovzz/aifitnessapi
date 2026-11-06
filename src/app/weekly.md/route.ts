import { servePageMirror } from "@/lib/pageMirrors";

/** /weekly.md — the markdown mirror of /weekly (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/weekly");
}
