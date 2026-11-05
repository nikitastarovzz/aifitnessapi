import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/permission-builder.md — the markdown mirror of /tools/permission-builder (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/permission-builder");
}
