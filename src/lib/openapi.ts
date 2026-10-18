import { site, absoluteUrl } from "@/lib/site";
import {
  API_BASE,
  API_VERSION,
  CACHE_CONTROL,
  DEVELOPERS_PATH,
  LICENSE_ID,
  LICENSE_NAME,
  MCP_PATH,
  OPENAPI_PATH,
  collections,
  type BuiltCollection,
  type Schema,
} from "@/lib/publicApi";

/**
 * The OpenAPI 3.1 document for /api/v1, generated from the same collection
 * list the routes are built from, so a path cannot exist without being
 * described or be described without existing (qa's API-* gates check the
 * built output both ways).
 *
 * Row schemas are derived from the rows themselves: a property's type is the
 * set of JSON types its values take, and its description is the dataset's own
 * field documentation. A column that is null in every row says so rather than
 * claiming a type the data never shows. Item paths enumerate every id, so the
 * document is also the complete list of item URLs.
 */

const jsonType = (v: unknown): string =>
  v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "number" ? (Number.isInteger(v) ? "integer" : "number") : typeof v;

function rowSchema(c: BuiltCollection): Schema {
  const properties: Record<string, Schema> = {};
  for (const col of c.columns) {
    const added = c.extra?.schema[col];
    if (added) {
      properties[col] = added;
      continue;
    }
    const types = [...new Set(c.rows.map((r) => jsonType(r[col])))].sort();
    const allNull = types.length === 1 && types[0] === "null";
    const doc = c.fieldDocs[col];
    const description = allNull ? `${doc ? `${doc}. ` : ""}Null in every row of this edition.` : doc;
    properties[col] = { type: types.length === 1 ? types[0] : types, ...(description ? { description } : {}) };
  }
  return { type: "object", required: c.columns, properties };
}

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const uri = { type: "string", format: "uri" };

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": { description: "Always *: any origin may read the response.", schema: { type: "string" } },
  "Cache-Control": { description: `Always "${CACHE_CONTROL}".`, schema: { type: "string" } },
};

const NOT_FOUND = {
  description:
    "No item has this id. Ids are case-sensitive. The body is the site's HTML not-found page, not JSON, so check the status code.",
};

function jsonOk(description: string, schema: Schema) {
  return { description, headers: RESPONSE_HEADERS, content: { "application/json": { schema } } };
}

/** Fields every collection and item response carries. */
const PROVENANCE: Record<string, Schema> = {
  apiVersion: { type: "string", const: "v1" },
  self: { ...uri, description: "This response's own URL" },
  title: { type: "string" },
  source: { ...uri, description: "The aifitnessapi.com page carrying the sourced claims for this data" },
  verified: ref("Verified"),
  license: { type: "string", const: LICENSE_ID },
  licenseUrl: uri,
  attribution: { type: "string", description: "Credit this when you reuse the data (CC BY 4.0's one condition)" },
  citeAs: { type: "string", description: "A ready-made citation for the dataset edition" },
  dataset: ref("DatasetRef"),
};

/** Provenance fields only some datasets carry, so never required. */
const OPTIONAL_PROVENANCE: Record<string, Schema> = {
  licenseNote: {
    type: "string",
    description: "What the licence covers, where the dataset limits it (for example, facts restated from a source that is not relicensed); present only on such datasets",
  },
};

export function openApiDocument(tools: { name: string; description: string }[]): Record<string, unknown> {
  const all = collections();
  const schemas: Record<string, Schema> = {
    Verified: {
      type: "object",
      required: ["date", "meaning"],
      description: "When the data was last verified or read from its primary source, and what that date means for this response",
      properties: {
        date: { type: "string", format: "date" },
        meaning: { type: "string" },
      },
    },
    DatasetRef: {
      type: "object",
      required: ["slug", "name", "version", "json", "csv"],
      description: "The published dataset edition this response is served from",
      properties: {
        slug: { type: "string" },
        name: { type: "string" },
        version: { type: "string" },
        json: uri,
        csv: uri,
        isBasedOn: {
          oneOf: [uri, { type: "array", items: uri }],
          description: "The vendor documentation a generated dataset is read from: one URL, or the list of them where it was read from several",
        },
      },
    },
    Excluded: {
      type: "object",
      required: ["id", "reason"],
      description: "A dataset row the collection does not serve, and why",
      properties: { id: { type: "string" }, reason: { type: "string" } },
    },
    ApiIndex: {
      type: "object",
      required: ["name", "apiVersion", "self", "docs", "openapi", "license", "attribution", "verified", "rules", "mcp", "collections"],
      properties: {
        name: { type: "string" },
        apiVersion: { type: "string", const: "v1" },
        self: uri,
        description: { type: "string" },
        source: uri,
        docs: uri,
        openapi: uri,
        license: { type: "string", const: LICENSE_ID },
        licenseUrl: uri,
        attribution: { type: "string" },
        verified: ref("Verified"),
        rules: { type: "array", items: { type: "string" } },
        mcp: {
          type: "object",
          required: ["url", "transport", "tools"],
          properties: {
            url: uri,
            transport: { type: "string", const: "streamable-http" },
            tools: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "description"],
                properties: { name: { type: "string" }, description: { type: "string" } },
              },
            },
          },
        },
        collections: {
          type: "array",
          items: {
            type: "object",
            required: ["title", "url", "itemUrl", "key", "count", "dataset", "source", "verified"],
            properties: {
              title: { type: "string" },
              url: uri,
              itemUrl: { type: "string", description: "URL template for one item" },
              key: { type: "string" },
              count: { type: "integer" },
              dataset: { type: "string" },
              source: uri,
              verified: ref("Verified"),
            },
          },
        },
      },
    },
  };

  const paths: Record<string, unknown> = {
    [API_BASE]: {
      get: {
        operationId: "getIndex",
        tags: ["Discovery"],
        summary: "Every collection, with its count, verified date and item URL template",
        responses: { "200": jsonOk("The discovery document", ref("ApiIndex")) },
      },
    },
    [OPENAPI_PATH]: {
      get: {
        operationId: "getOpenApi",
        tags: ["Discovery"],
        summary: "This OpenAPI 3.1 document",
        responses: { "200": jsonOk("The OpenAPI document", { type: "object" }) },
      },
    },
  };

  for (const c of all) {
    const row = rowSchema(c);
    schemas[c.singular] = row;
    const detail = c.detail
      ? {
          ...row,
          required: [...(row.required as string[]), ...Object.keys(c.detail.schema)],
          properties: { ...(row.properties as Record<string, Schema>), ...c.detail.schema },
        }
      : null;
    if (detail) schemas[`${c.singular}Detail`] = detail;

    schemas[`${c.plural}Collection`] = {
      type: "object",
      required: [...Object.keys(PROVENANCE), "description", "methodology", "key", "itemUrl", "count", "excluded", "fields", "items"],
      properties: {
        ...PROVENANCE,
        ...OPTIONAL_PROVENANCE,
        sourceTerms: {
          type: "string",
          description: "The source's own notice, verbatim, where the dataset carries one; present only on such datasets",
        },
        description: { type: "string" },
        methodology: { type: "string", description: "How the dataset was built, from the dataset itself" },
        key: { type: "string", const: c.param, description: "The item field whose value is the id in itemUrl" },
        itemUrl: { type: "string", description: "URL template for one item" },
        count: { type: "integer", const: c.rows.length },
        excluded: { type: "array", items: ref("Excluded") },
        fields: {
          type: "object",
          description: "What each item field means; null where the dataset documents no meaning",
          additionalProperties: { type: ["string", "null"] },
        },
        items: { type: "array", items: ref(c.singular) },
      },
    };
    schemas[`${c.singular}Response`] = {
      type: "object",
      required: [...Object.keys(PROVENANCE), "collection", "key", "id", "item"],
      properties: {
        ...PROVENANCE,
        ...OPTIONAL_PROVENANCE,
        collection: { ...uri, description: "The collection this item belongs to" },
        key: { type: "string", const: c.param },
        id: { type: "string" },
        item: ref(detail ? `${c.singular}Detail` : c.singular),
      },
    };

    paths[`${API_BASE}/${c.path}`] = {
      get: {
        operationId: `list${c.plural}`,
        tags: [c.tag],
        summary: `${c.title}: every row`,
        description: c.description,
        externalDocs: { description: "The page presenting this data", url: absoluteUrl(c.page) },
        responses: { "200": jsonOk(`${c.rows.length} rows`, ref(`${c.plural}Collection`)) },
      },
    };
    paths[`${API_BASE}/${c.path}/{${c.param}}`] = {
      get: {
        operationId: `get${c.singular}`,
        tags: [c.tag],
        summary: `${c.title}: one row by ${c.param}`,
        description: `${c.description}${detail ? " The single-item response adds fields the collection leaves out." : ""}`,
        parameters: [
          {
            name: c.param,
            in: "path",
            required: true,
            description: "Case-sensitive. The enum is the complete list of ids this edition serves.",
            schema: { type: "string", enum: c.rows.map((r) => c.key(r)) },
          },
        ],
        responses: { "200": jsonOk("The row", ref(`${c.singular}Response`)), "404": NOT_FOUND },
      },
    };
  }

  const tags = [
    { name: "Discovery", description: "The index and this document" },
    ...[...new Set(all.map((c) => c.tag))].map((name) => ({ name })),
  ];

  return {
    openapi: "3.1.0",
    info: {
      // The one brand string listings use (ops/SERP-30-2026-10-12.md #29);
      // API directories show info.title as the listing's name.
      title: "AI Fitness API (aifitnessapi.com)",
      version: API_VERSION,
      summary: "Verified fitness and health API reference data as read-only JSON.",
      description: [
        `Read-only JSON over the datasets ${site.name} publishes at ${absoluteUrl("/datasets")}: HealthKit type identifiers and metadata keys, Health Connect record types and permission strings, Wear OS Health Services data types, Google Health API data types, the HealthKit to Health Connect matrix, Bluetooth fitness GATT characteristic fields, pose-estimation keypoint maps, health and fitness MCP servers, dated ecosystem changes, the glossary, and the API directory.`,
        "",
        "- No key and no sign-up. GET only; nothing is written and no user data is involved.",
        "- Every response is a static file built from the CC BY 4.0 downloads and regenerated on each deploy. Collections are served whole, with no pagination.",
        "- Every response carries `source` (the page carrying the sourced claims), `license`, `attribution` and `verified` (the date and what it means).",
        "- `null` means the source does not state it or it could not be verified. It never means zero, and it is never a guess.",
        "",
        `The same data answers MCP tool calls at ${absoluteUrl(MCP_PATH)} (Streamable HTTP, stateless, read-only): ${tools.map((t) => t.name).join(", ")}.`,
      ].join("\n"),
      license: { name: LICENSE_NAME, identifier: LICENSE_ID },
      contact: { name: site.name, url: absoluteUrl("/about") },
    },
    jsonSchemaDialect: "https://spec.openapis.org/oas/3.1/dialect/base",
    servers: [{ url: site.url }],
    externalDocs: { description: "Developer documentation", url: absoluteUrl(DEVELOPERS_PATH) },
    tags,
    paths,
    components: { schemas },
  };
}
