import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/rep-counter-playground.md — the markdown mirror of /tools/rep-counter-playground (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/rep-counter-playground");
}
