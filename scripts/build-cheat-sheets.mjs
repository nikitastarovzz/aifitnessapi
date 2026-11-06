#!/usr/bin/env node
/**
 * The printable cheat sheets (/cheat-sheets, ops/VIRAL-20-2026-11-06.md item 13).
 *
 *   node scripts/build-cheat-sheets.mjs           redraw any sheet whose source changed
 *   node scripts/build-cheat-sheets.mjs --force   redraw all three
 *   node scripts/build-cheat-sheets.mjs --check   exit 1 if a sheet is stale or missing (no browser)
 *
 * Writes, for healthkit, health-connect and pose-keypoints:
 *   public/cheat-sheets/<slug>.pdf   one A4 page, printed by Playwright's Chromium (as build-atlas.mjs does)
 *   public/cheat-sheets/<slug>.png   the same page at 2x, 1588 x 2246 px
 * and public/cheat-sheets/manifest.json: per sheet, the SHA-256 of the HTML
 * it was drawn from, the PDF and PNG sizes, and the data date.
 *
 * Inputs (each imported directly; Node strips their types):
 * src/data/healthkitIdentifiers.ts, src/data/healthkitWritability.ts,
 * src/data/unifiedSchema.ts, src/data/healthConnectRecords.ts and
 * src/data/poseKeypoints.ts. scripts/lib/cheatSheets.mjs lays them out.
 * A PDF carries its creation time, so a sheet is redrawn only when its HTML
 * hash changed: an unchanged input leaves every file as it was. qa's
 * CHEATSHEET gate runs --check's comparison and holds each file under 1.5 MB.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { healthConnectSheet, healthkitSheet, poseSheet, SHEETS } from "./lib/cheatSheets.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/cheat-sheets");
const MANIFEST = path.join(OUT, "manifest.json");
export const MAX_BYTES = 1.5 * 1024 * 1024;

const imp = (rel) => import(new URL(`../${rel}`, import.meta.url).href);

/** Each sheet's HTML and data date, from the generated modules. */
export async function sheetSources() {
  const [hk, hkw, us, hc, pose, matrix] = await Promise.all([
    imp("src/data/healthkitIdentifiers.ts"),
    imp("src/data/healthkitWritability.ts"),
    imp("src/data/unifiedSchema.ts"),
    imp("src/data/healthConnectRecords.ts"),
    imp("src/data/poseKeypoints.ts"),
    imp("src/data/matrix.ts"),
  ]);
  const bodyFat = us.UNIFIED_RECORDS.find((r) => r.id === "bodyFat");
  const percentNote = bodyFat?.notes?.find((n) => /fraction/.test(n));
  const percentEvidence = us.UNIFIED_CONVERTER?.units?.unitEvidence?.percent?.quote;
  if (!percentNote || !percentEvidence) throw new Error("build-cheat-sheets: src/data/unifiedSchema.ts no longer carries the percent-unit note and Apple's sentence");
  const hrv = matrix.ROWS.find((r) => r.id === "hrv")?.watchOut ?? "";
  const hrvRaw = /^The big one: (.*?\.\s.*?\.)\s/.exec(hrv)?.[1];
  const hrvNote = hrvRaw && hrvRaw[0].toUpperCase() + hrvRaw.slice(1);
  if (!hrvNote) throw new Error("build-cheat-sheets: src/data/matrix.ts no longer opens its HRV row with the SDNN/RMSSD sentence");
  return {
    healthkit: {
      asOf: hk.HK_FETCHED_ON,
      html: healthkitSheet({
        identifiers: hk.HK_IDENTIFIERS,
        errors: hk.HK_ERRORS,
        readOnly: hkw.HK_READONLY,
        fetchedOn: hk.HK_FETCHED_ON,
        percentEvidence,
        percentNote,
        hrvNote,
      }),
    },
    "health-connect": {
      asOf: hc.HC_FETCHED_ON,
      html: healthConnectSheet({
        records: hc.HC_RECORDS,
        categories: hc.HC_CATEGORIES,
        jetpackPermissions: hc.HC_JETPACK_PERMISSION_CONSTANTS,
        additionalRead: hc.HC_ADDITIONAL_READ_PERMISSIONS,
        fetchedOn: hc.HC_FETCHED_ON,
        dataTypesUrl: hc.HC_DATA_TYPES_URL,
        dataTypesUpdated: hc.HC_DATA_TYPES_UPDATED,
      }),
    },
    "pose-keypoints": {
      asOf: pose.POSE_KEYPOINTS_FETCHED_ON,
      html: poseSheet({ schemes: pose.POSE_SCHEMES, sources: pose.POSE_SOURCES, fetchedOn: pose.POSE_KEYPOINTS_FETCHED_ON }),
    },
  };
}

export const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

/** Problems with the published files, without drawing anything. */
export async function checkSheets(root = ROOT) {
  const problems = [];
  const src = await sheetSources();
  const mf = path.join(root, "public/cheat-sheets/manifest.json");
  const manifest = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, "utf8")) : { sheets: [] };
  for (const s of SHEETS) {
    const m = manifest.sheets.find((x) => x.slug === s.slug);
    if (!m) problems.push(`${s.slug} is not in public/cheat-sheets/manifest.json`);
    else if (m.htmlSha256 !== sha256(src[s.slug].html)) problems.push(`${s.slug} was drawn from different data than src/data now holds`);
    for (const ext of ["pdf", "png"]) {
      const f = path.join(root, `public/cheat-sheets/${s.slug}.${ext}`);
      if (!fs.existsSync(f)) {
        problems.push(`public/cheat-sheets/${s.slug}.${ext} is missing`);
        continue;
      }
      const buf = fs.readFileSync(f);
      if (buf.length > MAX_BYTES) problems.push(`public/cheat-sheets/${s.slug}.${ext} is ${buf.length} bytes, over 1.5 MB`);
      const magic = ext === "pdf" ? buf.subarray(0, 5).toString() === "%PDF-" : buf.subarray(1, 4).toString() === "PNG";
      if (!magic) problems.push(`public/cheat-sheets/${s.slug}.${ext} is not a ${ext.toUpperCase()}`);
      if (m && m[`${ext}Bytes`] !== buf.length) problems.push(`public/cheat-sheets/${s.slug}.${ext} does not match the manifest`);
    }
  }
  return problems;
}

async function draw(force) {
  const src = await sheetSources();
  fs.mkdirSync(OUT, { recursive: true });
  const old = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : { sheets: [] };
  const todo = SHEETS.filter((s) => {
    const m = old.sheets.find((x) => x.slug === s.slug);
    return force || !m || m.htmlSha256 !== sha256(src[s.slug].html) || !fs.existsSync(path.join(OUT, `${s.slug}.pdf`)) || !fs.existsSync(path.join(OUT, `${s.slug}.png`));
  });
  if (todo.length) {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
    for (const s of todo) {
      await page.setContent(src[s.slug].html, { waitUntil: "load" });
      // One page or nothing: a sheet that overflows A4 fails rather than printing a second page.
      const overflow = await page.evaluate(() => {
        const el = document.querySelector(".sheet");
        const boxes = [...document.querySelectorAll(".cols, .split > div, table")];
        return Math.max(el.scrollHeight - el.clientHeight, document.documentElement.scrollWidth - 794, ...boxes.map((c) => c.scrollWidth - c.clientWidth));
      });
      if (overflow > 1) throw new Error(`build-cheat-sheets: ${s.slug} overflows its A4 page by ${overflow}px`);
      const pdf = await page.pdf({ width: "210mm", height: "297mm", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, pageRanges: "1" });
      const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 794, height: 1123 } });
      fs.writeFileSync(path.join(OUT, `${s.slug}.pdf`), pdf);
      fs.writeFileSync(path.join(OUT, `${s.slug}.png`), png);
      console.log(`build-cheat-sheets: drew ${s.slug} (PDF ${pdf.length} B, PNG ${png.length} B)`);
    }
    await browser.close();
  }
  const manifest = {
    generatedBy: "scripts/build-cheat-sheets.mjs",
    sheets: SHEETS.map((s) => ({
      slug: s.slug,
      title: s.title,
      asOf: src[s.slug].asOf,
      htmlSha256: sha256(src[s.slug].html),
      pdf: `/cheat-sheets/${s.slug}.pdf`,
      png: `/cheat-sheets/${s.slug}.png`,
      pdfBytes: fs.statSync(path.join(OUT, `${s.slug}.pdf`)).size,
      pngBytes: fs.statSync(path.join(OUT, `${s.slug}.png`)).size,
      pngWidth: 1588,
      pngHeight: 2246,
    })),
  };
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  if (!todo.length) console.log("build-cheat-sheets: every sheet is current");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--check")) {
    const problems = await checkSheets();
    if (problems.length) {
      for (const p of problems) console.error(`✗ ${p}`);
      console.error("run node scripts/build-cheat-sheets.mjs");
      process.exit(1);
    }
    console.log(`public/cheat-sheets is current (${SHEETS.length} sheets)`);
  } else {
    await draw(process.argv.includes("--force"));
    const problems = await checkSheets();
    if (problems.length) {
      for (const p of problems) console.error(`✗ ${p}`);
      process.exit(1);
    }
  }
}
