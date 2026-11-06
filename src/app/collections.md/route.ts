import { servePageMirror } from "@/lib/pageMirrors";

/** /collections.md — the markdown mirror of /collections (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/collections");
}
