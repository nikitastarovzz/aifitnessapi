#!/usr/bin/env node
/**
 * aifitnessapi-mcp — the site's reference data as MCP tools, over stdio.
 *
 * Why this exists: the audience for this data has moved. A developer deciding
 * whether HealthKit's step count is summable now asks their coding assistant,
 * not a search box. An MCP server puts the verified answer inside that loop,
 * and every response carries the canonical URL so the citation survives.
 *
 * The tools themselves live in ./tools.js, shared with the hosted endpoint at
 * https://aifitnessapi.com/mcp, so both answer the same questions the same way.
 * This file only loads the bundled datasets and speaks stdio.
 *
 * Every tool answers only from the bundled datasets. There is no model in this
 * server and no network call: if the data does not contain an answer, the tool
 * says so rather than producing one.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createToolkit, REQUIRED_DATASETS, SERVER_INFO, SERVER_INSTRUCTIONS } from "./tools.js";

const DATA = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
const load = (slug) => JSON.parse(readFileSync(join(DATA, `${slug}.json`), "utf8"));

const toolkit = createToolkit(Object.fromEntries(REQUIRED_DATASETS.map((slug) => [slug, load(slug)])));

// The low-level Server rather than McpServer: the tool definitions are plain
// JSON Schema shared with the hosted endpoint, which is the "advanced use"
// case the SDK keeps Server for.
const server = new Server(SERVER_INFO, { capabilities: { tools: {} }, instructions: SERVER_INSTRUCTIONS });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: toolkit.tools }));
server.setRequestHandler(CallToolRequestSchema, async (req) => toolkit.call(req.params.name, req.params.arguments));

await server.connect(new StdioServerTransport());
