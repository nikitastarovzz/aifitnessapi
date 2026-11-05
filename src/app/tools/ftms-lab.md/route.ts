import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/ftms-lab.md — the markdown mirror of /tools/ftms-lab (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/ftms-lab");
}
