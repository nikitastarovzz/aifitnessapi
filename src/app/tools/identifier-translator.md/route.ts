import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/identifier-translator.md — the markdown mirror of /tools/identifier-translator (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/identifier-translator");
}
