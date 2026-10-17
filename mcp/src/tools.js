/**
 * The aifitnessapi.com MCP tools: definitions and handlers, with no transport.
 *
 * Two servers run this one module: the stdio server in ./index.js (the npm
 * package, which reads the datasets bundled in ../data) and the hosted
 * Streamable HTTP endpoint at https://aifitnessapi.com/mcp (src/app/mcp/route.ts
 * in the site, which passes the same datasets from public/datasets). Keeping
 * the logic here is what makes "the same tools over the same data" true by
 * construction rather than by two copies agreeing.
 *
 * It imports nothing — no SDK, no fs — so the package stays self-contained and
 * the site can bundle it. Callers hand in the dataset documents.
 *
 * Every tool answers only from those datasets. There is no model here and no
 * network call: if the data does not contain an answer, the tool says so
 * rather than producing one. The site's rule is that an unverifiable claim is
 * omitted, and a tool that guessed would launder exactly the claims the site
 * refuses to publish.
 */

export const SITE = "https://aifitnessapi.com";

/** Server identity, shared by both transports. Keep `version` equal to
 *  mcp/package.json and mcp/server.json (qa's MCP-SERVER-JSON checks). The
 *  title is the one brand string listings use (ops/SERP-30-2026-10-12.md #29). */
export const SERVER_INFO = {
  name: "aifitnessapi",
  title: "AI Fitness API (aifitnessapi.com)",
  version: "0.1.0",
  description:
    "Verified fitness and health API reference data: HealthKit types, the HealthKit to Health Connect mapping, dated ecosystem changes and a glossary.",
  websiteUrl: `${SITE}/developers`,
};

/** Sent in the initialize result, for the model using the server. */
export const SERVER_INSTRUCTIONS =
  "Every answer comes from aifitnessapi.com's published CC BY 4.0 datasets and ends with the page to cite. When a tool reports no match, treat the fact as unverified rather than answering it from memory. Fields the site could not verify are absent or marked as not stated; they are never guessed.";

/** The datasets the tools read, by slug (public/datasets/<slug>.json). */
export const REQUIRED_DATASETS = [
  "healthkit-type-identifiers-2026",
  "health-data-type-matrix-2026",
  "fitness-api-changes-2026",
  "fitness-api-glossary-2026",
];

const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** Every response ends with the provenance the site is built on. */
function withSource(body, { page, dataset, note }) {
  const lines = [body, "", "---"];
  if (page) lines.push(`Source: ${SITE}${page}`);
  if (dataset) lines.push(`Dataset: ${SITE}/datasets/${dataset}.json (CC BY 4.0)`);
  if (note) lines.push(note);
  return lines.join("\n");
}

const text = (t) => ({ content: [{ type: "text", text: t }] });
const failure = (t) => ({ content: [{ type: "text", text: t }], isError: true });

/** family key -> the Apple type name recorded in the dataset. */
const FAMILY_TYPE = {
  quantity: "HKQuantityTypeIdentifier",
  category: "HKCategoryTypeIdentifier",
  characteristic: "HKCharacteristicTypeIdentifier",
  workoutActivity: "HKWorkoutActivityType",
};

/** Every tool only reads bundled data: nothing is written, nothing outside is touched. */
const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

// ---------------------------------------------------------------- tools ----

export const TOOLS = [
  {
    name: "healthkit_type",
    title: "HealthKit type lookup",
    description:
      "Look up any Apple HealthKit identifier across all four families: HKQuantityTypeIdentifier (numeric samples), HKCategoryTypeIdentifier (enum-valued samples such as sleep analysis), HKCharacteristicTypeIdentifier (read-only user facts) and HKWorkoutActivityType. Returns the Swift case and Objective-C constant, what it measures, the platform versions, and the family-specific detail that matters: for quantity types whether it is CUMULATIVE (sum with .cumulativeSum) or DISCRETE (average with .discreteAverage), and for category types the HKCategoryValue enum that decodes the sample. Use this before writing any HKStatisticsQuery — picking the wrong aggregation returns a plausible wrong number rather than an error. Accepts a case name like 'stepCount' or 'sleepAnalysis', an Objective-C constant, or a search term like 'energy'.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "Identifier name or search term, e.g. 'heartRate', 'sleepAnalysis', 'energy'.",
        },
        family: {
          type: "string",
          enum: ["quantity", "category", "characteristic", "workoutActivity", "any"],
          description: "Optionally restrict to one identifier family.",
        },
        aggregation: {
          type: "string",
          enum: ["cumulative", "discrete", "any"],
          description: "Optionally restrict to one aggregation style. Only quantity types have one.",
        },
      },
      required: ["query"],
    },
    annotations: { title: "HealthKit type lookup", ...READ_ONLY },
  },
  {
    name: "health_data_cross_platform",
    title: "HealthKit to Health Connect mapping",
    description:
      "Map a health metric between Apple HealthKit and Android Health Connect. Returns the type identifier on each platform plus the cross-platform gotcha where one exists — for example Apple stores HRV as SDNN while Health Connect stores RMSSD, which are different calculations and must not be normalised into a single field. Use this when building anything that must work on both platforms.",
    inputSchema: {
      type: "object",
      properties: {
        metric: {
          type: "string",
          minLength: 1,
          maxLength: 200,
          description: "A metric such as 'heart rate', 'hrv', 'sleep', 'steps', 'vo2 max'.",
        },
      },
      required: ["metric"],
    },
    annotations: { title: "HealthKit to Health Connect mapping", ...READ_ONLY },
  },
  {
    name: "fitness_api_changes",
    title: "Fitness API changes and deadlines",
    description:
      "Dated deprecations, turndowns and term changes across the fitness-API ecosystem (Fitbit, Google Fit, Oura, Garmin and others). Each entry is graded: 'confirmed' means a vendor's own words are quoted on the source page, 'reported' means the claim could not be confirmed on an official page. Date precision is preserved exactly as sourced — '2026-09' means a reported month, not a specific day.",
    inputSchema: {
      type: "object",
      properties: {
        product: {
          type: "string",
          maxLength: 200,
          description: "Optional filter, e.g. 'fitbit', 'google fit', 'oura'.",
        },
        upcomingOnly: { type: "boolean", description: "Only entries dated today or later." },
      },
    },
    annotations: { title: "Fitness API changes and deadlines", ...READ_ONLY },
  },
  {
    name: "fitness_api_glossary",
    title: "Fitness and health API glossary",
    description:
      "Define a term from the fitness and health API domain — SDNN, RMSSD, pose estimation, aggregator, on-device store and similar. Returns the definition and the canonical page explaining it.",
    inputSchema: {
      type: "object",
      properties: {
        term: { type: "string", minLength: 1, maxLength: 200, description: "The term to define." },
      },
      required: ["term"],
    },
    annotations: { title: "Fitness and health API glossary", ...READ_ONLY },
  },
];

/**
 * Check arguments against the tool's own inputSchema: required keys present,
 * strings within their length bounds, enum values from the enum, booleans
 * boolean. Unknown keys are ignored. Returns an error message, or null.
 */
function invalidArguments(tool, args) {
  if (args === null || typeof args !== "object" || Array.isArray(args)) return "Arguments must be an object.";
  const { properties = {}, required = [] } = tool.inputSchema;
  for (const key of required) {
    if (args[key] === undefined || args[key] === null) return `Missing required argument "${key}".`;
  }
  for (const [key, value] of Object.entries(args)) {
    const prop = properties[key];
    if (!prop || value === undefined) continue;
    if (prop.type === "string") {
      if (typeof value !== "string") return `Argument "${key}" must be a string.`;
      if (prop.minLength && value.trim().length < prop.minLength) return `Argument "${key}" must not be empty.`;
      if (prop.maxLength && value.length > prop.maxLength) return `Argument "${key}" is longer than ${prop.maxLength} characters.`;
      if (prop.enum && !prop.enum.includes(value)) return `Argument "${key}" must be one of: ${prop.enum.join(", ")}.`;
    } else if (prop.type === "boolean" && typeof value !== "boolean") {
      return `Argument "${key}" must be true or false.`;
    }
  }
  return null;
}

/** A search term that normalises to nothing would match every row. */
const searchable = (label, value) =>
  norm(value) ? null : `Argument "${label}" must contain at least one letter or digit.`;

// ------------------------------------------------------------- handlers ----

function handlers({ hk, matrix, changes, glossary }, now) {
  function toolHealthKit({ query, aggregation = "any", family = "any" }) {
    const empty = searchable("query", query);
    if (empty) return failure(empty);
    const n = norm(query);
    let rows = hk.items.filter(
      (r) =>
        norm(r.identifier).includes(n) ||
        norm(r.objcConstant).includes(n) ||
        norm(r.abstract).includes(n) ||
        norm(r.unitFamily).includes(n) ||
        norm(r.valueEnum).includes(n),
    );
    if (family !== "any") rows = rows.filter((r) => r.family === FAMILY_TYPE[family]);
    if (aggregation !== "any") rows = rows.filter((r) => r.aggregation === aggregation);

    if (rows.length === 0) {
      return text(
        withSource(
          `No HealthKit identifier matches "${query}"${family !== "any" ? ` in the ${family} family` : ""}${aggregation !== "any" ? ` with aggregation "${aggregation}"` : ""}.\n\nApple names types by what they measure rather than by the product feature — try "energy" rather than "calories", or "distance" rather than "miles". Note that sleep and mindfulness are CATEGORY types, not quantity types, so they carry a value enum rather than a unit.`,
          { page: "/healthkit-identifiers", dataset: "healthkit-type-identifiers-2026" },
        ),
      );
    }

    // Exact match wins outright; otherwise show the shortlist.
    const exact = rows.find((r) => norm(r.identifier) === n || norm(r.objcConstant) === n);
    const show = exact ? [exact] : rows.slice(0, 12);

    const body = show
      .map((r) => {
        const advice =
          r.family !== "HKQuantityTypeIdentifier"
            ? r.family === "HKCategoryTypeIdentifier"
              ? `CATEGORY type — the sample carries a value from ${r.valueEnum ?? "a fixed enum"}, not a number. Decode it with that enum; HKStatisticsQuery does not apply.`
              : r.family === "HKCharacteristicTypeIdentifier"
                ? "CHARACTERISTIC — a read-only fact about the user, not a sample series. Read it once from the health store; your app can never write it."
                : "WORKOUT ACTIVITY TYPE — a label for what a workout was, not a data series."
            : r.aggregation === "cumulative"
              ? "CUMULATIVE — accumulates over an interval. Sum it: HKStatisticsQuery with .cumulativeSum."
              : r.aggregation === "discrete"
                ? "DISCRETE — a point-in-time reading. Do not sum it: use .discreteAverage, .discreteMin or .discreteMax."
                : "Aggregation NOT STATED in Apple's documentation for this type. Check Apple's page before choosing a HKStatisticsQuery option; we do not guess it.";
        return [
          `## ${r.identifier}`,
          `Objective-C: ${r.objcConstant}`,
          r.abstract ? `\n${r.abstract}` : `\nApple ships this type with no abstract and no discussion — the identifier is real but undocumented.`,
          ``,
          advice,
          r.family === "HKQuantityTypeIdentifier"
            ? `Unit family: ${r.unitFamily ?? "not stated by Apple"}`
            : `Family: ${r.family}`,
          `Introduced: iOS ${r.iosIntroduced ?? "?"}${r.watchosIntroduced ? `, watchOS ${r.watchosIntroduced}` : ""}`,
          `Group: ${r.group}`,
          `Apple docs: ${r.appleDocs}`,
        ].join("\n");
      })
      .join("\n\n");

    const more = !exact && rows.length > show.length ? `\n\n(${rows.length - show.length} further matches not shown.)` : "";

    return text(
      withSource(body + more, {
        page: "/healthkit-identifiers",
        dataset: "healthkit-type-identifiers-2026",
        note: "Aggregation and unit family are derived from Apple's prose, which states them in sentences rather than as properties. Apple's documentation remains the authority.",
      }),
    );
  }

  function toolCrossPlatform({ metric }) {
    const empty = searchable("metric", metric);
    if (empty) return failure(empty);
    const n = norm(metric);
    const rows = matrix.items.filter(
      (r) => norm(r.label).includes(n) || norm(r.appleHealthKit).includes(n) || norm(r.androidHealthConnect).includes(n),
    );

    if (rows.length === 0) {
      const known = matrix.items.map((r) => r.label).join(", ");
      return text(
        withSource(
          `No verified cross-platform mapping for "${metric}".\n\nThis matrix deliberately covers only metrics confirmed against both Apple's and Google's own documentation: ${known}. A metric being absent means we could not verify it on both platforms, not that it does not exist.`,
          { page: "/matrix", dataset: "health-data-type-matrix-2026" },
        ),
      );
    }

    const body = rows
      .map((r) =>
        [
          `## ${r.label}`,
          `Apple HealthKit: ${r.appleHealthKit}`,
          `Android Health Connect: ${r.androidHealthConnect}`,
          r.watchOut ? `\nWATCH OUT: ${r.watchOut}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      )
      .join("\n\n");

    return text(
      withSource(body, {
        page: "/matrix",
        dataset: "health-data-type-matrix-2026",
        note: "Both are on-device stores. Neither has a server endpoint you can call — your app reads them on the device and syncs to your own backend.",
      }),
    );
  }

  function toolChanges({ product, upcomingOnly = false }) {
    if (product !== undefined && product.trim() !== "") {
      const empty = searchable("product", product);
      if (empty) return failure(empty);
    }
    const today = now().toISOString().slice(0, 10);
    let rows = changes.items;
    if (product && product.trim()) {
      const n = norm(product);
      rows = rows.filter((r) => norm(r.title).includes(n) || norm(r.summary).includes(n));
    }
    if (upcomingOnly) rows = rows.filter((r) => (r.sortDate ?? r.date) >= today);

    if (rows.length === 0) {
      return text(
        withSource(
          `No tracked change matches${product ? ` "${product}"` : ""}${upcomingOnly ? " with a date today or later" : ""}.\n\nThe tracker only carries changes traceable to a page on the site that quotes a source. Absence here means we have not verified one, not that nothing is happening.`,
          { page: "/changes", dataset: "fitness-api-changes-2026" },
        ),
      );
    }

    const body = rows
      .map((r) =>
        [
          `## ${r.date} — ${r.title}`,
          `Grading: ${String(r.status).toUpperCase()}${r.status === "reported" ? " (could not be confirmed on an official page)" : ""}`,
          ``,
          r.summary,
          r.source ? `\nDetail: ${r.source}${r.sourceLabel ? ` (${r.sourceLabel})` : ""}` : "",
          r.verifiedOn ? `Last checked: ${r.verifiedOn}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      )
      .join("\n\n");

    return text(
      withSource(body, {
        page: "/changes",
        dataset: "fitness-api-changes-2026",
        note: "Date precision is as sourced. A month-only date means the day is not confirmed — do not present it as a deadline.",
      }),
    );
  }

  function toolGlossary({ term }) {
    const empty = searchable("term", term);
    if (empty) return failure(empty);
    const n = norm(term);
    const rows = glossary.items.filter((r) => norm(r.term).includes(n) || norm(r.definition).includes(n));
    if (rows.length === 0) {
      return text(
        withSource(`"${term}" is not in the glossary. It covers ${glossary.items.length} terms specific to fitness and health APIs.`, {
          page: "/glossary",
          dataset: "fitness-api-glossary-2026",
        }),
      );
    }
    const exact = rows.find((r) => norm(r.term) === n);
    const show = exact ? [exact] : rows.slice(0, 8);
    const body = show.map((r) => `## ${r.term}\n${r.definition}\n\nExplained at: ${r.href}`).join("\n\n");
    return text(withSource(body, { page: "/glossary", dataset: "fitness-api-glossary-2026" }));
  }

  return {
    healthkit_type: toolHealthKit,
    health_data_cross_platform: toolCrossPlatform,
    fitness_api_changes: toolChanges,
    fitness_api_glossary: toolGlossary,
  };
}

/**
 * Bind the tools to a set of dataset documents, keyed by slug. Throws if one
 * is missing or empty, so a server never starts answering from half its data.
 * `now` is injectable so the date-relative filter can be tested.
 */
export function createToolkit(datasets, { now = () => new Date() } = {}) {
  for (const slug of REQUIRED_DATASETS) {
    const doc = datasets?.[slug];
    if (!doc || !Array.isArray(doc.items) || doc.items.length === 0) {
      throw new Error(`aifitnessapi MCP tools: dataset "${slug}" is missing or has no items`);
    }
  }
  const run = handlers(
    {
      hk: datasets["healthkit-type-identifiers-2026"],
      matrix: datasets["health-data-type-matrix-2026"],
      changes: datasets["fitness-api-changes-2026"],
      glossary: datasets["fitness-api-glossary-2026"],
    },
    now,
  );
  const byName = new Map(TOOLS.map((t) => [t.name, t]));

  return {
    tools: TOOLS,
    call(name, args) {
      const tool = byName.get(name);
      if (!tool) return failure(`Unknown tool: ${name}`);
      const input = args ?? {};
      const invalid = invalidArguments(tool, input);
      if (invalid) return failure(invalid);
      try {
        return run[name](input);
      } catch (err) {
        return failure(`Tool failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
  };
}
