import { fullSections, fullSectionText } from "@/lib/llmsFull";

/**
 * /llms-full/<section>.txt — one section of /llms-full.txt on its own, so an
 * assistant that needs one cluster's capsules and FAQs fetches tens of
 * kilobytes instead of the whole file. Same lines as that section of the
 * whole (src/lib/llmsFull.ts); /llms.txt lists every section with its size.
 *
 * The `.txt` suffix is part of the param, as with /feeds/<cluster>.xml, and
 * dynamicParams = false makes the generated list the only addresses.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { section: string }[] {
  return fullSections().map((s) => ({ section: `${s.id}.txt` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = fullSections().find((x) => `${x.id}.txt` === section);
  if (!s) return new Response("Not found", { status: 404 });
  return new Response(fullSectionText(s), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
