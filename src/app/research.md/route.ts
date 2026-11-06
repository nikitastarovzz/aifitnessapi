import { servePageMirror } from "@/lib/pageMirrors";

/** /research.md — the markdown mirror of /research (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/research");
}
