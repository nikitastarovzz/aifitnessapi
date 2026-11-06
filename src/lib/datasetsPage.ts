import fs from "node:fs";
import path from "node:path";
import { absoluteUrl } from "@/lib/site";

/**
 * The /datasets catalogue: which datasets are published, what each row is,
 * the caveat that travels with it, and the files read off public/datasets.
 * Shared by src/app/datasets/page.tsx and its markdown mirror, so the two list
 * the same datasets with the same counts.
 */
export const DATASETS_UPDATED = "2026-08-22";
export const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

/** The generated envelope every dataset in public/datasets shares. */
export type DatasetFile = {
  name: string;
  version: string;
  license: string;
  fields: Record<string, string>;
  items: unknown[];
};

/** The published file plus the column list read off its rows. */
export type Loaded = DatasetFile & { rows: number; columns: string[] };

export function loadDataset(slug: string): Loaded {
  const file = path.join(process.cwd(), "public", "datasets", `${slug}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(
      `public/datasets/${slug}.json is missing — run \`npm run datasets\` before building.`,
    );
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as DatasetFile;
  if (!Array.isArray(parsed.items) || parsed.items.length === 0) {
    throw new Error(`public/datasets/${slug}.json has no items.`);
  }
  // Columns come off the rows themselves, not the `fields` dictionary — the
  // dictionary documents the interesting columns, the rows are the truth.
  const columns: string[] = [];
  for (const item of parsed.items as Record<string, unknown>[]) {
    for (const key of Object.keys(item)) if (!columns.includes(key)) columns.push(key);
  }
  return { ...parsed, rows: parsed.items.length, columns };
}

export type Entry = {
  slug: string;
  /** What one row is, for the "N rows" line. */
  unit: string;
  blurb: string;
  keywords: string[];
  /** The page on this site that presents the same data as prose. */
  presentedBy: { href: string; label: string };
  /** Anything a citing reader should know before using it. */
  caveat: string;
};

export const ENTRIES: Entry[] = [
  {
    slug: "fitness-apis-2026",
    unit: "APIs, SDKs and models",
    blurb:
      "The access-structure survey behind our annual report: for each product, how the vendor bills developers, what the end user must already own or pay for, and what approval stands between working code and a live product. One source link per row.",
    keywords: [
      "fitness API",
      "wearable API",
      "API pricing model",
      "approval gate",
      "developer access",
    ],
    presentedBy: { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
    caveat:
      "A coverage-driven sample, not a census: these are the products this site's own verified pages already cover in depth, so it implies nothing about market share. KinesteX, which funds this site, is one of the rows and is classified by the same rule as everyone else.",
  },
  {
    slug: "health-data-type-matrix-2026",
    unit: "health metrics",
    blurb:
      "The cross-platform identifier mapping: each common health metric with its Apple HealthKit type identifier and its Android Health Connect record type, plus the gotcha where the two platforms quietly disagree — Apple stores HRV as SDNN, Health Connect stores RMSSD.",
    keywords: [
      "HealthKit",
      "Health Connect",
      "health data types",
      "cross-platform mapping",
      "iOS Android health",
    ],
    presentedBy: { href: "/matrix", label: "HealthKit ↔ Health Connect type reference" },
    caveat:
      "Scoped deliberately to the two on-device platform stores, because those are the cells we could verify against Apple's and Google's own documentation. A narrow table you can trust beats a wide one padded with guesses.",
  },
  {
    slug: "fitness-api-changes-2026",
    unit: "dated ecosystem events",
    blurb:
      "The dated record of what changed: deprecations, deadlines, term changes and model freezes. Every row is graded — confirmed means a vendor's own words are quoted on the linked page, reported means notices we could not confirm on an official page — and that grading survives into both formats.",
    keywords: [
      "API deprecation",
      "Google Fit shutdown",
      "Fitbit API",
      "fitness API changes",
      "developer deadlines",
    ],
    presentedBy: { href: "/changes", label: "Fitness API changes & deadlines tracker" },
    caveat:
      "Date precision is kept exactly as sourced — “2026-09” means a reported month, not a guessed day. The undated watch items on the tracker are excluded here because they carry no date to publish.",
  },
  {
    slug: "fitness-api-glossary-2026",
    unit: "defined terms",
    blurb:
      "The controlled vocabulary: each term with its definition, the section it belongs to, the one page on this site that is its canonical explanation, and its stable identifier — so a machine reader can cite the exact definition it used.",
    keywords: [
      "fitness API glossary",
      "health data terminology",
      "defined terms",
      "HRV",
      "pose estimation",
    ],
    presentedBy: { href: "/glossary", label: "Fitness & health API glossary" },
    caveat:
      "These are the site's own editorial definitions, written against the vendor documentation cited on the linked pages — not quotations from a standards body. The groups are our sections, not an industry taxonomy.",
  },
  {
    slug: "healthkit-type-identifiers-2026",
    unit: "type identifiers",
    blurb:
      "All four HealthKit naming families in one table — quantity, category, characteristic and workout activity — read straight from the JSON Apple serves to developer.apple.com, with units, value enums, platform versions, and the column Apple does not expose anywhere: whether a quantity type is cumulative or discrete.",
    keywords: [
      "HealthKit",
      "HKQuantityTypeIdentifier",
      "cumulative vs discrete",
      "HKStatisticsQuery",
      "iOS health data",
    ],
    presentedBy: { href: "/healthkit-identifiers", label: "Every HealthKit type identifier" },
    caveat:
      "Two columns are derived, not copied: aggregation and unit family. Apple states both in prose rather than as properties, so each was matched against Apple's own sentence and left null where Apple's wording does not say. Both apply only to quantity types — elsewhere null means the concept does not apply, not that Apple was silent. Apple's abstracts are reproduced to identify the API surface; the classification is ours, and Apple's documentation remains the authority.",
  },
  {
    slug: "health-connect-records-2026",
    unit: "record classes",
    blurb:
      "Every record class in Google's Health Connect data-types table, joined to its Jetpack reference page: category, record shape, unit class, mandatory fields, the exact read and write permission strings, and the aggregate metrics each class exposes.",
    keywords: [
      "Health Connect",
      "Health Connect records",
      "android.permission.health",
      "AggregateMetric",
      "Android health data",
    ],
    presentedBy: { href: "/health-connect", label: "Health Connect record types" },
    caveat:
      "Generated from Google's pages, so it says what they say: a field Google does not state is null. Where Google's own pages disagree on a permission string, this file carries the data-types table's spelling and the record page shows both.",
  },
  {
    slug: "health-connect-permissions-2026",
    unit: "permission strings",
    blurb:
      "Every constant on Android's framework HealthPermissions reference: the android.permission.health manifest string, Google's description, protection level, the API level it arrived in, and the record classes that use it.",
    keywords: [
      "Health Connect permissions",
      "android.permission.health",
      "HealthPermissions",
      "Android manifest",
      "READ_HEALTH_DATA_IN_BACKGROUND",
    ],
    presentedBy: { href: "/health-connect/permissions", label: "Every Health Connect permission string" },
    caveat:
      "The records column is a join to Google's data-types table, not a statement from the HealthPermissions page; background, history, medical and symptom permissions name no record class and are null there.",
  },
  {
    slug: "healthkit-metadata-keys-2026",
    unit: "metadata keys",
    blurb:
      "Every HKMetadataKey constant on Apple's Metadata Keys collection and its workout sub-collection, read from the JSON Apple serves to developer.apple.com: Swift and Objective-C names, Apple's topic group, abstract, platform versions, and the value type where Apple's own sentence states it.",
    keywords: [
      "HealthKit metadata keys",
      "HKMetadataKey",
      "HKMetadataKeyExternalUUID",
      "HealthKit metadata",
      "iOS health data",
    ],
    presentedBy: { href: "/healthkit-metadata-keys", label: "HealthKit metadata keys" },
    caveat:
      "valueType is derived, not copied: it is read from the sentence in Apple's text that names the value, and that sentence ships beside it in valueTypeEvidence. Where Apple's text does not say, both are null rather than guessed.",
  },
  {
    slug: "wear-os-health-services-data-types-2026",
    unit: "data types",
    blurb:
      "Every DataType companion constant on Google's Jetpack reference for Wear OS Health Services: the declared Kotlin type, delta or aggregate class, value and data-point class, Google's description, and the permission Google's permissions table lists it under.",
    keywords: [
      "Wear OS Health Services",
      "DataType",
      "HEART_RATE_BPM",
      "health-services-client",
      "Wear OS permissions",
    ],
    presentedBy: { href: "/wear-os-data-types", label: "Wear OS Health Services data types" },
    caveat:
      "The permission column is set only where Google's permissions table names the constant, and the table row ships beside it in permissionEvidence; a constant the table does not name has a null permission, not an inferred one.",
  },
  {
    slug: "pose-keypoint-maps-2026",
    unit: "keypoints",
    blurb:
      "Every point of the pose-estimation keypoint schemes this site covers — COCO 17, MediaPipe BlazePose 33, ML Kit, Halpe26, COCO-WholeBody, OpenPose BODY_25 and COCO 18, and Apple Vision 2D and 3D — with its index and name exactly as the model's own source spells them, the models a source ties to each scheme, and the source file's branch and hash.",
    keywords: [
      "pose estimation keypoints",
      "COCO keypoints",
      "MediaPipe pose landmarks",
      "OpenPose BODY_25",
      "keypoint mapping",
    ],
    presentedBy: { href: "/pose-keypoints", label: "Pose estimation keypoint maps" },
    caveat:
      "crosswalkKey is derived, not copied: the name lowercased with separators removed. Points are joined on that key alone, so a shared row means the names match, not that two models place the point in the same spot, and names that differ stay unmapped rather than guessed.",
  },
  {
    slug: "google-health-api-data-types-2026",
    unit: "data types",
    blurb:
      "Every data type in Google's Google Health API data-types table, joined to the v4 discovery document: record type, storage resolution, webhook and true-zeros support, operations and the methods they map to, full scope URLs, the DataPoint field and its schema's fields, rollup fields, the Fitbit Web API predecessor and the disagreements between Google's own pages.",
    keywords: [
      "Google Health API",
      "Fitbit Web API migration",
      "googlehealth scopes",
      "discovery document",
      "Fitbit data types",
    ],
    presentedBy: { href: "/google-health-api", label: "Google Health API reference" },
    caveat:
      "Three columns are derived and ship with their evidence: scope URLs (Google's documented prefix plus the printed suffix), methods (\"update\" is paired with patch only through Google's endpoint-mapping table) and the DataPoint field (matched by its own description, or by the kebab-case rule DataPoint.name states). Where Google's pages disagree, the flags column names the kind and the data-type page shows the texts.",
  },
  {
    slug: "health-mcp-servers-2026",
    unit: "MCP servers",
    blurb:
      "Every server in the official MCP Registry whose name, title or description names a health or fitness data source, read page by page from the registry's listing: the registry's description verbatim, version, status and dates, packages and remote URLs, the term each was kept for, and npm or PyPI facts for its packages.",
    keywords: [
      "MCP server",
      "Model Context Protocol",
      "health data MCP",
      "wearable data AI assistant",
      "MCP Registry",
    ],
    presentedBy: { href: "/health-mcp-servers", label: "MCP servers for health and fitness data" },
    caveat:
      "Descriptions are the publishers' own words and no server was run or audited. publisherIsVendor is yes only when the registry namespace is the vendor's own domain in reverse-DNS form; repositories were not read, so repositoryUrl is only what the entry lists.",
  },
  {
    slug: "bluetooth-fitness-gatt-2026",
    unit: "characteristic fields",
    blurb:
      "The byte layout of the Bluetooth GATT characteristics fitness and health devices use, read from the Bluetooth SIG's own YAML: one row per field with its type, size, offset where it is fixed, the Flags bit that makes it present, and its unit, plus a row for each in-scope characteristic the SIG publishes no structure for.",
    keywords: [
      "Bluetooth GATT",
      "BLE characteristic format",
      "Heart Rate Measurement 0x2A37",
      "FTMS Indoor Bike Data",
      "GATT Specification Supplement",
    ],
    presentedBy: { href: "/bluetooth-fitness", label: "Bluetooth GATT characteristics for fitness devices" },
    caveat:
      "The license covers this compilation and its derived columns. The UUIDs, names, types and sizes are the Bluetooth SIG's, restated as facts, and its files say they are proprietary to Bluetooth SIG and grant no license, so the SIG's descriptions are left out (the pages quote them with attribution) and the file carries the SIG's notice in sourceTerms. Offsets, flag bits and units are derived, each beside the line it was read from.",
  },
  {
    slug: "workout-types-crosswalk-2026",
    unit: "workout type constants",
    blurb:
      "Every workout or exercise type constant on HealthKit (HKWorkoutActivityType), Health Connect (ExerciseSessionRecord.EXERCISE_TYPE_*), Wear OS Health Services (ExerciseType) and the Google Health API (exerciseType), with the number each platform prints, the source's own wording, Health Connect's platform-API value and allowed segment types, and the constants of the same name on the other three.",
    keywords: [
      "HKWorkoutActivityType",
      "Health Connect exercise types",
      "Wear OS ExerciseType",
      "Google Health API exerciseType",
      "workout type mapping",
    ],
    presentedBy: { href: "/workout-types", label: "Workout types across four platforms" },
    caveat:
      "crosswalkKey is derived: the name with a leading EXERCISE_TYPE_ removed, lowercased, separators dropped. Constants are joined on that key alone, so a shared key means the names match, not that the platforms define the activity alike, and no Apple or Google page read for it maps one list onto another. Wear OS ids come from the androidx source the reference links, because the reference prints none.",
  },
  {
    slug: "exercise-form-rules-2026",
    unit: "rules",
    blurb:
      "The joint-angle, ratio and hold-time thresholds that licensed open-source exercise trackers use to count reps and check form for squats, push-ups, lunges, planks, bicep curls, shoulder presses and deadlifts, each with the verbatim line of code its value was captured from, the line that applies it and the line that computes the angle.",
    keywords: [
      "exercise form rules",
      "squat knee angle threshold",
      "push-up elbow angle",
      "rep counting thresholds",
      "pose estimation exercise dataset",
    ],
    presentedBy: { href: "/tools/exercise-form-rules", label: "Exercise form rules" },
    caveat:
      "These are the projects' own thresholds for their own camera setups, measured as 2D image angles, not biomechanical standards. A value is null where no licensed source read states one (deadlift, lunge rep counting, shoulder-press reps), with the reason; peer-reviewed definitions on hosts the build could not reach are not copied.",
  },
  {
    slug: "exercise-taxonomy-crosswalk-2026",
    unit: "terms",
    blurb:
      "Every category, equipment, muscle and body-part term of free-exercise-db, wger and ExerciseDB v1, spelled as each database spells it, with the HealthKit and Health Connect workout and segment types that share its name, and the exercise names that match a Health Connect constant.",
    keywords: [
      "ExerciseDB body parts",
      "wger exercise categories",
      "free-exercise-db",
      "exercise database to HealthKit",
      "Health Connect exercise type mapping",
    ],
    presentedBy: { href: "/tools/exercise-taxonomy-crosswalk", label: "Exercise taxonomy crosswalk" },
    caveat:
      "Matches are by name alone: a category or exercise name maps only where its normalized name equals a constant's, so most terms are unmapped by design. Equipment, muscle and body-part terms are never mapped; the nameContains columns are text coincidences for browsing. The databases' own licenses cover their content; this file republishes the term names.",
  },
  {
    slug: "fitness-api-docs-drift-2026",
    unit: "row groups",
    blurb:
      "Every evidence row this site has written (a claim, a source URL and a verbatim quote), followed through the repository's commit history to the commit that replaced or removed it, with the reason that commit's message gives: the vendor's page changed, this site changed the quote, or the source stopped answering.",
    keywords: ["api documentation drift", "how often api docs change", "vendor documentation changes", "source quote history", "fitness api docs"],
    presentedBy: { href: "/research/docs-drift", label: "How often fitness API documentation changes under us" },
    caveat:
      "Rows that share every column are grouped, and rows counts them. Causes come only from commit messages; dates are merge dates on main. A change that was never committed, or a page no row quotes, is not here.",
  },
  {
    slug: "fitness-api-shutdown-notice-2026",
    unit: "entries",
    blurb:
      "One row per Fitness API Graveyard entry: the end date at the vendor's precision, the day the vendor announced it where a vendor page dates the notice, the days between them, and for every other entry the reason it cannot be measured.",
    keywords: ["api deprecation notice period", "shutdown notice", "api sunset announcement", "fitness api graveyard", "deprecation timeline"],
    presentedBy: { href: "/research/shutdown-notice", label: "How much notice fitness API shutdowns gave" },
    caveat:
      "Notice is computed only where both dates are to the day, which few vendor pages allow. A missing announcement date means none was found on the pages read, not that none was given.",
  },
  {
    slug: "fitness-api-pricing-transparency-2026",
    unit: "vendors",
    blurb:
      "Every vendor on this site's pricing pages, classed as publishing a price, naming a paid plan without one, or free, each with the vendor's own line as the pages' evidence files quote it, plus any free entry or unpriced tier.",
    keywords: ["api pricing transparency", "contact sales pricing", "health data api prices", "wearable api free", "published api prices"],
    presentedBy: { href: "/research/pricing-transparency", label: "Which fitness API vendors publish their prices" },
    caveat:
      "The class records what the vendor's page says on the evidence files' read dates, not what a customer pays. KinesteX, which funds this site, and vendors whose lines state no price either way are listed but not counted.",
  },
];

export const LOADED = ENTRIES.map((e) => ({ entry: e, file: loadDataset(e.slug) }));


export const COUNT_ENTRIES = ENTRIES.length;

export const citeAs = (d: Loaded, slug: string) =>
  `AIFitnessAPI, "${d.name}," version ${d.version}, aifitnessapi.com, ${absoluteUrl(`/datasets/${slug}.json`)}`;

export const fmtUpdated = (iso: string) => {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const [y, m, d] = iso.split("-");
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
};

