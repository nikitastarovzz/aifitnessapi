#!/usr/bin/env node
/**
 * Postman and Bruno collections for the vendor OAuth flows and webhook
 * samples the site documents (/collections, ops/VIRAL-20-2026-11-06.md item 12).
 *
 *   node scripts/build-collections.mjs           write public/collections/*
 *   node scripts/build-collections.mjs --check   exit 1 if any file is stale
 *
 * Inputs, and nothing else: src/data/oauthVendors.ts, src/data/webhookPayloads.ts
 * and, for the Google Health API's scope list (joined exactly as
 * src/lib/oauthPlaygroundData.ts joins it), src/data/googleHealthApi.ts.
 * src/lib/apiCollections.mjs builds the requests.
 *
 * Writes, per vendor:
 *   public/collections/<vendor>.postman_collection.json   Postman Collection Format v2.1.0
 *   public/collections/<vendor>.bruno.zip                  a Bruno collection folder (bruno.json,
 *                                                          one .bru per request, environments/Local.bru)
 * and public/collections/index.json, the list /collections renders.
 * Every file is byte-identical for identical inputs (the zip's timestamps are
 * fixed by src/lib/zipWriter.mjs). scripts/collections.test.mjs runs --check.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brunoFiles, collectionPaths, postmanCollection, vendorCollections } from "../src/lib/apiCollections.mjs";
import { zipFiles } from "../src/lib/zipWriter.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/collections");

const imp = (rel) => import(new URL(`../${rel}`, import.meta.url).href);

export async function collections() {
  const [{ OAUTH_VENDORS, OAUTH_SOURCES }, { WEBHOOK_VENDORS, WEBHOOK_SOURCES }, { GHAPI_DOCUMENTED_SCOPES, GHAPI_FETCHED_ON }] = await Promise.all([
    imp("src/data/oauthVendors.ts"),
    imp("src/data/webhookPayloads.ts"),
    imp("src/data/googleHealthApi.ts"),
  ]);
  const oauthVendors = OAUTH_VENDORS.map((v) =>
    v.id === "google-health" ? { ...v, scopes: GHAPI_DOCUMENTED_SCOPES.map((s) => ({ scope: s.url, grants: s.permission, quote: s.permission, source: "googleWebServer" })) } : v,
  );
  return vendorCollections({
    oauthVendors,
    oauthSources: OAUTH_SOURCES,
    googleScopeSource: { url: "https://developers.google.com/health/scopes", label: "Google Health API, “Scopes” (via this site's generated Google Health API dataset)", fetched: GHAPI_FETCHED_ON },
    webhookVendors: WEBHOOK_VENDORS,
    webhookSources: WEBHOOK_SOURCES,
  });
}

/** Every output file: { relative path under public/collections: Buffer }. */
export async function outputs() {
  const cs = await collections();
  const files = {};
  const index = [];
  for (const c of cs) {
    const p = collectionPaths(c.id);
    const postman = `${JSON.stringify(postmanCollection(c), null, 2)}\n`;
    const bru = brunoFiles(c);
    const zip = zipFiles(Object.entries(bru).map(([f, content]) => ({ path: `${c.id}/${f}`, content })));
    files[path.basename(p.postman)] = Buffer.from(postman);
    files[path.basename(p.brunoZip)] = Buffer.from(zip);
    index.push({
      id: c.id,
      name: c.name,
      folders: c.folders.map((f) => ({ name: f.name, requests: f.requests.map((r) => r.name) })),
      variables: c.variables.map((x) => x.key),
      postman: p.postman,
      bruno: p.brunoZip,
      postmanBytes: Buffer.byteLength(postman),
      brunoBytes: zip.length,
      brunoFiles: Object.keys(bru),
    });
  }
  files["index.json"] = Buffer.from(`${JSON.stringify({ generatedBy: "scripts/build-collections.mjs", postmanSchema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json", collections: index }, null, 2)}\n`);
  return files;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = await outputs();
  if (process.argv.includes("--check")) {
    const stale = Object.entries(files).filter(([f, buf]) => !fs.existsSync(path.join(OUT, f)) || !fs.readFileSync(path.join(OUT, f)).equals(buf));
    const extra = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((f) => !(f in files)) : [];
    if (stale.length || extra.length) {
      console.error(`✗ public/collections is stale (${[...stale.map(([f]) => f), ...extra.map((f) => `${f} (not generated)`)].join(", ")}): run node scripts/build-collections.mjs`);
      process.exit(1);
    }
    console.log(`public/collections is current (${Object.keys(files).length} files)`);
  } else {
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(OUT, { recursive: true });
    for (const [f, buf] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), buf);
    const n = Object.keys(files).filter((f) => f.endsWith(".postman_collection.json")).length;
    console.log(`build-collections: ${n} vendors, ${Object.keys(files).length} files in public/collections (${Object.values(files).reduce((s, b) => s + b.length, 0)} bytes)`);
  }
}
