#!/usr/bin/env node
/**
 * Which translations still match their English page.
 *
 * Each translation records `sourceHash`, the hash of the English entry's
 * translatable fields when it was translated (src/lib/translationStore.mjs).
 * This recomputes the hash from src/data/<cluster>.entries.ts and prints, per
 * page, whether the translation is current or stale. A stale translation is
 * already handled by the site (noindex, out of the sitemap and hreflang, a
 * visible notice); this report is how you find what to re-translate.
 *
 * Usage:
 *   node scripts/translation-status.mjs                 # table, stale first
 *   node scripts/translation-status.mjs --json          # machine-readable
 *   node scripts/translation-status.mjs --hash <path>   # the English page's
 *        current hash, e.g. --hash /integrate/garmin-api — the value a fresh
 *        translation records as sourceHash, together with sourceUpdated (the
 *        English `updated` it was translated from) and translatedOn (today)
 *
 * Re-translating means translating the English page as it now stands, not
 * pasting a new hash into an old translation: a hash bumped without the text
 * changing would present outdated Portuguese as current, the same falsehood
 * as moving an `updated` stamp without re-checking the sources.
 *
 * Reads the English entries straight from the entries files, so it sees
 * unreleased entries too; the site builds a translation only when its
 * English page is released (qa's PTBR-ORPHAN names one that is not).
 * Exits 0 unless a translation file is malformed.
 */
import { loadTranslations, loadEnglishEntries, translationHash, translationStatus } from "../src/lib/translationStore.mjs";

const args = process.argv.slice(2);
const hashIdx = args.indexOf("--hash");

const translations = loadTranslations("pt-br");
const clusters = [...new Set([...translations.map((t) => `/${t.enPath.split("/")[1]}`), ...(hashIdx !== -1 ? [`/${(args[hashIdx + 1] ?? "").split("/")[1]}`] : [])])];
const english = loadEnglishEntries(clusters);

if (hashIdx !== -1) {
  const p = args[hashIdx + 1];
  const e = english.get(p);
  if (!e) {
    console.error(`translation-status: no English entry at ${p}`);
    process.exit(1);
  }
  console.log(`${p}\n  sourceHash: "${translationHash(e)}"\n  sourceUpdated: "${e.updated}"`);
  process.exit(0);
}

const rows = translations.map((t) => {
  const e = english.get(t.enPath);
  const { status, currentHash } = translationStatus(t, e);
  return {
    path: t.path,
    english: t.enPath,
    status,
    translatedOn: t.translatedOn,
    sourceUpdated: t.sourceUpdated,
    englishUpdated: e?.updated ?? null,
    sourceHash: t.sourceHash,
    currentHash,
  };
});
const order = { orphan: 0, stale: 1, current: 2 };
rows.sort((a, b) => order[a.status] - order[b.status] || a.path.localeCompare(b.path));

if (args.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const count = (s) => rows.filter((r) => r.status === s).length;
console.log(`pt-BR translations: ${rows.length} — ${count("current")} current, ${count("stale")} stale, ${count("orphan")} orphaned`);
console.log("");
const w = Math.max(...rows.map((r) => r.path.length), 4);
console.log(`${"page".padEnd(w)}  status   translated  from EN of  EN now     hash`);
for (const r of rows) {
  const hash = r.status === "current" ? r.sourceHash : `${r.sourceHash} -> ${r.currentHash ?? "(no English page)"}`;
  console.log(
    `${r.path.padEnd(w)}  ${r.status.padEnd(7)}  ${r.translatedOn}  ${r.sourceUpdated}  ${(r.englishUpdated ?? "-").padEnd(10)} ${hash}`,
  );
}
if (count("stale") || count("orphan")) {
  console.log("");
  console.log("Stale: re-translate from the English page as it stands, then record the new hash (--hash <english path>).");
  console.log("Orphaned: the English page is gone; delete the translation file in the same change.");
}
