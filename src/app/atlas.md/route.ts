import { servePageMirror } from "@/lib/pageMirrors";

/** /atlas.md — the markdown mirror of /atlas (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/atlas");
}
