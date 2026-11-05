import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/webhook-verifier.md — the markdown mirror of /tools/webhook-verifier (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/webhook-verifier");
}
