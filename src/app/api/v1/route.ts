import { apiIndex, apiJson } from "@/lib/publicApi";
import { TOOLS } from "../../../../mcp/src/tools.js";

/**
 * GET /api/v1 — the discovery document: every collection with its count, its
 * verified date and its item URL template, plus the OpenAPI and MCP addresses.
 * Static, built from src/lib/publicApi.ts like every other /api/v1 response.
 *
 * GET only. Next bails out of static generation for a route file that also
 * exports POST, PUT, PATCH, DELETE or OPTIONS (app-route module,
 * hasNonStaticMethods), so CORS preflights are answered by the header rule
 * for /api/v1 in next.config.ts instead.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return apiJson(apiIndex(TOOLS));
}
