import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/compliance-wizard.md — the markdown mirror of /tools/compliance-wizard (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/compliance-wizard");
}
