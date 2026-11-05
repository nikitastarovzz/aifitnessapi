import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/aggregation-checker.md — the markdown mirror of /tools/aggregation-checker (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/aggregation-checker");
}
