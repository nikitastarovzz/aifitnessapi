import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/gym-software-api-matrix.md — the markdown mirror of /tools/gym-software-api-matrix (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/gym-software-api-matrix");
}
