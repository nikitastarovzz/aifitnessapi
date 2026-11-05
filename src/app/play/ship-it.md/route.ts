import { servePageMirror } from "@/lib/pageMirrors";

/** /play/ship-it.md — the markdown mirror of /play/ship-it (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/play/ship-it");
}
