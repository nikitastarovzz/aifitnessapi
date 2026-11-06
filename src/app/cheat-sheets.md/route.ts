import { servePageMirror } from "@/lib/pageMirrors";

/** /cheat-sheets.md — the markdown mirror of /cheat-sheets (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/cheat-sheets");
}
