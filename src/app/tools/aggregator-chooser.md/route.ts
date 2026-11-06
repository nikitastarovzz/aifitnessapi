import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/aggregator-chooser.md — the markdown mirror of /tools/aggregator-chooser (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/aggregator-chooser");
}
