import { servePageMirror } from "@/lib/pageMirrors";

/** /research/pricing-transparency.md — the markdown mirror of /research/pricing-transparency (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/research/pricing-transparency");
}
