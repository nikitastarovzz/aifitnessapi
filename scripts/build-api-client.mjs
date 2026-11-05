/**
 * Generate packages/api-client/src/schema.ts from the site's OpenAPI document
 * for /api/v1 (ops/AUDIENCE-30-2026-11-05.md item 4).
 *
 *   npm run build && node scripts/build-api-client.mjs           write it
 *   node scripts/build-api-client.mjs --check                    exit 1 on drift
 *   node scripts/build-api-client.mjs --from path/to/openapi.json
 *
 * The OpenAPI document is itself generated (src/lib/openapi.ts) from the same
 * collection list the routes are built from, so it is read from the build
 * output — `.next/server/app/api/v1/openapi.json.body` — the way a client
 * meets it. qa's API-CLIENT-DRIFT gate imports `renderSchemaModule` and
 * compares, so a column added, removed or retyped in a dataset fails the
 * build until this is rerun.
 *
 * What is rendered, and what is deliberately not:
 *   - Envelope schemas (Verified, DatasetRef, Excluded, ApiIndex, each
 *     collection's Collection and Response) exactly, minus per-edition
 *     constants: `count` and item-id enums change with every data refresh and
 *     are typed `number` and `string`.
 *   - Row fields the OpenAPI document derives from the rows themselves (a
 *     bare `type`) as their observed non-null types `| null`, and as
 *     `unknown` where every row is null: the API's rule is that null means
 *     "the source does not state it", so any field may be null tomorrow.
 *     Fields with a declared schema (items, properties, format) are rendered
 *     from that schema, and each collection's id field is `string`.
 *   - No descriptions: they are documentation that changes for reasons a
 *     type checker cannot see. Read them in /api/v1/openapi.json or on
 *     /developers.
 *
 * Generated file: registered in CLAUDE.md's table. Never hand-edit it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const OUT = "packages/api-client/src/schema.ts";
export const BUILT_OPENAPI = ".next/server/app/api/v1/openapi.json.body";

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const prop = (k) => (IDENT.test(k) ? k : JSON.stringify(k));
const SCALAR = { string: "string", integer: "number", number: "number", boolean: "boolean", null: "null" };

function union(parts) {
  const uniq = [...new Set(parts)];
  return uniq.length ? uniq.join(" | ") : "unknown";
}

/** A JSON Schema fragment as a TypeScript type expression. */
function tsType(schema, ctx, indent = "") {
  if (!schema || typeof schema !== "object") return "unknown";
  if (schema.$ref) return schema.$ref.replace("#/components/schemas/", "");
  if (schema.oneOf || schema.anyOf) return union((schema.oneOf ?? schema.anyOf).map((s) => tsType(s, ctx, indent)));
  if (schema.const !== undefined) {
    // Per-edition numeric constants (a collection's count) are not types.
    return typeof schema.const === "string" ? JSON.stringify(schema.const) : typeof schema.const === "number" ? "number" : "unknown";
  }
  if (Array.isArray(schema.enum) && !ctx.dropEnums) return union(schema.enum.map((v) => JSON.stringify(v)));
  const types = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
  const out = types.map((t) => {
    if (t === "array") return `${wrap(tsType(schema.items, ctx, indent))}[]`;
    if (t === "object") return objectType(schema, ctx, indent);
    return SCALAR[t] ?? "unknown";
  });
  if (!types.length && schema.properties) out.push(objectType(schema, ctx, indent));
  return union(out);
}

const wrap = (t) => (/[|&]/.test(t) ? `(${t})` : t);

function objectType(schema, ctx, indent) {
  const props = schema.properties ?? {};
  const keys = Object.keys(props);
  if (!keys.length) {
    const ap = schema.additionalProperties;
    return ap && typeof ap === "object" ? `Record<string, ${tsType(ap, ctx, indent)}>` : "Record<string, unknown>";
  }
  const req = new Set(schema.required ?? []);
  const inner = `${indent}  `;
  const lines = keys.map((k) => `${inner}${prop(k)}${req.has(k) ? "" : "?"}: ${tsType(props[k], ctx, inner)};`);
  return `{\n${lines.join("\n")}\n${indent}}`;
}

/** Is this a row property the OpenAPI generator derived from observed values? */
function isObserved(schema) {
  if (!schema || schema.$ref || schema.items || schema.properties || schema.format || schema.oneOf || schema.anyOf || schema.enum) return false;
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  return types.every((t) => t in SCALAR || t === "array" || t === "object");
}

function rowInterface(name, schema, ctx, keyField) {
  const props = schema.properties ?? {};
  const req = new Set(schema.required ?? []);
  const lines = Object.entries(props).map(([k, s]) => {
    let t;
    // The id field is never null: the build refuses a row whose id is not URL-safe.
    if (k === keyField) t = "string";
    else if (isObserved(s)) {
      const types = (Array.isArray(s.type) ? s.type : [s.type]).filter((x) => x !== "null");
      t = types.length ? `${union(types.map((x) => (x === "array" ? "unknown[]" : x === "object" ? "Record<string, unknown>" : SCALAR[x])))} | null` : "unknown";
    } else t = tsType(s, ctx, "  ");
    return `  ${prop(k)}${req.has(k) ? "" : "?"}: ${t};`;
  });
  return `export interface ${name} {\n${lines.join("\n")}\n}`;
}

/**
 * @param {Record<string, any>} openapi  the /api/v1/openapi.json document
 * @returns {string} the schema.ts module text
 */
export function renderSchemaModule(openapi) {
  const schemas = openapi?.components?.schemas;
  const paths = openapi?.paths;
  if (!schemas || !paths || openapi.openapi !== "3.1.0") throw new Error("not the /api/v1 OpenAPI 3.1 document");
  const ctx = { dropEnums: true };

  // Collections: a list path with exactly one item path under it.
  const collections = [];
  for (const [p, op] of Object.entries(paths)) {
    const get = op.get;
    if (!get?.operationId?.startsWith("list")) continue;
    const itemPath = Object.keys(paths).find((q) => q.startsWith(`${p}/{`) && q.split("/").length === p.split("/").length + 1);
    if (!itemPath) throw new Error(`${p} has no item path`);
    const param = itemPath.slice(p.length + 2, -1);
    const listRef = get.responses["200"].content["application/json"].schema.$ref.replace("#/components/schemas/", "");
    const itemRef = paths[itemPath].get.responses["200"].content["application/json"].schema.$ref.replace("#/components/schemas/", "");
    const singular = itemRef.replace(/Response$/, "");
    const hasDetail = Boolean(schemas[`${singular}Detail`]);
    collections.push({ path: p.replace(/^\/api\/v1\//, ""), param, listRef, itemRef, singular, detail: hasDetail ? `${singular}Detail` : singular });
  }
  if (collections.length < 5) throw new Error(`only ${collections.length} collections found: a short parse fails the build`);
  collections.sort((a, b) => a.path.localeCompare(b.path));

  const rowKeys = new Map(collections.flatMap((c) => [[c.singular, c.param], [c.detail, c.param]]));
  const blocks = [];
  for (const name of Object.keys(schemas).sort()) {
    const s = schemas[name];
    if (rowKeys.has(name)) blocks.push(rowInterface(name, s, ctx, rowKeys.get(name)));
    else blocks.push(`export type ${name} = ${tsType(s, ctx, "")};`);
  }

  const map = collections
    .map((c) => `  ${JSON.stringify(c.path)}: { key: ${JSON.stringify(c.param)}; item: ${c.singular}; detail: ${c.detail}; collection: ${c.listRef}; response: ${c.itemRef} };`)
    .join("\n");
  const runtime = collections.map((c) => `  ${JSON.stringify(c.path)}: ${JSON.stringify(c.param)},`).join("\n");

  return `/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   npm run build && node scripts/build-api-client.mjs
 *
 * Types for https://aifitnessapi.com/api/v1, rendered from the OpenAPI
 * document the site builds (/api/v1/openapi.json, version ${openapi.info?.version ?? "?"}).
 * ${collections.length} collections. Row fields the API derives from the data are typed
 * as their observed types | null (null means the source does not state it);
 * descriptions live in the OpenAPI document and on /developers.
 */

${blocks.join("\n\n")}

/** Every collection path, with the item key and the types it serves. */
export interface Collections {
${map}
}

export type CollectionPath = keyof Collections;

/** The item key of each collection, at run time. */
export const COLLECTION_KEYS: { readonly [P in CollectionPath]: Collections[P]["key"] } = {
${runtime}
};
`;
}

function main() {
  const args = process.argv.slice(2);
  const fromIdx = args.indexOf("--from");
  const src = fromIdx >= 0 ? args[fromIdx + 1] : BUILT_OPENAPI;
  if (!fs.existsSync(src)) {
    console.error(`${src} is missing — run \`npm run build\` first (or pass --from <openapi.json>).`);
    process.exit(2);
  }
  const text = renderSchemaModule(JSON.parse(fs.readFileSync(src, "utf8")));
  if (args.includes("--check")) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
    if (current !== text) {
      console.error(`${OUT} is out of date with ${src}: run node scripts/build-api-client.mjs`);
      process.exit(1);
    }
    console.log(`${OUT} matches ${src}.`);
    return;
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, text);
  console.log(`wrote ${OUT} (${text.length} bytes)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
