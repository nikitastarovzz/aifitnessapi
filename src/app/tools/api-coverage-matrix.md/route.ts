import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/api-coverage-matrix.md — the markdown mirror of /tools/api-coverage-matrix (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/api-coverage-matrix");
}
