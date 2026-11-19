/**
 * The logic behind "Can I ship it?" (src/data/contentLicences.ts,
 * src/components/ContentLicences.tsx): free tiers, prices and commercial terms
 * for the exercise and nutrition sources the site's pages already cover.
 * Plain JavaScript so the unit test (scripts/content-licences.test.mjs) and the
 * pages run the same checks.
 *
 * A cell is { value, text, ev }. `value` is one of its column's values; `ev`
 * lists [evidenceFile, rowIndex, key] triples, each naming a row of
 * ops/sources/evidence/<evidenceFile>.json whose verbatim quote must contain
 * `key` (compared after folding case, curly quotes and whitespace). So a cell
 * cannot say "Commercial use Yes" unless the quote it cites says so.
 *
 * "not stated" means the passages read do not say. It carries no text of its
 * own unless it also cites the quotes the text describes.
 */

export const NOT_STATED = "not stated";

/** Column order is display order. `values` is also the sort order, best documented first. */
export const COLUMNS = [
  { id: "free", label: "Free tier", values: ["yes", "trial only", "no", NOT_STATED] },
  { id: "paid", label: "Paid from", values: ["price", "free", NOT_STATED] },
  { id: "commercial", label: "Commercial use", values: ["allowed", "allowed with conditions", "not allowed", NOT_STATED] },
  { id: "attribution", label: "Attribution", values: ["required", "requested", "per entry", "not required", "sources disagree", NOT_STATED] },
  { id: "media", label: "Images or video", values: ["yes", "no", NOT_STATED] },
  { id: "copy", label: "Self-host or keep a copy", values: ["yes", "on some plans", "separate deal", "no", NOT_STATED] },
  { id: "licence", label: "License or terms", values: ["stated", NOT_STATED] },
];

export const KINDS = ["exercise", "nutrition"];

/** Fold the differences a copied quote picks up: case, curly quotes, runs of whitespace. */
export function fold(s) {
  return String(s)
    .normalize("NFKC")
    .replace(/[‘’′]/g, "'")
    .replace(/[“”″]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** A `not stated` cell with nothing to say. */
export const unstated = () => ({ value: NOT_STATED, ev: [] });

const hostOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

/**
 * Every problem with one cited triple, or [] when it holds.
 * @param {[string, number, string]} ref
 * @param {Record<string, { quote: string, url: string }[]>} files
 * @param {string[]} [hosts]
 */
export function refProblems(ref, files, hosts) {
  const [file, i, key] = ref;
  const where = `${file}#${i}`;
  const rows = files[file];
  if (!rows) return [`${where}: no evidence file ops/sources/evidence/${file}.json`];
  const row = Number.isInteger(i) && i >= 0 ? rows[i] : undefined;
  if (!row) return [`${where}: the file has no row ${i}`];
  const out = [];
  if (!key || !fold(key)) out.push(`${where}: no key wording given`);
  else if (!fold(row.quote).includes(fold(key))) out.push(`${where}: quote does not contain ${JSON.stringify(key)}`);
  if (!/^https:\/\//.test(row.url)) out.push(`${where}: url ${row.url} is not https`);
  const h = hostOf(row.url);
  if (hosts?.length && !hosts.some((x) => h === x || h.endsWith(`.${x}`)))
    out.push(`${where}: a quote from ${h || row.url}, not from ${hosts.join(" or ")}`);
  return out;
}

/**
 * Every problem with the table: missing or unknown cells, values outside a
 * column, a stated value with no evidence, a note with no evidence, and every
 * problem with each cited quote.
 * @param {{ rows: { id: string, name: string, kind: string, hosts: string[], cells: Record<string, { value: string, text?: string, ev: [string, number, string][] }> }[] }} table
 * @param {Record<string, { quote: string, url: string }[]>} files
 */
export function licenceProblems(table, files) {
  const out = [];
  const ids = new Set();
  const colIds = new Set(COLUMNS.map((c) => c.id));
  for (const r of table.rows) {
    if (ids.has(r.id)) out.push(`${r.id}: duplicate row`);
    ids.add(r.id);
    if (!KINDS.includes(r.kind)) out.push(`${r.id}: kind ${r.kind}`);
    if (!r.hosts?.length) out.push(`${r.id}: no hosts`);
    for (const c of COLUMNS) {
      const cell = r.cells[c.id];
      const at = `${r.id}.${c.id}`;
      if (!cell) {
        out.push(`${at}: missing`);
        continue;
      }
      if (!c.values.includes(cell.value)) out.push(`${at}: value ${JSON.stringify(cell.value)} is not one of ${c.values.join(" | ")}`);
      const hasText = typeof cell.text === "string" && cell.text.trim().length > 0;
      if (cell.value !== NOT_STATED && cell.ev.length === 0) out.push(`${at}: says ${cell.value} with no evidence`);
      if (cell.value !== NOT_STATED && !hasText) out.push(`${at}: says ${cell.value} with no text`);
      if (cell.value === NOT_STATED && hasText !== cell.ev.length > 0)
        out.push(`${at}: a "not stated" cell carries text only together with the quotes it describes`);
      for (const ref of cell.ev) for (const p of refProblems(ref, files, r.hosts)) out.push(`${at}: ${p}`);
    }
    for (const k of Object.keys(r.cells)) if (!colIds.has(k)) out.push(`${r.id}: cell for unknown column ${k}`);
  }
  for (const n of table.notes ?? []) {
    if (!n.text?.trim()) out.push(`note: empty text`);
    for (const ref of n.ev) for (const p of refProblems(ref, files)) out.push(`note "${n.text.slice(0, 40)}": ${p}`);
  }
  return out;
}

/** Every evidence file the table cites. */
export function filesCited(table) {
  const out = new Set();
  for (const r of table.rows) for (const c of Object.values(r.cells)) for (const [f] of c.ev) out.add(f);
  for (const n of table.notes ?? []) for (const [f] of n.ev) out.add(f);
  return [...out].sort();
}

/** How many cells say "not stated", by column, and in all. */
export function unstatedCounts(table) {
  const by = Object.fromEntries(COLUMNS.map((c) => [c.id, 0]));
  let total = 0;
  for (const r of table.rows)
    for (const c of COLUMNS)
      if (r.cells[c.id]?.value === NOT_STATED) {
        by[c.id]++;
        total++;
      }
  return { by, total, cells: table.rows.length * COLUMNS.length };
}
