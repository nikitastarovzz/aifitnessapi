import fs from "node:fs";
import path from "node:path";
import { absoluteUrl } from "@/lib/site";
import { API_ENTRIES, APIS_PATH } from "@/data/apis";
import { coverageFor } from "@/lib/apiCoverage";
import { allSpokes } from "@/lib/clusterRegistry";
import { HK_BASE, GROUP_TO_SLUG, releasedHkGroups } from "@/data/hkGroupPages";
import { HC_PERMISSIONS_PATH, permissionAnchor } from "@/data/hcPages";

/**
 * The public read-only JSON API (/api/v1) — the published datasets, served
 * one collection and one item at a time.
 *
 * Every response is built from the files in public/datasets, the same files
 * /datasets offers as downloads, read at build time and served as static
 * JSON. Nothing is retyped here: item fields are the datasets' own columns,
 * and the few fields this module adds (a product's directory page, the pages
 * covering it, a change's id) are computed from the site's own data modules.
 *
 * COLLECTIONS is the whole configuration. One entry gives a dataset its
 * collection endpoint, an endpoint per item, its paths and schemas in the
 * OpenAPI document, its row on /developers and the index, and qa coverage
 * (the API-* gates read the built output, not this file). To publish another
 * dataset through the API, add one entry here; there is no other list to
 * update.
 */

export const API_BASE = "/api/v1";
export const OPENAPI_PATH = `${API_BASE}/openapi.json`;
export const MCP_PATH = "/mcp";
export const DEVELOPERS_PATH = "/developers";
export const LICENSE_ID = "CC-BY-4.0";
export const LICENSE_NAME = "CC BY 4.0";
export const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
export const ATTRIBUTION = "aifitnessapi.com";
/** OpenAPI info.version: the version of the interface, not of the data. */
export const API_VERSION = "1.0.0";

/** Responses are files regenerated on every deploy, so a client may reuse
 *  one for an hour and keep using it while it revalidates. */
export const CACHE_CONTROL = "public, max-age=3600, stale-while-revalidate=86400";

const API_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": CACHE_CONTROL,
  // Machine files, not pages: the same rule as /opensearch.xml. Fetchers and
  // assistants read them; search results should show the pages they cite.
  "x-robots-tag": "noindex",
  "x-content-type-options": "nosniff",
};

/** A built response: GET bodies are static, so this is all a handler sends.
 *  CORS preflights never reach a handler here (see src/app/api/v1/route.ts);
 *  the /api/v1 header rule in next.config.ts answers them. */
export function apiJson(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), { status, headers: API_HEADERS });
}

/* ───────────────────────────── the datasets ───────────────────────────── */

export type Row = Record<string, unknown>;

type DatasetDoc = {
  name: string;
  version: string;
  publisher: string;
  license: string;
  /** What the licence covers, where a dataset limits it (the Bluetooth SIG's
   *  facts are restated, not relicensed). Carried by every response. */
  licenseNote?: string;
  /** The source's own notice, verbatim. Carried by the collection response. */
  sourceTerms?: string;
  methodology: string;
  generatedFrom: string;
  /** One URL, or the list of sources a dataset was read from. */
  isBasedOn?: string | string[];
  sourceReadOn?: string;
  fields?: Record<string, string>;
  items: Row[];
};

export type Verified = { date: string; meaning: string };

/** A JSON Schema fragment, as the OpenAPI document needs it. */
export type Schema = Record<string, unknown>;

function loadDataset(slug: string): DatasetDoc {
  const file = path.join(process.cwd(), "public", "datasets", `${slug}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`public/datasets/${slug}.json is missing — run \`npm run datasets\` before building.`);
  }
  const doc = JSON.parse(fs.readFileSync(file, "utf8")) as DatasetDoc;
  if (!Array.isArray(doc.items) || doc.items.length === 0) throw new Error(`public/datasets/${slug}.json has no items.`);
  return doc;
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

function day(value: unknown, what: string): string {
  if (typeof value !== "string" || !ISO_DAY.test(value)) throw new Error(`${what} is not a YYYY-MM-DD date: ${JSON.stringify(value)}`);
  return value;
}

/**
 * A hand-built page's review date: its page-local `const UPDATED`, only when
 * the page publishes that constant as its WebPage lastReviewed
 * (`updated={UPDATED}` on PageSummary). Next refuses extra exports from a
 * page module, so the constant is read from source, as sitemap.ts reads it;
 * the build has the source. A page that states no review date fails the
 * build rather than lending its dataset one. Callers pass the file as a
 * literal path, so output tracing ships that one source file and not every
 * page.tsx in src/app.
 */
function reviewStamp(route: string, file: string): string {
  const src = fs.readFileSync(file, "utf8");
  const m = /const UPDATED\s*=\s*"(\d{4}-\d{2}-\d{2})"/.exec(src);
  if (!m || !/\bupdated=\{UPDATED\}/.test(src)) {
    throw new Error(`${route} publishes no review date (const UPDATED passed to PageSummary), so its dataset has no verified date.`);
  }
  return m[1];
}

const oldest = (dates: string[]) => [...dates].sort()[0];

/** Dataset generators record the day they read the vendor's documentation. */
function readOn(doc: DatasetDoc, what: string): Verified {
  const based = Array.isArray(doc.isBasedOn)
    ? ` (${doc.isBasedOn.length} sources, listed in the dataset's isBasedOn)`
    : doc.isBasedOn
      ? ` (${doc.isBasedOn})`
      : "";
  return {
    date: day(doc.sourceReadOn, `${doc.name} sourceReadOn`),
    meaning: `The date the generator read ${what}${based} for every row: the dataset's sourceReadOn.`,
  };
}

/** The canonical spoke, when a path is one, for its last-verified date. */
const SPOKE_UPDATED = new Map(allSpokes().map(({ basePath, entry }) => [`${basePath}/${entry.slug}`, entry.updated]));

const relPath = (url: unknown) => String(url).replace(/^https:\/\/aifitnessapi\.com/, "") || "/";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The fragment of a row's `page` URL: the row's own anchor on the page that
 *  presents it, as the dataset generator wrote it. */
function pageFragment(r: Row, what: string): string {
  const frag = String(r.page ?? "").split("#")[1];
  if (!frag) throw new Error(`${what}: a row's page URL has no #fragment (${String(r.page)}) — regenerate the datasets (npm run datasets).`);
  return frag;
}

/** An MCP server's id: its row anchor on /health-mcp-servers without the
 *  server- prefix, i.e. the registry name lowercased with each run of other
 *  characters made a hyphen (scripts/fetch-mcp-health-servers.mjs, slugOf). */
function mcpServerId(r: Row): string {
  const frag = pageFragment(r, "mcp-servers");
  if (!frag.startsWith("server-")) throw new Error(`mcp-servers: ${String(r.name)} is anchored at #${frag}, not #server-…`);
  return frag.slice("server-".length);
}

/** A GATT row's id: the characteristic's UUID, then the field's order in the
 *  structure; the UUID alone for a characteristic with no published structure. */
function gattFieldId(r: Row): string {
  return r.order === null || r.order === undefined ? String(r.characteristicUuid) : `${String(r.characteristicUuid)}.${String(r.order)}`;
}

/** A keypoint's id: the scheme, then the source's index — or the joint name
 *  for Apple Vision's joints, which have no index. */
function keypointId(r: Row): string {
  return `${String(r.scheme)}.${String(r.index ?? r.name)}`;
}

/** The aliases the directory matches products by, with the same word-boundary
 *  rule as lib/apiCoverage.ts, applied to the published change rows. */
function names(text: unknown, alias: string): boolean {
  const re = new RegExp(`(?<![\\w-])${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`);
  return re.test(String(text ?? ""));
}

/* ─────────────────────────── the configuration ─────────────────────────── */

type Collection = {
  /** Dataset slug: public/datasets/<dataset>.json. */
  dataset: string;
  /** Path below /api/v1. */
  path: string;
  /** Path parameter naming one item, and the served field that holds it. */
  param: string;
  /** The stable id of a row. Must be unique and URL-safe. */
  key: (row: Row) => string;
  /** OpenAPI names: list<plural>, get<singular>, and the schema names. */
  plural: string;
  singular: string;
  tag: string;
  title: string;
  /** One or two sentences: what a row is, and anything a reader must know. */
  description: string;
  /** The page on this site that presents the same data as prose. */
  page: string;
  verified: (doc: DatasetDoc, rows: Row[]) => Verified;
  /** Rows served; the default is every row. Each left out says why. */
  exclude?: (row: Row) => string | null;
  /** Fields added to every served row, with their schemas. */
  extra?: { compute: (row: Row) => Row; schema: Record<string, Schema> };
  /** Fields added only to the one-item response, with their schemas. The
   *  published change rows are passed in for joins against them. */
  detail?: { compute: (row: Row, changes: Row[]) => Row; schema: Record<string, Schema> };
  /** One item's own verification, when rows carry their own date. */
  itemVerified?: (row: Row) => Verified;
  /** The site page (or fragment) carrying one row's claims. */
  itemSource?: (row: Row) => string;
  /** Descriptions for columns the dataset's own `fields` leaves undescribed. */
  fieldNotes?: Record<string, string>;
};

const hkGroupSlugs = new Set(releasedHkGroups().map((g) => g.slug));

const COLLECTIONS: Collection[] = [
  {
    dataset: "fitness-apis-2026",
    path: "apis",
    param: "id",
    key: (r) => String(r.id),
    plural: "Apis",
    singular: "Api",
    tag: "API directory",
    title: "API directory",
    description:
      "One row per product in the directory at /apis: how the vendor bills developers, what each end user must own or pay for, and what approval gates a launch, each quoted from the linked source page. No prices, by design.",
    page: APIS_PATH,
    exclude: (r) => {
      if (API_ENTRIES.some((a) => a.id === r.id)) return null;
      if (r.category === "llm-features") {
        return "A category, not a product: it stands for whichever LLM vendor you use, so the directory gives it no page. It stays in the dataset download.";
      }
      throw new Error(`fitness-apis-2026 row "${String(r.id)}" has no directory entry — regenerate the datasets (npm run datasets).`);
    },
    extra: {
      compute: (r) => {
        const updated = SPOKE_UPDATED.get(relPath(r.source));
        return {
          page: absoluteUrl(`${APIS_PATH}/${String(r.id)}`),
          sourceLastVerified: updated ? day(updated, `${String(r.id)} source page updated`) : null,
        };
      },
      schema: {
        page: { type: "string", format: "uri", description: "The product's page in the aifitnessapi.com directory" },
        sourceLastVerified: {
          type: ["string", "null"],
          format: "date",
          description: "When the source page was last verified; null where the source is not a dated page",
        },
      },
    },
    detail: {
      compute: (r, changes) => {
        const api = API_ENTRIES.find((a) => a.id === r.id);
        if (!api) throw new Error(`no directory entry for ${String(r.id)}`);
        return {
          coverage: coverageFor(api.id).map((c) => ({
            section: c.clusterLabel,
            url: absoluteUrl(c.basePath),
            pages: c.pages.map((p) => ({ title: p.h1, url: absoluteUrl(p.href) })),
          })),
          changes: changes
            .filter((c) => api.aliases.some((a) => names(c.title, a) || names(c.summary, a)))
            .map((c) => ({ id: changeId(c), date: c.date, title: c.title, status: c.status, url: absoluteUrl(`${API_BASE}/changes/${changeId(c)}`) })),
        };
      },
      schema: {
        coverage: {
          type: "array",
          description: "Every page on aifitnessapi.com that covers the product, grouped by section, most relevant first",
          items: {
            type: "object",
            required: ["section", "url", "pages"],
            properties: {
              section: { type: "string" },
              url: { type: "string", format: "uri" },
              pages: {
                type: "array",
                items: {
                  type: "object",
                  required: ["title", "url"],
                  properties: { title: { type: "string" }, url: { type: "string", format: "uri" } },
                },
              },
            },
          },
        },
        changes: {
          type: "array",
          description: "Tracked ecosystem changes that name the product (rows of /api/v1/changes)",
          items: {
            type: "object",
            required: ["id", "date", "title", "status", "url"],
            properties: {
              id: { type: "string" },
              date: { type: "string" },
              title: { type: "string" },
              status: { type: "string" },
              url: { type: "string", format: "uri" },
            },
          },
        },
      },
    },
    verified: (_doc, rows) => {
      const dates = rows.map((r) => r.sourceLastVerified).filter((d): d is string => typeof d === "string");
      return {
        date: oldest(dates),
        meaning:
          "Each row's facts are quoted from its source page; this is the oldest of those pages' last-verified dates. Every row carries its own as sourceLastVerified.",
      };
    },
    itemVerified: (r) => ({
      date: day(r.sourceLastVerified, `${String(r.id)} sourceLastVerified`),
      meaning: `When ${String(r.source)}, the page this row's facts are quoted from, was last verified.`,
    }),
    itemSource: (r) => String(r.source),
    fieldNotes: {
      id: "Product id, also the slug of the product's directory page (/apis/<id>)",
      label: "The product as the directory names it",
      category:
        "Directory category: wearable-direct, aggregator, platform-store, nutrition, exercise-content, motion-sdk or pose-model",
      source: "aifitnessapi.com page carrying the verified claims",
    },
  },
  {
    dataset: "healthkit-type-identifiers-2026",
    path: "healthkit/types",
    param: "identifier",
    key: (r) => String(r.identifier),
    plural: "HealthkitTypes",
    singular: "HealthkitType",
    tag: "Apple HealthKit",
    title: "HealthKit type identifiers",
    description:
      "Every identifier in HealthKit's four families (quantity, category, characteristic, workout activity type), read from Apple's documentation JSON. aggregation and unitFamily are derived from Apple's prose and are null where Apple does not state them.",
    page: "/healthkit-identifiers",
    verified: (doc) => readOn(doc, "Apple's HealthKit documentation JSON"),
    itemSource: (r) => {
      const slug = GROUP_TO_SLUG[String(r.group)];
      return slug && hkGroupSlugs.has(slug)
        ? absoluteUrl(`${HK_BASE}/${slug}#id-${String(r.identifier).toLowerCase()}`)
        : absoluteUrl("/healthkit-identifiers");
    },
  },
  {
    dataset: "healthkit-metadata-keys-2026",
    path: "healthkit/metadata-keys",
    param: "swiftName",
    key: (r) => String(r.swiftName),
    plural: "HealthkitMetadataKeys",
    singular: "HealthkitMetadataKey",
    tag: "Apple HealthKit",
    title: "HealthKit metadata keys",
    description:
      "Every HKMetadataKey constant on Apple's Metadata Keys collection and its workout sub-collection. valueType is read from Apple's own sentence, which ships beside it in valueTypeEvidence; both are null where Apple does not say.",
    page: "/healthkit-metadata-keys",
    verified: (doc) => readOn(doc, "Apple's Metadata Keys documentation JSON"),
    itemSource: (r) => String(r.page),
  },
  {
    dataset: "health-connect-records-2026",
    path: "health-connect/records",
    param: "className",
    key: (r) => String(r.className),
    plural: "HealthConnectRecords",
    singular: "HealthConnectRecord",
    tag: "Android Health Connect",
    title: "Health Connect record types",
    description:
      "Every record class in Google's Health Connect data-types table, joined to its Jetpack reference page: shape, unit class, mandatory fields, the read and write permission strings, and aggregate metrics.",
    page: "/health-connect",
    verified: (doc) => readOn(doc, "Google's Health Connect data-types table and Jetpack reference"),
    itemSource: (r) => String(r.page),
    fieldNotes: {
      qualifiedName: "The record class's fully qualified Jetpack name",
      dataType: "The data type's name in Google's data-types table",
      featureFlag: "The FEATURE_ constant Google's table names in the row's permissions cell; null where none",
      deprecated: "yes when the class's Jetpack reference marks it deprecated",
    },
  },
  {
    dataset: "health-connect-permissions-2026",
    path: "health-connect/permissions",
    param: "constant",
    key: (r) => String(r.constant),
    plural: "HealthConnectPermissions",
    singular: "HealthConnectPermission",
    tag: "Android Health Connect",
    title: "Health Connect permission strings",
    description:
      "Every constant on Android's framework HealthPermissions reference: the manifest string, Google's description, protection level, availability, and the record classes whose data-types row names it.",
    page: HC_PERMISSIONS_PATH,
    verified: (doc) => readOn(doc, "Android's HealthPermissions reference"),
    itemSource: (r) => absoluteUrl(`${HC_PERMISSIONS_PATH}#${permissionAnchor(String(r.permission))}`),
  },
  {
    dataset: "wear-os-health-services-data-types-2026",
    path: "wear-os/data-types",
    param: "name",
    key: (r) => String(r.name),
    plural: "WearOsDataTypes",
    singular: "WearOsDataType",
    tag: "Wear OS Health Services",
    title: "Wear OS Health Services data types",
    description:
      "Every DataType constant on Google's Jetpack reference for Wear OS Health Services. permission is set only where Google's permissions table names the constant, with that table row in permissionEvidence.",
    page: "/wear-os-data-types",
    verified: (doc) => readOn(doc, "Google's Jetpack DataType reference and Health Services permissions guide"),
    itemSource: (r) => String(r.page),
  },
  {
    dataset: "health-data-type-matrix-2026",
    path: "matrix",
    param: "id",
    key: (r) => String(r.id),
    plural: "MatrixRows",
    singular: "MatrixRow",
    tag: "Cross-platform",
    title: "HealthKit to Health Connect type matrix",
    description:
      "One row per common health metric: the Apple HealthKit type identifier, the Android Health Connect record type, and the cross-platform gotcha where one exists. Narrow on purpose: only cells verified against both vendors' documentation.",
    page: "/matrix",
    verified: () => ({
      date: reviewStamp("/matrix", path.join(process.cwd(), "src", "app", "matrix", "page.tsx")),
      meaning: `The review date of ${absoluteUrl("/matrix")}, the page that carries these rows and their sources.`,
    }),
    itemSource: (r) => String(r.source),
  },
  {
    dataset: "fitness-api-changes-2026",
    path: "changes",
    param: "id",
    key: (r) => changeId(r),
    plural: "Changes",
    singular: "Change",
    tag: "Ecosystem changes",
    title: "Dated ecosystem changes",
    description:
      "Dated deprecations, deadlines and term changes, newest first. status grades the evidence: confirmed means the vendor's own words are quoted on the linked page; reported means the claim could not be confirmed on an official page. Date precision is kept as sourced.",
    page: "/changes",
    extra: {
      compute: (r) => ({ id: changeId(r) }),
      schema: {
        id: {
          type: "string",
          description:
            "sortDate plus the slugged title, the same rule as the deadlines calendar's event UIDs; it changes only if the entry's date or title is edited",
        },
      },
    },
    verified: (_doc, rows) => ({
      date: oldest(rows.map((r) => day(r.verifiedOn, `change "${String(r.title)}" verifiedOn`))),
      meaning:
        "The oldest verifiedOn among the rows: every entry was last checked against its source page on or after this date. Each row carries its own verifiedOn.",
    }),
    itemVerified: (r) => ({
      date: day(r.verifiedOn, `change "${String(r.title)}" verifiedOn`),
      meaning: "When this entry was last checked against its source page.",
    }),
    itemSource: (r) => String(r.source),
  },
  {
    dataset: "fitness-api-glossary-2026",
    path: "glossary",
    param: "slug",
    key: (r) => String(r.anchor).replace(/^#term-/, ""),
    plural: "GlossaryTerms",
    singular: "GlossaryTerm",
    tag: "Glossary",
    title: "Fitness and health API glossary",
    description:
      "The site's controlled vocabulary: each term's definition, its section, the one page that is its canonical explanation, and its stable fragment id on /glossary.",
    page: "/glossary",
    extra: {
      compute: (r) => ({ slug: String(r.anchor).replace(/^#term-/, "") }),
      schema: {
        slug: { type: "string", description: "The term's citable /glossary fragment without its #term- prefix" },
      },
    },
    verified: () => ({
      date: reviewStamp("/glossary", path.join(process.cwd(), "src", "app", "glossary", "page.tsx")),
      meaning: `The review date of ${absoluteUrl("/glossary")}, the page that publishes these definitions.`,
    }),
    itemSource: (r) => String(r.href),
  },
  {
    dataset: "google-health-api-data-types-2026",
    path: "google-health-api/data-types",
    param: "dataType",
    key: (r) => String(r.dataType),
    plural: "GoogleHealthDataTypes",
    singular: "GoogleHealthDataType",
    tag: "Google Health API",
    title: "Google Health API data types",
    description:
      "Every data type in Google's Google Health API data-types table, joined to the v4 discovery document: record type, storage resolution, operations and the methods they map to, scopes, fields, rollup fields and the Fitbit Web API predecessor. methods, scopes and dataPointProperty are derived and keep their evidence; flags names the kinds of disagreement between Google's own pages.",
    page: "/google-health-api",
    verified: (doc) => readOn(doc, "Google's Google Health API data-types table and the v4 discovery document"),
    itemSource: (r) => String(r.page),
    fieldNotes: {
      name: "Google's display name for the data type, as its data-types table prints it",
      fields: "Every field of that schema in the discovery document, semicolon-separated",
      rollupFields: "The fields of rollupSchema in the discovery document, semicolon-separated",
      fitbitDescription: "The description in Google's Fitbit Web API mapping row for the type, verbatim; null where the row has none",
      compatibleDevices: "The compatible devices Google's table lists for the type, semicolon-separated; null where it lists none",
    },
  },
  {
    dataset: "bluetooth-fitness-gatt-2026",
    path: "bluetooth/gatt-fields",
    param: "id",
    key: gattFieldId,
    plural: "BluetoothGattFields",
    singular: "BluetoothGattField",
    tag: "Bluetooth GATT",
    title: "Bluetooth fitness GATT characteristic fields",
    description:
      "One row per structure field of the GATT characteristics this site covers for fitness and health devices, read from the Bluetooth SIG's public repository; a struct's fields are rows under it, and a characteristic with no published structure is one row. CC BY 4.0 covers this compilation and its derived columns only: the UUIDs, identifiers, names, types and sizes are the SIG's, restated as facts, and presentIf and unitEvidence quote its lines; the SIG's descriptions are left out, and its notice is carried in sourceTerms (the collection response and the dataset) and summed up in licenseNote on every response.",
    page: "/bluetooth-fitness",
    extra: {
      compute: (r) => ({ id: gattFieldId(r) }),
      schema: {
        id: {
          type: "string",
          description:
            "The row's id in this API: the characteristic's 16-bit UUID, a dot and the field's order (0x2A37.1; 0x2A18.6.1 for the first field of the struct at position 6), or the UUID alone for a characteristic with no published structure (0x2A5E)",
        },
      },
    },
    verified: (doc) => readOn(doc, "the Bluetooth SIG's public repository"),
    itemSource: (r) => String(r.page),
  },
  {
    dataset: "health-mcp-servers-2026",
    path: "mcp-servers",
    param: "id",
    key: mcpServerId,
    plural: "McpServers",
    singular: "McpServer",
    tag: "MCP servers",
    title: "Health and fitness MCP servers",
    description:
      "Every latest-version entry in the official MCP Registry whose name, title or description matches a health or fitness data-source term, copied from the registry unchanged, with npm and PyPI facts for the packages it names. matchedTerms and publisherIsVendor are derived and keep their evidence. Descriptions are the publishers' own words; repositories were not read and no server was run.",
    page: "/health-mcp-servers",
    extra: {
      compute: (r) => ({ id: mcpServerId(r) }),
      schema: {
        id: {
          type: "string",
          description:
            "The server's row anchor on /health-mcp-servers without its server- prefix: the registry name lowercased, each run of other characters replaced by a hyphen",
        },
      },
    },
    verified: (doc) => readOn(doc, "the official MCP Registry listing"),
    itemSource: (r) => String(r.page),
  },
  {
    dataset: "pose-keypoint-maps-2026",
    path: "pose/keypoints",
    param: "id",
    key: keypointId,
    plural: "PoseKeypoints",
    singular: "PoseKeypoint",
    tag: "Pose estimation",
    title: "Pose-estimation keypoint maps",
    description:
      "Every point of each pose-estimation keypoint scheme this site maps, with its index and name exactly as the model's own source spells them (Apple Vision's named joints have no index, so theirs is null), the source file and the SHA-256 of the bytes read. crosswalkKey is derived (the name lowercased, everything outside a-z0-9 removed), and points are joined across schemes on it and nothing else.",
    page: "/pose-keypoints",
    extra: {
      compute: (r) => ({ id: keypointId(r) }),
      schema: {
        id: {
          type: "string",
          description:
            "The scheme slug, a dot and the point's index in that scheme (coco-17.5); for Apple Vision's named joints, which have no index, the joint name (apple-vision-2d.leftEar)",
        },
      },
    },
    verified: (doc) => readOn(doc, "each scheme's own source file or documentation page"),
    itemSource: (r) => String(r.page),
  },
];

/** Same rule as the UID of each event in /changes/calendar.ics. */
function changeId(r: Row): string {
  return `${day(r.sortDate, `change "${String(r.title)}" sortDate`)}-${slugify(String(r.title))}`;
}

/* ─────────────────────────────── building ──────────────────────────────── */

export type BuiltCollection = Collection & {
  doc: DatasetDoc;
  rows: Row[];
  excluded: { id: string; reason: string }[];
  columns: string[];
  fieldDocs: Record<string, string | null>;
  verifiedNow: Verified;
  url: string;
  itemUrl: string;
};

let BUILT: BuiltCollection[] | null = null;
let CHANGE_ROWS: Row[] | null = null;

/** The published change rows, for the joins `detail` makes against them. */
const changeRows = (): Row[] => (CHANGE_ROWS ??= loadDataset("fitness-api-changes-2026").items);

/** Every collection, loaded and checked once per build process. */
export function collections(): BuiltCollection[] {
  if (BUILT) return BUILT;
  BUILT = COLLECTIONS.map((c) => {
    const doc = loadDataset(c.dataset);
    const excluded: { id: string; reason: string }[] = [];
    const rows: Row[] = [];
    for (const row of doc.items) {
      const reason = c.exclude?.(row) ?? null;
      if (reason) excluded.push({ id: c.key(row), reason });
      else rows.push({ ...row, ...(c.extra?.compute(row) ?? {}) });
    }
    const seen = new Set<string>();
    for (const row of rows) {
      const id = c.key(row);
      if (!/^[A-Za-z0-9._-]+$/.test(id)) throw new Error(`${c.path}: id "${id}" is not URL-safe`);
      if (seen.has(id)) throw new Error(`${c.path}: duplicate id "${id}"`);
      seen.add(id);
    }
    const columns = Object.keys(rows[0]);
    for (const row of rows) {
      if (Object.keys(row).join(",") !== columns.join(",")) throw new Error(`${c.path}: rows do not share one column set`);
    }
    const fieldDocs: Record<string, string | null> = {};
    for (const col of columns) {
      const added = c.extra?.schema[col]?.description;
      fieldDocs[col] = (typeof added === "string" ? added : null) ?? c.fieldNotes?.[col] ?? doc.fields?.[col] ?? null;
    }
    const built: BuiltCollection = {
      ...c,
      doc,
      rows,
      excluded,
      columns,
      fieldDocs,
      verifiedNow: { date: "", meaning: "" },
      url: absoluteUrl(`${API_BASE}/${c.path}`),
      itemUrl: absoluteUrl(`${API_BASE}/${c.path}/{${c.param}}`),
    };
    built.verifiedNow = c.verified(doc, rows);
    day(built.verifiedNow.date, `${c.path} verified date`);
    return built;
  });
  return BUILT;
}

/** The licence, attribution and provenance every response carries. */
function provenance(c: BuiltCollection) {
  return {
    license: LICENSE_ID,
    licenseUrl: LICENSE_URL,
    // Where the dataset limits what the licence covers, every response says
    // so: one item is often all a client keeps.
    ...(c.doc.licenseNote ? { licenseNote: c.doc.licenseNote } : {}),
    attribution: ATTRIBUTION,
    citeAs: `AIFitnessAPI, "${c.doc.name}," version ${c.doc.version}, aifitnessapi.com, ${absoluteUrl(`/datasets/${c.dataset}.json`)}`,
    dataset: {
      slug: c.dataset,
      name: c.doc.name,
      version: c.doc.version,
      json: absoluteUrl(`/datasets/${c.dataset}.json`),
      csv: absoluteUrl(`/datasets/${c.dataset}.csv`),
      ...(c.doc.isBasedOn ? { isBasedOn: c.doc.isBasedOn } : {}),
    },
  };
}

export type ApiDocument = { path: string; body: Record<string, unknown> };

function collectionBody(c: BuiltCollection): Record<string, unknown> {
  return {
    apiVersion: "v1",
    self: c.url,
    title: c.title,
    description: c.description,
    source: absoluteUrl(c.page),
    verified: c.verifiedNow,
    ...provenance(c),
    ...(c.doc.sourceTerms ? { sourceTerms: c.doc.sourceTerms } : {}),
    methodology: c.doc.methodology,
    key: c.param,
    itemUrl: c.itemUrl,
    count: c.rows.length,
    excluded: c.excluded,
    fields: c.fieldDocs,
    items: c.rows,
  };
}

function itemBody(c: BuiltCollection, row: Row): Record<string, unknown> {
  const id = c.key(row);
  return {
    apiVersion: "v1",
    self: absoluteUrl(`${API_BASE}/${c.path}/${id}`),
    collection: c.url,
    title: c.title,
    source: c.itemSource ? c.itemSource(row) : absoluteUrl(c.page),
    verified: c.itemVerified ? c.itemVerified(row) : c.verifiedNow,
    ...provenance(c),
    key: c.param,
    id,
    item: { ...row, ...(c.detail?.compute(row, changeRows()) ?? {}) },
  };
}

let DOCS: ApiDocument[] | null = null;

/** Every static response below /api/v1, by path relative to it. */
export function apiDocuments(): ApiDocument[] {
  if (DOCS) return DOCS;
  DOCS = collections().flatMap((c) => [
    { path: c.path, body: collectionBody(c) },
    ...c.rows.map((row) => ({ path: `${c.path}/${c.key(row)}`, body: itemBody(c, row) })),
  ]);
  return DOCS;
}

export function apiDocument(rel: string): ApiDocument | undefined {
  return apiDocuments().find((d) => d.path === rel);
}

/** The /api/v1 discovery document. */
export function apiIndex(tools: { name: string; description: string }[]): Record<string, unknown> {
  const all = collections();
  return {
    name: "AI Fitness API (aifitnessapi.com)",
    apiVersion: "v1",
    self: absoluteUrl(API_BASE),
    description:
      "Read-only JSON over the datasets aifitnessapi.com publishes: every response is a static file built from the CC BY 4.0 downloads at /datasets, and carries its source page, licence and verification date. No key, no writes, no user data.",
    source: absoluteUrl("/datasets"),
    docs: absoluteUrl(DEVELOPERS_PATH),
    openapi: absoluteUrl(OPENAPI_PATH),
    license: LICENSE_ID,
    licenseUrl: LICENSE_URL,
    attribution: ATTRIBUTION,
    verified: {
      date: oldest(all.map((c) => c.verifiedNow.date)),
      meaning: "The oldest verified date across the collections. Each collection, and each item, states its own and what it means.",
    },
    rules: [
      "Answers come only from verified data: every value is copied from a published dataset row, and each row links the page carrying its sourced claim.",
      "null means the source does not state it or it could not be verified. It never means zero, and it is never a guess.",
      "Collections are served whole; the largest is a few hundred rows, so there is no pagination.",
      "Item ids are case-sensitive and come from the data itself (an identifier, a class name, a row's anchor on its page, a change's date and title, or two fields joined by a dot), so an id lasts as long as its row; an unknown id returns HTTP 404.",
    ],
    mcp: {
      url: absoluteUrl(MCP_PATH),
      transport: "streamable-http",
      tools: tools.map((t) => ({ name: t.name, description: t.description })),
    },
    collections: all.map((c) => ({
      title: c.title,
      url: c.url,
      itemUrl: c.itemUrl,
      key: c.param,
      count: c.rows.length,
      dataset: c.dataset,
      source: absoluteUrl(c.page),
      verified: c.verifiedNow,
    })),
  };
}
