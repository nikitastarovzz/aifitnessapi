import { servePageMirror } from "@/lib/pageMirrors";

/** /my-stack.md — the markdown mirror of /my-stack (src/lib/pageMirrors). */
export const dynamic = "force-static";

export function GET() {
  return servePageMirror("/my-stack");
}
