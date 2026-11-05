import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/keypoint-playground.md — the markdown mirror of /tools/keypoint-playground (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/keypoint-playground");
}
