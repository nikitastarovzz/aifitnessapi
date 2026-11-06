/**
 * The visual history of fitness and health APIs (/history,
 * ops/VIRAL-20-2026-11-06.md item 10): the model and the SVG.
 *
 * One drawing, two outputs. src/app/history/page.tsx inlines historySvg()
 * for the interactive timeline (the filters show and hide its marks by their
 * data attributes), and scripts/build-history.mjs writes the same drawing,
 * with a title block and footer, to public/history/ as the poster SVG and a
 * PNG printed by Playwright's Chromium. scripts/history.test.mjs tests both.
 *
 * Inputs are the two hand-sourced records, passed in as plain arrays so this
 * file has no imports: GRAVEYARD (src/data/graveyard.ts) and CHANGE_EVENTS
 * (src/data/changes.ts). Nothing is typed in here except the vendor lexicon,
 * which only says which company a record's own title names.
 *
 * Rules this file keeps:
 * - A date is drawn at its source's precision: a day is a point, a month is a
 *   bar across that month, a year a bar across that year. Never sharpened.
 *   Undated graveyard entries are listed, not placed.
 * - Every mark links its source: a graveyard date links the vendor page (or
 *   archive capture, or registry record) it quotes; a tracker entry links the
 *   page on this site that carries its quote, which is where its source is.
 * - A tracker entry dated the same as a graveyard date for the same page is
 *   one event: it is drawn once, as the graveyard mark, which links the
 *   vendor's own words.
 * - The date printed is the newest day any input was checked, never the day
 *   the script ran, so the same inputs draw the same bytes.
 */

/** Which company a record names. Matched case-sensitively, as whole words, in the record's own title; the earliest match wins. */
export const HISTORY_VENDORS = [
  { id: "fitbit", label: "Fitbit", terms: ["Fitbit"] },
  { id: "google", label: "Google", terms: ["Google", "MediaPipe", "MoveNet", "TensorFlow", "PoseNet"] },
  { id: "terra", label: "Terra", terms: ["Terra"] },
  { id: "thryve", label: "Thryve", terms: ["Thryve"] },
  { id: "open-wearables", label: "Open Wearables", terms: ["Open Wearables"] },
  { id: "garmin", label: "Garmin", terms: ["Garmin"] },
  { id: "sahha", label: "Sahha", terms: ["Sahha"] },
  { id: "ftc", label: "FTC", terms: ["FTC"] },
  { id: "samsung", label: "Samsung", terms: ["Samsung"] },
  { id: "strava", label: "Strava", terms: ["Strava"] },
  { id: "whoop", label: "WHOOP", terms: ["WHOOP"] },
  { id: "exercisedb", label: "ExerciseDB", terms: ["ExerciseDB", "AscendAPI"] },
  { id: "nutritionix", label: "Nutritionix", terms: ["Nutritionix"] },
  { id: "oura", label: "Oura", terms: ["Oura"] },
  { id: "ant-plus", label: "ANT+", terms: ["ANT+"] },
  { id: "moves", label: "Moves", terms: ["Moves"] },
  { id: "this-site", label: "This site", terms: ["This site"] },
];
export const OTHER_VENDOR = { id: "other", label: "Other" };

export const HISTORY_KINDS = [
  { id: "launch", label: "Launch" },
  { id: "change", label: "Tracked change" },
  { id: "milestone", label: "Milestone on the way out" },
  { id: "end", label: "Shutdown or deprecation" },
];

const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The vendor a title names, or OTHER_VENDOR. */
export function vendorOf(...texts) {
  for (const text of texts) {
    let best = null;
    for (const v of HISTORY_VENDORS) {
      for (const t of v.terms) {
        const m = new RegExp(`(?<![A-Za-z0-9])${reEsc(t)}(?![A-Za-z0-9])`).exec(text ?? "");
        if (m && (!best || m.index < best.at)) best = { at: m.index, v };
      }
    }
    if (best) return { id: best.v.id, label: best.v.label };
  }
  return OTHER_VENDOR;
}

/** "2026-11-02" → day, "2026-10" → month, "2026" → year; anything else null. */
export function precisionOf(d) {
  if (typeof d !== "string") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return "day";
  if (/^\d{4}-\d{2}$/.test(d)) return "month";
  if (/^\d{4}$/.test(d)) return "year";
  return null;
}

/** Where a date sits inside its year, as fractions [from, to] of the year. */
export function yearSpan(d) {
  const p = precisionOf(d);
  if (p === "year") return [0, 1];
  const m = Number(d.slice(5, 7)) - 1;
  if (p === "month") return [m / 12, (m + 1) / 12];
  const y = Number(d.slice(0, 4));
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const f = (m + (Number(d.slice(8, 10)) - 0.5) / days) / 12;
  return [f, f];
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** Keeps the precision: "November 2, 2026", "October 2026", "2026". */
export function fmtDate(d) {
  const p = precisionOf(d);
  if (p === "year") return d;
  const mn = MONTHS[Number(d.slice(5, 7)) - 1];
  return p === "month" ? `${mn} ${d.slice(0, 4)}` : `${mn} ${Number(d.slice(8, 10))}, ${d.slice(0, 4)}`;
}

const isExternal = (u) => /^https?:\/\//.test(u);

/**
 * @param {{ graveyard: object[], changes: object[] }} input  GRAVEYARD and CHANGE_EVENTS
 */
export function historyModel({ graveyard, changes }) {
  const marks = [];
  const undated = [];
  const graveDays = new Set();

  for (const g of graveyard) {
    const vendor = vendorOf(g.name, g.vendor);
    const page = g.page?.href ?? `/graveyard#${g.id}`;
    const base = { vendorId: vendor.id, vendorLabel: vendor.label, page, graveId: g.id };
    if (g.launched && precisionOf(g.launched.date)) {
      marks.push({ ...base, id: `${g.id}--launch`, kind: "launch", status: "launch", date: g.launched.date, title: `${g.name}: ${g.launched.label}`, short: g.name, href: g.launched.url, hrefLabel: "registry record" });
      graveDays.add(`${g.launched.date}|${page}`);
    }
    for (const m of g.milestones ?? []) {
      if (!precisionOf(m.date)) continue;
      marks.push({ ...base, id: `${g.id}--${m.date}`, kind: "milestone", status: "milestone", date: m.date, title: `${g.name}: ${m.label}`, short: `${g.name}: ${m.label}`, href: m.url, hrefLabel: g.source.publisher, quote: m.quote });
      graveDays.add(`${m.date}|${page}`);
    }
    if (g.end && precisionOf(g.end)) {
      marks.push({ ...base, id: `${g.id}--end`, kind: "end", status: g.status, date: g.end, title: `${g.name}: ${g.endLabel}`, short: `${g.name}: ${g.endLabel}`, href: g.source.url, hrefLabel: g.source.publisher, quote: g.source.quote });
      graveDays.add(`${g.end}|${page}`);
    } else if (!g.end) {
      undated.push({ ...base, id: `${g.id}--end`, kind: "end", status: g.status, date: null, title: `${g.name}: ${g.endLabel}`, short: g.name, href: g.source.url, hrefLabel: g.source.publisher });
    }
  }

  for (const c of changes) {
    if (c.status === "watch" || !precisionOf(c.date)) continue;
    if (graveDays.has(`${c.date}|${c.page.href}`)) continue;
    const vendor = vendorOf(c.title);
    marks.push({
      id: `change--${c.sortDate}--${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48)}`,
      kind: "change",
      status: c.status,
      date: c.date,
      title: c.title,
      short: c.title,
      href: c.page.href,
      hrefLabel: c.page.label,
      page: c.page.href,
      vendorId: vendor.id,
      vendorLabel: vendor.label,
    });
  }

  // Chronological; within a day the order of the records is kept stable by id.
  const at = (m) => Number(m.date.slice(0, 4)) + yearSpan(m.date)[0];
  marks.sort((a, b) => at(a) - at(b) || a.id.localeCompare(b.id));
  const ids = new Set();
  for (const m of marks) {
    if (ids.has(m.id)) throw new Error(`history: duplicate mark id ${m.id}`);
    ids.add(m.id);
    m.external = isExternal(m.href);
  }
  for (const u of undated) u.external = isExternal(u.href);

  const counts = new Map();
  for (const m of [...marks, ...undated]) {
    const c = counts.get(m.vendorId) ?? { id: m.vendorId, label: m.vendorLabel, count: 0 };
    c.count++;
    counts.set(m.vendorId, c);
  }
  const vendors = [...counts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const kinds = HISTORY_KINDS.map((k) => ({ ...k, count: marks.filter((m) => m.kind === k.id).length + undated.filter((m) => m.kind === k.id).length }));
  const years = [...new Set(marks.map((m) => Number(m.date.slice(0, 4))))].sort((a, b) => a - b);
  const asOf = [...graveyard.map((g) => g.source?.checkedOn), ...changes.map((c) => c.verifiedOn)].filter(Boolean).sort().at(-1);
  return { marks, undated, vendors, kinds, years, asOf, graveyardCount: graveyard.length };
}

/* ── Drawing ─────────────────────────────────────────────────────────── */

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const W = 1100;
const LEFT = 84;
const RIGHT = 1080;
const STRIP = RIGHT - LEFT;
const LANE = 22;
const ROW_TOP = 22;
const ROW_BOTTOM = 14;
const GAP_ROW = 30;
const CHAR = 6.1;
const MAX_LABEL = 40;

/** Colors: four categorical hues checked with the dataviz validator against light and dark surfaces; ink and muted from the page tokens. */
const STYLE = `
svg.fh-svg{width:100%;height:auto;display:block}
.fh-bg{fill:var(--bg,#ffffff)}
.fh-ink{fill:var(--fg,#0a0a0a)}
.fh-muted{fill:var(--muted,#6b7280)}
.fh-grid{stroke:var(--border,#e5e7eb);stroke-width:1}
.fh-axis{stroke:var(--muted,#6b7280);stroke-width:1}
.fh-t{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.fh-label{font-size:11px;fill:var(--fg,#0a0a0a)}
.fh-small{font-size:10px;fill:var(--muted,#6b7280)}
.fh-year{font-size:15px;font-weight:700;fill:var(--fg,#0a0a0a)}
.k-change{fill:#059669;stroke:#059669}
.k-launch{fill:#a21caf;stroke:#a21caf}
.k-milestone{fill:#2563eb;stroke:#2563eb}
.k-end.s-dying{fill:#ea580c;stroke:#ea580c}
.k-end.s-dead{fill:var(--fg,#0a0a0a);stroke:var(--fg,#0a0a0a)}
.k-end.s-deprecated{fill:var(--muted,#6b7280);stroke:var(--muted,#6b7280)}
.s-reported{fill:var(--bg,#ffffff);stroke-width:2}
.fh-span{opacity:.28;stroke:none}
.fh-mark:focus{outline:none}
.fh-mark:focus .fh-label,.fh-mark:hover .fh-label{text-decoration:underline}
.fh-mark:focus .fh-glyph{stroke:var(--fg,#0a0a0a);stroke-width:2}
.fh-hidden{display:none}
.fh-row.fh-dim{opacity:.3}
.fh-list .fh-dim{display:none}
`;

const truncate = (s, n = MAX_LABEL) => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);

function glyph(m, x, y) {
  const cls = `fh-glyph k-${m.kind} s-${m.status}`;
  if (m.kind === "change") return `<circle class="${cls}" cx="${x}" cy="${y}" r="5"/>`;
  if (m.kind === "launch") return `<path class="${cls}" d="M${x} ${y - 6}L${x + 6} ${y + 5}L${x - 6} ${y + 5}Z"/>`;
  if (m.kind === "milestone") return `<path class="${cls}" d="M${x} ${y - 6}L${x + 6} ${y}L${x} ${y + 6}L${x - 6} ${y}Z"/>`;
  return `<rect class="${cls}" x="${x - 5}" y="${y - 5}" width="10" height="10" rx="1.5"/>`;
}

/** Greedy lane packing of one year's marks; returns marks with x0, x1, lane, label side. */
export function layoutYear(marks) {
  const lanes = [];
  // Year-wide bars first: they take a lane of their own.
  const ordered = [...marks].sort((a, b) => (precisionOf(b.date) === "year") - (precisionOf(a.date) === "year"));
  const out = [];
  for (const m of ordered) {
    const [f0, f1] = yearSpan(m.date);
    const x0 = LEFT + f0 * STRIP;
    const x1 = LEFT + f1 * STRIP;
    const label = truncate(m.short);
    const w = label.length * CHAR;
    const right = x0 + 9 + w <= RIGHT;
    const lo = right ? x0 - 7 : Math.min(x0 - 9 - w, x0 - 7);
    const hi = right ? Math.max(x1, x0 + 9 + w) : Math.max(x1, x0 + 7);
    let lane = lanes.findIndex((iv) => iv.every(([a, b]) => hi + 6 < a || lo - 6 > b));
    if (lane === -1) {
      lanes.push([]);
      lane = lanes.length - 1;
    }
    lanes[lane].push([lo, hi]);
    out.push({ m, x0, x1, lane, right, label });
  }
  return { placed: out, lanes: Math.max(1, lanes.length) };
}

function markSvg(p, rowY) {
  const { m, x0, x1, lane, right, label } = p;
  const y = rowY + ROW_TOP + lane * LANE + LANE / 2;
  const span = x1 > x0 ? `<rect class="fh-span k-${m.kind} s-${m.status}" x="${x0.toFixed(1)}" y="${y - 4}" width="${(x1 - x0).toFixed(1)}" height="8" rx="4"/>` : "";
  const tx = right ? x0 + 9 : x0 - 9;
  const aria = `${fmtDate(m.date)}: ${m.title}. ${m.vendorLabel}. Source: ${m.hrefLabel}.`;
  const target = m.external ? ` target="_blank" rel="noopener"` : "";
  return (
    `<a class="fh-mark" href="${esc(m.href)}"${target} data-id="${esc(m.id)}" data-vendor="${esc(m.vendorId)}" data-kind="${m.kind}" aria-label="${esc(aria)}">` +
    `<title>${esc(aria)}</title>${span}${glyph(m, Number(x0.toFixed(1)), y)}` +
    `<text class="fh-t fh-label" x="${tx.toFixed(1)}" y="${y + 4}"${right ? "" : ` text-anchor="end"`}>${esc(label)}</text></a>`
  );
}

const MONTH_ABBR = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function legendSvg(y) {
  const items = [
    { kind: "launch", status: "launch", text: "Launch" },
    { kind: "change", status: "confirmed", text: "Tracked change, confirmed" },
    { kind: "change", status: "reported", text: "reported" },
    { kind: "milestone", status: "milestone", text: "Milestone on the way out" },
    { kind: "end", status: "dead", text: "Dead" },
    { kind: "end", status: "dying", text: "Dying" },
    { kind: "end", status: "deprecated", text: "Deprecated" },
  ];
  let x = LEFT;
  const parts = [];
  for (const it of items) {
    parts.push(glyph(it, x + 6, y), `<text class="fh-t fh-label" x="${x + 16}" y="${y + 4}">${esc(it.text)}</text>`);
    x += 16 + it.text.length * CHAR + 22;
  }
  parts.push(`<text class="fh-t fh-small" x="${LEFT}" y="${y + 24}">A point is a day; a bar is a month or a whole year, as the source dates it.</text>`);
  return parts.join("");
}

/**
 * @param {ReturnType<typeof historyModel>} model
 * @param {{ poster?: boolean, url?: string, site?: string }} opts
 */
export function historySvg(model, opts = {}) {
  const { poster = false, url = "https://aifitnessapi.com/history", site = "AIFitnessAPI" } = opts;
  const parts = [];
  let y = 0;
  if (poster) {
    parts.push(
      `<text class="fh-t fh-ink" x="${LEFT}" y="56" font-size="30" font-weight="800">A visual history of fitness and health APIs</text>`,
      `<text class="fh-t fh-muted" x="${LEFT}" y="84" font-size="14">${esc(`${model.marks.length} dated launches, changes and shutdowns from ${model.vendors.length} vendors, from the API graveyard and the changes tracker. Data as of ${fmtDate(model.asOf)}.`)}</text>`,
    );
    y = 110;
  } else {
    y = 8;
  }
  parts.push(legendSvg(y + 10));
  y += 56;

  const byYear = new Map();
  for (const m of model.marks) {
    const yr = Number(m.date.slice(0, 4));
    byYear.set(yr, [...(byYear.get(yr) ?? []), m]);
  }
  let prev = null;
  for (const yr of model.years) {
    if (prev !== null && yr - prev > 1) {
      const from = prev + 1;
      const to = yr - 1;
      parts.push(`<text class="fh-t fh-small" x="${LEFT}" y="${y + 19}" font-style="italic">${from === to ? from : `${from}–${to}`}: no dated entries</text>`);
      y += GAP_ROW;
    }
    const { placed, lanes } = layoutYear(byYear.get(yr));
    const h = ROW_TOP + lanes * LANE + ROW_BOTTOM;
    const row = [`<g class="fh-row" data-year="${yr}">`];
    row.push(`<text class="fh-t fh-year" x="16" y="${y + ROW_TOP + 14}">${yr}</text>`);
    row.push(`<line class="fh-axis" x1="${LEFT}" y1="${y + ROW_TOP - 4}" x2="${RIGHT}" y2="${y + ROW_TOP - 4}"/>`);
    for (let i = 0; i <= 12; i++) {
      const x = (LEFT + (i / 12) * STRIP).toFixed(1);
      row.push(`<line class="fh-grid" x1="${x}" y1="${y + ROW_TOP - 4}" x2="${x}" y2="${y + h - ROW_BOTTOM + 4}"/>`);
      if (i < 12) row.push(`<text class="fh-t fh-small" x="${(LEFT + ((i + 0.5) / 12) * STRIP).toFixed(1)}" y="${y + ROW_TOP - 9}" text-anchor="middle">${MONTH_ABBR[i]}</text>`);
    }
    // Draw in chronological order so tab order follows time.
    for (const p of [...placed].sort((a, b) => a.x0 - b.x0 || a.lane - b.lane)) row.push(markSvg(p, y));
    row.push("</g>");
    parts.push(row.join(""));
    y += h;
    prev = yr;
  }

  if (model.undated.length) {
    y += 8;
    parts.push(`<text class="fh-t fh-ink" x="16" y="${y + 14}" font-size="13" font-weight="700">No end date given by the vendor</text>`);
    y += 22;
    for (const u of model.undated) {
      const target = u.external ? ` target="_blank" rel="noopener"` : "";
      const aria = `${u.title}. ${u.vendorLabel}. No date given. Source: ${u.hrefLabel}.`;
      parts.push(
        `<a class="fh-mark" href="${esc(u.href)}"${target} data-id="${esc(u.id)}" data-vendor="${esc(u.vendorId)}" data-kind="${u.kind}" aria-label="${esc(aria)}"><title>${esc(aria)}</title>${glyph(u, LEFT + 6, y + 10)}<text class="fh-t fh-label" x="${LEFT + 18}" y="${y + 14}">${esc(truncate(u.title, 90))}</text></a>`,
      );
      y += LANE;
    }
  }

  if (poster) {
    y += 20;
    parts.push(`<text class="fh-t fh-small" x="${LEFT}" y="${y + 10}" font-size="12">${esc(`${site} · ${url} · CC BY 4.0 · every mark links its source; vendor quotes on /graveyard and /changes`)}</text>`);
    y += 26;
  } else {
    y += 8;
  }
  const H = Math.ceil(y);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-labelledby="fh-title fh-desc" class="fh-svg">` +
    `<title id="fh-title">A visual history of fitness and health APIs</title>` +
    `<desc id="fh-desc">${esc(`A timeline of ${model.marks.length} dated launches, tracked changes, milestones and shutdowns, one row per year, each mark at its source's date precision and linking its source.`)}</desc>` +
    `<style>${STYLE}</style><rect class="fh-bg" x="0" y="0" width="${W}" height="${H}"/>` +
    parts.join("") +
    `</svg>`
  );
}

/** The ?vendor= and ?kind= deep link, read leniently: unknown values are dropped. */
export function parseFilter(search, model) {
  const q = new URLSearchParams(search);
  const vendors = new Set(model.vendors.map((v) => v.id));
  const kinds = new Set(HISTORY_KINDS.map((k) => k.id));
  const vendor = q.get("vendor");
  const kindList = (q.get("kind") ?? "").split(",").filter((k) => kinds.has(k));
  return { vendor: vendor && vendors.has(vendor) ? vendor : null, kinds: kindList };
}

/** Whether a mark passes a filter. An empty kind list means every kind. */
export function passes(m, f) {
  return (!f.vendor || m.vendorId === f.vendor) && (!f.kinds.length || f.kinds.includes(m.kind));
}
