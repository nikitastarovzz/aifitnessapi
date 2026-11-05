import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/starter-scaffold.md — the markdown mirror of /tools/starter-scaffold (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/starter-scaffold");
}
