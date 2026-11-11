/**
 * External link audit. Run `npm run build && node scripts/external-links.mjs`.
 *
 * qa.mjs holds every internal href to a page the build produced
 * (PHANTOM-LINK), and nothing held the other half: the citations. The site's
 * claim is that every fact points at a primary source, so a vendor page that
 * moved, a docs path that was retired, or a repository that was deleted turns
 * a citation into a dead end, and no local build can notice. This probes
 * every distinct external URL in the built HTML and reports the ones that
 * are gone.
 *
 * What counts as what:
 *  - dead:       HTTP 404 or 410, or a host that does not resolve. These are
 *                the failures; the process exits 1 when any exist (unless
 *                --no-fail).
 *  - unverified: 401, 403, 429, 5xx, a timeout, a TLS error. Bot walls and
 *                rate limits look like this, and so does a site having a bad
 *                minute, so they are listed but never fail the run. A URL that
 *                is really gone behind a 403 wall needs a human, not a gate.
 *  - ok:         anything else (2xx, and 3xx that fetch follows).
 *
 * One probe per page, not per link: tracking parameters (utm_*) never
 * change what a server returns, and a share intent (x.com/intent/tweet,
 * reddit.com/submit, …) is one endpoint carrying this site's own URL in the
 * query, so both are collapsed before probing. On 2026-11-11 that took the
 * site's 7,849 distinct external hrefs down to 2,541 URLs to probe.
 *
 * HEAD first, then GET when HEAD is refused (405, 403, 404 — plenty of hosts
 * 404 a HEAD and 200 the GET) or fails at the network. One retry on a
 * network error. Requests to the same host are serialized with a short gap,
 * so the run never hammers one vendor; different hosts run in parallel.
 *
 * Output: a Markdown summary on stdout (and in $GITHUB_STEP_SUMMARY when
 * set) and the full result as JSON at .cache/external-links/report.json,
 * each URL with the pages that reference it.
 *
 * Flags: --limit N (first N URLs, for a quick look), --filter <substring>
 * (only URLs containing it), --no-fail (always exit 0), --concurrency N
 * (hosts in flight at once, default 8), --timeout MS (default 15000).
 *
 * From the dev environment most vendor hosts are blocked by the proxy, so a
 * run here reports nearly everything as unverified; the workflow in
 * .github/workflows/external-links.yml runs it from GitHub's runners.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = ".next/server/app";
const OUT_DIR = ".cache/external-links";
const SELF_HOSTS = new Set(["aifitnessapi.com", "www.aifitnessapi.com"]);
// Share endpoints: the query is this site's own URL and title, so the
// endpoint is probed once with no query at all.
const SHARE_ENDPOINTS = new Set([
  "x.com/intent/tweet",
  "twitter.com/intent/tweet",
  "www.reddit.com/submit",
  "www.linkedin.com/sharing/share-offsite/",
  "news.ycombinator.com/submitlink",
  "www.facebook.com/sharer/sharer.php",
]);

/** The URL to probe for an href: fragment dropped, tracking params dropped,
 *  share intents collapsed to the endpoint. Null for anything unparseable. */
function canonicalize(href) {
  let u;
  try {
    u = new URL(href);
  } catch {
    return null;
  }
  u.hash = "";
  if (SHARE_ENDPOINTS.has(u.host + u.pathname)) {
    u.search = "";
  } else {
    for (const k of [...u.searchParams.keys()]) if (/^utm_/i.test(k)) u.searchParams.delete(k);
  }
  return u.toString();
}

const args = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = args.indexOf(name);
  return i === -1 ? dflt : args[i + 1];
};
const LIMIT = Number(flag("--limit", 0)) || 0;
const FILTER = flag("--filter", "");
const NO_FAIL = args.includes("--no-fail");
const CONCURRENCY = Number(flag("--concurrency", 8)) || 8;
const TIMEOUT_MS = Number(flag("--timeout", 15000)) || 15000;
const HOST_GAP_MS = 250;

if (!fs.existsSync(ROOT)) {
  console.error("No build output found — run `npm run build` first.");
  process.exit(1);
}

// ── Collect every external href from the built HTML, with its referring pages.
const htmls = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) htmls.push(p);
  }
})(ROOT);

const routeOf = (h) => {
  let r = h.slice(ROOT.length).replace(/\.html$/, "");
  if (r.endsWith("/index")) r = r.slice(0, -6);
  return r === "" ? "/" : r;
};

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

/** @type {Map<string, Set<string>>} url -> referring routes */
const refs = new Map();
for (const h of htmls) {
  const route = routeOf(h);
  if (route.startsWith("/_")) continue;
  const html = fs.readFileSync(h, "utf8");
  for (const m of html.matchAll(/href="(https?:\/\/[^"\s<>]+)"/g)) {
    const url = canonicalize(decode(m[1]));
    if (!url) continue;
    if (SELF_HOSTS.has(new URL(url).hostname)) continue;
    if (FILTER && !url.includes(FILTER)) continue;
    (refs.get(url) ?? refs.set(url, new Set()).get(url)).add(route);
  }
}

let urls = [...refs.keys()].sort();
if (LIMIT) urls = urls.slice(0, LIMIT);
console.log(`${urls.length} distinct external URLs across ${htmls.length} built pages`);

// ── Probe. One queue per host, hosts in parallel.
const UA = "Mozilla/5.0 (compatible; aifitnessapi-link-audit/1.0; +https://aifitnessapi.com/methodology)";

async function request(url, method) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: ctl.signal,
      headers: { "user-agent": UA, accept: "text/html,application/json;q=0.9,*/*;q=0.8" },
    });
    // Drain a GET so the socket is reusable; the body itself is not needed.
    if (method === "GET") await res.arrayBuffer().catch(() => {});
    return { status: res.status, finalUrl: res.url };
  } finally {
    clearTimeout(t);
  }
}

/** A readable name for a fetch failure: the socket-level code when there is
 *  one (ENOTFOUND, ECONNRESET, CERT_HAS_EXPIRED), else the message. */
function errorName(err) {
  const code = err?.cause?.code ?? err?.code;
  if (typeof code === "string" && code) return code;
  if (err?.name === "AbortError") return "TIMEOUT";
  return err?.cause?.message ?? err?.message ?? String(err);
}

function classify(status, err) {
  if (err) {
    const code = errorName(err);
    if (code === "ENOTFOUND" || code === "EAI_AGAIN") return "dead";
    return "unverified";
  }
  if (status === 404 || status === 410) return "dead";
  if (status >= 200 && status < 400) return "ok";
  return "unverified";
}

async function probe(url) {
  const out = { url, pages: [...refs.get(url)].sort(), status: null, finalUrl: null, error: null, method: "HEAD" };
  const attempt = async (method) => {
    try {
      const r = await request(url, method);
      return { status: r.status, finalUrl: r.finalUrl, error: null };
    } catch (e) {
      return { status: null, finalUrl: null, error: e };
    }
  };
  let r = await attempt("HEAD");
  // HEAD refused or failed: the GET is the verdict.
  if (r.error || r.status === 405 || r.status === 403 || r.status === 404 || r.status >= 500) {
    out.method = "GET";
    r = await attempt("GET");
    if (r.error) {
      await new Promise((res) => setTimeout(res, 1000));
      r = await attempt("GET");
    }
  }
  out.status = r.status;
  out.finalUrl = r.finalUrl;
  out.error = r.error ? errorName(r.error) : null;
  out.verdict = classify(r.status, r.error);
  return out;
}

const byHost = new Map();
for (const u of urls) {
  const h = new URL(u).hostname;
  (byHost.get(h) ?? byHost.set(h, []).get(h)).push(u);
}
const hostQueues = [...byHost.values()];
const results = [];
let done = 0;

async function worker() {
  for (;;) {
    const q = hostQueues.shift();
    if (!q) return;
    for (const u of q) {
      results.push(await probe(u));
      done++;
      if (done % 100 === 0) console.log(`  …${done}/${urls.length}`);
      await new Promise((res) => setTimeout(res, HOST_GAP_MS));
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// ── Report.
results.sort((a, b) => a.url.localeCompare(b.url));
const dead = results.filter((r) => r.verdict === "dead");
const unverified = results.filter((r) => r.verdict === "unverified");
const ok = results.length - dead.length - unverified.length;

const row = (r) =>
  `| ${r.url} | ${r.status ?? r.error} | ${r.pages.length} | ${r.pages.slice(0, 3).join(", ")}${r.pages.length > 3 ? ", …" : ""} |`;
const lines = [
  `## External links: ${ok} ok, ${dead.length} dead, ${unverified.length} unverified (${results.length} probed)`,
  "",
];
if (dead.length) {
  lines.push("### Dead (404, 410, or no such host)", "", "| URL | Result | Pages | e.g. |", "|---|---|---|---|");
  for (const r of dead) lines.push(row(r));
  lines.push("");
}
if (unverified.length) {
  lines.push(
    "### Unverified (bot wall, rate limit, server error or timeout; check by hand)",
    "",
    "| URL | Result | Pages | e.g. |",
    "|---|---|---|---|",
  );
  for (const r of unverified) lines.push(row(r));
  lines.push("");
}
const md = lines.join("\n");
console.log("\n" + md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, "report.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), probed: results.length, ok, dead: dead.length, unverified: unverified.length, results }, null, 2),
);
console.log(`Report: ${path.join(OUT_DIR, "report.json")}`);

if (dead.length && !NO_FAIL) process.exit(1);
