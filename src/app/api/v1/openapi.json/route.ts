import { apiJson } from "@/lib/publicApi";
import { openApiDocument } from "@/lib/openapi";
import { TOOLS } from "../../../../../mcp/src/tools.js";

/**
 * GET /api/v1/openapi.json — the OpenAPI 3.1 description of /api/v1,
 * generated from the same collection list as the routes (src/lib/openapi.ts).
 * GET only, to stay static (see src/app/api/v1/route.ts).
 */
export const dynamic = "force-static";

export function GET(): Response {
  return apiJson(openApiDocument(TOOLS));
}
