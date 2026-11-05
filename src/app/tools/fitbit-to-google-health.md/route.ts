import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/fitbit-to-google-health.md — the markdown mirror of /tools/fitbit-to-google-health (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/fitbit-to-google-health");
}
