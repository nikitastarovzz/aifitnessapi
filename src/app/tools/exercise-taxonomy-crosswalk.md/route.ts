import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/exercise-taxonomy-crosswalk.md — the markdown mirror of /tools/exercise-taxonomy-crosswalk (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/exercise-taxonomy-crosswalk");
}
