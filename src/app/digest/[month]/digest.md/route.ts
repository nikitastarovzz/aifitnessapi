import { digests, getDigest, digestMarkdown } from "@/data/digest";

/**
 * The plain-text edition of one digest issue, at
 * /digest/<month>/digest.md — the same document the email sender ships, so
 * "what subscribers received" and "what is published" are one artifact
 * rather than two that drift.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return digests().map((d) => ({ month: d.month }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ month: string }> },
) {
  const { month } = await params;
  const d = getDigest(month);
  if (!d) return new Response("Not found", { status: 404 });
  return new Response(digestMarkdown(d), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
