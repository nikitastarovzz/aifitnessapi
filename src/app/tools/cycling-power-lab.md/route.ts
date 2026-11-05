import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/cycling-power-lab.md — the markdown mirror of /tools/cycling-power-lab (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/cycling-power-lab");
}
