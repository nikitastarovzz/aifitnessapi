import { servePageMirror } from "@/lib/pageMirrors";

/** /fitness-api-index.md — the markdown mirror of /fitness-api-index (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/fitness-api-index");
}
