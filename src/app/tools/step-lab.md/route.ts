import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/step-lab.md — the markdown mirror of /tools/step-lab (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/step-lab");
}
