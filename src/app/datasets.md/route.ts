import { servePageMirror } from "@/lib/pageMirrors";

/** /datasets.md — the markdown mirror of /datasets (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/datasets");
}
