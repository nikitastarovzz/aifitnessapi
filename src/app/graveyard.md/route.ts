import { servePageMirror } from "@/lib/pageMirrors";

/** /graveyard.md — the markdown mirror of /graveyard (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/graveyard");
}
