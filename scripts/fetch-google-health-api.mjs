#!/usr/bin/env node
/**
 * Regenerate src/data/googleHealthApi.ts from Google's own documentation of
 * the Google Health API (the Fitbit Web API's successor).
 *
 * Two kinds of source are read:
 *
 *   1. The API's discovery documents — health.googleapis.com/$discovery/rest
 *      for ?version=v4 and ?version=v4beta. They carry the revision, every
 *      method (HTTP verb, path template, description, accepted scopes,
 *      parameters), the OAuth scopes with their consent text, and every
 *      schema: the DataPoint union (one property per data type), each data
 *      type's own schema, and the RollupDataPoint / DailyRollupDataPoint
 *      unions that say which *RollupValue a rollup of a type returns.
 *   2. Google's developer guide at developers.google.com/health — the
 *      data-types table (the master list: display name, dataType id, filter
 *      parameter, record type, storage resolution, webhook and true-zero
 *      badges, compatible devices, available operations, scopes, the v4beta
 *      tag), the Scopes page, the Fitbit migration API specifications (scope
 *      and data-type mapping tables, calculations, endpoint mappings), About,
 *      the migration overview, rate limits, app verification, webhooks, the
 *      v4 error catalog, troubleshooting, the release notes and the endpoints
 *      guide. Prose sections are copied verbatim as blocks, and only the
 *      sections the pages render: each is named below, and a named section
 *      that disappears fails the run rather than leaving a page quietly
 *      shorter.
 *
 * There is no model in this loop. Every published field is copied from one
 * of those sources. The derived fields keep the text they came from:
 *
 *   scope URL — Google's tables print scopes as ".family.readonly"; the URL
 *       is the prefix the Scopes page states ("All Google Health API scopes
 *       begin with: …") plus that suffix. The sentence ships in
 *       GHAPI_SCOPE_PREFIX_EVIDENCE.
 *   dataPointProperty — the DataPoint property whose description names the
 *       type ("Data for points in the `heart-rate` sample data type
 *       collection."); that description is stored beside it, and it must
 *       also satisfy the rule DataPoint.name states (the dataType id is the
 *       kebab-case of the field name) or the run fails.
 *   rollup / dailyRollup — the RollupDataPoint / DailyRollupDataPoint
 *       property whose description says it is "Returned by default when
 *       rolling up data points from the `<id>` data type"; that description
 *       is stored beside it.
 *   operation → method — the table prints "rollup", the discovery document
 *       names the method "rollUp": matched case-insensitively, recorded as
 *       such. The table's "update" has no method of that name; it is paired
 *       with patch only because Google's own endpoint-mapping table maps
 *       "CREATE & UPDATE Logs" to the patch method, and both texts travel
 *       with the pairing (and a flag says so).
 *   required — true only where Google's field description opens with
 *       "Required."; the label word is kept, and the description is verbatim.
 *   dates — the About timeline and the release-note headings print dates
 *       in words; the ISO date sits beside the printed text.
 *
 * Disagreements between Google's own pages are published as flags (kind,
 * summary, and the verbatim texts that disagree), never corrected here:
 * scopes the discovery document defines that the Scopes page does not list
 * (and the reverse), mapping-table types missing from the data-types table,
 * table types with no v4 DataPoint property, table operations versus
 * discovery methods, rollups the discovery document names that the table
 * does not list, and webhook support as the release notes, the data-types
 * badges and the webhooks page each state it.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node scripts/fetch-google-health-api.mjs [--offline]
 *   --offline reparses the cache in .cache/google-health-api without
 *   refetching. Node's built-in fetch ignores HTTPS_PROXY; behind a proxy
 *   run it with NODE_USE_ENV_PROXY=1 (Node >= 22.21).
 *
 * The cache keeps each guide page trimmed to its <article> through the
 * content footer (where "Last updated" and the licence line live), and each
 * discovery document as served. The fetch date of every cached file is kept
 * in .cache/google-health-api/meta.json, so an --offline reparse publishes
 * the date the bytes were actually fetched, not the date the script ran.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DOCS = "https://developers.google.com/health";
const DISCOVERY = "https://health.googleapis.com/$discovery/rest";
const CACHE = ".cache/google-health-api";
const META = join(CACHE, "meta.json");
const OUT = "src/data/googleHealthApi.ts";
const OFFLINE = process.argv.includes("--offline");

// Floors. Google's data-types table listed 44 data types on 2026-10-17
// (page "Last updated 2026-10-06"); the Scopes page documented 18 scopes;
// the API-specifications page mapped 32 Fitbit Web API data types (floor 30);
// the v4 discovery document (revision 20261014) held 151 schemas (floor 140)
// and 9 users.dataTypes.dataPoints methods. Every read so far has only added
// rows, so fewer almost certainly means the parse dropped some. Raise a floor
// after a verified read; lower one only after checking on Google's page that
// a row really was removed — never to get a write through.
const EXPECTED_MIN_DATA_TYPES = 44;
const EXPECTED_MIN_DOCUMENTED_SCOPES = 18;
const EXPECTED_MIN_MAPPING_ROWS = 30;
const EXPECTED_MIN_SCHEMAS = 140;
const EXPECTED_MIN_DATAPOINT_METHODS = 9;
// Secondary floors from the same 2026-10-17 read: 15 scope-mapping rows, 62
// error-catalog reasons, 8 dated release-note entries, 3 rate-limit rows,
// 28 webhook-supported types, 2 timeline dates on the About page.
const EXPECTED_MIN_SCOPE_MAPPING_ROWS = 15;
const EXPECTED_MIN_ERRORS = 60;
const EXPECTED_MIN_RELEASES = 8;
const EXPECTED_MIN_RATE_LIMITS = 3;
const EXPECTED_MIN_WEBHOOK_TYPES = 28;

/**
 * Every source, in the order the generated file lists them. `sections` names
 * the heading ids each page's renderers quote; the run fails if one is gone.
 */
const SOURCES = [
  { key: "discoveryV4", file: "discovery-v4.json", url: `${DISCOVERY}?version=v4`, kind: "json", title: "Google Health API discovery document (v4)" },
  { key: "discoveryV4beta", file: "discovery-v4beta.json", url: `${DISCOVERY}?version=v4beta`, kind: "json", title: "Google Health API discovery document (v4beta)" },
  { key: "dataTypes", file: "data-types.html", url: `${DOCS}/data-types`, kind: "html", title: "Google Health API data types",
    sections: ["data-type-fields", "query_constraints", "daily-versus-interval-data-types", "data_availability", "third-party_access", "data-quality-and-validity-filtering", "variable_day_lengths", "daylight_savings_time", "travel"] },
  { key: "scopes", file: "scopes.html", url: `${DOCS}/scopes`, kind: "html", title: "Scopes", sections: ["implementation"] },
  { key: "apiSpecifications", file: "api-specifications.html", url: `${DOCS}/migration/api-specifications`, kind: "html", title: "API specifications (Fitbit Web API migration)",
    sections: ["scopes", "scope_mappings", "data-types", "calculations", "oxygen-saturation-filtering", "activity-thresholds", "sedentary-sleep", "body-mass-index", "basal-metabolic-rate", "tdee", "endpoints", "endpoint_mappings"] },
  { key: "about", file: "about.html", url: `${DOCS}/about`, kind: "html", title: "About the Google Health API",
    sections: ["what-you-get", "what-about-fitbit", "device-support", "feedback", "roadmap", "q4_2026"] },
  { key: "migration", file: "migration.html", url: `${DOCS}/migration`, kind: "html", title: "Fitbit Web API migration overview",
    sections: ["why-migrate", "support_both_login_methods", "ensure-data-continuity", "handle-http-412", "backfill-historical-data", "communication_and_timing", "value-first_communication", "when_to_notify_users"] },
  { key: "rateLimits", file: "rate-limits.html", url: `${DOCS}/rate-limits`, kind: "html", title: "Quotas and rate limits",
    sections: ["handle_rate_limit_errors", "default_limits_and_impact_analysis", "request_a_quota_increase"] },
  { key: "appVerification", file: "app-verification.html", url: `${DOCS}/app-verification`, kind: "html", title: "App verification",
    sections: ["oauth_app_verification", "in-app_disclosure_requirements", "security_assessment_casa", "escalations"] },
  { key: "webhooks", file: "webhooks.html", url: `${DOCS}/webhooks`, kind: "html", title: "Webhook subscriptions",
    sections: ["supported-data-types", "notifications_scopes", "service-accounts", "cpe_roles", "manage_subscribers", "create_a_subscriber", "list_subscribers", "update_a_subscriber", "delete_a_subscriber", "endpoint_verification", "key_rotation", "user_subscriptions", "automatic_subscriptions", "manual_subscriptions", "notifications", "notification-format", "user-id-mapping", "time-intervals", "dataTypeTokens", "aggregation-of-updates", "respond_to_a_notification", "best-practices", "signature_verification", "how_to_verify_the_signature", "subscriber_status_and_recovery", "common_errors"] },
  { key: "errors", file: "errors.html", url: `${DOCS}/reference/rest/v4/errors`, kind: "html", title: "Google Health API v4 error catalog", sections: ["error-codes"] },
  { key: "troubleshooting", file: "troubleshooting.html", url: `${DOCS}/troubleshooting`, kind: "html", title: "Troubleshooting",
    sections: ["4xx-client-errors", "400-bad-request", "401_unauthorized", "403_forbidden", "404-not-found", "412-precondition-failed", "retrieve_a_fitbit_user_id", "revoke-consent", "device-sync-delays"] },
  { key: "releaseNotes", file: "release-notes.html", url: `${DOCS}/release-notes`, kind: "html", title: "Release notes", sections: [] },
  { key: "endpoints", file: "endpoints.html", url: `${DOCS}/endpoints`, kind: "html", title: "Endpoints",
    sections: ["rest_api_conventions", "headers", "get-user-id", "get-intraday", "get-reconciled-view", "filter-data", "filter-by-data-source", "filter-and-aggregate-by-data-source", "supported_data_source_families", "aggregate", "aggregate-by-day", "rollup-alignment", "rollup-window-storage-resolution", "update", "when-to-use-datapoint-name", "delete", "find-device-information", "query-historical-data", "phased-data-sync-hot-versus-cold-load", "query-chunking-for-aggregation", "leverage-pre-aggregated-roll-ups", "resilient-error-handling-smart-retries"] },
];

mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
const problems = [];

function trimPage(html) {
  const a = html.indexOf("<article");
  const footEnd = html.indexOf("</devsite-content-footer>");
  if (a < 0 || footEnd < 0) return html;
  return html.slice(a, footEnd + "</devsite-content-footer>".length);
}

async function getSource(src) {
  const path = join(CACHE, src.file);
  if (existsSync(path)) return readFileSync(path, "utf8");
  if (OFFLINE) throw new Error(`offline and ${path} is not cached`);
  // Without an explicit language devsite may serve a machine-translated page,
  // and the parse is anchored on Google's English captions and headings.
  const url = src.kind === "html" ? `${src.url}${src.url.includes("?") ? "&" : "?"}hl=en` : src.url;
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" },
      });
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      let body = await res.text();
      if (src.kind === "html") {
        body = trimPage(body);
        if (/devsite-banner-translated/.test(body)) throw new Error(`translated page served for ${url}`);
      } else {
        JSON.parse(body); // refuse to cache a body that is not JSON
      }
      writeFileSync(path, body);
      meta[src.file] = { url, fetchedOn: new Date().toISOString().slice(0, 10) };
      writeFileSync(META, JSON.stringify(meta, null, 2));
      await new Promise((r) => setTimeout(r, 200));
      return body;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

// ---------------------------------------------------------------------------
// A small HTML tree builder — devsite serves well-formed markup, and the
// pages are read for structure (tables, lists, headings), not by regex.
// ---------------------------------------------------------------------------

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

function parseAttrs(s) {
  const out = {};
  for (const m of s.matchAll(/([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return out;
}

function parseHtml(html) {
  const src = html.replace(/<!--[\s\S]*?-->/g, "");
  const root = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/g;
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    if (m.index > last) stack[stack.length - 1].children.push(src.slice(last, m.index));
    last = re.lastIndex;
    const [, close, tagRaw, attrStr, selfClose] = m;
    const tag = tagRaw.toLowerCase();
    if (close) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) {
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const node = { tag, attrs: parseAttrs(attrStr), children: [] };
    stack[stack.length - 1].children.push(node);
    if (tag === "script" || tag === "style") {
      const end = src.toLowerCase().indexOf(`</${tag}`, last);
      last = end < 0 ? src.length : end;
      re.lastIndex = last;
      continue;
    }
    if (!VOID.has(tag) && !selfClose) stack.push(node);
  }
  if (last < src.length) stack[stack.length - 1].children.push(src.slice(last));
  return root;
}

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rarr: "→", larr: "←", ndash: "–", mdash: "—",
  hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", times: "×", le: "≤", ge: "≥", middot: "·", copy: "©",
};
function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z][a-z0-9]*);/gi, (m, n) => {
      if (n in ENTITIES) return ENTITIES[n];
      problems.push(`unknown HTML entity ${m} — add it to ENTITIES rather than publishing it raw`);
      return m;
    });
}

const hasClass = (n, c) => typeof n === "object" && (n.attrs.class ?? "").split(/\s+/).includes(c);

function find(node, pred, out = []) {
  if (typeof node !== "object") return out;
  if (pred(node)) out.push(node);
  for (const c of node.children) find(c, pred, out);
  return out;
}
const findOne = (node, pred) => find(node, pred)[0] ?? null;

const INLINE_BREAK = new Set(["li", "p", "div", "ul", "ol", "table", "tr", "section", "aside", "blockquote", "pre", "h1", "h2", "h3", "h4", "h5", "h6"]);

/** Inline text: tags dropped, code spans in backticks, <br> as a newline,
 *  other whitespace (source line wrapping included) collapsed. */
function inline(node, inCode = false) {
  if (typeof node === "string") return decode(node.replace(/\s+/g, " "));
  if (node.tag === "br") return "\n";
  if (["script", "style", "devsite-feedback"].includes(node.tag)) return "";
  const inner = node.children.map((c) => inline(c, inCode || node.tag === "code")).join("");
  if (node.tag === "code" && !inCode) return inner.trim() ? `\`${inner.replace(/\s+/g, " ").trim()}\`` : "";
  // Block-level elements read inline (a list inside a table cell, a <p>
  // inside a <li>) start and end a line, so their items do not run together.
  if (INLINE_BREAK.has(node.tag)) return `\n${inner}\n`;
  return inner;
}
function clean(s) {
  return s
    .split("\n")
    .map((l) => l.replace(/[ \t\r\f\v ]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    // A space the markup put between a code span or link and the punctuation
    // after it ("`steps` .") is source formatting, not text.
    .replace(/ +([.,;:!?])/g, "$1");
}
const text = (node) => clean(inline(node));
/** Code text: whitespace kept, tags dropped. */
function codeText(node) {
  if (typeof node === "string") return decode(node);
  if (node.tag === "br") return "\n";
  return node.children.map(codeText).join("");
}

// ---------------------------------------------------------------------------
// Blocks and sections — the verbatim prose of a guide page.
// ---------------------------------------------------------------------------

const BLOCK_TAGS = new Set(["p", "ul", "ol", "table", "aside", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "div", "section", "devsite-code", "devsite-selector", "devsite-filter", "devsite-expandable", "blockquote", "dl", "figure"]);

function listBlock(node) {
  const items = [];
  for (const li of node.children.filter((c) => typeof c === "object" && c.tag === "li")) {
    const own = { ...li, children: li.children.filter((c) => !(typeof c === "object" && (c.tag === "ul" || c.tag === "ol"))) };
    const sub = li.children
      .filter((c) => typeof c === "object" && (c.tag === "ul" || c.tag === "ol"))
      .flatMap((l) => listBlock(l).items.map((i) => (i.sub?.length ? `${i.text} ${i.sub.join(" ")}` : i.text)));
    // A <li> may wrap block children (paragraphs); read them as one run.
    const t = text(own);
    items.push(sub.length ? { text: t, sub } : { text: t });
  }
  return { kind: "list", ordered: node.tag === "ol", items };
}

function tableBlock(node) {
  const caption = findOne(node, (n) => n.tag === "caption");
  const rows = find(node, (n) => n.tag === "tr");
  const head = [];
  const body = [];
  for (const tr of rows) {
    const cells = tr.children.filter((c) => typeof c === "object" && (c.tag === "td" || c.tag === "th"));
    if (!cells.length) continue;
    if (cells.every((c) => c.tag === "th")) head.push(...cells.map(text));
    else body.push(cells.map((c) => (findOne(c, (n) => n.tag === "pre") ? clean(codeText(c)) : text(c))));
  }
  return { kind: "table", caption: caption ? text(caption) : null, head, rows: body };
}

function blocksOf(container) {
  const out = [];
  let pending = [];
  const flush = () => {
    const t = clean(pending.map((p) => inline(p)).join(""));
    if (t) out.push({ kind: "p", text: t });
    pending = [];
  };
  for (const c of container.children) {
    if (typeof c === "string" || !BLOCK_TAGS.has(c.tag)) {
      pending.push(c);
      continue;
    }
    flush();
    if (/^h[1-6]$/.test(c.tag)) out.push({ kind: "heading", level: Number(c.tag[1]), id: c.attrs.id ?? null, text: text(c) });
    else if (c.tag === "p") {
      if (c.children.some((k) => typeof k === "object" && BLOCK_TAGS.has(k.tag) && k.tag !== "p")) out.push(...blocksOf(c));
      else {
        const t = text(c);
        if (t) out.push({ kind: "p", text: t });
      }
    } else if (c.tag === "ul" || c.tag === "ol") out.push(listBlock(c));
    else if (c.tag === "table") out.push(tableBlock(c));
    else if (c.tag === "aside" || c.tag === "blockquote") out.push({ kind: "note", variant: (c.attrs.class ?? c.tag).split(/\s+/)[0], text: text(c) });
    else if (c.tag === "pre") out.push({ kind: "code", text: codeText(c).replace(/\s+$/, "") });
    else if (hasClass(c, "ds-selector-tabs") || c.tag === "devsite-selector") {
      // Tabbed examples ("Request" / "Response"): each tab's heading is a
      // label on the code under it, not a section of the page.
      for (const tab of c.children.filter((k) => typeof k === "object")) {
        const h = tab.children.find((k) => typeof k === "object" && /^h[1-6]$/.test(k.tag));
        if (h) out.push({ kind: "label", text: text(h) });
        out.push(...blocksOf({ ...tab, children: tab.children.filter((k) => k !== h) }));
      }
    } else out.push(...blocksOf(c));
  }
  flush();
  return out;
}

/** The article body as sections: one per h2/h3/h4, with the blocks under it. */
function sectionsOf(articleRoot) {
  const body = findOne(articleRoot, (n) => hasClass(n, "devsite-article-body"));
  if (!body) return null;
  const sections = [{ id: null, heading: null, level: 1, blocks: [] }];
  for (const b of blocksOf(body)) {
    if (b.kind === "heading" && b.level >= 2 && b.level <= 4) sections.push({ id: b.id, heading: b.text, level: b.level, blocks: [] });
    else if (b.kind !== "heading" || b.level > 4) sections[sections.length - 1].blocks.push(b.kind === "heading" ? { kind: "p", text: b.text } : b);
  }
  return sections;
}

function pageFacts(html) {
  const root = parseHtml(html);
  const h1 = findOne(root, (n) => n.tag === "h1" && hasClass(n, "devsite-page-title"));
  const footer = findOne(root, (n) => n.tag === "devsite-content-footer");
  const footerText = footer ? text(footer) : "";
  return {
    root,
    // The h1's own text only: devsite nests a bookmark button ("Stay
    // organized with collections …") inside it.
    title: h1 ? clean(h1.children.filter((c) => typeof c === "string").map((c) => inline(c)).join(" ")) : null,
    lastUpdated: (html.match(/Last updated (\d{4}-\d{2}-\d{2}) UTC/) ?? [])[1] ?? null,
    license: (footerText.match(/Except as otherwise noted[\s\S]*?Apache 2\.0 License\./) ?? [])[0]?.replace(/\s+/g, " ").trim() ?? null,
    sections: sectionsOf(root),
  };
}

/** Sections by id, in page order, keeping only the ones a renderer quotes. */
function pickSections(key, facts, ids) {
  const out = [];
  for (const id of ids) {
    const s = facts.sections?.find((x) => x.id === id);
    if (!s) problems.push(`${key}: section #${id} is gone from Google's page — check the page and the renderer that quotes it`);
    else out.push(s);
  }
  return out;
}

const blocksText = (blocks) =>
  blocks
    .map((b) =>
      b.kind === "list"
        ? b.items.map((i) => [i.text, ...(i.sub ?? [])].join(" ")).join(" ")
        : b.kind === "table"
          ? [b.caption ?? "", ...b.head, ...b.rows.flat()].join(" ")
          : b.text,
    )
    .join(" ");

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function isoFromWords(s) {
  const m = s.match(/\b([A-Z][a-z]+) (\d{1,2}), (\d{4})\b/);
  if (!m) return null;
  const mo = MONTHS.indexOf(m[1].toLowerCase());
  if (mo < 0) return null;
  return `${m[3]}-${String(mo + 1).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Read every source.
// ---------------------------------------------------------------------------

const raw = {};
for (const s of SOURCES) raw[s.key] = await getSource(s);

const disc = JSON.parse(raw.discoveryV4);
const discBeta = JSON.parse(raw.discoveryV4beta);
const facts = {};
for (const s of SOURCES.filter((x) => x.kind === "html")) facts[s.key] = pageFacts(raw[s.key]);
for (const s of SOURCES.filter((x) => x.kind === "html")) {
  if (!facts[s.key].sections) problems.push(`${s.key}: no devsite-article-body found`);
  if (!facts[s.key].lastUpdated) problems.push(`${s.key}: no "Last updated" date in the page footer`);
}

const sourceMeta = SOURCES.map((s) => ({
  key: s.key,
  title: s.kind === "html" ? (facts[s.key].title ?? s.title) : s.title,
  url: s.url,
  fetchedOn: meta[s.file]?.fetchedOn ?? new Date().toISOString().slice(0, 10),
  lastUpdated: s.kind === "html" ? facts[s.key].lastUpdated : null,
  revision: s.kind === "json" ? (s.key === "discoveryV4" ? disc.revision : discBeta.revision) : null,
  license: s.kind === "html" ? facts[s.key].license : null,
}));

// ---------------------------------------------------------------------------
// 1. The Scopes page: the prefix sentence and the documented scope table.
// ---------------------------------------------------------------------------

const scopesRoot = facts.scopes.root;
const scopesBody = findOne(scopesRoot, (n) => hasClass(n, "devsite-article-body"));
const scopesBlocks = scopesBody ? blocksOf(scopesBody) : [];
const prefixAt = scopesBlocks.findIndex((b) => b.kind === "p" && /All Google Health API scopes begin with:?$/.test(b.text));
const prefixBlock = prefixAt >= 0 ? scopesBlocks.slice(prefixAt + 1).find((b) => b.kind === "code" || b.kind === "p") : null;
const SCOPE_PREFIX = prefixBlock ? prefixBlock.text.replace(/`/g, "").trim() : null;
if (!SCOPE_PREFIX || !/^https:\/\/www\.googleapis\.com\/auth\/[a-z]+$/.test(SCOPE_PREFIX)) {
  problems.push(`Scopes page: could not read the scope prefix after "All Google Health API scopes begin with" (got ${JSON.stringify(SCOPE_PREFIX)})`);
}
const SCOPE_PREFIX_EVIDENCE = prefixAt >= 0 ? `${scopesBlocks[prefixAt].text} ${SCOPE_PREFIX}` : null;
const scopeUrl = (shorthand) => `${SCOPE_PREFIX}${shorthand}`;

const discScopes = disc.auth?.oauth2?.scopes ?? {};
const discBetaScopes = discBeta.auth?.oauth2?.scopes ?? {};

const documentedScopes = [];
{
  const table = findOne(scopesRoot, (n) => n.tag === "table" && /Table: Google Health API scopes/.test(text(n)));
  if (!table) problems.push("Scopes page: the table captioned \"Table: Google Health API scopes\" is gone");
  let family = null;
  for (const tr of table ? find(table, (n) => n.tag === "tr") : []) {
    const tds = tr.children.filter((c) => typeof c === "object" && c.tag === "td");
    if (tr.attrs.id) family = tr.attrs.id;
    if (tds.length !== 2) continue;
    const shorthand = text(tds[0]).replace(/`/g, "");
    if (!/^\.[a-z_]+\.(readonly|writeonly)$/.test(shorthand)) {
      problems.push(`Scopes page: unexpected scope cell ${JSON.stringify(shorthand)}`);
      continue;
    }
    const url = scopeUrl(shorthand);
    documentedScopes.push({
      shorthand,
      url,
      family: shorthand.replace(/^\./, "").replace(/\.(readonly|writeonly)$/, ""),
      familyAnchor: family,
      access: shorthand.endsWith(".readonly") ? "read" : "write",
      permission: text(tds[1]),
      inDiscoveryV4: url in discScopes,
      discoveryDescription: discScopes[url]?.description ?? null,
    });
  }
}

const discoveryScopes = Object.entries(discScopes).map(([url, v]) => ({
  url,
  description: v.description ?? null,
  googleHealth: url.startsWith(`${SCOPE_PREFIX}.`),
  shorthand: url.startsWith(`${SCOPE_PREFIX}.`) ? url.slice(SCOPE_PREFIX.length) : null,
  onScopesPage: documentedScopes.some((d) => d.url === url),
  inV4beta: url in discBetaScopes,
}));

// ---------------------------------------------------------------------------
// 2. The discovery document: methods, schemas, the DataPoint union.
// ---------------------------------------------------------------------------

const methods = [];
(function walk(resources, prefix) {
  for (const [rn, r] of Object.entries(resources ?? {})) {
    const res = prefix ? `${prefix}.${rn}` : rn;
    for (const [mn, m] of Object.entries(r.methods ?? {})) {
      methods.push({
        id: m.id ?? null,
        resource: res,
        name: mn,
        httpMethod: m.httpMethod ?? null,
        flatPath: m.flatPath ?? null,
        path: m.path ?? null,
        description: m.description ?? null,
        scopes: m.scopes ?? [],
        parameters: Object.entries(m.parameters ?? {}).map(([pn, p]) => ({
          name: pn,
          location: p.location ?? null,
          required: Boolean(p.required),
          type: p.type ?? null,
          description: p.description ?? null,
        })),
        request: m.request?.$ref ?? null,
        response: m.response?.$ref ?? null,
      });
    }
    walk(r.resources, res);
  }
})(disc.resources, "");
methods.sort((a, b) => a.resource.localeCompare(b.resource) || a.name.localeCompare(b.name));
const dpMethods = methods.filter((m) => m.resource === "users.dataTypes.dataPoints");

const LABELS = ["Required", "Optional", "Output only", "Identifier", "Immutable", "Input only"];
function fieldOf(name, p) {
  const desc = p.description ?? null;
  const label = desc ? (LABELS.find((l) => desc.startsWith(`${l}.`)) ?? null) : null;
  const items = p.items ?? null;
  const ref = p.$ref ?? null;
  const itemsRef = items?.$ref ?? null;
  const enumSrc = p.enum ? p : items?.enum ? items : null;
  const type = ref
    ? ref
    : p.type === "array"
      ? `array<${itemsRef ?? `${items?.type ?? "?"}${items?.format ? `/${items.format}` : ""}`}>`
      : `${p.type ?? "?"}${p.format ? `/${p.format}` : ""}`;
  return {
    name,
    type,
    ref,
    itemsRef,
    label,
    required: label === "Required",
    readOnly: Boolean(p.readOnly),
    description: desc,
    enum: enumSrc ? enumSrc.enum.map((v, i) => ({ value: v, description: enumSrc.enumDescriptions?.[i] ?? null })) : null,
  };
}
/** One copy of every schema a page shows, keyed by id (many types share
 *  ObservationTimeInterval, CivilDateTime and the rest). */
const SCHEMAS = {};
function registerSchema(schemas, source, id) {
  const s = schemas[id];
  if (!s) return null;
  SCHEMAS[id] ??= {
    id,
    source,
    description: s.description ?? null,
    // Required fields first, then by name — Google's property order is not
    // meaningful in the discovery document.
    fields: Object.entries(s.properties ?? {})
      .map(([k, v]) => fieldOf(k, v))
      .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name)),
  };
  return SCHEMAS[id];
}
/** A schema, plus the schemas its fields refer to, one level deep. */
function schemaOf(schemas, id, source = "v4") {
  const s = registerSchema(schemas, source, id);
  if (!s) return null;
  const nested = [];
  for (const f of s.fields) {
    const r = f.ref ?? f.itemsRef;
    if (!r || r === id || nested.includes(r)) continue;
    const child = registerSchema(schemas, source, r);
    if (child && child.fields.length) nested.push(r);
  }
  return { id, nested };
}

const DP = disc.schemas?.DataPoint?.properties ?? {};
const DP_BETA = discBeta.schemas?.DataPoint?.properties ?? {};
const DATAPOINT_RULE = (disc.schemas?.DataPoint?.properties?.name?.description?.match(/The `\{data_type\}` ID corresponds to[^.]*\.(?:[^.]*field\.)?/) ?? [])[0] ?? null;
if (!DATAPOINT_RULE) problems.push("DataPoint.name: the sentence stating how the {data_type} id maps to the DataPoint field is gone");
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();

/**
 * The DataPoint property for a dataType id. Two readings of Google's text,
 * which must agree: the property whose description names the id ("Data for
 * points in the `heart-rate` …"), and the rule DataPoint.name states (the id
 * is the kebab-case of the field name). Where a description names no id
 * (DataPoint.food: "Optional. The food details."), the rule alone decides,
 * and `match` says so.
 */
function dataPointFor(props, id) {
  const entries = Object.entries(props).filter(([p]) => !["name", "dataSource"].includes(p));
  const byDesc = entries.filter(([, v]) => new RegExp(`Data for points in the \`${id}\` `).test(v.description ?? ""));
  const byRule = entries.filter(([p]) => kebab(p) === id);
  if (byDesc.length > 1 || byRule.length > 1) return "ambiguous";
  if (byDesc.length && byRule.length && byDesc[0][0] !== byRule[0][0]) return "ambiguous";
  const hit = byDesc[0] ?? byRule[0];
  if (!hit) return null;
  return { property: hit[0], ref: hit[1].$ref ?? null, evidence: hit[1].description ?? null, match: byDesc.length ? "description" : "kebab-case rule" };
}
function rollupFor(props, id) {
  const hits = Object.entries(props).filter(([, v]) => new RegExp(`rolling up data points from the \`${id}\` data type`).test(v.description ?? ""));
  return hits.length === 1 ? { property: hits[0][0], ref: hits[0][1].$ref ?? null, evidence: hits[0][1].description } : hits.length > 1 ? "ambiguous" : null;
}

// ---------------------------------------------------------------------------
// 3. The data-types page: the master table and its key.
// ---------------------------------------------------------------------------

const dtRoot = facts.dataTypes.root;
const keyTable = findOne(dtRoot, (n) => n.tag === "table" && n.attrs.id === "table-data-type-key");
if (!keyTable) problems.push("data-types page: #table-data-type-key is gone");
const tableKey = [];
for (const tr of keyTable ? find(keyTable, (n) => n.tag === "tr") : []) {
  const tds = tr.children.filter((c) => typeof c === "object" && c.tag === "td");
  if (tds.length !== 2) continue;
  const list = findOne(tds[1], (n) => n.tag === "ul");
  const own = { ...tds[1], children: tds[1].children.filter((c) => c !== list) };
  tableKey.push({ field: text(tds[0]), description: text(own), items: list ? listBlock(list).items.map((i) => i.text) : [] });
}
const recordTypeDefs = {};
for (const it of tableKey.find((k) => /^Record type$/i.test(k.field))?.items ?? []) {
  const m = it.match(/^`([A-Za-z]+)` \((.*)\)$/);
  if (m) recordTypeDefs[m[1]] = m[2];
}

const mainTable = findOne(dtRoot, (n) => n.tag === "table" && n.attrs.id === "table-data-types");
if (!mainTable) throw new Error("data-types page: #table-data-types is gone — refusing to continue");
const tableRows = [];
for (const tr of find(mainTable, (n) => n.tag === "tr")) {
  const tds = tr.children.filter((c) => typeof c === "object" && c.tag === "td");
  if (tds.length < 3) continue;
  const [left, opsCell, scopeCell] = tds;
  const strong = findOne(left, (n) => n.tag === "strong");
  const nameLink = strong ? findOne(strong, (n) => n.tag === "a") : null;
  const name = text(nameLink ?? strong ?? left);
  const label = findOne(left, (n) => n.tag === "span" && hasClass(n, "devsite-label"));
  const divs = find(left, (n) => n.tag === "div");
  const divText = divs.map((d) => text(d));
  const field = (re) => {
    for (const t of divText) {
      const m = t.match(re);
      if (m) return m[1].trim();
    }
    return null;
  };
  const dataType = (field(/dataType: `([a-z0-9-]+)`/) ?? "").trim();
  const filterParam = field(/filter parameter: `([a-z0-9_]+)`/);
  const recordType = field(/^Record type: ([A-Za-z]+)$/m) ?? field(/Record type: ([A-Za-z]+)/);
  const storageResolution = field(/^Storage resolution: (.+)$/m);
  const badges = find(left, (n) => n.tag === "a" && /background-color/.test(n.attrs.style ?? ""));
  const guides = [];
  let webhook = false;
  let trueZeros = false;
  for (const b of badges) {
    const href = b.attrs.href ?? "";
    const t = text(b);
    if (href === "/health/webhooks" && t === "Webhook support") webhook = true;
    else if (href === "/health/data-presence-and-true-zeros" && t === "True zeros support") trueZeros = true;
    else if (/^\/health\/data-types\/[a-z0-9-]+$/.test(href) && / guide$/.test(t)) guides.push({ title: t, url: `https://developers.google.com${href}` });
    else problems.push(`data-types table, ${dataType || name}: unfamiliar badge "${t}" → ${href}`);
  }
  const expandable = findOne(left, (n) => n.tag === "devsite-expandable");
  const devices = expandable
    ? find(expandable, (n) => n.tag === "li").map((li) => {
        const a = findOne(li, (n) => n.tag === "a");
        return { name: text(li), url: a?.attrs.href ?? null };
      })
    : [];
  const operations = text(opsCell)
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const scopes = find(scopeCell, (n) => n.tag === "code").map((c) => text(c).replace(/`/g, ""));
  const ref = nameLink?.attrs.href ?? null;
  tableRows.push({
    name,
    dataType,
    filterParam,
    recordType,
    storageResolution,
    webhook,
    trueZeros,
    channel: label && text(label) === "v4beta" ? "v4beta" : label ? `unknown:${text(label)}` : "v4",
    referenceHref: ref,
    guides,
    devices,
    operations,
    scopes,
  });
}

// ---------------------------------------------------------------------------
// 4. The API-specifications page: mappings, calculations, endpoint mapping.
// ---------------------------------------------------------------------------

const specRoot = facts.apiSpecifications.root;
const tableByCaption = (root, caption) => findOne(root, (n) => n.tag === "table" && findOne(n, (c) => c.tag === "caption" && text(c).includes(caption)));

const scopeMapping = [];
{
  const t = tableByCaption(specRoot, "Table: Fitbit Web API to Google Health API scope mappings");
  if (!t) problems.push("API specifications: the scope-mapping table is gone");
  for (const tr of t ? find(t, (n) => n.tag === "tr") : []) {
    const tds = tr.children.filter((c) => typeof c === "object" && c.tag === "td");
    if (tds.length !== 2) continue;
    // The Google cell prints one scope per line (<br>-separated), not as code.
    const google = text(tds[1])
      .replace(/`/g, "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const g of google) if (!/^\.[a-z_]+\.(readonly|writeonly)$/.test(g)) problems.push(`scope mapping: unexpected Google scope cell line ${JSON.stringify(g)}`);
    scopeMapping.push({ fitbitScope: text(tds[0]).replace(/`/g, ""), googleScopes: google, googleScopeUrls: google.map(scopeUrl) });
  }
}

const dataTypeMapping = [];
{
  const t = tableByCaption(specRoot, "Table: Fitbit Web API to Google Health API data type mappings");
  if (!t) problems.push("API specifications: the data-type mapping table is gone");
  for (const tr of t ? find(t, (n) => n.tag === "tr") : []) {
    const tds = tr.children.filter((c) => typeof c === "object" && c.tag === "td");
    if (tds.length !== 3) continue;
    const codes = find(tds[1], (n) => n.tag === "code").map((c) => text(c).replace(/`/g, ""));
    const a = findOne(tds[1], (n) => n.tag === "a");
    const nameOnly = { ...tds[1], children: tds[1].children.filter((c) => !(typeof c === "object" && c.tag === "code")) };
    const desc = text(tds[2]);
    dataTypeMapping.push({
      fitbitDataType: text(tds[0]),
      googleName: text(a ?? nameOnly),
      googleDataType: codes[codes.length - 1] ?? null,
      description: desc || null,
      referenceUrl: a?.attrs.href ? new URL(a.attrs.href, "https://developers.google.com").href : null,
    });
  }
}

const endpointMapping = [];
{
  const sec = facts.apiSpecifications.sections?.find((s) => s.id === "endpoint_mappings");
  const t = sec?.blocks.find((b) => b.kind === "table");
  if (!t) problems.push("API specifications: the endpoint-mapping table is gone");
  for (const r of t?.rows ?? []) if (r.length === 2) endpointMapping.push({ fitbitEndpointType: r[0], googleHealthApi: r[1] });
}

// ---------------------------------------------------------------------------
// 5. About: the timeline. Rate limits, errors, webhooks, release notes.
// ---------------------------------------------------------------------------

const timeline = [];
{
  const sec = facts.about.sections?.find((s) => s.id === "what-about-fitbit");
  for (const b of sec?.blocks ?? []) {
    if (b.kind !== "list") continue;
    for (const it of b.items) {
      const m = it.text.match(/^([A-Z][a-z]+ \d{1,2}, \d{4}) \(([^)]+)\): (.+)$/s);
      if (m) timeline.push({ date: isoFromWords(m[1]), dateText: m[1], label: m[2], text: m[3], item: it.text });
    }
  }
  if (timeline.length < 2 || timeline.some((t) => !t.date)) problems.push(`About: expected the two dated timeline items under "What about the Fitbit Web API?", parsed ${timeline.length}`);
}

const rateLimits = [];
{
  const sec = facts.rateLimits.sections?.find((s) => s.id === "default_limits_and_impact_analysis");
  const t = sec?.blocks.find((b) => b.kind === "table");
  if (t && !(t.head[0] === "Metric" && t.head[1] === "Default Limit")) problems.push(`rate limits: table head is ${JSON.stringify(t.head)}`);
  for (const r of t?.rows ?? []) if (r.length === 3) rateLimits.push({ metric: r[0], defaultLimit: r[1], qpsImpact: r[2] });
}

const errors = [];
{
  const t = findOne(facts.errors.root, (n) => n.tag === "table" && n.attrs.id === "errorCodes.errorCatalog-table");
  if (!t) problems.push("error catalog: #errorCodes.errorCatalog-table is gone");
  for (const tr of t ? find(t, (n) => n.tag === "tr") : []) {
    const tds = tr.children.filter((c) => typeof c === "object" && c.tag === "td");
    if (tds.length !== 3) continue;
    errors.push({ reason: text(tds[0]).replace(/`/g, ""), httpStatus: Number(text(tds[1]).replace(/`/g, "")), description: text(tds[2]) });
  }
  if (errors.some((e) => !/^[A-Z][A-Z0-9_]+$/.test(e.reason) || !Number.isInteger(e.httpStatus))) problems.push("error catalog: a row did not parse as REASON / status / description");
}
const errorsIntro = (facts.errors.sections ?? [])
  .filter((s) => s.id === "error-codes")
  .flatMap((s) => s.blocks.filter((b) => b.kind === "p" || b.kind === "note"));

const webhookTypes = [];
{
  const t = tableByCaption(facts.webhooks.root, "Table: Google Health API data types with webhook support");
  if (!t) problems.push("webhooks page: the supported-data-types table is gone");
  for (const div of t ? find(t, (n) => n.tag === "div") : []) {
    const m = text(div).match(/^dataType: `([a-z0-9-]+)`/);
    if (m && !webhookTypes.includes(m[1])) webhookTypes.push(m[1]);
  }
  if (!webhookTypes.length && t) {
    for (const m of text(t).matchAll(/dataType: `([a-z0-9-]+)`/g)) if (!webhookTypes.includes(m[1])) webhookTypes.push(m[1]);
  }
}
const webhookTokens = [];
{
  const sec = facts.webhooks.sections?.find((s) => s.id === "dataTypeTokens");
  const t = sec?.blocks.find((b) => b.kind === "table");
  for (const r of t?.rows ?? []) {
    if (r.length !== 2) continue;
    const token = r[0].replace(/`/g, "");
    const m = r[1].match(/^`([a-z0-9-]+)`(.*)$/);
    webhookTokens.push({ token, dataType: m ? m[1] : r[1], systemEvent: m ? /system event/.test(m[2]) : false, text: r[1] });
  }
  if (!webhookTokens.length) problems.push("webhooks page: the token vocabulary table did not parse");
}

const releaseNotes = [];
{
  let cur = null;
  for (const s of facts.releaseNotes.sections ?? []) {
    if (s.level === 2) {
      const date = isoFromWords(s.heading ?? "");
      if (!date) {
        problems.push(`release notes: h2 "${s.heading}" is not a date`);
        cur = null;
        continue;
      }
      cur = { date, dateText: s.heading, id: s.id, intro: s.blocks, sections: [] };
      releaseNotes.push(cur);
    } else if (cur) cur.sections.push({ heading: s.heading, id: s.id, blocks: s.blocks });
  }
}

// ---------------------------------------------------------------------------
// 6. Join the table rows to the discovery document, with cross-checks.
// ---------------------------------------------------------------------------

const flags = [];
const flag = (f) => flags.push(f);
const PATCH = dpMethods.find((m) => m.name === "patch");
const UPDATE_ROW = endpointMapping.find((r) => /UPDATE/.test(r.fitbitEndpointType) && /`patch`/.test(r.googleHealthApi));

function methodFor(op) {
  const exact = dpMethods.find((m) => m.name === op);
  if (exact) return { method: exact, match: "exact", evidence: null };
  const ci = dpMethods.find((m) => m.name.toLowerCase() === op.toLowerCase());
  if (ci) return { method: ci, match: "case-insensitive", evidence: `Google's table prints "${op}"; the discovery document names the method "${ci.name}".` };
  if (op === "update" && PATCH && UPDATE_ROW) {
    return {
      method: PATCH,
      match: "endpoint-mapping",
      evidence: `Google's endpoint-mapping table: "${UPDATE_ROW.fitbitEndpointType} → ${UPDATE_ROW.googleHealthApi}"; the discovery document's patch method: "${PATCH.description}"`,
    };
  }
  return { method: null, match: null, evidence: null };
}

const dataTypes = [];
for (const row of tableRows) {
  const id = row.dataType;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    problems.push(`data-types table: row "${row.name}" has no parsable dataType id`);
    continue;
  }
  if (row.filterParam !== id.replace(/-/g, "_")) problems.push(`${id}: filter parameter "${row.filterParam}" is not the underscored id`);
  if (!row.recordType) problems.push(`${id}: no record type parsed`);
  if (!row.operations.length) problems.push(`${id}: no operations parsed`);
  if (!row.scopes.length) problems.push(`${id}: no scopes parsed`);
  if (row.channel.startsWith("unknown:")) problems.push(`${id}: unfamiliar channel label ${row.channel}`);
  const typeFlags = [];
  const tf = (f) => {
    const full = { dataType: id, ...f };
    typeFlags.push(full);
    flag(full);
  };

  // DataPoint property, in v4 and (for a beta row) v4beta.
  const v4 = dataPointFor(DP, id);
  const beta = dataPointFor(DP_BETA, id);
  if (v4 === "ambiguous" || beta === "ambiguous") problems.push(`${id}: more than one DataPoint property names it`);
  const dp = v4 && v4 !== "ambiguous" ? { ...v4, source: "v4" } : beta && beta !== "ambiguous" ? { ...beta, source: "v4beta" } : null;
  if (dp && kebab(dp.property) !== id) problems.push(`${id}: DataPoint.${dp.property} names it, but its kebab-case is ${kebab(dp.property)} — the DataPoint.name rule disagrees`);
  const anchor = (row.referenceHref ?? "").split("#")[1] ?? null;
  if (dp && anchor && anchor !== dp.property.toLowerCase()) {
    tf({ kind: "reference-anchor-differs", summary: `The table links ${id} to the reference anchor #${anchor}; the DataPoint property that names it is ${dp.property}.`, evidence: [{ source: "dataTypes", text: row.name }, { source: dp.source === "v4" ? "discoveryV4" : "discoveryV4beta", text: dp.evidence }] });
  }
  const opsText = row.operations.join(", ");
  const schemas = dp?.source === "v4beta" ? discBeta.schemas : disc.schemas;
  const schema = dp?.ref ? schemaOf(schemas, dp.ref, dp.source) : null;
  if (dp && !schema) problems.push(`${id}: DataPoint.${dp.property} refers to ${dp.ref}, which has no schema`);
  if (!v4 || v4 === "ambiguous") {
    const rollAny = rollupFor(disc.schemas.RollupDataPoint?.properties ?? {}, id) ?? rollupFor(disc.schemas.DailyRollupDataPoint?.properties ?? {}, id);
    tf({
      kind: "no-v4-datapoint-property",
      summary:
        dp?.source === "v4beta"
          ? `The v4 discovery document has no DataPoint property for ${id}; the v4beta document has ${dp.property}, matching the table's v4beta tag.`
          : rollAny && rollAny !== "ambiguous"
            ? `Neither discovery document has a DataPoint property for ${id}; it exists only as a rollup (${rollAny.property}), matching the table's operations (${row.operations.join(", ")}).`
            : `Neither discovery document has a DataPoint property for ${id}.`,
      evidence: [{ source: "dataTypes", text: row.name }, { source: "dataTypes", text: opsText }, ...(dp ? [{ source: "discoveryV4beta", text: dp.evidence }] : rollAny && rollAny !== "ambiguous" ? [{ source: "discoveryV4", text: rollAny.evidence }] : [])],
    });
  }

  // Operations → discovery methods, and the documented request paths.
  const operations = row.operations.map((op) => {
    const { method, match, evidence } = methodFor(op);
    if (!method) tf({ kind: "operation-without-method", summary: `The table lists "${op}" for ${id}; the discovery document has no users.dataTypes.dataPoints method of that name.`, evidence: [{ source: "dataTypes", text: opsText }] });
    return {
      op,
      method: method?.name ?? null,
      methodId: method?.id ?? null,
      match,
      httpMethod: method?.httpMethod ?? null,
      flatPath: method?.flatPath ?? null,
      path: method?.flatPath ? `${disc.rootUrl}${method.flatPath.replace("{dataTypesId}", id)}` : null,
      evidence,
    };
  });
  for (const o of operations.filter((x) => x.match === "endpoint-mapping")) {
    tf({ kind: "operation-name-differs", summary: `The table lists "${o.op}" for ${id}, but the discovery document has no method named ${o.op}; Google's endpoint-mapping table points updates at patch.`, evidence: [{ source: "apiSpecifications", text: UPDATE_ROW.fitbitEndpointType }, { source: "apiSpecifications", text: UPDATE_ROW.googleHealthApi }, { source: "discoveryV4", text: PATCH.description }] });
  }
  // exportExerciseTcx is documented for one type only.
  const tcx = dpMethods.find((m) => m.name === "exportExerciseTcx");
  const tcxFor = (tcx?.parameters.find((p) => p.name === "name")?.description?.match(/users\/\{user\}\/dataTypes\/([a-z0-9-]+)\/dataPoints/) ?? [])[1];
  if (tcx && tcxFor === id && !row.operations.some((o) => o.toLowerCase() === "exportexercisetcx")) {
    tf({ kind: "method-not-in-table", summary: `The discovery document's exportExerciseTcx method is documented for ${id}, but the table's operations for ${id} do not list it.`, evidence: [{ source: "discoveryV4", text: tcx.description.split(" ## ")[0] }, { source: "dataTypes", text: opsText }] });
  }

  // Scopes: URL from the documented prefix; on the Scopes page; in discovery;
  // accepted by each operation's method.
  const scopes = row.scopes.map((s) => {
    const url = scopeUrl(s);
    const doc = documentedScopes.find((d) => d.shorthand === s) ?? null;
    return { shorthand: s, url, family: s.replace(/^\./, "").replace(/\.(readonly|writeonly)$/, ""), access: s.endsWith(".readonly") ? "read" : "write", permission: doc?.permission ?? null, onScopesPage: Boolean(doc), inDiscoveryV4: url in discScopes };
  });
  for (const s of scopes) {
    if (!s.onScopesPage) tf({ kind: "scope-not-on-scopes-page", summary: `The table lists ${s.shorthand} for ${id}; the Scopes page does not document it.`, evidence: [{ source: "dataTypes", text: s.shorthand }] });
    if (!s.inDiscoveryV4) {
      tf({
        kind: "scope-not-in-discovery",
        scope: s.url,
        summary: `The table lists ${s.shorthand} for ${id}, but the v4 discovery document defines no ${s.url} scope, and none of its methods accepts it.`,
        evidence: [{ source: "dataTypes", text: s.shorthand }, ...(s.permission ? [{ source: "scopes", text: s.permission }] : [])],
      });
      continue;
    }
    for (const o of operations) {
      const m = dpMethods.find((x) => x.name === o.method);
      if (!m) continue;
      const writeOp = ["create", "patch", "batchDelete"].includes(m.name);
      if (writeOp && s.access === "read") continue;
      if (!m.scopes.includes(s.url)) tf({ kind: "scope-not-accepted-by-method", scope: s.url, summary: `${s.shorthand} is listed for ${id}, but the discovery document's ${m.name} method does not list it among its accepted scopes.`, evidence: [{ source: "discoveryV4", text: m.id }] });
    }
  }

  // Rollups the discovery document names, against the table's operations.
  const rRoll = rollupFor(disc.schemas.RollupDataPoint?.properties ?? {}, id);
  const rDaily = rollupFor(disc.schemas.DailyRollupDataPoint?.properties ?? {}, id);
  if (rRoll === "ambiguous" || rDaily === "ambiguous") problems.push(`${id}: more than one rollup property names it`);
  const hasRoll = row.operations.includes("rollup");
  const hasDaily = row.operations.includes("dailyRollup");
  const rollupOut = (r) => (r && r !== "ambiguous" ? { property: r.property, evidence: r.evidence, schema: schemaOf(disc.schemas, r.ref) } : null);
  for (const [listed, found, op, union] of [
    [hasRoll, rRoll, "rollup", "RollupDataPoint"],
    [hasDaily, rDaily, "dailyRollup", "DailyRollupDataPoint"],
  ]) {
    if (!listed && found && found !== "ambiguous") {
      tf({ kind: "rollup-not-in-table", summary: `The discovery document's ${union}.${found.property} is returned when rolling up ${id}, but the table does not list ${op} for ${id}.`, evidence: [{ source: "discoveryV4", text: found.evidence }, { source: "dataTypes", text: opsText }] });
    }
    if (listed && !found && row.channel === "v4") {
      tf({ kind: "rollup-not-in-discovery", summary: `The table lists ${op} for ${id}, but no ${union} property in the discovery document says it is returned for ${id}.`, evidence: [{ source: "dataTypes", text: opsText }] });
    }
  }

  // Webhooks: the table badge against the webhooks page and its tokens.
  const onWebhooksPage = webhookTypes.includes(id);
  const token = webhookTokens.find((t) => t.dataType === id) ?? null;
  if (row.webhook !== onWebhooksPage) {
    tf({ kind: "webhook-support-differs", summary: `The data-types table ${row.webhook ? "marks" : "does not mark"} ${id} with webhook support; the webhooks page ${onWebhooksPage ? "lists" : "does not list"} it.`, evidence: [{ source: "dataTypes", text: row.name }] });
  }
  if (row.webhook !== Boolean(token)) {
    tf({ kind: "webhook-support-differs", summary: `The data-types table ${row.webhook ? "marks" : "does not mark"} ${id} with webhook support; the webhooks page's token vocabulary ${token ? `has ${token.token}` : "has no token for it"}.`, evidence: [{ source: "dataTypes", text: row.name }, { source: "webhooks", text: token ? token.token : "Vocabulary of webhook data type tokens" }] });
  }

  // The Fitbit Web API predecessor, from Google's mapping table.
  const fitbit = dataTypeMapping.find((m) => m.googleDataType === id) ?? null;
  const fitbitScopes = scopeMapping.filter((m) => m.googleScopes.some((g) => row.scopes.includes(g))).map((m) => m.fitbitScope);

  dataTypes.push({
    dataType: id,
    name: row.name,
    filterParam: row.filterParam,
    recordType: row.recordType,
    recordTypeDefinition: recordTypeDefs[row.recordType] ?? null,
    storageResolution: row.storageResolution,
    webhookSupport: row.webhook,
    trueZerosSupport: row.trueZeros,
    channel: row.channel,
    referenceUrl: row.referenceHref ? new URL(row.referenceHref, "https://developers.google.com").href : null,
    operations,
    scopes,
    compatibleDevices: row.devices,
    guides: row.guides,
    dataPointProperty: dp?.property ?? null,
    dataPointEvidence: dp?.evidence ?? null,
    dataPointMatch: dp?.match ?? null,
    dataPointSource: dp?.source ?? null,
    schema,
    rollup: hasRoll ? rollupOut(rRoll) : null,
    dailyRollup: hasDaily ? rollupOut(rDaily) : null,
    webhookOnWebhooksPage: onWebhooksPage,
    webhookToken: token?.token ?? null,
    fitbit: fitbit ? { fitbitDataType: fitbit.fitbitDataType, description: fitbit.description } : null,
    fitbitScopes,
    flags: typeFlags,
  });
}

// Section-level cross-checks.
for (const s of discoveryScopes.filter((x) => x.googleHealth && !x.onScopesPage)) {
  flag({ dataType: null, kind: "scope-not-on-scopes-page", scope: s.url, summary: `The v4 discovery document defines ${s.shorthand} ("${s.description}"); the Scopes page does not list it.`, evidence: [{ source: "discoveryV4", text: s.url }, ...(s.description ? [{ source: "discoveryV4", text: s.description }] : [])] });
}
for (const s of documentedScopes.filter((x) => !x.inDiscoveryV4)) {
  flag({ dataType: null, kind: "scope-not-in-discovery", scope: s.url, summary: `The Scopes page documents ${s.shorthand} ("${s.permission}"); the v4 discovery document does not define it.`, evidence: [{ source: "scopes", text: s.shorthand }, { source: "scopes", text: s.permission }] });
}
const tableIds = new Set(dataTypes.map((t) => t.dataType));
for (const m of dataTypeMapping.filter((x) => x.googleDataType && !tableIds.has(x.googleDataType))) {
  const inDp = Object.keys(DP).find((p) => kebab(p) === m.googleDataType) ?? null;
  flag({
    dataType: m.googleDataType,
    kind: "mapping-type-not-in-table",
    summary: `Google's Fitbit mapping table maps "${m.fitbitDataType}" to ${m.googleDataType}, which the data-types table does not list${inDp ? `; the v4 discovery document does have DataPoint.${inDp}` : ""}.`,
    evidence: [
      { source: "apiSpecifications", text: m.fitbitDataType },
      { source: "apiSpecifications", text: m.googleDataType },
      ...(m.description ? [{ source: "apiSpecifications", text: m.description }] : []),
      ...(inDp ? [{ source: "discoveryV4", text: DP[inDp].description }] : []),
    ],
  });
}
for (const [p, v] of Object.entries(DP)) {
  if (["name", "dataSource"].includes(p)) continue;
  const named = (v.description ?? "").match(/Data for points in the `([a-z0-9-]+)` /)?.[1];
  if (named && !tableIds.has(named) && !dataTypeMapping.some((m) => m.googleDataType === named)) {
    flag({ dataType: named, kind: "datapoint-property-without-table-row", summary: `The v4 discovery document's DataPoint.${p} names ${named}, which neither the data-types table nor the mapping table lists.`, evidence: [{ source: "discoveryV4", text: v.description }] });
  }
}
// Release notes that named webhook data types (camelCase) the current
// webhook pages do not list. The camelCase → id step is the DataPoint.name
// rule (kebab-case of the field name), stated in DATAPOINT_RULE.
for (const r of releaseNotes) {
  for (const sec of r.sections) {
    if (!/webhook/i.test(sec.heading ?? "")) continue;
    for (const b of sec.blocks.filter((x) => x.kind === "list")) {
      for (const it of b.items) {
        if (!/^Notification support for the data types/.test(it.text)) continue;
        for (const m of it.text.matchAll(/`([a-z][A-Za-z0-9]+)`/g)) {
          const id = kebab(m[1]);
          if (!webhookTypes.includes(id)) {
            flag({ dataType: id, kind: "release-note-webhook-type-not-listed", summary: `Google's release notes for ${r.dateText} list ${m[1]} under webhook notification support; the data-types table and the webhooks page do not list ${id} as webhook-supported.`, evidence: [{ source: "releaseNotes", text: it.text }] });
            const t = dataTypes.find((x) => x.dataType === id);
            if (t) t.flags.push(flags[flags.length - 1]);
          }
        }
      }
    }
  }
}

const flat = (s) => s.replace(/`/g, "").replace(/\s+/g, " ").trim();
const pageTextCache = {};
const pageText = (key) => (pageTextCache[key] ??= flat(inline(facts[key].root)));

// How many scopes are restricted, as each guide page words it. The About
// page and the app-verification page have not always agreed ("All …" versus
// "Most …"); where the quantifiers differ the sentences are published.
{
  const claims = [];
  for (const key of ["about", "appVerification", "scopes", "migration", "apiSpecifications"]) {
    for (const m of pageText(key).matchAll(/[^.]*\b(All|Most)\b[^.]*\bscopes\b[^.]*\b[Rr]estricted\b[^.]*\./g)) {
      claims.push({ source: key, text: m[0].trim(), quantifier: m[1].toLowerCase() });
    }
  }
  if (new Set(claims.map((c) => c.quantifier)).size > 1) {
    const title = (k) => SOURCES.find((s) => s.key === k)?.title ?? k;
    flag({
      dataType: null,
      kind: "restricted-scope-wording",
      summary: `Google's pages word the restricted-scope rule differently: ${claims.map((c) => `${title(c.source)} says "${c.quantifier}"`).join("; ")}.`,
      evidence: claims.map((c) => ({ source: c.source, text: c.text })),
    });
  }
}

// Every flag's evidence must be text that is actually in its source: for a
// discovery document, part of one of its string values or keys; for a guide
// page, part of the page's text (code-span backticks and whitespace aside).
const discStrings = {};
for (const [k, doc] of [["discoveryV4", disc], ["discoveryV4beta", discBeta]]) {
  const out = [];
  (function walk(v) {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") for (const [kk, vv] of Object.entries(v)) {
      out.push(kk);
      walk(vv);
    }
  })(doc);
  discStrings[k] = out;
}
for (const f of flags) {
  if (!f.evidence.length) problems.push(`flag ${f.kind} (${f.dataType ?? f.scope}): no evidence`);
  for (const e of f.evidence) {
    const where = `flag ${f.kind} (${f.dataType ?? f.scope})`;
    if (!e.text) problems.push(`${where}: empty evidence`);
    else if (e.source in discStrings) {
      if (!discStrings[e.source].some((v) => v.includes(e.text))) problems.push(`${where}: evidence "${e.text.slice(0, 80)}" is not text from ${e.source}`);
    } else if (!(e.source in facts)) problems.push(`${where}: unknown evidence source ${e.source}`);
    else if (!pageText(e.source).includes(flat(e.text))) problems.push(`${where}: evidence "${e.text.slice(0, 80)}" is not text from ${e.source}`);
  }
}

// Operation coverage, computed for the hub.
const opCoverage = dpMethods.map((m) => ({
  method: m.name,
  dataTypes: dataTypes.filter((t) => t.operations.some((o) => o.method === m.name)).map((t) => t.dataType),
}));

// Request schemas the methods take, for the methods overview.
const requestSchemas = [...new Set(dpMethods.map((m) => m.request).filter(Boolean))]
  .filter((r) => r !== "DataPoint")
  .map((r) => schemaOf(disc.schemas, r));

// Sentences in Google's guides that name a type in code — quoted on its page.
const MENTION_SOURCES = [
  ["dataTypes", ["query_constraints", "data-quality-and-validity-filtering"]],
  ["apiSpecifications", ["oxygen-saturation-filtering", "activity-thresholds", "sedentary-sleep", "body-mass-index", "basal-metabolic-rate"]],
  ["endpoints", ["rollup-window-storage-resolution", "query-historical-data"]],
];
const mentions = {};
for (const [key, ids] of MENTION_SOURCES) {
  for (const id of ids) {
    const sec = facts[key].sections?.find((s) => s.id === id);
    if (!sec) continue;
    const units = sec.blocks.flatMap((b) => (b.kind === "list" ? b.items.flatMap((i) => [i.text, ...(i.sub ?? [])]) : b.kind === "p" ? [b.text] : []));
    for (const u of units) {
      for (const m of u.matchAll(/`([a-z0-9]+(?:-[a-z0-9]+)*)`/g)) {
        if (!tableIds.has(m[1])) continue;
        const list = (mentions[m[1]] ??= []);
        if (!list.some((x) => x.text === u)) list.push({ source: key, section: sec.heading, sectionId: id, text: u });
      }
    }
  }
}

// Verbatim prose for the pages.
const pages = {};
for (const s of SOURCES.filter((x) => x.kind === "html")) {
  pages[s.key] = { title: facts[s.key].title, intro: facts[s.key].sections?.[0]?.blocks ?? [], sections: pickSections(s.key, facts[s.key], s.sections) };
}
// Tables that are exported in structured form above are dropped from the
// prose copy: the data-types page's key and master table (GHAPI_TABLE_KEY,
// GHAPI_DATA_TYPES), the webhooks page's copy of the master table
// (GHAPI_WEBHOOK_TYPES) and the error catalog (GHAPI_ERRORS).
const STRUCTURED = { dataTypes: ["data-type-fields"], webhooks: ["supported-data-types"], errors: ["error-codes"] };
for (const [key, ids] of Object.entries(STRUCTURED)) {
  for (const sec of pages[key].sections) if (ids.includes(sec.id)) sec.blocks = sec.blocks.filter((b) => b.kind !== "table");
}

// ---------------------------------------------------------------------------
// Guards — refuse to publish a short or broken parse.
// ---------------------------------------------------------------------------

if (dataTypes.length < EXPECTED_MIN_DATA_TYPES) problems.push(`only ${dataTypes.length} data types parsed from the table (expected >= ${EXPECTED_MIN_DATA_TYPES})`);
if (new Set(dataTypes.map((t) => t.dataType)).size !== dataTypes.length) problems.push("duplicate dataType ids in the table");
if (documentedScopes.length < EXPECTED_MIN_DOCUMENTED_SCOPES) problems.push(`only ${documentedScopes.length} scopes parsed from the Scopes page (expected >= ${EXPECTED_MIN_DOCUMENTED_SCOPES})`);
if (dataTypeMapping.length < EXPECTED_MIN_MAPPING_ROWS) problems.push(`only ${dataTypeMapping.length} data-type mapping rows parsed (expected >= ${EXPECTED_MIN_MAPPING_ROWS})`);
if (dataTypeMapping.some((m) => !m.googleDataType || !m.fitbitDataType)) problems.push("a data-type mapping row has no Fitbit name or Google dataType");
if (scopeMapping.length < EXPECTED_MIN_SCOPE_MAPPING_ROWS) problems.push(`only ${scopeMapping.length} scope-mapping rows parsed (expected >= ${EXPECTED_MIN_SCOPE_MAPPING_ROWS})`);
if (scopeMapping.some((m) => !m.googleScopes.length)) problems.push("a scope-mapping row has no Google scope");
const schemaCount = Object.keys(disc.schemas ?? {}).length;
if (schemaCount < EXPECTED_MIN_SCHEMAS) problems.push(`the v4 discovery document has ${schemaCount} schemas (expected >= ${EXPECTED_MIN_SCHEMAS})`);
if (dpMethods.length < EXPECTED_MIN_DATAPOINT_METHODS) problems.push(`only ${dpMethods.length} users.dataTypes.dataPoints methods (expected >= ${EXPECTED_MIN_DATAPOINT_METHODS})`);
if (!/^\d{8}$/.test(disc.revision ?? "")) problems.push(`v4 discovery revision ${JSON.stringify(disc.revision)} is not YYYYMMDD`);
if (errors.length < EXPECTED_MIN_ERRORS) problems.push(`only ${errors.length} error-catalog rows (expected >= ${EXPECTED_MIN_ERRORS})`);
if (releaseNotes.length < EXPECTED_MIN_RELEASES) problems.push(`only ${releaseNotes.length} dated release-note entries (expected >= ${EXPECTED_MIN_RELEASES})`);
if (rateLimits.length < EXPECTED_MIN_RATE_LIMITS) problems.push(`only ${rateLimits.length} rate-limit rows (expected >= ${EXPECTED_MIN_RATE_LIMITS})`);
if (webhookTypes.length < EXPECTED_MIN_WEBHOOK_TYPES) problems.push(`only ${webhookTypes.length} webhook-supported types on the webhooks page (expected >= ${EXPECTED_MIN_WEBHOOK_TYPES})`);
if (!endpointMapping.length) problems.push("no endpoint-mapping rows parsed");
if (!UPDATE_ROW) problems.push("the endpoint-mapping row that maps updates to patch is gone — re-check the update → patch pairing");
for (const t of dataTypes) {
  if (t.channel === "v4" && !t.schema && t.operations.some((o) => !["rollUp", "dailyRollUp"].includes(o.method))) problems.push(`${t.dataType}: lists ${t.operations.map((o) => o.op).join(", ")} but has no v4 schema`);
  if (t.rollup && !t.rollup.schema) problems.push(`${t.dataType}: rollup listed but its RollupValue schema did not resolve`);
  if (t.dailyRollup && !t.dailyRollup.schema) problems.push(`${t.dataType}: dailyRollup listed but its RollupValue schema did not resolve`);
  if (!t.recordTypeDefinition) problems.push(`${t.dataType}: record type ${t.recordType} has no definition in the table key`);
}
for (const s of Object.values(SCHEMAS)) for (const f of s.fields) if (f.required !== (f.label === "Required")) problems.push(`${s.id}.${f.name}: required flag disagrees with its label`);
const noDesc = dataTypes.flatMap((t) => (t.schema ? SCHEMAS[t.schema.id].fields : []).filter((f) => !f.description).map((f) => `${t.dataType}.${f.name}`));
if (noDesc.length > 10) problems.push(`${noDesc.length} data-type fields with no description — more than expected; check the discovery document`);

if (problems.length) {
  console.error("REFUSING TO WRITE — a Google source's shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Write.
// ---------------------------------------------------------------------------

// The data date is the date the data-types page was fetched (from the cache
// metadata), so an --offline reparse does not claim a fresh read.
const fetchedOn = meta["data-types.html"]?.fetchedOn ?? new Date().toISOString().slice(0, 10);
/**
 * JSON, pretty-printed, except that any value whose one-line form fits in 160
 * characters stays on one line — one line per field, scope or device, which
 * keeps a regeneration's diff to the rows that changed.
 */
function J(v, indent = "") {
  const one = JSON.stringify(v);
  if (one === undefined) return "null";
  if (v === null || typeof v !== "object" || one.length <= 160) return one;
  const next = `${indent}  `;
  if (Array.isArray(v)) return v.length ? `[\n${v.map((x) => next + J(x, next)).join(",\n")}\n${indent}]` : "[]";
  const keys = Object.entries(v);
  return keys.length ? `{\n${keys.map(([k, x]) => `${next}${JSON.stringify(k)}: ${J(x, next)}`).join(",\n")}\n${indent}}` : "{}";
}
const srcLine = (k) => {
  const s = sourceMeta.find((x) => x.key === k);
  return ` *   ${s.url}${s.lastUpdated ? ` (Last updated ${s.lastUpdated})` : ""}${s.revision ? ` (revision ${s.revision})` : ""} — fetched ${s.fetchedOn}`;
};

const body = `/**
 * The Google Health API (the Fitbit Web API's successor), read from Google's
 * own documentation: every data type in Google's data-types table joined to
 * the v4 discovery document, plus the scopes, methods, Fitbit Web API
 * mappings, rate limits, webhooks, errors and release notes.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-google-health-api.mjs
 *
 * Sources:
${SOURCES.map((s) => srcLine(s.key)).join("\n")}
 * Fetched: ${fetchedOn}
 *
 * Copied verbatim: names, ids, filter parameters, record types, storage
 * resolutions, badges, devices, operations, scope strings and consent text,
 * method verbs, path templates and descriptions, field names, types,
 * descriptions and enum values, the mapping tables, rate limits, the error
 * catalog, release notes, and every prose block (as text, code in
 * backticks).
 *
 * Derived, with the text kept beside it:
 *   scope url — Google's prefix (GHAPI_SCOPE_PREFIX_EVIDENCE) + the printed
 *     ".family.access" suffix.
 *   dataPointProperty — the DataPoint property whose description names the
 *     type (dataPointEvidence), checked against DataPoint.name's kebab-case
 *     rule (GHAPI_DATAPOINT_RULE).
 *   rollup / dailyRollup — the RollupDataPoint / DailyRollupDataPoint
 *     property whose description names the type (evidence).
 *   operation → method — exact, case-insensitive ("rollup" → rollUp), or,
 *     for "update", via Google's endpoint-mapping table (evidence).
 *   required — true only where the description opens "Required.".
 *   ISO dates — beside the date as Google prints it.
 *   flags — where Google's own pages disagree, published as found with the
 *     texts that disagree; never corrected here.
 */

export type GhapiSourceKey = ${SOURCES.map((s) => JSON.stringify(s.key)).join(" | ")};

export type GhapiSource = {
  key: GhapiSourceKey;
  title: string;
  url: string;
  fetchedOn: string;
  /** The page footer's "Last updated" date; null for the discovery documents. */
  lastUpdated: string | null;
  /** The discovery document's revision; null for guide pages. */
  revision: string | null;
  /** The page footer's licence sentence, verbatim. */
  license: string | null;
};

export type GhapiBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered: boolean; items: { text: string; sub?: string[] }[] }
  | { kind: "table"; caption: string | null; head: string[]; rows: string[][] }
  | { kind: "note"; variant: string; text: string }
  | { kind: "code"; text: string }
  /** A tab heading over an example ("Request", "Response"). */
  | { kind: "label"; text: string };

export type GhapiSection = { id: string | null; heading: string | null; level: number; blocks: GhapiBlock[] };

export type GhapiField = {
  name: string;
  /** The type as the discovery document states it: a schema id, "string/int64", "array<SleepStage>"… */
  type: string;
  ref: string | null;
  itemsRef: string | null;
  /** The behaviour word Google's description opens with ("Required", "Optional", "Output only", "Identifier"); null when none. */
  label: string | null;
  /** True only where the description opens "Required.". */
  required: boolean;
  readOnly: boolean;
  description: string | null;
  enum: { value: string; description: string | null }[] | null;
};

export type GhapiSchema = {
  id: string;
  /** The discovery document the schema was read from. */
  source: "v4" | "v4beta";
  description: string | null;
  /** Required fields first, then by name. */
  fields: GhapiField[];
};

/** A schema by id (in GHAPI_SCHEMAS), with the ids of the schemas its fields
 *  refer to, one level deep. */
export type GhapiSchemaRef = { id: string; nested: string[] };

export type GhapiOperation = {
  /** The operation as Google's data-types table prints it. */
  op: string;
  /** The users.dataTypes.dataPoints method it was matched to; null when none. */
  method: string | null;
  methodId: string | null;
  match: "exact" | "case-insensitive" | "endpoint-mapping" | null;
  httpMethod: string | null;
  /** The discovery document's flatPath template. */
  flatPath: string | null;
  /** rootUrl + flatPath with {dataTypesId} filled with this type's id. */
  path: string | null;
  evidence: string | null;
};

export type GhapiScopeRef = {
  shorthand: string;
  url: string;
  family: string;
  access: "read" | "write";
  /** The Scopes page's permission sentence; null where the page does not list the scope. */
  permission: string | null;
  onScopesPage: boolean;
  inDiscoveryV4: boolean;
};

export type GhapiFlag = {
  kind: string;
  dataType: string | null;
  scope?: string;
  /** One factual sentence naming the disagreement. */
  summary: string;
  /** The texts that disagree, verbatim, with the source each came from. */
  evidence: { source: GhapiSourceKey; text: string }[];
};

export type GhapiRollup = { property: string; evidence: string; schema: GhapiSchemaRef | null };

export type GhapiDataType = {
  /** The hyphenated id used in endpoint URLs, e.g. "heart-rate". */
  dataType: string;
  /** Google's display name, e.g. "Heart Rate". */
  name: string;
  /** The underscored id used as the dataType filter value, e.g. "heart_rate". */
  filterParam: string;
  /** Interval, Sample, Daily, Session or Food, as printed. */
  recordType: string;
  /** Google's definition of that record type, from the table key. */
  recordTypeDefinition: string | null;
  /** e.g. "1 minute"; null where the table states none. */
  storageResolution: string | null;
  webhookSupport: boolean;
  trueZerosSupport: boolean;
  /** "v4", or "v4beta" where the table tags the row. */
  channel: string;
  /** The reference anchor the table's name links to. */
  referenceUrl: string | null;
  operations: GhapiOperation[];
  scopes: GhapiScopeRef[];
  compatibleDevices: { name: string; url: string | null }[];
  guides: { title: string; url: string }[];
  dataPointProperty: string | null;
  /** The DataPoint property's own description, verbatim. */
  dataPointEvidence: string | null;
  /** "description" where that description names the id; "kebab-case rule"
   *  where it does not and GHAPI_DATAPOINT_RULE alone made the match. */
  dataPointMatch: "description" | "kebab-case rule" | null;
  dataPointSource: "v4" | "v4beta" | null;
  schema: GhapiSchemaRef | null;
  /** Set only where the table lists rollup. */
  rollup: GhapiRollup | null;
  /** Set only where the table lists dailyRollup. */
  dailyRollup: GhapiRollup | null;
  webhookOnWebhooksPage: boolean;
  webhookToken: string | null;
  /** Google's Fitbit Web API → Google Health API mapping row; null where it has none. */
  fitbit: { fitbitDataType: string; description: string | null } | null;
  /** Fitbit Web API scopes whose mapping row lists one of this type's scopes. */
  fitbitScopes: string[];
  flags: GhapiFlag[];
};

export type GhapiMethod = {
  id: string | null;
  resource: string;
  name: string;
  httpMethod: string | null;
  flatPath: string | null;
  path: string | null;
  description: string | null;
  scopes: string[];
  parameters: { name: string; location: string | null; required: boolean; type: string | null; description: string | null }[];
  request: string | null;
  response: string | null;
};

/** The date the generator fetched Google's data-types page. */
export const GHAPI_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** Every source read, with its fetch date and Google's own "Last updated". */
export const GHAPI_SOURCES: GhapiSource[] = ${J(sourceMeta)};

/** Facts about the v4 and v4beta discovery documents. */
export const GHAPI_DISCOVERY = ${J({
  url: SOURCES[0].url,
  betaUrl: SOURCES[1].url,
  title: disc.title ?? null,
  description: disc.description ?? null,
  version: disc.version ?? null,
  revision: disc.revision ?? null,
  betaRevision: discBeta.revision ?? null,
  rootUrl: disc.rootUrl ?? null,
  documentationLink: disc.documentationLink ?? null,
  schemaCount,
  betaSchemaCount: Object.keys(discBeta.schemas ?? {}).length,
  dataPointPropertyCount: Object.keys(DP).length,
  betaOnlySchemas: Object.keys(discBeta.schemas ?? {}).filter((k) => !(k in (disc.schemas ?? {}))),
  methodCount: methods.length,
})};

/** The prefix every scope starts with, and the Scopes page's sentence saying so. */
export const GHAPI_SCOPE_PREFIX = ${JSON.stringify(SCOPE_PREFIX)};
export const GHAPI_SCOPE_PREFIX_EVIDENCE = ${JSON.stringify(SCOPE_PREFIX_EVIDENCE)};

/** DataPoint.name's sentence on how a dataType id maps to a DataPoint field. */
export const GHAPI_DATAPOINT_RULE = ${JSON.stringify(DATAPOINT_RULE)};

/** The data-types table's own key: what each column means, verbatim. */
export const GHAPI_TABLE_KEY: { field: string; description: string; items: string[] }[] = ${J(tableKey)};

/** Every data type in Google's data-types table, in the table's order. */
export const GHAPI_DATA_TYPES: GhapiDataType[] = ${J(dataTypes)};

/** The Scopes page's table, in Google's order. */
export const GHAPI_DOCUMENTED_SCOPES: {
  shorthand: string;
  url: string;
  family: string;
  /** The row-group anchor Google's table uses for the family; null where absent. */
  familyAnchor: string | null;
  access: "read" | "write";
  permission: string;
  inDiscoveryV4: boolean;
  discoveryDescription: string | null;
}[] = ${J(documentedScopes)};

/** Every scope the v4 discovery document defines. */
export const GHAPI_DISCOVERY_SCOPES: { url: string; description: string | null; googleHealth: boolean; shorthand: string | null; onScopesPage: boolean; inV4beta: boolean }[] = ${J(discoveryScopes)};

/** Every method in the v4 discovery document, by resource. */
export const GHAPI_METHODS: GhapiMethod[] = ${J(methods)};

/** How many table types list an operation that maps to each dataPoints method. */
export const GHAPI_OPERATION_COVERAGE: { method: string; dataTypes: string[] }[] = ${J(opCoverage)};

/** Request bodies the dataPoints methods take (DataPoint itself excluded). */
export const GHAPI_REQUEST_SCHEMAS: GhapiSchemaRef[] = ${J(requestSchemas)};

/** Every schema a type, rollup or request refers to (and one level below),
 *  keyed by id, as the discovery documents state them. */
export const GHAPI_SCHEMAS: Record<string, GhapiSchema> = ${J(Object.fromEntries(Object.keys(SCHEMAS).sort().map((k) => [k, SCHEMAS[k]])))};

/** Google's Fitbit Web API scope → Google Health API scope table. */
export const GHAPI_SCOPE_MAPPING: { fitbitScope: string; googleScopes: string[]; googleScopeUrls: string[] }[] = ${J(scopeMapping)};

/** Google's Fitbit Web API data type → Google Health API dataType table. */
export const GHAPI_DATA_TYPE_MAPPING: { fitbitDataType: string; googleName: string; googleDataType: string; description: string | null; referenceUrl: string | null }[] = ${J(dataTypeMapping)};

/** Google's Fitbit Web API endpoint type → Google Health API method table. */
export const GHAPI_ENDPOINT_MAPPING: { fitbitEndpointType: string; googleHealthApi: string }[] = ${J(endpointMapping)};

/** The About page's turn-down timeline. */
export const GHAPI_TIMELINE: { date: string; dateText: string; label: string; text: string; item: string }[] = ${J(timeline)};

/** The rate-limits table, verbatim. */
export const GHAPI_RATE_LIMITS: { metric: string; defaultLimit: string; qpsImpact: string }[] = ${J(rateLimits)};

/** The v4 error catalog, verbatim. */
export const GHAPI_ERRORS: { reason: string; httpStatus: number; description: string }[] = ${J(errors)};

/** The error catalog's own introduction, verbatim. */
export const GHAPI_ERRORS_INTRO: GhapiBlock[] = ${J(errorsIntro)};

/** dataType ids the webhooks page lists as supported. */
export const GHAPI_WEBHOOK_TYPES: string[] = ${J(webhookTypes)};

/** The webhooks page's token vocabulary. */
export const GHAPI_WEBHOOK_TOKENS: { token: string; dataType: string; systemEvent: boolean; text: string }[] = ${J(webhookTokens)};

/** Dated release-note entries, newest first, as Google prints them. */
export const GHAPI_RELEASE_NOTES: { date: string; dateText: string; id: string | null; intro: GhapiBlock[]; sections: { heading: string | null; id: string | null; blocks: GhapiBlock[] }[] }[] = ${J(releaseNotes)};

/** Sentences in Google's guides that name a data type in code, by type. */
export const GHAPI_MENTIONS: Record<string, { source: GhapiSourceKey; section: string | null; sectionId: string; text: string }[]> = ${J(mentions)};

/** Every cross-check flag: where Google's own pages disagree. */
export const GHAPI_FLAGS: GhapiFlag[] = ${J(flags)};

/** The prose sections the pages quote, per source page, verbatim. */
export const GHAPI_PAGES: Record<Exclude<GhapiSourceKey, "discoveryV4" | "discoveryV4beta">, { title: string | null; intro: GhapiBlock[]; sections: GhapiSection[] }> = ${J(pages)};
`;

writeFileSync(OUT, body);
console.log(`wrote ${OUT}: ${dataTypes.length} data types, ${documentedScopes.length} documented scopes (${discoveryScopes.length} in discovery), ${methods.length} methods (${dpMethods.length} dataPoints), ${dataTypeMapping.length} data-type mapping rows, ${scopeMapping.length} scope mapping rows, ${schemaCount} schemas, revision ${disc.revision}`);
console.log(`  ${errors.length} error reasons, ${releaseNotes.length} release-note entries, ${rateLimits.length} rate-limit rows, ${webhookTypes.length} webhook types, ${flags.length} cross-check flags`);
for (const f of flags) console.log(`  flag ${f.kind}: ${f.summary}`);
console.log("sources:");
for (const s of sourceMeta) console.log(`  ${s.url} — fetched ${s.fetchedOn}${s.lastUpdated ? `, Last updated ${s.lastUpdated}` : ""}${s.revision ? `, revision ${s.revision}` : ""}`);
