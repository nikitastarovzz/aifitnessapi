import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/build-plan.md — the markdown mirror of /tools/build-plan (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/build-plan");
}
