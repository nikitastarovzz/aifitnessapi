import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import {
  createToolkit,
  SERVER_INFO,
  SERVER_INSTRUCTIONS,
  type DatasetDocument,
} from "../../../mcp/src/tools.js";
// Imported, not read from disk: this route runs on demand, and an import is
// bundled into the function, where a runtime read of public/ would depend on
// output tracing to ship the files. Same files the API and downloads serve.
import healthkitTypes from "../../../public/datasets/healthkit-type-identifiers-2026.json";
import typeMatrix from "../../../public/datasets/health-data-type-matrix-2026.json";
import ecosystemChanges from "../../../public/datasets/fitness-api-changes-2026.json";
import glossaryTerms from "../../../public/datasets/fitness-api-glossary-2026.json";

/**
 * The hosted MCP endpoint: https://aifitnessapi.com/mcp.
 *
 * The same four read-only tools as the stdio package (@aifitnessapi/mcp), from
 * the same module (mcp/src/tools.js), over the same published datasets. The
 * transport is the SDK's Streamable HTTP transport in stateless mode: a fresh
 * server and transport per POST, no session ids, JSON responses instead of SSE
 * streams. Nothing is stored between requests and nothing is written anywhere.
 *
 * GET and DELETE answer 405, which the MCP spec (2025-11-25, Streamable HTTP)
 * allows when a server offers no standalone SSE stream and no sessions to end.
 *
 * Origin: the spec asks servers to validate Origin against DNS rebinding,
 * which protects servers on a private network from pages a user visits. This
 * one is public, unauthenticated, read-only and holds no user data, so every
 * origin is acceptable and browser-based clients are welcome (CORS *).
 */
export const dynamic = "force-dynamic";
// Each call is an in-memory lookup that finishes in milliseconds; a short cap
// bounds what a stuck request can cost.
export const maxDuration = 10;

const toolkit = createToolkit({
  "healthkit-type-identifiers-2026": healthkitTypes as unknown as DatasetDocument,
  "health-data-type-matrix-2026": typeMatrix as unknown as DatasetDocument,
  "fitness-api-changes-2026": ecosystemChanges as unknown as DatasetDocument,
  "fitness-api-glossary-2026": glossaryTerms as unknown as DatasetDocument,
});

/** Tool arguments are a few short strings; anything near this is not a client. */
const MAX_BODY_BYTES = 64 * 1024;

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
  "access-control-allow-headers": "Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID",
  "access-control-expose-headers": "Mcp-Session-Id, Mcp-Protocol-Version",
  "access-control-max-age": "86400",
};
/** A machine endpoint, not a page (the same rule as /opensearch.xml). */
const COMMON = { ...CORS, "x-robots-tag": "noindex", "cache-control": "no-store" };

function withHeaders(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(COMMON)) headers.set(k, v);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

function rpcError(status: number, code: number, message: string, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ jsonrpc: "2.0", error: { code, message }, id: null }), {
    status,
    headers: { "content-type": "application/json", ...COMMON, ...extra },
  });
}

function buildServer(): Server {
  // The low-level Server: the tool definitions are plain JSON Schema shared
  // with the stdio package (see mcp/src/index.js).
  const server = new Server(SERVER_INFO, { capabilities: { tools: {} }, instructions: SERVER_INSTRUCTIONS });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: toolkit.tools }));
  server.setRequestHandler(CallToolRequestSchema, async (req) => toolkit.call(req.params.name, req.params.arguments));
  return server;
}

export async function POST(req: Request): Promise<Response> {
  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: MAX_BODY_BYTES,
  });
  try {
    await server.connect(transport);
    // In JSON-response mode this resolves once every response to the request
    // is in the body, so closing below cannot cut a reply short.
    return withHeaders(await transport.handleRequest(req));
  } catch {
    return rpcError(500, -32603, "Internal error");
  } finally {
    await transport.close().catch(() => undefined);
    await server.close().catch(() => undefined);
  }
}

const NOT_OFFERED =
  "Method not allowed. This is a stateless MCP endpoint (Streamable HTTP): POST JSON-RPC messages here. There is no SSE stream to open and no session to end. Docs: https://aifitnessapi.com/developers";

export function GET(): Response {
  return rpcError(405, -32000, NOT_OFFERED, { allow: "POST, OPTIONS" });
}

export function DELETE(): Response {
  return rpcError(405, -32000, NOT_OFFERED, { allow: "POST, OPTIONS" });
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: { ...COMMON, allow: "GET, POST, DELETE, OPTIONS" } });
}
