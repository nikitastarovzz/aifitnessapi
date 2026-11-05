import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/stack-generator.md — the markdown mirror of /tools/stack-generator (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/stack-generator");
}
