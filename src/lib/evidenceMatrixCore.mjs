/**
 * The logic behind evidence-backed comparison matrices
 * (src/lib/evidenceMatrix.ts; /tools/gym-software-api-matrix,
 * /tools/research-platform-chooser and /tools/aggregator-chooser). Plain
 * JavaScript so the unit tests (scripts/evidence-matrix.test.mjs), qa and the
 * pages run the same code.
 *
 * A cell is { value: "yes" | "no" | "unknown", text, ev }: `ev` lists row
 * indices of the page's evidence file, whose verbatim quotes the page prints
 * beside the cell. An entry may instead be a string "<file>#<index>" (see
 * `at`) naming a row of another evidence file: the aggregator chooser draws
 * on the roundup's, the pricing pages', the compare pages' and the
 * alternatives pages' files. "unknown" means the passages read do not say; it
 * is never a "no".
 *
 * A row may list `hosts`: then every quote it cites must come from one of
 * them, so a mistyped index cannot hand one vendor another vendor's quote.
 */

export const UNKNOWN_TEXT = "Not stated in the passages read";

/** @typedef {number | string} EvRef */
/** @typedef {{ value: "yes" | "no" | "unknown", text: string, ev: EvRef[] }} Cell */

/** @param {string} text @param {...EvRef} ev @returns {Cell} */
export const yes = (text, ...ev) => ({ value: "yes", text, ev });
/** @param {string} text @param {...EvRef} ev @returns {Cell} */
export const no = (text, ...ev) => ({ value: "no", text, ev });
/** @param {string} [text] @param {...EvRef} ev @returns {Cell} */
export const unknown = (text = UNKNOWN_TEXT, ...ev) => ({ value: "unknown", text, ev });

/** A reference to row `i` of another evidence file. @param {string} file @param {number} i @returns {string} */
export const at = (file, i) => `${file}#${i}`;

/**
 * The evidence row an ev entry names, or undefined.
 * @param {EvRef} ref
 * @param {{ quote: string, url: string }[]} evidence
 * @param {Record<string, { quote: string, url: string }[]>} [files]
 */
export function rowOf(ref, evidence, files = {}) {
  if (typeof ref === "number") return Number.isInteger(ref) && ref >= 0 ? evidence[ref] : undefined;
  const m = /^([a-z0-9-]+)#(\d+)$/.exec(String(ref));
  return m ? files[m[1]]?.[Number(m[2])] : undefined;
}

/** The evidence files a matrix cites: its own first, then every other one named. */
export function filesCited(m) {
  const out = new Set([m.evidenceFile]);
  for (const r of m.rows) for (const c of Object.values(r.cells)) for (const e of c.ev) if (typeof e === "string") out.add(e.split("#")[0]);
  return [...out];
}

const hostOf = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

/**
 * Every problem with a matrix: missing cells, dangling evidence, a value with
 * no evidence, a text column marked "no", a quote from another vendor's host.
 * @param {{ id: string, columns: { id: string, kind: string }[], rows: { id: string, hosts?: string[], cells: Record<string, { value: string, text: string, ev: EvRef[] }> }[] }} m
 * @param {{ quote: string, url: string }[]} evidence
 * @param {Record<string, { quote: string, url: string }[]>} [files]
 */
export function matrixProblems(m, evidence, files = {}) {
  const out = [];
  const colIds = new Set(m.columns.map((c) => c.id));
  const rowIds = new Set();
  for (const r of m.rows) {
    if (rowIds.has(r.id)) out.push(`${m.id}: duplicate row ${r.id}`);
    rowIds.add(r.id);
    for (const c of m.columns) {
      const cell = r.cells[c.id];
      if (!cell) {
        out.push(`${m.id}: ${r.id} has no ${c.id} cell`);
        continue;
      }
      if (!["yes", "no", "unknown"].includes(cell.value)) out.push(`${m.id}: ${r.id}.${c.id} has value ${cell.value}`);
      if (c.kind === "text" && cell.value === "no") out.push(`${m.id}: ${r.id}.${c.id} is a text column and cannot be "no"`);
      if (cell.value !== "unknown" && cell.ev.length === 0) out.push(`${m.id}: ${r.id}.${c.id} says ${cell.value} with no evidence`);
      if (cell.value === "unknown" && cell.ev.length === 0 && cell.text !== UNKNOWN_TEXT)
        out.push(`${m.id}: ${r.id}.${c.id} is unknown but carries its own text without evidence`);
      for (const i of cell.ev) {
        const row = rowOf(i, evidence, files);
        if (!row) {
          out.push(`${m.id}: ${r.id}.${c.id} cites evidence row ${i}, which does not exist`);
          continue;
        }
        const h = hostOf(row.url);
        if (r.hosts?.length && !r.hosts.some((x) => h === x || h.endsWith(`.${x}`)))
          out.push(`${m.id}: ${r.id}.${c.id} cites evidence row ${i}, a quote from ${h || row.url}, not from ${r.hosts.join(" or ")}`);
      }
    }
    for (const k of Object.keys(r.cells)) if (!colIds.has(k)) out.push(`${m.id}: ${r.id} has a cell for unknown column ${k}`);
  }
  return out;
}

/** The matrix with each cell's quotes attached. Throws on any problem. */
export function resolveWith(m, evidence, files = {}) {
  const problems = matrixProblems(m, evidence, files);
  if (problems.length) throw new Error(`evidence matrix ${m.id}:\n${problems.join("\n")}`);
  return {
    ...m,
    rows: m.rows.map((r) => ({
      ...r,
      cells: Object.fromEntries(
        Object.entries(r.cells).map(([k, c]) => [
          k,
          {
            ...c,
            sources: c.ev.map((i) => {
              const e = rowOf(i, evidence, files);
              return { url: e.url, quote: e.quote };
            }),
          },
        ]),
      ),
    })),
  };
}

/**
 * Rows ordered by how many of the required features they are documented to
 * have ("yes"), then by name. A ranking of documentation, not of products.
 * @template {{ name: string, cells: Record<string, { value: string }> }} T
 * @param {T[]} rows @param {string[]} required
 * @returns {{ row: T, met: number, missing: string[] }[]}
 */
export function rankRows(rows, required) {
  return rows
    .map((row) => {
      const missing = required.filter((id) => row.cells[id]?.value !== "yes");
      return { row, met: required.length - missing.length, missing };
    })
    .sort((a, b) => b.met - a.met || a.row.name.localeCompare(b.row.name));
}
