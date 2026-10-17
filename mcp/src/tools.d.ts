/** Types for ./tools.js — the shared MCP tool logic (see that file's header). */

/** A published dataset document (public/datasets/<slug>.json). */
export interface DatasetDocument {
  name: string;
  version: string;
  license: string;
  items: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, Record<string, unknown>>;
    required?: string[];
  };
  annotations: {
    title: string;
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
    openWorldHint: boolean;
  };
}

/** A type alias, not an interface, so it stays assignable to the SDK's
 *  index-signature result types. */
export type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

export interface Toolkit {
  tools: ToolDefinition[];
  call(name: string, args: unknown): ToolResult;
}

export const SITE: string;
export const SERVER_INFO: {
  name: string;
  title: string;
  version: string;
  description: string;
  websiteUrl: string;
};
export const SERVER_INSTRUCTIONS: string;
export const REQUIRED_DATASETS: string[];
export const TOOLS: ToolDefinition[];

export function createToolkit(
  datasets: Record<string, DatasetDocument>,
  options?: { now?: () => Date },
): Toolkit;
