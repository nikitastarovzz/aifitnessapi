import fs from "node:fs";
import path from "node:path";

/**
 * Facts about this site's own MCP server, read at build time from the
 * package itself (mcp/package.json and mcp/src/index.js), so a page that
 * describes it cannot drift from what the package declares. Whether npm and
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
  /** Dataset slugs the entry point loads from its bundled data directory. */
  datasets: string[];
  /** True when the entry point connects a StdioServerTransport. */
  stdio: boolean;
  /** True when any tool declares annotations (readOnlyHint and the rest). */
  declaresAnnotations: boolean;
};

let cached: SiteMcpServer | null = null;

export function siteMcpServer(): SiteMcpServer {
  if (cached) return cached;
  const root = path.join(process.cwd(), "mcp");
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const src = fs.readFileSync(path.join(root, "src", "index.js"), "utf8");
  const toolsBlock = /const TOOLS = \[([\s\S]*?)\n\];/.exec(src)?.[1];
  if (!toolsBlock) throw new Error("mcp/src/index.js: could not find the TOOLS array");
  const tools = [...toolsBlock.matchAll(/^\s{4}name: "([a-z0-9_]+)",$/gm)].map((m) => m[1]);
  if (tools.length === 0) throw new Error("mcp/src/index.js: TOOLS parsed to no tool names");
  const datasets = [...src.matchAll(/\bload\("([a-z0-9-]+)"\)/g)].map((m) => m[1]);
  if (datasets.length === 0) throw new Error("mcp/src/index.js: found no load(\"<dataset>\") calls");
  const repo = typeof pkg.repository === "string" ? { url: pkg.repository } : pkg.repository ?? {};
  cached = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    license: pkg.license,
    repositoryUrl: repo.url ?? null,
    repositoryDirectory: repo.directory ?? null,
    tools,
    datasets,
    stdio: /new StdioServerTransport\(\)/.test(src),
    declaresAnnotations: /\bannotations\s*:/.test(toolsBlock),
  };
  return cached;
}
