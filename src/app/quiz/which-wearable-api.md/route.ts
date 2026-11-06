import { servePageMirror } from "@/lib/pageMirrors";

/** /quiz/which-wearable-api.md — the markdown mirror of the quiz (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/quiz/which-wearable-api");
}
