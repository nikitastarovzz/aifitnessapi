import { servePageMirror } from "@/lib/pageMirrors";

/** /tools.md — the markdown mirror of /tools (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools");
}
