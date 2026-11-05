import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/pose-benchmark.md — the markdown mirror of /tools/pose-benchmark (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/pose-benchmark");
}
