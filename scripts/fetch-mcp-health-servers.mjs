#!/usr/bin/env node
/**
 * Refresh src/data/mcpHealthServers.ts — the MCP servers listed in the
 * official MCP Registry whose name, title or description names a health or
 * fitness data source.
 *
 * Sources, all read live, nothing typed by hand:
 *   - The official MCP Registry API, v0.1 — the version the registry's README
 *     says is under an API freeze while v0 keeps changing:
 *       GET https://registry.modelcontextprotocol.io/v0.1/servers?version=latest&limit=100&cursor=…
 *     EVERY page of the listing, not a keyword search. The registry's own
 *     OpenAPI document describes `search` as "Search servers by name
 *     (substring match)", so on 2026-10-17 a search for "garmin" returned 12
 *     names and missed a cycling-coach server whose description names Garmin,
 *     and a search for "oura" returned "foura". Reading the whole listing and
 *     matching locally is the only way to see descriptions at all.
 *   - npm (https://registry.npmjs.org/<name>) and PyPI
 *     (https://pypi.org/pypi/<name>/json) for every npm or PyPI package an
 *     in-scope entry names: the package's latest version, its licence as the
 *     package metadata states it, and the date that version was published.
 *
 * Not read: the servers' repositories. github.com and api.github.com are not
 * reachable from the authoring environment, so a repository URL is printed
 * exactly as the registry entry lists it and nothing is claimed about what is
 * there. The servers themselves are never run or connected to.
 *
 * In scope. A server is in scope when one of the TERMS below matches, on a
 * word boundary, in its registry name (separators read as spaces), title or
 * description. Four vendor names are also ordinary words or other products
 * (Polar is also a payments platform, Terra a GIS project, Junction an MCP
 * directory, Vital an adjective), so those count only when the entry also
 * carries a health or fitness word (CONTEXT); the word that qualified
 * them is stored with the match. Every match keeps its evidence — the field
 * and the exact text matched — and the generator refuses to write a match
 * whose text is not in that field. EXCLUDED removes, by name and with a
 * reason, entries a term matched in a sense that is not health or fitness
 * data; it is an editorial list, printed on the page, never a filter on
 * anything else.
 *
 * Latest version per server. The listing is requested with version=latest,
 * so each name should appear once. If a name does appear twice, the entry the
 * registry marks `isLatest` (in _meta["io.modelcontextprotocol.registry/
 * official"]) wins, else the highest version by semver precedence; the rule
 * that decided is stored per row in `versionRule`.
 *
 * Official vs unofficial. `publisherIsVendor` is true only when the registry
 * namespace (the part of the name before "/") is the reverse-DNS form of a
 * domain this site already cites for that vendor's developer documentation
 * (each source's `domains`, with the page they come from in `domainSource`),
 * or a sub-namespace of it. The registry's authentication docs say a domain
 * namespace can only be published under after proving control of the domain
 * by DNS or HTTP, and an io.github.<name> namespace only through the GitHub
 * account or organisation <name> — so a GitHub namespace is never treated as
 * a vendor's, whatever it is called. Everything
 * else is unofficial. A vendor with no domain on this site can have no
 * official server here; a namespace that LOOKS like such a vendor's domain
 * fails the run instead of being labelled either way, so a person checks it.
 *
 * Guard rails, from CLAUDE.md:
 *   - A short read fails. MIN_REGISTRY_ENTRIES floors the size of the whole
 *     listing and EXPECTED_MIN_SERVERS the in-scope count; below either the
 *     script exits non-zero and leaves the existing file alone. A package
 *     lookup that fails for any reason but a 404 also fails the run.
 *   - Derived fields keep their evidence (matches, publisherEvidence,
 *     licenseEvidence), and are null where the source does not state them.
 *
 * Writes only when something changed, or when the stamp is a week old. The
 * workflow (.github/workflows/mcp-health-servers.yml) decides whether a diff
 * is worth a commit.
 *
 * Usage:  NODE_USE_ENV_PROXY=1 node scripts/fetch-mcp-health-servers.mjs [--offline]
 *   --offline reparses .cache/mcp-registry without fetching anything.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync, renameSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "src/data/mcpHealthServers.ts";
const CACHE = ".cache/mcp-registry";
const OFFLINE = process.argv.includes("--offline");
const STALE_AFTER_DAYS = 7;

const REGISTRY = "https://registry.modelcontextprotocol.io";
const LISTING = `${REGISTRY}/v0.1/servers`;
const PAGE_SIZE = 100; // the API's maximum (it answers 422 above 100)
const MAX_PAGES = 3000; // a loop guard, far above the registry's size
const TIMEOUT_MS = 60_000;
const ATTEMPTS = 5;
const PAGE_PAUSE_MS = 250;
const PACKAGE_PAUSE_MS = 100;

/**
 * Floors from the first full read (2026-10-17): the latest-version listing
 * held 45,161 entries over 452 pages, and the filter kept 176 servers. The
 * floors sit about 10% under those, because the registry is in preview and
 * entries are deleted as well as added; a drop bigger than that in one week
 * is far more likely a truncated crawl than a real change. Raise them after
 * a verified read; lower one only after confirming the registry really
 * shrank — never to get a write through.
 */
const MIN_REGISTRY_ENTRIES = 40_000;
const EXPECTED_MIN_SERVERS = 158;

const SOURCES_DOC = {
  registryApi: LISTING,
  registryOpenApi: "https://raw.githubusercontent.com/modelcontextprotocol/registry/main/docs/reference/api/openapi.yaml",
  registryReadme: "https://raw.githubusercontent.com/modelcontextprotocol/registry/main/README.md",
  registryAuthentication:
    "https://raw.githubusercontent.com/modelcontextprotocol/registry/main/docs/modelcontextprotocol-io/authentication.mdx",
  npm: "https://registry.npmjs.org",
  pypi: "https://pypi.org/pypi",
};

// ── What counts as a health or fitness data source ───────────────────────

/**
 * Health and fitness words that qualify an ambiguous vendor name. Searched in
 * the whole entry (name, title, description), and the word found is stored
 * with the match. Deliberately no "watch" or "ring": both are everyday words
 * in the descriptions this rule exists to keep out.
 */
const CONTEXT =
  /\b(health|healthy|fitness|wearables?|workouts?|training|sleep|heart|HRV|activit(?:y|ies)|exercises?|running|cycling|steps|recovery|athletes?|sports?|wellness|nutrition|glucose|CGM|smartwatch(?:es)?)\b/i;

/**
 * One row per data source. `terms` are [label, pattern] pairs; `needsContext`
 * makes every term of the source count only when a CONTEXT word appears
 * somewhere in the same entry. `domains` are the vendor's own domains AS THIS SITE ALREADY
 * CITES THEM (the page or data module is named in `domainSource`); a source
 * with no domain here can have no official server.
 */
const SOURCES = [
  // Platform stores and platform APIs
  {
    key: "apple-health",
    label: "Apple Health (HealthKit)",
    kind: "platform",
    terms: [
      ["Apple Health", /\bApple[ -]?Health\b/i],
      ["HealthKit", /\bHealth ?Kit\b/i],
    ],
    domains: ["apple.com"],
    domainSource: "developer.apple.com, the documentation /healthkit-identifiers is generated from",
  },
  {
    key: "health-connect",
    label: "Health Connect",
    kind: "platform",
    terms: [["Health Connect", /\bHealth[ -]?Connect\b/i]],
    domains: ["android.com", "google.com"],
    domainSource: "developer.android.com, the documentation /health-connect is generated from",
  },
  {
    key: "google-health",
    label: "Google Health API",
    kind: "platform",
    terms: [["Google Health", /\bGoogle Health\b/i]],
    domains: ["google.com"],
    domainSource: "developers.google.com/health, cited by /fitbit-api-shutdown and /integrate/fitbit-api",
  },
  {
    key: "fitbit",
    label: "Fitbit",
    kind: "platform",
    terms: [["Fitbit", /\bFitbit\b/i]],
    domains: ["fitbit.com", "google.com"],
    domainSource: "dev.fitbit.com and developers.google.com/health, cited by /integrate/fitbit-api",
  },
  {
    key: "google-fit",
    label: "Google Fit",
    kind: "platform",
    terms: [["Google Fit", /\bGoogle[ -]?Fit\b/i]],
    domains: ["google.com"],
    domainSource: "google.com: Google Fit is Google's, and /fitbit-api-shutdown cites developers.google.com for Google's health APIs",
  },
  {
    key: "samsung-health",
    label: "Samsung Health",
    kind: "platform",
    terms: [["Samsung Health", /\bSamsung[ -]?Health\b/i]],
    domains: [],
    nameToken: "samsung",
  },
  // Wearables and devices
  {
    key: "garmin",
    label: "Garmin",
    kind: "device",
    terms: [["Garmin", /\bGarmin\b/i]],
    domains: ["garmin.com"],
    domainSource: "developer.garmin.com, cited by /integrate/garmin-api",
  },
  {
    key: "oura",
    label: "Oura",
    kind: "device",
    terms: [["Oura", /\bOura\b/i]],
    domains: ["ouraring.com"],
    domainSource: "cloud.ouraring.com and api.ouraring.com, cited by /integrate/oura-api",
  },
  {
    key: "whoop",
    label: "WHOOP",
    kind: "device",
    terms: [["WHOOP", /\bWhoop\b/i]],
    domains: ["whoop.com"],
    domainSource: "api.prod.whoop.com, cited by /integrate/whoop-api",
  },
  {
    key: "polar",
    label: "Polar",
    kind: "device",
    needsContext: true,
    terms: [["Polar", /\bPolar\b/i]],
    domains: ["polar.com", "polaraccesslink.com"],
    domainSource: "flow.polar.com and www.polaraccesslink.com, cited by /integrate/polar-api",
  },
  { key: "withings", label: "Withings", kind: "device", terms: [["Withings", /\bWithings\b/i]], domains: [], nameToken: "withings" },
  { key: "suunto", label: "Suunto", kind: "device", terms: [["Suunto", /\bSuunto\b/i]], domains: [], nameToken: "suunto" },
  { key: "coros", label: "COROS", kind: "device", terms: [["COROS", /\bCoros\b/i]], domains: [], nameToken: "coros" },
  { key: "wahoo", label: "Wahoo", kind: "device", terms: [["Wahoo", /\bWahoo\b/i]], domains: [], nameToken: "wahoo" },
  { key: "dexcom", label: "Dexcom", kind: "device", terms: [["Dexcom", /\bDexcom\b/i]], domains: [], nameToken: "dexcom" },
  { key: "peloton", label: "Peloton", kind: "device", terms: [["Peloton", /\bPeloton\b/i]], domains: [], nameToken: "peloton" },
  // Apps
  {
    key: "strava",
    label: "Strava",
    kind: "app",
    terms: [["Strava", /\bStrava\b/i]],
    domains: ["strava.com"],
    domainSource: "developers.strava.com, cited by /integrate/strava-api",
  },
  {
    key: "myfitnesspal",
    label: "MyFitnessPal",
    kind: "app",
    terms: [["MyFitnessPal", /\bMy[ -]?Fitness[ -]?Pal\b/i]],
    domains: [],
    nameToken: "myfitnesspal",
  },
  { key: "cronometer", label: "Cronometer", kind: "app", terms: [["Cronometer", /\bCronometer\b/i]], domains: [], nameToken: "cronometer" },
  // Aggregators
  {
    key: "terra",
    label: "Terra",
    kind: "aggregator",
    needsContext: true,
    terms: [["Terra", /\bTerra\b/i]],
    domains: ["tryterra.co"],
    domainSource: "api.tryterra.co, cited by /integrate/terra-api",
  },
  {
    key: "junction",
    label: "Junction (formerly Vital)",
    kind: "aggregator",
    needsContext: true,
    terms: [
      ["Junction", /\bJunction\b/i],
      // "vital signs" and "vital records" are not the product.
      ["Vital", /\b(?:tryvital|Vital)\b(?![ -]?(?:signs?|records?|statistics|stats)\b)/i],
    ],
    domains: ["junction.com"],
    domainSource: "junction.com, which /fitness-apis/terra-vs-vital names as Junction's documentation domain",
  },
  // Not a vendor: the generic terms. A server matching only these is grouped
  // under "general".
  {
    key: "general",
    label: "Wearable, fitness and health data in general",
    kind: "general",
    terms: [
      ["wearable", /\bwearables?\b/i],
      ["fitness", /\bfitness\b/i],
      ["workout", /\bworkouts?\b/i],
      ["sleep tracking", /\bsleep[ -]?track(?:ing|ers?)\b/i],
      ["HRV", /\bHRV\b|\bheart[ -]rate variability\b/i],
      ["health data", /\bhealth data\b/i],
    ],
    domains: [],
  },
];

/**
 * Entries a term matched in a sense that is not health or fitness data:
 * the word is there, but it means something else. Name → the reason, printed
 * on the page. Decided by reading each entry's registry description
 * (2026-10-17); an entry is never excluded for being thin, unofficial or
 * unlike the rest. Add one only with its reason.
 */
const EXCLUDED = {
  "ai.sfomo/events":
    "Searches upcoming San Francisco Bay Area events; “fitness” is one of its event categories, not data it reads.",
  "com.formulasignal/record":
    "Tracks the formulas of pre-workout supplements; “workout” is part of a product category, not workout data.",
  "com.gitbuyer/mcp": "Searches and sells code repositories; “fitness” describes how well a repository fits.",
  "com.idevice/wearables": "A buyer's guide to wearables and phones (prices, when to buy); it reads no data from a wearable.",
  "com.trycommonplace/seller": "Helps sell large household items; “fitness gear” is one example of an item.",
  "com.wphealthkit/mcp-server": "A WordPress security-audit tool titled “WP HealthKit”; it is unrelated to Apple's HealthKit.",
  "io.github.MetriLLM/metrillm": "Benchmarks local language models; “fitness” is its verdict on whether hardware suits a model.",
  "io.github.TweedBeetle/dependency-fitness-mcp": "Checks npm dependencies; “fitness” describes the state of a package.",
  "io.github.dexcom-inc/argocd-mcp":
    "Manages ArgoCD deployments. “Dexcom” is only in the publishing GitHub account's name; it reads no glucose or health data.",
  "io.github.rotifer-protocol/mcp-server": "Ranks AI agent components by an “Arena fitness” score.",
  "io.github.thehomer87/badge-mcp-server": "Screens AI agents and reads their “fitness scores” on a talent leaderboard.",
};

// ── HTTP ──────────────────────────────────────────────────────────────────

const UA = { "user-agent": "aifitnessapi-mcp-directory (+https://aifitnessapi.com/health-mcp-servers)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** JSON from `url`, or { notFound: true } on a 404. Retries everything else. */
async function getJson(url) {
  let lastErr;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { ...UA, accept: "application/json" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (res.status === 404) return { notFound: true };
      if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
      return { json: await res.json() };
    } catch (e) {
      lastErr = e;
      if (attempt < ATTEMPTS - 1) await sleep(2000 * 2 ** attempt);
    }
  }
  throw lastErr;
}

const day = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : null);
const today = new Date().toISOString().slice(0, 10);

// ── 1. The registry listing ──────────────────────────────────────────────

mkdirSync(CACHE, { recursive: true });
const META = join(CACHE, "meta.json");
const LISTING_DIR = join(CACHE, "listing");

let pages;
let fetchedOn;
if (OFFLINE) {
  if (!existsSync(META) || !existsSync(LISTING_DIR)) {
    console.error(`--offline: no cached listing in ${CACHE}; run once online first.`);
    process.exit(1);
  }
  const meta = JSON.parse(readFileSync(META, "utf8"));
  fetchedOn = meta.fetchedOn;
  pages = readdirSync(LISTING_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(LISTING_DIR, f), "utf8")));
  if (pages.length !== meta.pages) {
    console.error(`--offline: ${pages.length} cached pages but meta.json records ${meta.pages}; refusing a partial cache.`);
    process.exit(1);
  }
} else {
  pages = [];
  let cursor = null;
  for (;;) {
    if (pages.length >= MAX_PAGES) {
      console.error(`Listing did not end within ${MAX_PAGES} pages; refusing to continue.`);
      process.exit(1);
    }
    const u = new URL(LISTING);
    u.searchParams.set("version", "latest");
    u.searchParams.set("limit", String(PAGE_SIZE));
    if (cursor) u.searchParams.set("cursor", cursor);
    const r = await getJson(u.href);
    if (r.notFound || !Array.isArray(r.json?.servers)) {
      console.error(`Registry listing answered without a servers array at page ${pages.length + 1} (${u.href}).`);
      process.exit(1);
    }
    pages.push(r.json);
    const next = r.json.metadata?.nextCursor;
    if (!next || r.json.servers.length === 0) break;
    if (next === cursor) {
      console.error(`Registry returned the same cursor twice (${next}); refusing to loop.`);
      process.exit(1);
    }
    cursor = next;
    if (pages.length % 50 === 0) console.log(`  … ${pages.length} pages read`);
    await sleep(PAGE_PAUSE_MS);
  }
  fetchedOn = today;
  // Replace the cache only after a complete read.
  const tmp = `${LISTING_DIR}.tmp`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  pages.forEach((p, i) => writeFileSync(join(tmp, `${String(i + 1).padStart(5, "0")}.json`), JSON.stringify(p)));
  rmSync(LISTING_DIR, { recursive: true, force: true });
  renameSync(tmp, LISTING_DIR);
  writeFileSync(META, JSON.stringify({ fetchedOn, listing: LISTING, pages: pages.length }, null, 2));
}

const entries = pages.flatMap((p) => p.servers);
const OFFICIAL_META = "io.modelcontextprotocol.registry/official";

if (entries.length < MIN_REGISTRY_ENTRIES) {
  console.error(
    `Short read: the latest-version listing yielded ${entries.length} entries, below the floor of ${MIN_REGISTRY_ENTRIES}. ` +
      "Refusing to write; the existing file is untouched.",
  );
  process.exit(1);
}

// ── 2. One entry per server name ─────────────────────────────────────────

/** Semver precedence (prerelease < release); non-semver strings sort last-resort lexically. */
function compareVersions(a, b) {
  const parse = (v) => {
    const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$/.exec(v);
    return m ? { core: [+m[1], +m[2], +m[3]], pre: m[4] ? m[4].split(".") : null } : null;
  };
  const pa = parse(a);
  const pb = parse(b);
  if (!pa || !pb) return pa ? 1 : pb ? -1 : a < b ? -1 : a > b ? 1 : 0;
  for (let i = 0; i < 3; i++) if (pa.core[i] !== pb.core[i]) return pa.core[i] - pb.core[i];
  if (!pa.pre && !pb.pre) return 0;
  if (!pa.pre) return 1;
  if (!pb.pre) return -1;
  for (let i = 0; i < Math.max(pa.pre.length, pb.pre.length); i++) {
    const x = pa.pre[i];
    const y = pb.pre[i];
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const nx = /^\d+$/.test(x);
    const ny = /^\d+$/.test(y);
    if (nx && ny && +x !== +y) return +x - +y;
    if (nx !== ny) return nx ? -1 : 1;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

const byName = new Map();
for (const e of entries) {
  const name = e?.server?.name;
  if (!name) continue;
  (byName.get(name) ?? byName.set(name, []).get(name)).push(e);
}
const latest = [];
let duplicateNames = 0;
for (const list of byName.values()) {
  if (list.length === 1) {
    const isLatest = list[0]._meta?.[OFFICIAL_META]?.isLatest;
    latest.push({ entry: list[0], versionRule: isLatest === true ? "registry isLatest" : "only version listed" });
    continue;
  }
  duplicateNames++;
  const flagged = list.filter((e) => e._meta?.[OFFICIAL_META]?.isLatest === true);
  if (flagged.length === 1) {
    latest.push({ entry: flagged[0], versionRule: "registry isLatest" });
  } else {
    const top = [...list].sort((a, b) => compareVersions(b.server.version, a.server.version))[0];
    latest.push({ entry: top, versionRule: "highest version" });
  }
}

// ── 3. Matching ──────────────────────────────────────────────────────────

/** The registry name with its separators read as spaces, so \b works on "oura-mcp". */
const nameText = (name) => name.replace(/[/._-]+/g, " ");

const fieldsOf = (server) => ({
  name: nameText(server.name),
  title: server.title ?? "",
  description: server.description ?? "",
});

/** The first CONTEXT word anywhere in the entry, with its field. */
function contextIn(fields) {
  for (const [field, text] of Object.entries(fields)) {
    const c = CONTEXT.exec(text);
    if (c) return { field, text: c[0] };
  }
  return null;
}

/**
 * Every term that matches the entry, at most once per term (the first field
 * it appears in). `dropped` collects ambiguous vendor names that matched with
 * no health or fitness word anywhere in the entry.
 */
function matchesFor(server, dropped) {
  const fields = fieldsOf(server);
  const context = contextIn(fields);
  const found = [];
  for (const src of SOURCES) {
    for (const [term, re] of src.terms) {
      for (const [field, text] of Object.entries(fields)) {
        if (!text) continue;
        const m = re.exec(text);
        if (!m) continue;
        if (src.needsContext && !context) {
          dropped.push({ name: server.name, term, field, text: m[0] });
          break;
        }
        found.push({ source: src.key, term, field, text: m[0], context: src.needsContext ? context : null });
        break; // one field per term is evidence enough
      }
    }
  }
  return found;
}

const SOURCE_BY_KEY = new Map(SOURCES.map((s) => [s.key, s]));
const reverseDns = (domain) => domain.split(".").reverse().join(".");

function publisherFor(name, sourceKeys) {
  const ns = name.split("/")[0].toLowerCase();
  for (const key of sourceKeys) {
    const src = SOURCE_BY_KEY.get(key);
    for (const d of src.domains) {
      const rev = reverseDns(d);
      if (ns === rev || ns.startsWith(`${rev}.`)) {
        return {
          publisherIsVendor: true,
          publisherEvidence:
            `Namespace "${ns}" is ${d} in reverse-DNS form. ${src.label}'s own domain on this site: ${src.domainSource}. ` +
            "The registry only lets a publisher use a domain namespace after proving control of the domain by DNS or HTTP.",
        };
      }
    }
    // A vendor this site has no verified domain for, under a namespace that
    // looks like its name: neither label is safe, so a person decides.
    if (!src.domains.length && src.nameToken) {
      const labels = ns.split(".");
      if (!ns.startsWith("io.github.") && labels.slice(0, 2).includes(src.nameToken)) {
        throw new Error(
          `${name}: namespace "${ns}" looks like ${src.label}'s own domain, but this site has no verified domain for ${src.label}. ` +
            "Verify the vendor's domain, add it to SOURCES with where it was read, and rerun.",
        );
      }
    }
  }
  return { publisherIsVendor: false, publisherEvidence: null };
}

const inScope = [];
const excludedSeen = [];
const contextDropped = [];
for (const { entry, versionRule } of latest) {
  const s = entry.server;
  const dropped = [];
  const matches = matchesFor(s, dropped);
  if (!matches.length) {
    contextDropped.push(...dropped);
    continue;
  }
  if (EXCLUDED[s.name]) {
    excludedSeen.push({ name: s.name, reason: EXCLUDED[s.name], matched: [...new Set(matches.map((m) => m.term))] });
    continue;
  }
  inScope.push({ entry, versionRule, matches });
}

// ── 4. Package registry facts (npm, PyPI) ────────────────────────────────

const NPM_DIR = join(CACHE, "npm");
const PYPI_DIR = join(CACHE, "pypi");
mkdirSync(NPM_DIR, { recursive: true });
mkdirSync(PYPI_DIR, { recursive: true });
const cacheName = (id) => `${id.replace(/[^A-Za-z0-9._-]+/g, "__")}.json`;

async function cachedLookup(dir, id, url) {
  const file = join(dir, cacheName(id));
  if (OFFLINE) {
    if (!existsSync(file)) throw new Error(`--offline: ${file} is not cached`);
    return JSON.parse(readFileSync(file, "utf8"));
  }
  const r = await getJson(url);
  const stored = r.notFound ? { notFound: true } : { json: r.json };
  writeFileSync(file, JSON.stringify(stored));
  await sleep(PACKAGE_PAUSE_MS);
  return stored;
}

function licenseFromPypi(info) {
  if (info.license_expression) return { license: info.license_expression, licenseEvidence: "PyPI license_expression" };
  const raw = (info.license || "").trim();
  if (raw && raw.length <= 40 && !raw.includes("\n")) return { license: raw, licenseEvidence: "PyPI license field" };
  const cls = (info.classifiers || []).find((c) => c.startsWith("License :: "));
  if (cls) return { license: cls.split(" :: ").at(-1), licenseEvidence: `PyPI classifier "${cls}"` };
  return { license: null, licenseEvidence: null };
}

const isNpm = (p) => p.registryType === "npm" && (!p.registryBaseUrl || /^https:\/\/registry\.npmjs\.org\/?$/.test(p.registryBaseUrl));
const isPypi = (p) => p.registryType === "pypi" && (!p.registryBaseUrl || /^https:\/\/pypi\.org\/?$/.test(p.registryBaseUrl));

async function packageFacts(p) {
  if (isNpm(p)) {
    const r = await cachedLookup(NPM_DIR, p.identifier, `https://registry.npmjs.org/${p.identifier.replace("/", "%2F")}`);
    const page = `https://www.npmjs.com/package/${p.identifier}`;
    if (r.notFound) return { registry: "npm", url: page, found: false };
    const doc = r.json;
    const v = doc["dist-tags"]?.latest;
    const meta = v ? doc.versions?.[v] : null;
    // The package exists but npm names no latest version: say exactly that.
    if (!v || !meta) return { registry: "npm", url: page, found: true, latestVersion: null, lastPublished: null, license: null, licenseEvidence: null, deprecated: null };
    const license = typeof meta.license === "string" ? meta.license : meta.license?.type ?? null;
    return {
      registry: "npm",
      url: page,
      found: true,
      latestVersion: v,
      lastPublished: day(doc.time?.[v]),
      license,
      licenseEvidence: license ? "package.json license" : null,
      deprecated: meta.deprecated ? String(meta.deprecated) : null,
    };
  }
  if (isPypi(p)) {
    const r = await cachedLookup(PYPI_DIR, p.identifier, `https://pypi.org/pypi/${encodeURIComponent(p.identifier)}/json`);
    const page = `https://pypi.org/project/${p.identifier}/`;
    if (r.notFound) return { registry: "pypi", url: page, found: false };
    const info = r.json.info;
    if (!info?.version) return { registry: "pypi", url: page, found: true, latestVersion: null, lastPublished: null, license: null, licenseEvidence: null, deprecated: null };
    const files = r.json.releases?.[info.version] ?? [];
    const uploaded = files.map((f) => f.upload_time_iso_8601).filter(Boolean).sort()[0] ?? null;
    return {
      registry: "pypi",
      url: page,
      found: true,
      latestVersion: info.version,
      lastPublished: day(uploaded),
      ...licenseFromPypi(info),
      deprecated: files.length > 0 && files.every((f) => f.yanked) ? "every file of the latest release is yanked" : null,
    };
  }
  return null;
}

const slugOf = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const servers = [];
let npmLookups = 0;
let pypiLookups = 0;
for (const { entry, versionRule, matches } of inScope) {
  const s = entry.server;
  const official = entry._meta?.[OFFICIAL_META] ?? {};
  const sourceKeys = [...new Set(matches.map((m) => m.source))];
  const vendorKeys = sourceKeys.filter((k) => k !== "general");

  const packages = [];
  for (const p of s.packages ?? []) {
    if (!p?.identifier || !p?.registryType) continue;
    const facts = await packageFacts(p);
    if (facts?.registry === "npm") npmLookups++;
    if (facts?.registry === "pypi") pypiLookups++;
    const env = (p.environmentVariables ?? []).filter((v) => typeof v?.name === "string");
    packages.push({
      registryType: p.registryType,
      registryBaseUrl: p.registryBaseUrl ?? null,
      identifier: p.identifier,
      version: p.version ?? null,
      transport: p.transport?.type ?? null,
      runtimeHint: p.runtimeHint ?? null,
      // Names only, never a value: the variables the entry says the package
      // reads, and which of them it marks isSecret (tokens, passwords).
      environmentVariables: env.map((v) => v.name),
      secretEnvironmentVariables: env.filter((v) => v.isSecret === true).map((v) => v.name),
      facts,
    });
  }
  const remotes = (s.remotes ?? [])
    .filter((r) => r?.type && r?.url)
    .map((r) => {
      const variables = r.variables && typeof r.variables === "object" ? Object.entries(r.variables) : [];
      return {
        type: r.type,
        url: r.url,
        // Header names the entry declares for the remote, and which are secret.
        headers: (r.headers ?? []).filter((h) => typeof h?.name === "string").map((h) => h.name),
        secretHeaders: (r.headers ?? []).filter((h) => typeof h?.name === "string" && h.isSecret === true).map((h) => h.name),
        // {name} placeholders in the URL, and which the entry marks secret:
        // a secret here travels inside the URL itself.
        urlVariables: variables.map(([name]) => name),
        secretUrlVariables: variables.filter(([, v]) => v?.isSecret === true).map(([name]) => name),
      };
    });

  // Evidence check: every match's text (and any qualifying context word)
  // must be in the field it names.
  const fieldText = fieldsOf(s);
  for (const m of matches) {
    if (!fieldText[m.field].includes(m.text) || (m.context && !fieldText[m.context.field].includes(m.context.text))) {
      console.error(`${s.name}: match "${m.term}" is not supported by the field it names — refusing to write.`);
      process.exit(1);
    }
  }

  servers.push({
    slug: slugOf(s.name),
    name: s.name,
    namespace: s.name.split("/")[0],
    title: s.title ?? null,
    description: s.description ?? "",
    version: s.version,
    versionRule,
    status: official.status ?? null,
    statusMessage: official.statusMessage ?? null,
    publishedOn: day(official.publishedAt),
    updatedOn: day(official.updatedAt),
    packages,
    remotes,
    repositoryUrl: s.repository?.url ?? null,
    repositorySource: s.repository?.source ?? null,
    repositorySubfolder: s.repository?.subfolder ?? null,
    websiteUrl: s.websiteUrl ?? null,
    registryEntryUrl: `${REGISTRY}/v0.1/servers/${encodeURIComponent(s.name)}/versions/${encodeURIComponent(s.version)}`,
    matches,
    sources: sourceKeys,
    group: vendorKeys.length === 0 ? "general" : vendorKeys.length === 1 ? vendorKeys[0] : "several",
    ...publisherFor(s.name, vendorKeys),
  });
}

// Case-insensitive code-point order, so the file sorts the same on every
// machine (localeCompare follows the runtime's locale data).
const byNameOrder = (a, b) => {
  const x = a.name.toLowerCase();
  const y = b.name.toLowerCase();
  return x < y ? -1 : x > y ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
};
servers.sort(byNameOrder);

// This site's own server (mcp/package.json) is checked, never listed from
// the registry: is any entry for it, and does npm have the package?
const SITE_PACKAGE = JSON.parse(readFileSync("mcp/package.json", "utf8")).name;
const siteEntries = latest
  .map(({ entry }) => entry.server)
  .filter((s) => /aifitnessapi/i.test(s.name) || (s.packages ?? []).some((p) => p?.identifier === SITE_PACKAGE));
const siteNpm = await packageFacts({ registryType: "npm", identifier: SITE_PACKAGE });
const siteServer = {
  package: SITE_PACKAGE,
  registryNames: siteEntries.map((s) => s.name),
  onNpm: Boolean(siteNpm?.found),
  npmVersion: siteNpm?.found ? siteNpm.latestVersion : null,
};
{
  const slugs = new Set();
  for (const s of servers) {
    if (!s.slug || slugs.has(s.slug)) {
      console.error(`Duplicate or empty anchor slug "${s.slug}" for ${s.name}; refusing to write.`);
      process.exit(1);
    }
    slugs.add(s.slug);
  }
}

if (servers.length < EXPECTED_MIN_SERVERS) {
  console.error(
    `Short read: ${servers.length} servers in scope, below the floor of ${EXPECTED_MIN_SERVERS}. ` +
      "Refusing to write; the existing file is untouched.",
  );
  process.exit(1);
}
for (const name of Object.keys(EXCLUDED)) {
  if (!excludedSeen.some((x) => x.name === name)) {
    console.log(`note: EXCLUDED names ${name}, which no term matched this run (or is no longer listed).`);
  }
}

// ── 5. Write ─────────────────────────────────────────────────────────────

const GROUPS = [
  ...SOURCES.filter((s) => s.key !== "general").map((s) => ({ key: s.key, label: s.label, kind: s.kind })),
  { key: "several", label: "Several sources", kind: "several" },
  { key: "general", label: SOURCE_BY_KEY.get("general").label, kind: "general" },
];
const TERMS = SOURCES.map((s) => ({
  source: s.key,
  terms: s.terms.map(([label, re]) => ({ label, pattern: re.source })),
  needsContext: Boolean(s.needsContext),
  domains: s.domains,
}));
const scan = {
  pages: pages.length,
  entries: entries.length,
  uniqueNames: byName.size,
  duplicateNames,
  matched: inScope.length + excludedSeen.length,
  excluded: excludedSeen.length,
  contextDropped: new Set(contextDropped.map((d) => d.name)).size,
  inScope: servers.length,
  npmLookups,
  pypiLookups,
};

const payload = JSON.stringify(servers, null, 2);
const content = `/**
 * MCP servers for health and fitness data, from the official MCP Registry.
 *
 * GENERATED — do not hand-edit. Produced by scripts/fetch-mcp-health-servers.mjs
 * from every page of the registry's v0.1 listing (version=latest) and, for the
 * npm and PyPI packages the in-scope entries name, the npm registry and PyPI;
 * refreshed by .github/workflows/mcp-health-servers.yml.
 *
 * A server is here because a term in MCP_SERVER_TERMS matched its registry
 * name, title or description on a word boundary; \`matches\` keeps the field
 * and the exact text. \`publisherIsVendor\` is true only when the registry
 * namespace is the reverse-DNS form of a vendor domain this site already
 * cites, and \`publisherEvidence\` says which. Repositories were not read:
 * \`repositoryUrl\` is exactly what the entry lists. Package facts are null
 * for package types other than npm and PyPI.
 */

export type McpPackageFacts = {
  registry: "npm" | "pypi";
  /** The package's page on npmjs.com or pypi.org. */
  url: string;
  /** False when the registry answered 404 for the identifier the entry lists. */
  found: boolean;
  /** Null when the package exists but its registry names no latest version. */
  latestVersion?: string | null;
  /** YYYY-MM-DD the latest version was published. */
  lastPublished?: string | null;
  license?: string | null;
  licenseEvidence?: string | null;
  deprecated?: string | null;
};

export type McpPackage = {
  registryType: string;
  registryBaseUrl: string | null;
  identifier: string;
  /** The package version the registry entry pins. */
  version: string | null;
  /** stdio, streamable-http or sse, as the entry states it. */
  transport: string | null;
  runtimeHint: string | null;
  /** Environment variable names the entry declares (never values). */
  environmentVariables: string[];
  /** The subset the entry marks isSecret. */
  secretEnvironmentVariables: string[];
  facts: McpPackageFacts | null;
};

export type McpRemote = {
  type: string;
  /** The URL as listed; may contain {template} variables. */
  url: string;
  /** Header names the entry declares (never values). */
  headers: string[];
  /** The subset the entry marks isSecret. */
  secretHeaders: string[];
  /** {name} placeholders the URL carries (never values). */
  urlVariables: string[];
  /** The subset the entry marks isSecret — a secret that travels inside the URL. */
  secretUrlVariables: string[];
};

export type McpMatch = {
  /** A key of MCP_SERVER_GROUPS (never "several"). */
  source: string;
  term: string;
  field: "name" | "title" | "description";
  /** The exact text the term matched in that field (the name is read with separators as spaces). */
  text: string;
  /** For an ambiguous vendor name, the health or fitness word that qualified it, and where. */
  context: { field: "name" | "title" | "description"; text: string } | null;
};

export type McpHealthServer = {
  /** Row anchor on /health-mcp-servers: #server-<slug>. */
  slug: string;
  /** Registry name, namespace/server. */
  name: string;
  namespace: string;
  title: string | null;
  /** The registry description, verbatim. */
  description: string;
  version: string;
  /** Which rule chose this version when a name appeared more than once. */
  versionRule: "registry isLatest" | "only version listed" | "highest version";
  status: "active" | "deprecated" | "deleted" | null;
  statusMessage: string | null;
  /** The registry's publishedAt / updatedAt for this version's record, as YYYY-MM-DD. */
  publishedOn: string | null;
  updatedOn: string | null;
  packages: McpPackage[];
  remotes: McpRemote[];
  repositoryUrl: string | null;
  repositorySource: string | null;
  repositorySubfolder: string | null;
  websiteUrl: string | null;
  /** The registry API record this row was read from. */
  registryEntryUrl: string;
  matches: McpMatch[];
  /** Every source key a match named, "general" included. */
  sources: string[];
  /** The one group the row is rendered under: a vendor key, "several" or "general". */
  group: string;
  publisherIsVendor: boolean;
  publisherEvidence: string | null;
};

/** The date the registry was read for this file (UTC). */
export const MCP_SERVERS_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** The generator's floor for the in-scope count; it refuses to write fewer. */
export const MCP_SERVERS_EXPECTED_MIN = ${EXPECTED_MIN_SERVERS};

/** What the run read and kept. */
export const MCP_REGISTRY_SCAN = ${JSON.stringify(scan, null, 2)};

/** This site's own server (mcp/package.json), looked up in the same run: registry entries naming it, and npm. */
export const MCP_SITE_SERVER_CHECK = ${JSON.stringify(siteServer, null, 2)};

export const MCP_SERVERS_SOURCES = ${JSON.stringify(SOURCES_DOC, null, 2)};

/** Groups in page order. A group's order is not a ranking of its servers. */
export const MCP_SERVER_GROUPS: { key: string; label: string; kind: string }[] = ${JSON.stringify(GROUPS, null, 2)};

/**
 * The terms the filter used, as regular-expression sources, with each source's
 * vendor domains (the only namespaces that can make a server official).
 */
export const MCP_SERVER_TERMS: { source: string; terms: { label: string; pattern: string }[]; needsContext: boolean; domains: string[] }[] = ${JSON.stringify(TERMS, null, 2)};

/** Entries a term matched in a sense that is not health or fitness data. */
export const MCP_SERVERS_EXCLUDED: { name: string; reason: string; matched: string[] }[] = ${JSON.stringify(excludedSeen, null, 2)};

/** Ambiguous vendor names (Polar, Terra, Junction, Vital) found with no health or fitness word in the entry. */
export const MCP_SERVERS_CONTEXT_DROPPED: { name: string; term: string; field: string; text: string }[] = ${JSON.stringify(
    contextDropped.sort(byNameOrder),
    null,
    2,
  )};

export const MCP_HEALTH_SERVERS: McpHealthServer[] = ${payload};
`;

// The stamp moves on every run by construction, so it is left out of "did
// anything change": a run that read the same facts again only rewrites the
// file once the stamp is a week old.
const STAMP = /export const MCP_SERVERS_FETCHED_ON = "(\d{4}-\d{2}-\d{2})";/;
const withoutStamp = (text) => text.replace(STAMP, "");
if (existsSync(OUT)) {
  const prev = readFileSync(OUT, "utf8");
  const previousFetchedOn = STAMP.exec(prev)?.[1] ?? null;
  const ageDays = previousFetchedOn ? Math.round((Date.parse(fetchedOn) - Date.parse(previousFetchedOn)) / 86400000) : Infinity;
  if (withoutStamp(prev) === withoutStamp(content) && ageDays < STALE_AFTER_DAYS) {
    console.log(`Nothing changed and the stamp is ${ageDays}d old — leaving ${OUT} untouched.`);
    process.exit(0);
  }
}
writeFileSync(OUT, content);

console.log(
  `wrote ${OUT}: ${servers.length} servers in scope from ${entries.length} latest-version entries ` +
    `(${pages.length} pages, ${byName.size} names, ${duplicateNames} duplicated); ` +
    `${scan.matched} matched a term, ${excludedSeen.length} excluded; ` +
    `${servers.filter((s) => s.publisherIsVendor).length} under a vendor's own namespace; ` +
    `${npmLookups} npm and ${pypiLookups} PyPI lookups` +
    (OFFLINE ? " [offline]" : ""),
);
