import fs from "node:fs";
import path from "node:path";
import { resolvedLicences } from "@/lib/contentLicences";
import { fold } from "@/lib/contentLicencesCore.mjs";
import { MIGRATION, UNVERIFIED_RAPIDAPI_NOTE, VARIANTS, citedRefs } from "@/lib/exerciseDbSniffer.mjs";

/**
 * Build-time data for the "Which ExerciseDB is this?" sniffer
 * (src/components/ExerciseDbSniffer.tsx): every evidence row the rules in
 * src/lib/exerciseDbSniffer.mjs cite, resolved to its URL and quote, and each
 * variant's "Can I ship it?" row and notes from src/lib/contentLicences.ts.
 * Throws on a missing row or a quote without its wording, so a broken rule
 * fails the build as well as scripts/open-exercises.test.mjs.
 */

export type SnifferSource = { url: string; quote: string };
export type SnifferCell = { label: string; value: string; text: string | null; urls: string[] };
export type SnifferVariant = {
  id: string;
  label: string;
  isExerciseDb: boolean;
  row: { name: string; page: { href: string; label: string }; cells: SnifferCell[] } | null;
  notes: { text: string; urls: string[] }[];
  migration: { href: string; label: string }[];
};
export type SnifferData = {
  evidence: Record<string, SnifferSource>;
  variants: Record<string, SnifferVariant>;
  rapidapiNote: { text: string; urls: string[] };
  notStated: string;
};

const EVIDENCE_DIR = path.join(process.cwd(), "ops/sources/evidence");

export const refKey = (ref: readonly [string, number, string]) => `${ref[0]}#${ref[1]}`;

export function snifferData(): SnifferData {
  const files = new Map<string, { url: string; quote: string }[]>();
  const evidence: Record<string, SnifferSource> = {};
  for (const ref of citedRefs() as [string, number, string][]) {
    const [file, i, key] = ref;
    if (!files.has(file)) files.set(file, JSON.parse(fs.readFileSync(path.join(EVIDENCE_DIR, `${file}.json`), "utf8")));
    const row = files.get(file)![i];
    if (!row) throw new Error(`exercisedb sniffer: ${file}.json has no row ${i}`);
    if (!fold(row.quote).includes(fold(key))) throw new Error(`exercisedb sniffer: ${file}.json row ${i} does not contain "${key}"`);
    evidence[refKey(ref)] = { url: row.url, quote: row.quote };
  }

  const lic = resolvedLicences();
  const urlsOf = (ns: number[]) => ns.map((n) => lic.sources[n - 1].url);
  const notes = lic.notes.map((n) => ({ text: n.text, urls: urlsOf(n.sources) }));
  const variants: Record<string, SnifferVariant> = {};
  for (const [id, v] of Object.entries(VARIANTS)) {
    const r = v.row ? lic.rows.find((x) => x.id === v.row) : null;
    if (v.row && !r) throw new Error(`exercisedb sniffer: no "Can I ship it?" row ${v.row}`);
    variants[id] = {
      id,
      label: v.label,
      isExerciseDb: v.isExerciseDb,
      row: r
        ? {
            name: r.name,
            page: r.page,
            cells: lic.columns.map((c) => {
              const cell = r.cells[c.id];
              return { label: c.label, value: cell.value, text: cell.text ?? null, urls: urlsOf(cell.sources) };
            }),
          }
        : null,
      notes: v.notes.map((i) => {
        if (!notes[i]) throw new Error(`exercisedb sniffer: no ExerciseDB note ${i}`);
        return notes[i];
      }),
      migration: MIGRATION[id as keyof typeof MIGRATION] ?? [],
    };
  }
  return { evidence, variants, rapidapiNote: notes[UNVERIFIED_RAPIDAPI_NOTE], notStated: lic.notStated };
}
