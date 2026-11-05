import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/schema-converter.md — the markdown mirror of /tools/schema-converter (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/schema-converter");
}
