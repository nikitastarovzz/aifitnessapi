import { absoluteUrl } from "@/lib/site";
import { answerSectionDoc, answerSections, answersBody, answersIndexDoc, answersJson } from "@/lib/answersIndex";

/**
 * /answers/<section>.json — one section of /answers.json, and
 * /answers/index.json listing every section with its count, newest review
 * date and size. Records are taken unchanged from the whole document
 * (src/lib/answersIndex.ts), so the split cannot disagree with it.
 *
 * The `.json` suffix is part of the param, as with /feeds/<cluster>.xml, and
 * dynamicParams = false makes the generated list the only addresses.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

const INDEX = "index.json";

export function generateStaticParams(): { section: string }[] {
  return [{ section: INDEX }, ...answerSections().map((s) => ({ section: `${s.id}.json` }))];
}

const headers = {
  "content-type": "application/json; charset=utf-8",
  link: `<${absoluteUrl("/llms.txt")}>; rel="describedby"; type="text/plain"`,
};

export async function GET(_req: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section === INDEX) return new Response(answersJson(answersIndexDoc()), { headers });
  const body = answersBody();
  const s = answerSections(body).find((x) => `${x.id}.json` === section);
  if (!s) return new Response("Not found", { status: 404 });
  return new Response(answersJson(answerSectionDoc(s, body)), { headers });
}
