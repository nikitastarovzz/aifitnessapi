import fs from "node:fs";
import path from "node:path";
import { CONTENT_LICENCES, type LicenceColumnId, type LicenceKind, type LicenceRef } from "@/data/contentLicences";
import { COLUMNS, NOT_STATED, filesCited, licenceProblems } from "@/lib/contentLicencesCore.mjs";
import { clusterMap } from "@/lib/clusterRegistry";
import { urlKey } from "@/lib/keyFacts";

/**
 * Resolves "Can I ship it?" (src/data/contentLicences.ts) for rendering: each
 * cited [file, row, key] becomes the row's URL and verbatim quote, numbered
 * once per page, with the date the page that evidence file belongs to says it
 * checked that URL. Build-time only (reads ops/sources/evidence/ with fs, as
 * src/lib/keyFacts.ts does) and throws on any problem licenceProblems finds,
 * so a bad citation fails the build as well as the unit test.
 */

/** English pages that render the table, and which kind of source they open on. */
export const CONTENT_LICENCE_PAGES: Record<string, LicenceKind> = {
  "/pricing/exercise-database-api-pricing": "exercise",
  "/alternatives/exercisedb-alternatives": "exercise",
  "/fitness-apis/exercise-database-apis": "exercise",
  "/fitness-apis/nutrition-apis": "nutrition",
  "/pricing/nutrition-api-pricing": "nutrition",
  "/pricing/nutritionix-api-pricing": "nutrition",
  "/alternatives/nutritionix-alternatives": "nutrition",
};

export type ResolvedSource = { n: number; url: string; quote: string; checked: string };
export type ResolvedCell = { value: string; text?: string; sources: number[] };
export type ResolvedRow = {
  id: string;
  name: string;
  kind: LicenceKind;
  page: { href: string; label: string };
  /** Earliest and latest date the cited sources were checked. */
  checked: { from: string; to: string };
  cells: Record<LicenceColumnId, ResolvedCell>;
};
export type ResolvedNote = { text: string; sources: number[] };
export type ResolvedLicences = {
  columns: { id: LicenceColumnId; label: string; values: string[] }[];
  rows: ResolvedRow[];
  notes: ResolvedNote[];
  sources: ResolvedSource[];
  notStated: string;
};

const EVIDENCE_DIR = path.join(process.cwd(), "ops/sources/evidence");

/**
 * The date the page an evidence file belongs to checked `url`: the matching
 * entry of its `sources`, else the page's own `updated` stamp.
 */
function checkedDate(file: string, url: string, clusters: ReturnType<typeof clusterMap>): string {
  const base = Object.keys(clusters)
    .filter((b) => file.startsWith(`${b.slice(1).replace(/\//g, "-")}-`))
    .sort((a, b) => b.length - a.length)[0];
  if (!base) throw new Error(`content licences: no cluster for evidence file ${file}`);
  const slug = file.slice(base.length);
  const entry = clusters[base].find((e) => e.slug === slug);
  if (!entry) throw new Error(`content licences: evidence file ${file} names no released page`);
  const key = urlKey(url);
  return entry.sources?.find((s) => urlKey(s.url) === key)?.checked ?? entry.updated;
}

let cached: ResolvedLicences | null = null;

export function resolvedLicences(): ResolvedLicences {
  if (cached) return cached;
  const files: Record<string, { claim: string; url: string; quote: string }[]> = {};
  for (const f of filesCited(CONTENT_LICENCES)) files[f] = JSON.parse(fs.readFileSync(path.join(EVIDENCE_DIR, `${f}.json`), "utf8"));
  const problems = licenceProblems(CONTENT_LICENCES, files);
  if (problems.length) throw new Error(`content licences:\n${problems.join("\n")}`);

  const clusters = clusterMap();
  const sources: ResolvedSource[] = [];
  const index = new Map<string, number>();
  const number = ([file, i]: LicenceRef): number => {
    const row = files[file][i];
    const k = `${row.url}\n${row.quote}`;
    let n = index.get(k);
    if (n === undefined) {
      n = sources.length + 1;
      index.set(k, n);
      sources.push({ n, url: row.url, quote: row.quote, checked: checkedDate(file, row.url, clusters) });
    }
    return n;
  };
  const uniq = (xs: number[]) => [...new Set(xs)];

  const rows: ResolvedRow[] = CONTENT_LICENCES.rows.map((r) => {
    const cells = Object.fromEntries(
      COLUMNS.map((c) => {
        const cell = r.cells[c.id as LicenceColumnId];
        return [c.id, { value: cell.value, ...(cell.text ? { text: cell.text } : {}), sources: uniq(cell.ev.map(number)) }];
      }),
    ) as Record<LicenceColumnId, ResolvedCell>;
    const dates = Object.values(cells)
      .flatMap((c) => c.sources)
      .map((n) => sources[n - 1].checked)
      .sort();
    return { id: r.id, name: r.name, kind: r.kind, page: r.page, checked: { from: dates[0], to: dates[dates.length - 1] }, cells };
  });
  const notes = CONTENT_LICENCES.notes.map((n) => ({ text: n.text, sources: uniq(n.ev.map(number)) }));

  cached = {
    columns: COLUMNS.map((c) => ({ id: c.id as LicenceColumnId, label: c.label, values: [...c.values] })),
    rows,
    notes,
    sources,
    notStated: NOT_STATED,
  };
  return cached;
}
