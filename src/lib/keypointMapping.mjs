/**
 * The mapping core of /tools/keypoint-playground.
 *
 * Pure functions over the generated keypoint dataset (src/data/poseKeypoints.ts,
 * passed in rather than imported, so the page, the client component and
 * scripts/keypoint-mapping.test.mjs all run exactly this code on exactly that
 * data). Nothing here knows an anatomical fact. A pair between two schemes is
 * emitted only when the dataset's own crosswalk has a row holding a cell for
 * both schemes, which is the dataset's name-identity rule; every other point
 * is reported as unmapped, by name, instead of being guessed.
 *
 * Plain .mjs (with keypointMapping.d.mts beside it) so `node --test` runs it
 * without a build step.
 */

/** @typedef {{ index: number | null; name: string; key: string }} KPoint */
/** @typedef {{ slug: string; shortName: string; indexed: boolean; points: KPoint[] }} KScheme */
/** @typedef {{ key: string; label: string; cells: { scheme: string; index: number | null; name: string }[] }} KRow */

/** @param {KScheme[]} schemes @param {string} slug */
export function schemeOf(schemes, slug) {
  return schemes.find((s) => s.slug === slug) ?? null;
}

/** "13 left_knee", or Apple's bare name. */
export function label(p) {
  return p.index !== null ? `${p.index} ${p.name}` : p.name;
}

/**
 * The selected point's counterpart in every scheme: the crosswalk cell for
 * that scheme when the row has one, else null ("not in this scheme"). A key
 * with no crosswalk row belongs to its own scheme only.
 *
 * @param {KScheme[]} schemes @param {KRow[]} crosswalk @param {string} fromSlug @param {string} key
 */
export function jointAcross(schemes, crosswalk, fromSlug, key) {
  const from = schemeOf(schemes, fromSlug);
  const point = from?.points.find((p) => p.key === key) ?? null;
  if (!from || !point) return null;
  const row = crosswalk.find((r) => r.key === key) ?? null;
  return {
    point,
    row,
    cells: schemes.map((s) => {
      if (s.slug === fromSlug) return { scheme: s.slug, point };
      const cell = row?.cells.find((c) => c.scheme === s.slug) ?? null;
      return { scheme: s.slug, point: cell ? { index: cell.index, name: cell.name, key } : null };
    }),
  };
}

/**
 * Every pair the dataset supports from one scheme to another, in the from
 * scheme's own order, plus the points on each side that have none.
 *
 * @param {KScheme[]} schemes @param {KRow[]} crosswalk @param {string} fromSlug @param {string} toSlug
 */
export function mappingBetween(schemes, crosswalk, fromSlug, toSlug) {
  const from = schemeOf(schemes, fromSlug);
  const to = schemeOf(schemes, toSlug);
  if (!from || !to || fromSlug === toSlug) return null;
  const byKey = new Map(crosswalk.map((r) => [r.key, r]));
  /** @type {{ key: string; from: KPoint; to: { index: number | null; name: string } }[]} */
  const pairs = [];
  const unmappedFrom = [];
  for (const p of from.points) {
    const row = byKey.get(p.key);
    const a = row?.cells.find((c) => c.scheme === fromSlug);
    const b = row?.cells.find((c) => c.scheme === toSlug);
    // `a` must be this very point: the crosswalk is the authority, and a
    // cell that names a different spelling would mean the row is not ours.
    if (row && a && b && a.name === p.name && a.index === p.index) {
      pairs.push({ key: p.key, from: p, to: { index: b.index, name: b.name } });
    } else unmappedFrom.push(p);
  }
  const reached = new Set(pairs.map((x) => x.key));
  const unmappedTo = to.points.filter((p) => !reached.has(p.key));
  return { from, to, pairs, unmappedFrom, unmappedTo };
}

/** Count of supported pairs over every ordered pair of distinct schemes. */
export function totalPairs(schemes, crosswalk) {
  let ordered = 0;
  let schemePairsWithAny = 0;
  for (const a of schemes) {
    for (const b of schemes) {
      if (a.slug === b.slug) continue;
      const m = mappingBetween(schemes, crosswalk, a.slug, b.slug);
      ordered += m.pairs.length;
      if (m.pairs.length) schemePairsWithAny++;
    }
  }
  return { ordered, unordered: ordered / 2, schemePairsWithAny: schemePairsWithAny / 2 };
}

const constName = (s) => s.shortName.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
const tsKey = (p) => (p.index !== null ? String(p.index) : JSON.stringify(p.name));
const pyKey = tsKey; // JSON string quoting is valid Python for these ASCII names.
const tsType = (s) => (s.indexed ? "number" : "string");
const pyType = (s) => (s.indexed ? "int" : "str");

/** Wrap a list of labels into comment lines no wider than ~88 characters. */
function wrapList(prefix, items) {
  const lines = [];
  let line = "";
  for (const it of items) {
    const next = line ? `${line}, ${it}` : it;
    if (`${prefix} ${next}`.length > 88 && line) {
      lines.push(`${prefix} ${line},`);
      line = it;
    } else line = next;
  }
  if (line) lines.push(`${prefix} ${line}`);
  return lines;
}

/**
 * A copyable TypeScript or Python dict from one scheme's indices (or Apple
 * names) to another's. Unmapped points are listed in a comment, never given
 * a value.
 *
 * @param {ReturnType<typeof mappingBetween>} m
 * @param {"ts" | "py"} lang
 * @param {{ fetchedOn: string; url: string }} meta
 */
export function snippet(m, lang, meta) {
  if (!m) return "";
  const c = lang === "py" ? "#" : "//";
  const name = `${constName(m.from)}_TO_${constName(m.to)}`;
  const head = [
    `${c} ${m.from.shortName} -> ${m.to.shortName}: ${m.pairs.length} of ${m.from.points.length} ${m.from.shortName} points have a name match.`,
    `${c} From the aifitnessapi.com keypoint crosswalk (sources read ${meta.fetchedOn}): a pair exists`,
    `${c} only where both names match after lowercasing and dropping non-alphanumerics.`,
    `${c} A name match is not a guarantee that two models place the point identically.`,
    `${c} ${meta.url}`,
  ];
  const body =
    m.pairs.length === 0
      ? [`${c} The dataset has no name equivalence between these two schemes, so nothing is mapped.`]
      : [];
  const entries = m.pairs.map((x) => {
    const k = lang === "py" ? pyKey(x.from) : tsKey(x.from);
    const v = lang === "py" ? pyKey(x.to) : tsKey(x.to);
    return `    ${k}: ${v},  ${c} ${x.from.name} -> ${x.to.name}`;
  });
  const decl =
    lang === "py"
      ? [`${name}: dict[${pyType(m.from)}, ${pyType(m.to)}] = {`, ...entries, "}"]
      : [`export const ${name}: Readonly<Record<${tsType(m.from)}, ${tsType(m.to)}>> = {`, ...entries.map((e) => e.replace(/^ {4}/, "  ")), "};"];
  const tail = m.unmappedFrom.length
    ? [
        `${c} No name match in ${m.to.shortName} (${m.unmappedFrom.length}; left out, not guessed):`,
        ...wrapList(c, m.unmappedFrom.map(label)),
      ]
    : [`${c} Every ${m.from.shortName} point has a name match in ${m.to.shortName}.`];
  return [...head, ...body, ...decl, ...tail].join("\n") + "\n";
}

/**
 * Read ?from=&to=&joint= against the data, falling back to defaults for
 * anything the dataset does not hold (a stale or hand-edited link).
 */
export function parseState(schemes, search, defaults) {
  const q = new URLSearchParams(search);
  const pick = (v, d) => (v && schemeOf(schemes, v) ? v : d);
  const from = pick(q.get("from"), defaults.from);
  let to = pick(q.get("to"), defaults.to);
  if (to === from) to = schemes.find((s) => s.slug !== from)?.slug ?? to;
  const j = q.get("joint");
  const fromScheme = schemeOf(schemes, from);
  const joint = j && fromScheme?.points.some((p) => p.key === j) ? j : fromScheme?.points.some((p) => p.key === defaults.joint) ? defaults.joint : fromScheme?.points[0]?.key ?? "";
  return { from, to, joint };
}
