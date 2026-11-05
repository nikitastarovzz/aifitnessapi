import { servePageMirror } from "@/lib/pageMirrors";

/** /tools/rate-limit-calculator.md — the markdown mirror of /tools/rate-limit-calculator (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/tools/rate-limit-calculator");
}
