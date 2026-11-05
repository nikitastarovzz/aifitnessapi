import { servePageMirror } from "@/lib/pageMirrors";

/** /webhooks.md — the markdown mirror of /webhooks (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/webhooks");
}
