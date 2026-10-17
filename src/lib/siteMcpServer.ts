import fs from "node:fs";
import path from "node:path";

/**
 * Facts about this site's own MCP server, read at build time from the
 * package itself (mcp/package.json, the tools module mcp/src/tools.js that
 * both transports run, and the stdio entry point mcp/src/index.js) and from
 * the hosted endpoint's route in this repository, so a page that describes it
 * cannot drift from what the package declares. Whether npm and
 * the MCP Registry list it is a different kind of fact — it changes outside
 * this repository — and comes from the generator's run instead
 * (MCP_SITE_SERVER_CHECK in src/data/mcpHealthServers.ts).
 *
 * Throws rather than returning a partial description: a page that says the
 * server has no tools because a parse failed would be stating a falsehood.
 */
export type SiteMcpServer = {
  name: string;
  version: string;
  description: string;
  license: string;
  repositoryUrl: string | null;
  repositoryDirectory: string | null;
  /** Tool names in the order the server lists them. */
  tools: string[];
  /** Dataset slugs the tools read (REQUIRED_DATASETS in mcp/src/tools.js). */
  datasets: string[];
  /** True when the entry point connects a StdioServerTransport. */
  stdio: boolean;
  /** True when any tool declares annotations (readOnlyHint and the rest). */
  declaresAnnotations: boolean;
  /** True when every tool spreads READ_ONLY and READ_ONLY sets readOnlyHint: true. */
  allReadOnly: boolean;
  /** The hosted Streamable HTTP endpoint's URL when src/app/mcp/route.ts serves the same tools. */
  hostedUrl: string | null;
};

let cached: SiteMcpServer | null = null;

export function siteMcpServer(): SiteMcpServer {
  if (cached) return cached;
  const root = path.join(process.cwd(), "mcp");
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const tools = fs.readFileSync(path.join(root, "src", "tools.js"), "utf8");
  const entry = fs.readFileSync(path.join(root, "src", "index.js"), "utf8");
  const toolsBlock = /export const TOOLS = \[([\s\S]*?)\n\];/.exec(tools)?.[1];
  if (!toolsBlock) throw new Error("mcp/src/tools.js: could not find the TOOLS array");
  const names = [...toolsBlock.matchAll(/^\s{4}name: "([a-z0-9_]+)",$/gm)].map((m) => m[1]);
  if (names.length === 0) throw new Error("mcp/src/tools.js: TOOLS parsed to no tool names");
  const required = /export const REQUIRED_DATASETS = \[([\s\S]*?)\];/.exec(tools)?.[1] ?? "";
  const datasets = [...required.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
  if (datasets.length === 0) throw new Error("mcp/src/tools.js: REQUIRED_DATASETS parsed to no dataset");
  const readOnly = /const READ_ONLY = \{([^}]*)\}/.exec(tools)?.[1] ?? "";
  const spreads = toolsBlock.match(/\.\.\.READ_ONLY\b/g)?.length ?? 0;
  const site = /export const SITE = "([^"]+)"/.exec(tools)?.[1] ?? null;
  const hosted = fs.existsSync(path.join(process.cwd(), "src", "app", "mcp", "route.ts"));
  const repo = typeof pkg.repository === "string" ? { url: pkg.repository } : pkg.repository ?? {};
  cached = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    license: pkg.license,
    repositoryUrl: repo.url ?? null,
    repositoryDirectory: repo.directory ?? null,
    tools: names,
    datasets,
    stdio: /new StdioServerTransport\(\)/.test(entry),
    declaresAnnotations: /\bannotations\s*:/.test(toolsBlock),
    allReadOnly: spreads === names.length && /readOnlyHint:\s*true/.test(readOnly),
    hostedUrl: hosted && site ? `${site}/mcp` : null,
  };
  return cached;
}
