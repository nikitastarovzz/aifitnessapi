import { servePageMirror } from "@/lib/pageMirrors";

/** /daily.md — the markdown mirror of /daily (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/daily");
}
