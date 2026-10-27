/**
 * The translation store, shared by the site build, scripts/qa.mjs and
 * scripts/translation-status.mjs. Plain ESM so the scripts can import it
 * without a TypeScript loader; src/lib/translations.ts wraps it for the site.
 *
 * A translation is one markdown file per English page under
 * content/translations/<locale>/<cluster>/<slug>.md: YAML front matter for
 * the short fields, the translated body after it. Each file records
 * `sourceHash`, the hash of the English entry's translatable fields at the
 * moment it was translated. When the English page changes, its hash moves,
 * the two stop matching, and the translation is stale: the site then stops
 * presenting it as current (noindex, out of the sitemap and hreflang, a
 * visible notice pointing at the English page). Nothing about the English
 * page is blocked by a translation falling behind.
 *
 * ONE hash function, here, used by every reader. qa recomputes the status
 * from the English entries and checks that the built page renders the same
 * status, so a second copy drifting would fail the build rather than ship.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const TRANSLATION_ROOT = "content/translations";

/** The locales with a translation store, keyed by URL prefix segment. */
export const LOCALES = { "pt-br": { dir: "pt-BR", lang: "pt-BR", ogLocale: "pt_BR" } };

/**
 * The English fields a translation renders. Anything here changing makes a
 * translation stale; anything not here (the `updated` stamp, `sources`,
 * `primaryQuery`) is not translated text, and the translated page reads it
 * live from the English entry. An English re-verification that changes no
 * text therefore leaves the translation current, and the page shows the new
 * verification date, which is then true of the translated text too.
 */
export function translatableFields(entry) {
  return {
    h1: entry.h1,
    metaTitle: entry.metaTitle,
    metaDescription: entry.metaDescription,
    answer: entry.answer,
    body: entry.body,
    faqs: (entry.faqs ?? []).map((f) => ({ q: f.q, a: f.a })),
    related: (entry.related ?? []).map((r) => ({ href: r.href, label: r.label })),
    cta: { pitch: entry.cta?.pitch ?? "" },
    steps: (entry.steps ?? []).map((s) => ({ name: s.name, text: s.text })),
    firstParty: entry.firstParty === true,
  };
}

/** 16 hex characters of SHA-256 over the translatable fields, in fixed key order. */
export function translationHash(entry) {
  return crypto.createHash("sha256").update(JSON.stringify(translatableFields(entry))).digest("hex").slice(0, 16);
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const str = (v) => typeof v === "string" && v.trim() !== "";

/**
 * Every translation file for one locale, validated. A malformed file throws:
 * a translation with a missing field would render a half-English page, which
 * is worse than a failed build.
 */
export function loadTranslations(prefix = "pt-br", root = process.cwd()) {
  const locale = LOCALES[prefix];
  if (!locale) throw new Error(`translationStore: unknown locale prefix ${prefix}`);
  const dir = path.join(root, TRANSLATION_ROOT, locale.dir);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const cluster of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!cluster.isDirectory()) continue;
    for (const f of fs.readdirSync(path.join(dir, cluster.name)).sort()) {
      if (!f.endsWith(".md")) continue;
      const file = path.join(TRANSLATION_ROOT, locale.dir, cluster.name, f);
      const { data, content } = matter(fs.readFileSync(path.join(root, file), "utf8"));
      const enPath = `/${cluster.name}/${f.replace(/\.md$/, "")}`;
      const bad = (why) => {
        throw new Error(`translationStore: ${file}: ${why}`);
      };
      if (data.path !== enPath) bad(`path "${data.path}" does not match its location (${enPath})`);
      for (const k of ["translatedOn", "sourceUpdated"]) {
        if (!ISO_DAY.test(String(data[k] ?? ""))) bad(`${k} must be a quoted YYYY-MM-DD string`);
      }
      if (!/^[0-9a-f]{16}$/.test(String(data.sourceHash ?? ""))) bad("sourceHash must be 16 hex characters");
      for (const k of ["metaTitle", "metaDescription", "h1", "answer", "cta"]) if (!str(data[k])) bad(`${k} missing`);
      if (!Array.isArray(data.faqs) || data.faqs.some((x) => !str(x?.q) || !str(x?.a))) bad("faqs must be a list of {q, a}");
      if (!Array.isArray(data.related) || data.related.some((x) => !str(x?.href) || !str(x?.label))) {
        bad("related must be a list of {href, label}");
      }
      const steps = data.steps ?? [];
      if (!Array.isArray(steps) || steps.some((x) => !str(x?.name) || !str(x?.text))) bad("steps must be a list of {name, text}");
      if (!str(content)) bad("empty body");
      out.push({
        file,
        prefix,
        lang: locale.lang,
        enPath,
        path: `/${prefix}${enPath}`,
        translatedOn: data.translatedOn,
        sourceUpdated: data.sourceUpdated,
        sourceHash: data.sourceHash,
        metaTitle: data.metaTitle.trim(),
        metaDescription: data.metaDescription.trim(),
        h1: data.h1.trim(),
        answer: data.answer.trim(),
        cta: data.cta.trim(),
        faqs: data.faqs.map((x) => ({ q: x.q.trim(), a: x.a.trim() })),
        related: data.related.map((x) => ({ href: x.href.trim(), label: x.label.trim() })),
        steps: steps.map((x) => ({ name: x.name.trim(), text: x.text.trim() })),
        body: content.trim(),
      });
    }
  }
  return out.sort((a, b) => a.enPath.localeCompare(b.enPath));
}

/**
 * The English entries, read straight from src/data/<cluster>.entries.ts for
 * the scripts (the site uses the cluster registry instead). Those files are
 * JSON arrays behind a typed `export const`, which is what lets plain Node
 * read them. Only the clusters a translation names are read, and each is
 * resolved through the module that imports it, exactly as
 * scripts/backfill-published.mjs resolves URL bases.
 */
export function loadEnglishEntries(clusters, root = process.cwd()) {
  const DATA = path.join(root, "src/data");
  const modules = fs.readdirSync(DATA).filter((f) => f.endsWith(".ts") && !f.endsWith(".entries.ts"));
  const out = new Map();
  for (const file of fs.readdirSync(DATA).filter((f) => f.endsWith(".entries.ts"))) {
    const stem = file.replace(/\.ts$/, "");
    const importer = modules.find((m) => fs.readFileSync(path.join(DATA, m), "utf8").includes(`from "./${stem}"`));
    if (!importer) continue;
    const src = fs.readFileSync(path.join(DATA, importer), "utf8");
    const ref = src.match(/basePath:\s*(?:"([^"]*)"|([A-Z_][A-Z0-9_]*))/);
    const base = ref?.[1] ?? (ref?.[2] ? src.match(new RegExp(`const ${ref[2]}\\s*=\\s*"([^"]*)"`))?.[1] : undefined);
    if (!base || !clusters.includes(base)) continue;
    const raw = fs.readFileSync(path.join(DATA, file), "utf8");
    const at = raw.indexOf("=\n[");
    if (at === -1) throw new Error(`translationStore: ${file} is not a JSON array export`);
    const list = JSON.parse(raw.slice(at + 1).trim().replace(/;\s*$/, ""));
    for (const e of list) out.set(`${base}/${e.slug}`, e);
  }
  return out;
}

/** current | stale | orphan (the English page no longer exists). */
export function translationStatus(t, enEntry) {
  if (!enEntry) return { status: "orphan", currentHash: null };
  const currentHash = translationHash(enEntry);
  return { status: currentHash === t.sourceHash ? "current" : "stale", currentHash };
}
