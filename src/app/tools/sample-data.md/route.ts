import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/sample-data.md — the markdown mirror of /tools/sample-data (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/sample-data");
}
