/**
 * Full-text search over the per-section answer files (/answers/<section>.json),
 * run in the browser by /answers-search (ops/AUDIENCE-30-2026-11-05.md item 25).
 *
 * The site search (/search-index.json, components/SearchPalette) holds every
 * page and FAQ but only the first 180 characters of an answer, and needs every
 * typed word to match. This indexes the whole text of every answer capsule,
 * FAQ answer, post FAQ and tracker entry, in the sections the reader loads,
 * and ranks with BM25 over two fields: the question or title (weighted) and
 * the answer. Pure functions with no dependencies; tested in
 * scripts/answer-search.test.mjs (npm run test:answer-search).
 */

const STOP = new Set(
  "a an and are as at be by can do does for from has have how i if in is it its of on or that the this to was what when where which who why will with you your".split(" "),
);

/** `stepCount` → "step count", `HKUnit` → "hk unit". */
function spellOut(t) {
  return t.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

/**
 * Lowercased terms. An identifier also yields its spelled-out parts, so
 * "stepCount" finds "step count" and the other way round; stop words go.
 */
export function tokenize(s) {
  const out = [];
  for (const raw of String(s).split(/[^A-Za-z0-9]+/)) {
    if (!raw) continue;
    const whole = raw.toLowerCase();
    if (!STOP.has(whole) && (whole.length > 1 || /\d/.test(whole))) out.push(whole);
    const parts = spellOut(raw).split(" ");
    if (parts.length > 1) for (const p of parts) {
      const l = p.toLowerCase();
      if (l.length > 1 && !STOP.has(l)) out.push(l);
    }
  }
  return out;
}

/** An absolute URL on this site → its path (with fragment); other URLs unchanged. */
export function sitePath(url, origin) {
  if (typeof url !== "string") return "/";
  return url.startsWith(origin) ? url.slice(origin.length) || "/" : url;
}

/**
 * The searchable documents in one /answers/<section>.json file. Keys follow
 * /answers.json: `answers` and `reference_pages` (one page record with FAQs),
 * `posts` (blog posts with FAQs) and `changes` (tracker entries, plus the
 * undated `watching` list). Facts and start-here sections carry no prose and
 * are not indexed.
 */
export function docsFromSection(doc, origin) {
  const out = [];
  const section = doc.section ?? "";
  const pages = [...(doc.answers ?? []), ...(doc.reference_pages ?? [])];
  for (const p of pages) {
    const href = sitePath(p.url, origin);
    out.push({ kind: "answer", section, title: p.title, question: p.question, text: p.answer, href, page: p.title, date: p.last_reviewed ?? null, firstParty: !!p.first_party });
    for (const f of p.faqs ?? []) {
      out.push({ kind: "faq", section, title: f.question, question: "", text: f.answer, href: sitePath(f.url, origin), page: p.title, date: p.last_reviewed ?? null, firstParty: !!p.first_party });
    }
  }
  for (const p of doc.posts ?? []) {
    const href = sitePath(p.url, origin);
    out.push({ kind: "post", section, title: p.title, question: "", text: p.description, href, page: p.title, date: p.last_reviewed ?? null, firstParty: false });
    for (const f of p.faqs ?? []) {
      out.push({ kind: "faq", section, title: f.question, question: "", text: f.answer, href, page: p.title, date: p.last_reviewed ?? null, firstParty: false });
    }
  }
  for (const c of doc.changes ?? []) {
    out.push({ kind: "change", section, title: c.title, question: `${c.date} ${c.status}`, text: c.summary, href: sitePath(c.url, origin), page: "Changes & deadlines", date: c.verified_on ?? null, firstParty: false });
  }
  for (const w of doc.watching ?? []) {
    out.push({ kind: "change", section, title: w.title, question: "watch", text: w.summary, href: sitePath(w.url, origin), page: "Changes & deadlines", date: null, firstParty: false });
  }
  return out;
}

/** An empty index; documents are added section by section as they load. */
export function createIndex() {
  return { docs: [], postings: new Map(), lenSum: 0 };
}

const TITLE_WEIGHT = 3;

/** Adds documents. Returns the index for chaining. */
export function addDocs(index, docs) {
  for (const d of docs) {
    const id = index.docs.length;
    const head = tokenize(`${d.title} ${d.question}`);
    const body = tokenize(d.text);
    const tf = new Map();
    for (const t of head) tf.set(t, (tf.get(t) ?? 0) + TITLE_WEIGHT);
    for (const t of body) tf.set(t, (tf.get(t) ?? 0) + 1);
    const len = head.length * TITLE_WEIGHT + body.length;
    index.docs.push({ ...d, len, lowerHead: `${d.title} ${d.question}`.toLowerCase(), lowerText: String(d.text).toLowerCase() });
    index.lenSum += len;
    for (const [t, n] of tf) {
      let list = index.postings.get(t);
      if (!list) index.postings.set(t, (list = []));
      list.push([id, n]);
    }
  }
  return index;
}

const K1 = 1.2;
const B = 0.75;

/**
 * Ranked results for `query`: BM25 over the weighted term frequencies, every
 * query term contributing; documents matching more of the terms first. The
 * last term also matches as a prefix (at least three letters), so results
 * appear while a word is being typed. A query that appears verbatim in a
 * question or title, or in the answer, earns a bonus.
 */
export function search(index, query, { limit = 20 } = {}) {
  const terms = [...new Set(tokenize(query))];
  const N = index.docs.length;
  if (!terms.length || !N) return [];
  const avg = index.lenSum / N;
  const scores = new Map();
  const matched = new Map();
  terms.forEach((t, i) => {
    const expand = i === terms.length - 1 && t.length >= 3 && !/\s$/.test(query);
    const keys = index.postings.has(t) ? [t] : [];
    if (expand) for (const k of index.postings.keys()) if (k !== t && k.startsWith(t)) keys.push(k);
    const seen = new Set();
    for (const k of keys) {
      const list = index.postings.get(k);
      const idf = Math.log(1 + (N - list.length + 0.5) / (list.length + 0.5));
      const discount = k === t ? 1 : 0.6;
      for (const [id, tf] of list) {
        const len = index.docs[id].len;
        const s = discount * idf * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * len) / avg)));
        scores.set(id, (scores.get(id) ?? 0) + s);
        if (!seen.has(id)) {
          seen.add(id);
          matched.set(id, (matched.get(id) ?? 0) + 1);
        }
      }
    }
  });
  const phrase = query.trim().toLowerCase().replace(/\s+/g, " ");
  const ranked = [];
  for (const [id, s] of scores) {
    const d = index.docs[id];
    let score = s * (matched.get(id) / terms.length) ** 2;
    if (phrase.length > 3 && phrase.includes(" ")) {
      if (d.lowerHead.includes(phrase)) score += 4;
      else if (d.lowerText.includes(phrase)) score += 2;
    }
    ranked.push({ doc: d, score, matched: matched.get(id) });
  }
  ranked.sort((a, b) => b.score - a.score || (a.doc.href < b.doc.href ? -1 : 1));
  return ranked.slice(0, limit);
}

/**
 * A window of `text` around the first matching term, split into segments
 * marked `hit` where a query term (or a word it prefixes) starts.
 */
export function snippet(text, query, max = 260) {
  const s = String(text);
  const terms = [...new Set(tokenize(query))].filter((t) => t.length > 1);
  if (!terms.length) return [{ t: s.slice(0, max), hit: false }];
  const re = new RegExp(`\\b(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})[a-z0-9]*`, "gi");
  const first = s.search(re);
  let start = first > max / 3 ? first - Math.floor(max / 3) : 0;
  if (start > 0) {
    const sp = s.indexOf(" ", start);
    if (sp > 0 && sp < first) start = sp + 1;
  }
  let window = s.slice(start, start + max);
  if (start + max < s.length) window = `${window.replace(/\s+\S*$/, "")}…`;
  if (start > 0) window = `…${window}`;
  const out = [];
  let last = 0;
  for (const m of window.matchAll(re)) {
    if (m.index > last) out.push({ t: window.slice(last, m.index), hit: false });
    out.push({ t: m[0], hit: true });
    last = m.index + m[0].length;
  }
  if (last < window.length) out.push({ t: window.slice(last), hit: false });
  return out;
}
