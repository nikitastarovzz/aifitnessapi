import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/deprecation-scanner.md — the markdown mirror of /tools/deprecation-scanner (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/deprecation-scanner");
}
