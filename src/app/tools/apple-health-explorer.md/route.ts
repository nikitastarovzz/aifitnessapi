import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/apple-health-explorer.md — the markdown mirror of /tools/apple-health-explorer (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/apple-health-explorer");
}
