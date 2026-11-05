import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/oauth-playground.md — the markdown mirror of /tools/oauth-playground (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/oauth-playground");
}
