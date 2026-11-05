import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/exercise-form-rules.md — the markdown mirror of /tools/exercise-form-rules (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/exercise-form-rules");
}
