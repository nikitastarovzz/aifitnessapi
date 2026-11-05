import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/heart-rate-lab.md — the markdown mirror of /tools/heart-rate-lab (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/heart-rate-lab");
}
