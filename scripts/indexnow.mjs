#!/usr/bin/env node
/**
 * IndexNow submitter — pings Bing + Yandex (and any IndexNow-participating
 * engine) so new/updated pages get crawled fast. Google does NOT use IndexNow;
 * for Google, rely on the sitemap + internal links + URL Inspection.
 *
 * Usage:
 *   node scripts/indexnow.mjs                 # diff mode: only what changed since the last snapshot
 *   node scripts/indexnow.mjs --all           # submit EVERY url in the live sitemap (one-off full resubmission)
 *   node scripts/indexnow.mjs /guides /blog   # submit only these paths (flagship drip; snapshot untouched)
 *
 * Flags:
 *   --dry-run              print what would be submitted; no POST, no snapshot write
 *   --sitemap-file=PATH    read the sitemap from disk instead of the live site
 *
 * Diff mode is the default because it is what CI runs on every production
 * deploy (.github/workflows/indexnow.yml). Resubmitting the whole sitemap on
 * every deploy asks for hundreds of crawls that find nothing new, and buries
 * the few pages that did change among them. So the sitemap's <loc>/<lastmod>
 * pairs are compared with the snapshot the last successful run left (env
 * INDEXNOW_SNAPSHOT, default .indexnow/snapshot.json), and only these are
 * submitted:
 *
 *   - URLs that are new, or whose <lastmod> changed;
 *   - URLs that left the sitemap, so the engine recrawls and sees them gone;
 *   - the nearest hub listed in the sitemap for each of those (/fix for
 *     /fix/x), because a hub's list of links changed with them;
 *   - the homepage, whenever anything at all changed.
 *
 * The snapshot is written only after IndexNow accepts the batch (200/202). A
 * failed submission therefore leaves the old snapshot in place and the same
 * changes are retried next run, instead of being recorded as sent.
 *
 * No snapshot (first run, or CI's cache expired) is deliberately neither
 * "submit nothing" nor "submit everything": it submits the URLs whose
 * <lastmod> is within FIRST_RUN_WINDOW_DAYS, plus their hubs, and says so.
 * The window matches the weekly catch-up cron, so an expired cache costs at
 * most a re-ping of one week's changes.
 *
 * Requires the site to be deployed (it reads the live sitemap) and the key file
 * public/<KEY>.txt to be reachable at https://<host>/<KEY>.txt.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Canonical site URL. Keep in sync with src/lib/site.ts `url` (override with
// SITE_URL=... for preview deploys). Plain .mjs can't import the TS config.
const SITE_URL = (process.env.SITE_URL || "https://aifitnessapi.com").replace(/\/$/, "");
const KEY = "7ab02ba01079101c36facfcb28908c50";
const HOST = new URL(SITE_URL).host; // aifitnessapi.com
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const SNAPSHOT = process.env.INDEXNOW_SNAPSHOT || ".indexnow/snapshot.json";
const FIRST_RUN_WINDOW_DAYS = 7;
// Diff-mode logs list the URLs they submit (they are public sitemap URLs);
// past this many, the rest are counted rather than printed.
const LIST_LIMIT = 60;

async function readSitemapXml(file) {
  if (file) return readFileSync(file, "utf8");
  const res = await fetch(`${SITE_URL}/sitemap.xml`, {
    headers: { "user-agent": "aifitnessapi-indexnow/1.0" },
  });
  // A non-200 sitemap is the alert, not a reason to submit nothing quietly:
  // the job going red is how a broken deploy (or a paused one) gets noticed.
  if (!res.ok) throw new Error(`Could not fetch sitemap (${res.status}). Is the site deployed?`);
  return res.text();
}

const unescapeXml = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

/** loc → lastmod (string as written in the sitemap, or null), in document order. */
function parseSitemap(xml) {
  const entries = new Map();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1];
    if (!loc) continue;
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1];
    entries.set(unescapeXml(loc.trim()), lastmod ? lastmod.trim() : null);
  }
  return entries;
}

function loadSnapshot() {
  if (!existsSync(SNAPSHOT)) {
    console.log(`No previous snapshot at ${SNAPSHOT}.`);
    return null;
  }
  try {
    const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
    // A snapshot of a preview deploy says nothing about production.
    if (snap.site !== SITE_URL) {
      console.log(`Snapshot at ${SNAPSHOT} is for ${snap.site}, not ${SITE_URL} — ignoring it.`);
      return null;
    }
    if (!snap.urls || typeof snap.urls !== "object") throw new Error("no urls object");
    console.log(`Loaded snapshot: ${Object.keys(snap.urls).length} URLs, saved ${snap.savedAt}.`);
    return new Map(Object.entries(snap.urls));
  } catch (e) {
    console.log(`Snapshot at ${SNAPSHOT} is unreadable (${e.message}) — ignoring it.`);
    return null;
  }
}

function saveSnapshot(current) {
  mkdirSync(dirname(SNAPSHOT), { recursive: true });
  const snap = { site: SITE_URL, savedAt: new Date().toISOString(), urls: Object.fromEntries(current) };
  writeFileSync(SNAPSHOT, JSON.stringify(snap, null, 2) + "\n");
  console.log(`Snapshot written to ${SNAPSHOT} (${current.size} URLs).`);
}

// Sitemaps are not consistent about a trailing slash on the homepage
// ("https://host" vs "https://host/"), so hubs are looked up without one.
const bare = (u) => u.replace(/\/+$/, "");

/**
 * The changed URLs plus, for each, the nearest ancestor path that the sitemap
 * lists (its hub), plus the homepage if the set is non-empty. Hubs are only
 * taken from the current sitemap: pinging a hub that no longer exists would
 * just be another 404 for the engine to crawl.
 */
function withHubs(changed, current) {
  const listed = new Map([...current.keys()].map((u) => [bare(u), u]));
  const out = new Set(changed);
  for (const url of changed) {
    const u = new URL(url);
    const segs = u.pathname.split("/").filter(Boolean);
    while (segs.length > 1) {
      segs.pop();
      const hub = listed.get(`${u.origin}/${segs.join("/")}`);
      if (hub) {
        out.add(hub);
        break;
      }
    }
  }
  if (out.size) out.add(listed.get(SITE_URL) ?? `${SITE_URL}/`);
  return [...out];
}

function logList(label, urls) {
  if (!urls.length) return;
  console.log(`${label} (${urls.length}):`);
  for (const u of urls.slice(0, LIST_LIMIT)) console.log(`  ${u}`);
  if (urls.length > LIST_LIMIT) console.log(`  … and ${urls.length - LIST_LIMIT} more`);
}

function toAbsolute(pathOrUrl) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** POSTs the batch. Returns true when IndexNow accepted it; exits 1 when it did not. */
async function submit(urlList, { dryRun }) {
  if (!urlList.length) {
    console.error("No URLs to submit.");
    process.exit(1);
  }
  // IndexNow requires every submitted URL to be on HOST.
  const bad = urlList.filter((u) => new URL(u).host !== HOST);
  if (bad.length) {
    console.error(`These URLs are not on ${HOST} and were dropped:\n${bad.join("\n")}`);
  }
  const urls = urlList.filter((u) => new URL(u).host === HOST);

  if (dryRun) {
    logList(`Dry run — would submit to IndexNow for ${HOST}`, urls);
    console.log("Nothing sent, snapshot untouched.");
    return false;
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow for ${HOST} …`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });

  // IndexNow returns 200/202 on success; 4xx tells you what's wrong.
  const body = await res.text();
  if (res.ok || res.status === 202) {
    console.log(`✓ Accepted (HTTP ${res.status}). Bing/Yandex will crawl these shortly.`);
    return true;
  }
  console.error(`✗ IndexNow returned HTTP ${res.status}: ${body || "(no body)"}`);
  if (res.status === 403) console.error("403 usually means the key file is not reachable at " + KEY_LOCATION);
  if (res.status === 422) console.error("422 usually means a URL host mismatch or malformed URL.");
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const flags = args.filter((a) => a.startsWith("--"));
  const paths = args.filter((a) => !a.startsWith("--"));
  const all = flags.includes("--all");
  const dryRun = flags.includes("--dry-run");
  const sitemapFile = flags.find((f) => f.startsWith("--sitemap-file="))?.slice("--sitemap-file=".length);
  // A mistyped flag must not quietly fall back to diff mode — "--al" meant
  // "--all", and the one recovery resubmission would silently not happen.
  const unknown = flags.filter((f) => f !== "--all" && f !== "--dry-run" && !f.startsWith("--sitemap-file="));
  if (unknown.length) throw new Error(`Unknown flag(s): ${unknown.join(" ")}`);
  if (all && paths.length) throw new Error("--all and explicit paths are mutually exclusive.");

  // Explicit paths: a hand-picked drip. It says nothing about the rest of the
  // sitemap, so it neither reads nor writes the snapshot.
  if (paths.length) {
    await submit(paths.map(toAbsolute), { dryRun });
    return;
  }

  const current = parseSitemap(await readSitemapXml(sitemapFile));
  // A sitemap that parses to nothing is broken, not empty — and recording it
  // as the snapshot would make the next run "add" every URL on the site.
  if (!current.size) throw new Error("The sitemap parsed to 0 URLs. Is it a sitemap index, or truncated?");
  console.log(`Sitemap: ${current.size} URLs.`);

  let urls;
  if (all) {
    console.log("--all: submitting every URL in the sitemap.");
    urls = [...current.keys()];
  } else {
    const previous = loadSnapshot();
    if (!previous) {
      const cutoff = Date.now() - FIRST_RUN_WINDOW_DAYS * 86400000;
      const recent = [...current].filter(([, lm]) => lm && Date.parse(lm) >= cutoff).map(([loc]) => loc);
      console.log(
        `FIRST-RUN FALLBACK (no usable snapshot): this is not a diff. Submitting the URLs whose ` +
          `lastmod is within ${FIRST_RUN_WINDOW_DAYS} days, plus their hubs. ` +
          `Run with --all for a full resubmission.`,
      );
      logList("Recently modified", recent);
      if (!recent.length) {
        // Nothing to send, and nothing lost by recording a baseline: without
        // one, every later run would be a first run too.
        console.log(`No URL has a lastmod within ${FIRST_RUN_WINDOW_DAYS} days. Nothing submitted.`);
        if (!dryRun) saveSnapshot(current);
        return;
      }
      urls = withHubs(recent, current);
    } else {
      const added = [];
      const modified = [];
      for (const [loc, lastmod] of current) {
        if (!previous.has(loc)) added.push(loc);
        else if (previous.get(loc) !== lastmod) modified.push(loc);
      }
      const removed = [...previous.keys()].filter((loc) => !current.has(loc));
      if (!added.length && !modified.length && !removed.length) {
        console.log("Nothing changed since the last snapshot. Nothing submitted.");
        return;
      }
      logList("New", added);
      logList("lastmod changed", modified);
      logList("Left the sitemap", removed);
      urls = withHubs([...added, ...modified, ...removed], current);
      const hubs = urls.length - added.length - modified.length - removed.length;
      console.log(`Plus ${hubs} hub(s)/homepage.`);
    }
  }

  const accepted = await submit(urls, { dryRun });
  if (accepted) saveSnapshot(current);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
