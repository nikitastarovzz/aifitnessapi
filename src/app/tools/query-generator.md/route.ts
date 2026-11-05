import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/query-generator.md — the markdown mirror of /tools/query-generator (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/query-generator");
}
