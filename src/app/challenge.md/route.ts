import { servePageMirror } from "@/lib/pageMirrors";

/** /challenge.md — the markdown mirror of /challenge (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/challenge");
}
