/**
 * Exercise-name normalizer for /tools/exercise-taxonomy-crosswalk#normalize:
 * a gym-floor name ("DB incline press", "RDL", "lat pulldown wide") in, the
 * closest free-exercise-db exercises out, each with the reason it matched.
 *
 * Deterministic and explainable, nothing fuzzy:
 *   1. The query is lowercased and split on anything outside a-z0-9.
 *   2. A word in ABBREVIATIONS is replaced by its expansion, in the query and
 *      in exercise names alike; a query word in STOPWORDS is dropped.
 *   3. Every word, query and exercise alike, loses one trailing "s" when it is
 *      longer than three letters and does not end in "ss" (curls = curl,
 *      press stays press).
 *   4. A query word matches an exercise when the exercise's name has the same
 *      word, or two adjacent name words that join into it ("pullup" matches
 *      "Pull-Up"), or when two adjacent query words join into one name word
 *      ("pull down" matches "Pulldown"). A word the name lacks may still match
 *      the exercise's equipment, category or muscles, at half weight.
 *   5. Ranked by matched words (name 1, other fields 0.5), then by fewest name
 *      words left unmatched, then by name. Exercises with no match are left out.
 *
 * Pure and dependency-free: the page's client component and
 * scripts/open-exercises.test.mjs import the same file.
 */

/** Abbreviations and spellings we expand. Shown on the page as a table. */
export const ABBREVIATIONS = [
  { abbr: "db", expansion: "dumbbell" },
  { abbr: "dbs", expansion: "dumbbell" },
  { abbr: "bb", expansion: "barbell" },
  { abbr: "kb", expansion: "kettlebell" },
  { abbr: "kbs", expansion: "kettlebell" },
  { abbr: "bw", expansion: "bodyweight" },
  { abbr: "rdl", expansion: "romanian deadlift" },
  { abbr: "rdls", expansion: "romanian deadlift" },
  { abbr: "sldl", expansion: "stiff legged deadlift" },
  { abbr: "dl", expansion: "deadlift" },
  { abbr: "ohp", expansion: "overhead press" },
  { abbr: "bp", expansion: "bench press" },
  { abbr: "cgbp", expansion: "close grip bench press" },
  { abbr: "ghr", expansion: "glute ham raise" },
  { abbr: "hspu", expansion: "handstand push up" },
  { abbr: "inc", expansion: "incline" },
  { abbr: "dec", expansion: "decline" },
  { abbr: "alt", expansion: "alternate" },
  { abbr: "ext", expansion: "extension" },
  { abbr: "rev", expansion: "reverse" },
  { abbr: "tri", expansion: "triceps" },
  { abbr: "tris", expansion: "triceps" },
  { abbr: "bi", expansion: "biceps" },
  { abbr: "bis", expansion: "biceps" },
  { abbr: "lats", expansion: "lat" },
  { abbr: "fly", expansion: "flye" },
  { abbr: "flys", expansion: "flye" },
  { abbr: "flies", expansion: "flye" },
  { abbr: "1", expansion: "one" },
  { abbr: "2", expansion: "two" },
];

/** The matching rule in five sentences, printed on the page and in its mirror. */
export const MATCH_RULES = [
  "The name is lowercased and split into words on anything that is not a letter or a digit.",
  "Each word in the abbreviation table is replaced by its expansion, in the name you type and in the exercise names alike, and filler words (a, an, and, the, with, on, of, to, for, in, at) are dropped.",
  "A word longer than three letters loses one trailing s unless it ends in ss, so curls and curl are the same word and press stays press.",
  "A word matches when an exercise name has the same word, two neighboring words that join into it (pullup and Pull-Up), or one word that two of yours join into (pull down and Pulldown). A word the name lacks can still match the exercise's equipment, category or muscles, at half weight.",
  "Results rank by matched words, then by the fewest name words left over, then alphabetically. Nothing is matched by spelling distance or by meaning.",
];

export const STOPWORDS =["a", "an", "and", "the", "with", "on", "of", "to", "for", "in", "at"];

const ABBR = new Map(ABBREVIATIONS.map((a) => [a.abbr, a.expansion]));
const STOP = new Set(STOPWORDS);

export const words = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

export const stem = (w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);

/** The query's words after expansion: [{ word, from }] where `from` is the abbreviation it came from, or null. */
export function expandQuery(query) {
  const out = [];
  for (const w of words(query)) {
    const exp = ABBR.get(w);
    if (exp) for (const x of words(exp)) out.push({ word: stem(x), from: w });
    else if (!STOP.has(w)) out.push({ word: stem(w), from: null });
  }
  // Two identical words count once ("db dumbbell press").
  const seen = new Set();
  return out.filter((t) => (seen.has(t.word) ? false : (seen.add(t.word), true)));
}

const joinedPairs = (ws) => ws.slice(0, -1).map((w, i) => ({ joined: w + ws[i + 1], parts: [w, ws[i + 1]] }));

/**
 * Score one exercise against expanded query words. `ex` needs name, and may
 * have equipment, category, primaryMuscles and secondaryMuscles.
 */
export function scoreExercise(terms, ex) {
  // Names get the same expansion as queries: some free-exercise-db names say "DB".
  const nameWords = words(ex.name).flatMap((w) => (ABBR.has(w) ? words(ABBR.get(w)) : [w])).map(stem);
  const nameSet = new Set(nameWords);
  const pairs = joinedPairs(nameWords);
  const used = new Set();
  const reasons = [];
  const matched = new Set();

  // Adjacent query words that join into one name word ("pull down" → Pulldown).
  for (let i = 0; i + 1 < terms.length; i++) {
    const j = terms[i].word + terms[i + 1].word;
    if (!matched.has(i) && !matched.has(i + 1) && nameSet.has(j) && !nameSet.has(terms[i].word)) {
      matched.add(i).add(i + 1);
      used.add(j);
      reasons.push({ query: [terms[i], terms[i + 1]].map((t) => t.from ?? t.word).join(" "), via: null, field: "name", matched: j, how: "joined" });
    }
  }
  terms.forEach((t, i) => {
    if (matched.has(i)) return;
    if (nameSet.has(t.word)) {
      matched.add(i);
      used.add(t.word);
      reasons.push({ query: t.from ?? t.word, via: t.from ? t.word : null, field: "name", matched: t.word, how: "word" });
      return;
    }
    const p = pairs.find((x) => x.joined === t.word);
    if (p) {
      matched.add(i);
      p.parts.forEach((w) => used.add(w));
      reasons.push({ query: t.from ?? t.word, via: t.from ? t.word : null, field: "name", matched: p.parts.join(" "), how: "split" });
    }
  });
  let score = matched.size;
  const fields = [
    ["equipment", [ex.equipment]],
    ["category", [ex.category]],
    ["muscles", [...(ex.primaryMuscles ?? []), ...(ex.secondaryMuscles ?? [])]],
  ];
  terms.forEach((t, i) => {
    if (matched.has(i)) return;
    for (const [field, values] of fields) {
      const ws = new Set(values.filter(Boolean).flatMap((v) => words(v).map(stem)));
      if (ws.has(t.word)) {
        matched.add(i);
        score += 0.5;
        reasons.push({ query: t.from ?? t.word, via: t.from ? t.word : null, field, matched: t.word, how: "word" });
        return;
      }
    }
  });
  const unmatchedName = nameWords.filter((w) => !used.has(w)).length;
  return { score, matchedTerms: matched.size, unmatchedName, reasons };
}

/** The best `limit` exercises for a query, with their reasons. */
export function matchExercises(query, exercises, { limit = 8 } = {}) {
  const terms = expandQuery(query);
  if (!terms.length) return { terms, results: [] };
  const scored = [];
  for (const ex of exercises) {
    const s = scoreExercise(terms, ex);
    if (s.score > 0) scored.push({ exercise: ex, ...s });
  }
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      a.unmatchedName - b.unmatchedName ||
      (a.exercise.name < b.exercise.name ? -1 : a.exercise.name > b.exercise.name ? 1 : 0),
  );
  return { terms, results: scored.slice(0, limit) };
}
