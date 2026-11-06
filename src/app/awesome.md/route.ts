import { servePageMirror } from "@/lib/pageMirrors";

/** /awesome.md — the markdown mirror of /awesome (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/awesome");
}
