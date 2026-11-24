/**
 * "Which ExerciseDB is this?" — the sniffer on /pricing/exercise-database-api-pricing
 * (English only, inside the "Can I ship it?" block). The reader pastes an
 * ExerciseDB URL, a curl command or a JSON response; this names the variant
 * from its host or its field shapes, and the page shows that variant's row of
 * the "Can I ship it?" table (src/data/contentLicences.ts) and the site's
 * notes and pages on it.
 *
 * Every rule cites one evidence row, [file, row, wording the quote must
 * contain], and scripts/open-exercises.test.mjs fails when a row is missing or
 * its quote lacks the wording. Host rules rest on hosts the site's ExerciseDB
 * pages already quote. Shape rules rest on two kinds of evidence only: fields
 * of real responses from the free V1 host, fetched through source-snapshot
 * runs 45495879916 and 45496377203 on 2026-11-24
 * (ops/sources/evidence/tools-exercisedb-sniffer.json), and fields AscendAPI's
 * documentation lists, which the evidence files quote. Anything else is "not
 * recognized"; nothing is guessed from a name.
 *
 * Pure and dependency-free, so the client component and the test import it.
 */

const SN = "tools-exercisedb-sniffer";
const XP = "pricing-exercise-database-api-pricing";
const XI = "integrate-exercisedb-api";
const XF = "compare-exercisedb-vs-free-exercise-db";
const XW = "compare-exercisedb-vs-wger";

/**
 * What the sniffer can name. `row` is the "Can I ship it?" row it shows;
 * `notes` index the table's "Which ExerciseDB is this?" notes.
 */
export const VARIANTS = {
  "exercisedb-v1-free": {
    label: "ExerciseDB V1, free tier (AscendAPI, oss.exercisedb.dev)",
    row: "exercisedb-v1",
    notes: [1],
    isExerciseDb: true,
  },
  "exercisedb-v1-paid": {
    label: "ExerciseDB V1, paid tier on RapidAPI (AscendAPI)",
    row: "exercisedb-v1",
    notes: [1],
    isExerciseDb: true,
  },
  "exercisedb-v2": {
    label: "ExerciseDB V2 (AscendAPI, on RapidAPI)",
    row: "exercisedb-v2",
    notes: [2],
    isExerciseDb: true,
  },
  "ascendapi-site": {
    label: "AscendAPI's website or documentation, not an API host",
    row: null,
    notes: [0, 1, 2],
    isExerciseDb: true,
  },
  "exercisedb-repo": {
    label: "The ExerciseDB/exercisedb-api repository on GitHub",
    row: null,
    notes: [3],
    isExerciseDb: true,
  },
  "free-exercise-db": {
    label: "Not ExerciseDB: free-exercise-db (yuhonas/free-exercise-db)",
    row: "free-exercise-db",
    notes: [],
    isExerciseDb: false,
  },
  wger: {
    label: "Not ExerciseDB: wger (wger.de)",
    row: "wger",
    notes: [],
    isExerciseDb: false,
  },
};

/** Pages on this site about each variant: the migration and integration notes. */
export const MIGRATION = {
  "exercisedb-v1-free": [
    { href: "/integrate/exercisedb-api#ascendapis-exercisedb-v1-and-v2-formerly-exercisedbdev", label: "AscendAPI's V1 and V2 endpoints, in the ExerciseDB integration guide" },
    { href: "/compare/exercisedb-vs-free-exercise-db", label: "ExerciseDB vs free-exercise-db, field by field" },
    { href: "/alternatives/exercisedb-alternatives", label: "ExerciseDB alternatives" },
  ],
  "exercisedb-v1-paid": [
    { href: "/integrate/exercisedb-api#ascendapis-exercisedb-v1-and-v2-formerly-exercisedbdev", label: "AscendAPI's V1 and V2 endpoints, in the ExerciseDB integration guide" },
    { href: "/alternatives/exercisedb-alternatives", label: "ExerciseDB alternatives" },
  ],
  "exercisedb-v2": [
    { href: "/integrate/exercisedb-api#ascendapis-exercisedb-v1-and-v2-formerly-exercisedbdev", label: "AscendAPI's V1 and V2 endpoints, in the ExerciseDB integration guide" },
    { href: "/fitness-apis/exercise-video-apis", label: "Exercise video APIs compared" },
    { href: "/alternatives/exercisedb-alternatives", label: "ExerciseDB alternatives" },
  ],
  "ascendapi-site": [
    { href: "/apis/exercisedb", label: "Every page on this site about ExerciseDB" },
    { href: "/integrate/exercisedb-api", label: "ExerciseDB API integration guide" },
  ],
  "exercisedb-repo": [
    { href: "/compare/exercisedb-vs-free-exercise-db", label: "ExerciseDB vs free-exercise-db" },
    { href: "/alternatives/exercisedb-alternatives", label: "ExerciseDB alternatives" },
  ],
  "free-exercise-db": [
    { href: "/tools/exercise-taxonomy-crosswalk#normalize", label: "Every free-exercise-db exercise, searchable, with a download" },
    { href: "/compare/exercisedb-vs-free-exercise-db", label: "ExerciseDB vs free-exercise-db" },
  ],
  wger: [
    { href: "/compare/exercisedb-vs-wger", label: "ExerciseDB vs wger" },
    { href: "/alternatives/wger-alternatives", label: "wger alternatives" },
  ],
};

/**
 * Host rules, first match wins. `path` narrows a shared host. `media` marks a
 * media host: it says which tier's documentation shows media there, not which
 * API returned the URL.
 */
export const HOST_RULES = [
  { host: "oss.exercisedb.dev", variant: "exercisedb-v1-free", why: "AscendAPI's V1 documentation gives oss.exercisedb.dev as the free tier's hosted API.", ev: [XP, 3, "oss.exercisedb.dev/api/v1/exercises"] },
  { host: "edb-with-gifs-and-images-by-ascendapi.p.rapidapi.com", variant: "exercisedb-v1-paid", why: "AscendAPI's V1 documentation names this X-RapidAPI-Host for the paid tier.", ev: [XI, 7, "edb-with-gifs-and-images-by-ascendapi.p.rapidapi.com"] },
  { host: "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com", variant: "exercisedb-v2", why: "AscendAPI's quickstart names this X-RapidAPI-Host for ExerciseDB V2.", ev: [XI, 15, "edb-with-videos-and-images-by-ascendapi.p.rapidapi.com"] },
  { host: "static.exercisedb.dev", variant: "exercisedb-v1-free", media: true, why: "A media URL. AscendAPI's V1 documentation shows the free tier's single GIF on static.exercisedb.dev; a media URL alone does not say which API returned it.", ev: [SN, 10, "static.exercisedb.dev/media/"] },
  { host: "assets.exercisedb.dev", variant: "exercisedb-v1-paid", media: true, why: "A media URL. AscendAPI's V1 documentation shows the paid tier's multi-resolution images and GIFs on assets.exercisedb.dev; whether V2 media lives there too was not read.", ev: [SN, 9, "assets.exercisedb.dev/media/"] },
  { host: "exercisedb.dev", variant: "ascendapi-site", why: "exercisedb.dev is AscendAPI's home page, which reads \"Previously ExerciseDB\".", ev: [XP, 0, "Previously ExerciseDB"] },
  { host: "www.exercisedb.dev", variant: "ascendapi-site", why: "exercisedb.dev is AscendAPI's home page, which reads \"Previously ExerciseDB\".", ev: [XP, 0, "Previously ExerciseDB"] },
  { host: "docs.ascendapi.com", variant: "ascendapi-site", why: "docs.ascendapi.com is AscendAPI's documentation for both ExerciseDB versions.", ev: [XP, 2, "No authentication required"] },
  { host: "github.com", path: /^\/exercisedb\/exercisedb-api(\/|$)/i, variant: "exercisedb-repo", why: "AscendAPI's documentation names github.com/ExerciseDB/exercisedb-api as its GitHub.", ev: [XP, 1, "github.com/ExerciseDB/exercisedb-api"] },
  { host: "raw.githubusercontent.com", path: /^\/exercisedb\/exercisedb-api\//i, variant: "exercisedb-repo", why: "A file in the ExerciseDB/exercisedb-api repository, which carries an AGPL-3.0 LICENSE file.", ev: [XP, 19, "GNU AFFERO GENERAL PUBLIC LICENSE"] },
  { host: "github.com", path: /^\/yuhonas\/free-exercise-db(\/|$)/i, variant: "free-exercise-db", why: "The free-exercise-db repository, whose LICENSE.md releases it into the public domain.", ev: [XF, 29, "released into the public domain"] },
  { host: "raw.githubusercontent.com", path: /^\/yuhonas\/free-exercise-db\//i, variant: "free-exercise-db", why: "A file in the free-exercise-db repository, whose README points to raw.githubusercontent.com for its JSON and images.", ev: [XF, 23, "raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"] },
  { host: "wger.de", variant: "wger", why: "wger.de is the live wger system its README points to.", ev: [XW, 28, "https://wger.de"] },
];

/** The contentLicences note about the older RapidAPI listing, shown for any RapidAPI host no rule above names. */
export const UNVERIFIED_RAPIDAPI_NOTE = 4;

/**
 * Shape rules, on the records of a pasted JSON response (the `data` of a V1
 * envelope, the `results` of a wger page, an array, or the object itself).
 * First match wins.
 */
export const SHAPE_RULES = [
  {
    variant: "exercisedb-v2",
    test: (r) => typeof r.videoUrl === "string",
    fields: ["videoUrl"],
    why: "It has videoUrl, which AscendAPI documents on ExerciseDB V2 records; neither V1 schema the documentation shows lists it.",
    ev: [XI, 9, "videoUrl | string"],
  },
  {
    variant: "exercisedb-v1-paid",
    test: (r) =>
      (typeof r.exerciseId === "string" && r.exerciseId.startsWith("edb_")) ||
      isObj(r.imageUrls) ||
      isObj(r.gifUrls) ||
      "difficulty" in r ||
      Array.isArray(r.exerciseTypes) ||
      Array.isArray(r.relatedExerciseIds),
    fields: ["exerciseId edb_…", "imageUrls", "gifUrls", "difficulty", "exerciseTypes", "relatedExerciseIds"],
    why: "It has fields that AscendAPI's V1 documentation lists only in the paid (RapidAPI) schema: an edb_ id, multi-resolution imageUrls or gifUrls, difficulty, exerciseTypes or relatedExerciseIds.",
    ev: [SN, 5, "edb_T5uXtLj"],
  },
  {
    variant: "exercisedb-v1-free",
    test: (r) => typeof r.exerciseId === "string" && typeof r.gifUrl === "string",
    fields: ["exerciseId", "gifUrl", "bodyParts", "targetMuscles", "equipments"],
    why: "It has exerciseId and a single gifUrl string, as the free V1 host's responses do (with bodyParts, equipments, targetMuscles and secondaryMuscles lists); the search endpoint returns only exerciseId, name and gifUrl.",
    ev: [SN, 1, "\"gifUrl\":\"https://static.exercisedb.dev/media/01qpYSe.gif\",\"bodyParts\""],
  },
  {
    variant: "free-exercise-db",
    test: (r) => typeof r.id === "string" && Array.isArray(r.primaryMuscles) && Array.isArray(r.images) && Array.isArray(r.instructions),
    fields: ["id", "primaryMuscles", "images", "instructions"],
    why: "It has id, primaryMuscles, images and instructions, the shape of every record in free-exercise-db's exercises.json.",
    ev: [SN, 15, "\"primaryMuscles\": ["],
  },
  {
    variant: "wger",
    test: (r) => typeof r.uuid === "string" && Array.isArray(r.translations) && isObj(r.category),
    fields: ["uuid", "category", "translations"],
    why: "It has uuid, a category object and translations, the shape of wger's /api/v2/exerciseinfo/ records.",
    ev: [SN, 17, "\"category\":{\"id\":9,\"name\":\"Legs\"}"],
  },
];

/** Envelope rules: the wrapper alone, when the records are empty or cut off. */
export const ENVELOPE_RULES = [
  {
    variant: "exercisedb-v1-free",
    test: (j) => j.success === true && isObj(j.meta) && "nextCursor" in j.meta,
    why: "It is wrapped in success, meta (with nextCursor) and data, as the free V1 host's list responses are.",
    ev: [SN, 0, "\"hasPreviousPage\":false,\"nextCursor\""],
  },
];

function isObj(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Every https URL and X-RapidAPI-Host value in a pasted text, in order. */
export function hostsIn(text) {
  const out = [];
  const s = String(text ?? "");
  for (const m of s.matchAll(/x-rapidapi-host["']?\s*[:=|,]\s*["']?([a-z0-9.-]+\.[a-z]{2,})/gi)) out.push({ host: m[1].toLowerCase(), path: "/", raw: m[0] });
  for (const m of s.matchAll(/\b(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(\/[^\s"'<>)\]]*)?/gi)) {
    const host = m[1].toLowerCase();
    if (!/[a-z]/.test(host.split(".").at(-1))) continue;
    out.push({ host, path: m[2] ?? "/", raw: m[0] });
  }
  return out;
}

export function hostRule(host, path) {
  return HOST_RULES.find((r) => r.host === host && (!r.path || r.path.test(path))) ?? null;
}

const recordsOf = (j) => {
  if (Array.isArray(j)) return j.filter(isObj);
  if (!isObj(j)) return [];
  if (Array.isArray(j.data)) return j.data.filter(isObj);
  if (isObj(j.data)) return [j.data];
  if (Array.isArray(j.results)) return j.results.filter(isObj);
  return [j];
};

/**
 * Identify a pasted text. Returns { status: "recognized" | "not-recognized",
 * variant, by: "host" | "shape", why, ev, host?, fields?, rapidapiNote? }.
 */
export function sniff(input) {
  const text = String(input ?? "").trim();
  if (!text) return null;
  let json;
  if (/^[[{]/.test(text)) {
    try {
      json = JSON.parse(text);
    } catch {
      json = undefined;
    }
  }
  if (json !== undefined) {
    const records = recordsOf(json);
    for (const rule of SHAPE_RULES) {
      const hit = records.find((r) => rule.test(r));
      if (hit) return { status: "recognized", variant: rule.variant, by: "shape", why: rule.why, ev: rule.ev, fields: rule.fields.filter((f) => f.split(" ")[0] in hit) };
    }
    if (isObj(json)) for (const rule of ENVELOPE_RULES) if (rule.test(json)) return { status: "recognized", variant: rule.variant, by: "shape", why: rule.why, ev: rule.ev, fields: ["success", "meta", "data"] };
    const keys = [...new Set(records.flatMap((r) => Object.keys(r)))].slice(0, 20);
    return { status: "not-recognized", variant: null, by: "shape", why: keys.length ? `No rule here knows a response with these fields: ${keys.join(", ")}.` : "The JSON holds no record this tool can read.", ev: null, fields: keys };
  }
  const hosts = hostsIn(text);
  for (const h of hosts) {
    const rule = hostRule(h.host, h.path);
    if (rule) return { status: "recognized", variant: rule.variant, by: "host", host: h.host, why: rule.why, ev: rule.ev, media: Boolean(rule.media) };
  }
  const rapid = hosts.find((h) => h.host.endsWith(".rapidapi.com") || h.host === "rapidapi.com");
  if (rapid) {
    return {
      status: "not-recognized",
      variant: null,
      by: "host",
      host: rapid.host,
      why: `${rapid.host} is on RapidAPI, but it is not a host AscendAPI's documentation names for ExerciseDB V1 or V2, as this site read it.`,
      ev: null,
      rapidapiNote: UNVERIFIED_RAPIDAPI_NOTE,
    };
  }
  return {
    status: "not-recognized",
    variant: null,
    by: "host",
    host: hosts[0]?.host ?? null,
    why: hosts.length ? `${hosts[0].host} is not a host any ExerciseDB page on this site quotes.` : "No URL, host or JSON found in what you pasted.",
    ev: null,
  };
}

/** Every [file, row, key] the rules cite, for the evidence check. */
export function citedRefs() {
  return [...HOST_RULES, ...SHAPE_RULES, ...ENVELOPE_RULES].map((r) => r.ev);
}
