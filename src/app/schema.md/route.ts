import { servePageMirror } from "@/lib/pageMirrors";

/** /schema.md — the markdown mirror of /schema (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/schema");
}
