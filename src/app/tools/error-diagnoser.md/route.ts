import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/error-diagnoser.md — the markdown mirror of /tools/error-diagnoser (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/error-diagnoser");
}
