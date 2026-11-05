import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/research-platform-chooser.md — the markdown mirror of /tools/research-platform-chooser (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/research-platform-chooser");
}
