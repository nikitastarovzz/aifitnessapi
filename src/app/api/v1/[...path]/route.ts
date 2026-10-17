import { apiDocument, apiDocuments, apiJson } from "@/lib/publicApi";

/**
 * Every collection and item below /api/v1 (/api/v1/healthkit/types,
 * /api/v1/healthkit/types/stepCount, …), prerendered from the collection list
 * in src/lib/publicApi.ts. Unknown paths 404 outright: with dynamicParams off
 * nothing is rendered on request, so the API is exactly the files the build
 * wrote and costs nothing to serve. GET only, to stay static (see
 * src/app/api/v1/route.ts).
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { path: string[] }[] {
  return apiDocuments().map((d) => ({ path: d.path.split("/") }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const { path } = await params;
  const doc = apiDocument(path.join("/"));
  if (!doc) return apiJson({ error: "not found", docs: "https://aifitnessapi.com/developers" }, 404);
  return apiJson(doc.body);
}
