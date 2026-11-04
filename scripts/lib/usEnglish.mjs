/**
 * US English for the site's own prose (ops/NEXT-10-2026-11-04.md item 10).
 *
 * One word list and one quote/code-aware scanner, shared by the one-off
 * converter (scripts/us-english.mjs) and qa's US-SPELLING gate, so the gate
 * holds exactly the rule the conversion applied.
 *
 * The list is explicit: every British form maps to one US form, and a word is
 * on it only when the US spelling is unambiguous in this site's usage. Words
 * whose US use is legitimately the same or context-dependent stay off it:
 * "dialogue" (US keeps it for speech), "analyses" (also the plural noun),
 * "programmed", "licensed", "licensing", "enrolled" (identical in both).
 *
 * What is never prose and so never changed or flagged:
 * - text inside quotation marks ("…", “…”, ‘…’): a quoted source keeps its
 *   own spelling, and so does a quoted term;
 * - blockquote lines (markdown `>` or a <blockquote> element);
 * - inline code and fenced code, <code>/<pre>/<kbd>/<samp>;
 * - URLs, paths and anything else with a slash, markdown link targets,
 *   HTML tags and their attributes;
 * - the proper nouns in PROPER_NOUNS (an organization's own name).
 */

/** CLAUDE.md "Generated data — never hand-edit". */
export const GENERATED = new Set([
  "src/data/healthkitIdentifiers.ts",
  "src/data/healthkitWritability.ts",
  "src/data/healthConnectRecords.ts",
  "src/data/sdkReleases.ts",
  "src/data/libraries.ts",
  "src/data/errorCodes.ts",
  "src/data/hcReleases.ts",
  "src/data/healthkitMetadataKeys.ts",
  "src/data/healthServicesDataTypes.ts",
  "src/data/poseKeypoints.ts",
  "src/data/googleHealthApi.ts",
  "src/data/mcpHealthServers.ts",
  "src/data/bluetoothGatt.ts",
  "src/data/workoutTypes.ts",
  "src/data/published.ts",
  "src/data/apiDemand.ts",
  "src/data/indexDemand.ts",
]);

/** -ise/-ize stems: every form below is generated with s → z. */
const ISE_STEMS = [
  "normal", "denormal", "recogn", "unrecogn", "organ", "reorgan", "disorgan", "optim", "minim", "maxim",
  "local", "standard", "personal", "individual", "summar", "author", "unauthor", "monet", "general",
  "character", "synchron", "synthes", "parallel", "special", "scrutin", "pseudonym", "anonym", "initial",
  "internal", "canonical", "plural", "priorit", "editorial", "sanit", "serial", "deserial", "material",
  "stabil", "demoral", "commodit", "professional", "parameter", "emphas", "penal", "custom", "container",
  "memo", "item", "memor", "real", "util", "categor", "visual", "final", "capital", "critic", "apolog",
  "central", "decentral", "token", "random", "digit", "familiar", "harmon", "mobil", "neutral", "theor",
  "trivial", "incentiv", "amort", "jeopard", "modern", "legal", "global", "industrial", "commercial",
  "operational", "rational", "democrat", "symbol", "vocal", "patron", "agon", "sympath", "fantas",
  "hypothes", "subsid", "stigmat", "systemat", "schemat", "templat", "virtual", "contextual",
  "conceptual", "quant", "steril", "fertil", "hospital", "immun", "econom", "vapor", "polar",
  "raster", "marginal", "national", "human",
];
const ISE_SUFFIXES = [
  ["ise", "ize"], ["ised", "ized"], ["ises", "izes"], ["ising", "izing"], ["isation", "ization"],
  ["isations", "izations"], ["iser", "izer"], ["isers", "izers"], ["isable", "izable"],
];

/** Explicit British → US pairs, lowercase. */
const PAIRS = {
  // -our
  behaviour: "behavior", behaviours: "behaviors", behavioural: "behavioral", behaviourally: "behaviorally",
  misbehaviour: "misbehavior",
  colour: "color", colours: "colors", coloured: "colored", colouring: "coloring", colourful: "colorful",
  favour: "favor", favours: "favors", favoured: "favored", favouring: "favoring", favourable: "favorable",
  favourably: "favorably", favourite: "favorite", favourites: "favorites", unfavourable: "unfavorable",
  honour: "honor", honours: "honors", honoured: "honored", honouring: "honoring",
  labour: "labor", neighbour: "neighbor", neighbours: "neighbors", neighbouring: "neighboring",
  rumour: "rumor", rumours: "rumors", flavour: "flavor", flavours: "flavors", flavoured: "flavored",
  humour: "humor", endeavour: "endeavor", endeavours: "endeavors", vigour: "vigor", harbour: "harbor",
  // -re
  centre: "center", centres: "centers", centred: "centered", centring: "centering",
  metre: "meter", metres: "meters", kilometre: "kilometer", kilometres: "kilometers",
  millimetre: "millimeter", millimetres: "millimeters", centimetre: "centimeter", centimetres: "centimeters",
  litre: "liter", litres: "liters", decilitre: "deciliter", decilitres: "deciliters",
  millilitre: "milliliter", millilitres: "milliliters", fibre: "fiber", fibres: "fibers",
  // -ogue
  catalogue: "catalog", catalogues: "catalogs", catalogued: "cataloged", cataloguing: "cataloging",
  analogue: "analog",
  // -ence (nouns) / -ise (verb)
  licence: "license", licences: "licenses", defence: "defense", defences: "defenses",
  offence: "offense", offences: "offenses", pretence: "pretense",
  practise: "practice", practised: "practiced", practising: "practicing",
  // -yse
  analyse: "analyze", analysed: "analyzed", analysing: "analyzing", analyser: "analyzer", analysers: "analyzers",
  paralyse: "paralyze", paralysed: "paralyzed", catalyse: "catalyze",
  // doubled l
  labelled: "labeled", labelling: "labeling", unlabelled: "unlabeled", mislabelled: "mislabeled",
  labeller: "labeler", relabelled: "relabeled",
  modelled: "modeled", modelling: "modeling", modeller: "modeler",
  cancelled: "canceled", cancelling: "canceling",
  travelled: "traveled", travelling: "traveling", traveller: "traveler", travellers: "travelers",
  signalled: "signaled", signalling: "signaling", fuelled: "fueled", fuelling: "fueling",
  totalled: "totaled", totalling: "totaling", levelled: "leveled", levelling: "leveling",
  channelled: "channeled", tunnelling: "tunneling", marshalling: "marshaling",
  // the rest
  judgement: "judgment", judgements: "judgments",
  acknowledgement: "acknowledgment", acknowledgements: "acknowledgments",
  ageing: "aging", fulfil: "fulfill", fulfils: "fulfills", fulfilment: "fulfillment",
  enrol: "enroll", enrols: "enrolls", enrolment: "enrollment", enrolments: "enrollments",
  grey: "gray", greys: "grays", greyed: "grayed", greying: "graying",
  programme: "program", programmes: "programs",
  artefact: "artifact", artefacts: "artifacts",
  maths: "math", sceptical: "skeptical", sceptic: "skeptic",
};

export const US_SPELLING = (() => {
  const map = { ...PAIRS };
  for (const stem of new Set(ISE_STEMS)) {
    for (const [gb, us] of ISE_SUFFIXES) map[stem + gb] = stem + us;
  }
  return map;
})();

/** Organization and product names that keep their own spelling. Matched case-sensitively. */
export const PROPER_NOUNS = [
  "Organisation for Economic Co-operation and Development",
  "National Cyber Security Centre",
  "Information Commissioner's Office",
];

// A hyphen before the word is allowed ("open-licence" is prose); a letter,
// digit, underscore or dot is not ("normaliseUnit", "x.colour").
const WORD_RE = new RegExp(
  `(?:(?<![A-Za-z0-9_.])|(?<=\\\\[nt]))(${Object.keys(US_SPELLING).sort((a, b) => b.length - a.length).join("|")})(?![A-Za-z0-9_])`,
  "gi",
);

function matchCase(src, us) {
  if (src === src.toUpperCase() && src.length > 1) return us.toUpperCase();
  if (src[0] === src[0].toUpperCase()) return us[0].toUpperCase() + us.slice(1);
  return us;
}

/**
 * Split text into [isProse, chunk] runs. Everything not prose is returned
 * untouched by the converter and ignored by the gate.
 *
 * The text may be the raw source of a JS string, where a quotation mark is
 * written \" and a newline \n: both escaped and literal forms count.
 */
export function segments(text) {
  const out = [];
  let i = 0;
  let prose = "";
  const flush = () => {
    if (prose) out.push([true, prose]);
    prose = "";
  };
  const skip = (len) => {
    flush();
    out.push([false, text.slice(i, i + len)]);
    i += len;
  };
  const atLineStart = (k) => {
    // start of text, a real newline, or a literal \n escape in raw source
    let j = k - 1;
    while (j >= 0 && (text[j] === " " || text[j] === "\t")) j--;
    if (j < 0) return true;
    if (text[j] === "\n") return true;
    if (text[j] === "n" && text[j - 1] === "\\" && text[j - 2] !== "\\") return true;
    return false;
  };
  const findLineEnd = (k) => {
    let j = k;
    while (j < text.length) {
      if (text[j] === "\n") return j;
      if (text[j] === "\\" && text[j + 1] === "n") return j;
      if (text[j] === "\\") j += 2;
      else j++;
    }
    return j;
  };
  const indexOfFrom = (needle, k) => {
    const j = text.indexOf(needle, k);
    return j === -1 ? text.length : j;
  };
  while (i < text.length) {
    const c = text[i];
    const rest = text.slice(i, i + 12);
    // blockquote line
    if (c === ">" && atLineStart(i)) {
      skip(findLineEnd(i) - i);
      continue;
    }
    // fenced code (``` or escaped \`\`\`)
    if (rest.startsWith("```") || rest.startsWith("\\`\\`\\`")) {
      const fence = rest.startsWith("```") ? "```" : "\\`\\`\\`";
      const end = text.indexOf(fence, i + fence.length);
      skip((end === -1 ? text.length : end + fence.length) - i);
      continue;
    }
    // inline code
    if (c === "`" || (c === "\\" && text[i + 1] === "`")) {
      const tick = c === "`" ? "`" : "\\`";
      const end = text.indexOf(tick, i + tick.length);
      skip((end === -1 ? text.length : end + tick.length) - i);
      continue;
    }
    // HTML elements whose content is not prose, then any tag
    const el = /^<(code|pre|kbd|samp|blockquote|q|script|style)\b/i.exec(text.slice(i, i + 16));
    if (el) {
      const close = new RegExp(`</${el[1]}\\s*>`, "i");
      const m = close.exec(text.slice(i));
      skip(m ? m.index + m[0].length : text.length - i);
      continue;
    }
    if (c === "<" && /[A-Za-z!/]/.test(text[i + 1] ?? "")) {
      skip(indexOfFrom(">", i) + 1 - i);
      continue;
    }
    // quotations: straight (possibly escaped), curly double, curly single
    if (c === '"' || (c === "\\" && text[i + 1] === '"')) {
      const q = c === '"' ? 1 : 2;
      let j = i + q;
      while (j < text.length && !(text[j] === '"' || (text[j] === "\\" && text[j + 1] === '"'))) j++;
      const endLen = j < text.length ? (text[j] === '"' ? 1 : 2) : 0;
      skip(j + endLen - i);
      continue;
    }
    if (c === "“") {
      skip(indexOfFrom("”", i + 1) + 1 - i);
      continue;
    }
    if (c === "‘" && !/[A-Za-z0-9]/.test(text[i - 1] ?? "")) {
      // closes at a ’ not followed by a letter (so "it’s" inside does not close it)
      let j = i + 1;
      while (j < text.length && !(text[j] === "’" && !/[A-Za-z]/.test(text[j + 1] ?? ""))) j++;
      skip(Math.min(j + 1, text.length) - i);
      continue;
    }
    // markdown link target ](…) — prose label stays, target is skipped
    if (c === "]" && text[i + 1] === "(") {
      prose += "]";
      i++;
      skip(indexOfFrom(")", i) + 1 - i);
      continue;
    }
    // a whitespace-delimited token containing a slash, @, :// or = is a path/URL/handle
    if (!/\s/.test(c) && (i === 0 || /[\s(\[*_]/.test(text[i - 1]))) {
      let j = i;
      while (j < text.length && !/[\s)\]|,;]/.test(text[j]) && !(text[j] === "\\" && text[j + 1] === "n")) j++;
      const tok = text.slice(i, j);
      if (/[/@]|:\/\/|=|^www\.|\.(com|org|io|dev|net|json|md|ts|tsx|js|mjs)\b/.test(tok)) {
        skip(j - i);
        continue;
      }
    }
    prose += c;
    i++;
  }
  flush();
  return out;
}

/** Mask proper nouns so neither the converter nor the gate touches them. */
function maskProperNouns(s) {
  const masks = [];
  let t = s;
  for (const p of PROPER_NOUNS) {
    t = t.split(p).join(`\u0000${masks.push(p) - 1}\u0000`);
  }
  return { t, unmask: (x) => x.replace(/\u0000(\d+)\u0000/g, (_, n) => masks[+n]) };
}

/**
 * Convert the prose runs of `text` to US spelling. Returns the new text and a
 * per-word count of what changed (keyed by the lowercase British form).
 */
export function toUS(text, counts = {}) {
  let out = "";
  for (const [isProse, chunk] of segments(text)) {
    if (!isProse) {
      out += chunk;
      continue;
    }
    const { t, unmask } = maskProperNouns(chunk);
    out += unmask(
      t.replace(WORD_RE, (m) => {
        const us = US_SPELLING[m.toLowerCase()];
        counts[m.toLowerCase()] = (counts[m.toLowerCase()] ?? 0) + 1;
        return matchCase(m, us);
      }),
    );
  }
  return out;
}

/** The British forms left in the prose runs of `text` (for the gate). */
export function findBritish(text) {
  const found = [];
  for (const [isProse, chunk] of segments(text)) {
    if (!isProse) continue;
    const { t } = maskProperNouns(chunk);
    for (const m of t.matchAll(WORD_RE)) {
      found.push({ word: m[0], chunk: t, index: m.index, context: t.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40) });
    }
  }
  return found;
}

export { WORD_RE };

/**
 * Generated data (GENERATED) is other publishers' text — Apple's, Google's,
 * a package README, the Bluetooth SIG's unit names — rendered into reference
 * pages without quotation marks, so it is quoted text in all but punctuation.
 * The gate allows a British form on a page when the word and a neighbour
 * ("metre per", "the normalised") occur together in one of those files.
 * Returns that set of lowercase "a b" pairs.
 */
export function generatedPairs(readFile) {
  const pairs = new Set();
  for (const f of GENERATED) {
    let raw;
    try {
      raw = readFile(f);
    } catch {
      continue;
    }
    const words = raw.replace(/\\[nrt"]/g, " ").toLowerCase().match(/[a-z]+/g) ?? [];
    for (let i = 0; i < words.length; i++) {
      if (!US_SPELLING[words[i]]) continue;
      if (i > 0) pairs.add(`${words[i - 1]} ${words[i]}`);
      if (i + 1 < words.length) pairs.add(`${words[i]} ${words[i + 1]}`);
    }
  }
  return pairs;
}

/** Whether a British form found in `text` at `index` is one generated data supplies. */
export function fromGenerated(pairs, text, index, word) {
  const before = text.slice(Math.max(0, index - 40), index).toLowerCase().match(/[a-z]+/g) ?? [];
  const after = text.slice(index + word.length, index + word.length + 40).toLowerCase().match(/[a-z]+/g) ?? [];
  const w = word.toLowerCase();
  return (before.length > 0 && pairs.has(`${before.at(-1)} ${w}`)) || (after.length > 0 && pairs.has(`${w} ${after[0]}`));
}

/**
 * The prose of a built HTML page: its <title>, meta description and <body>
 * text, without scripts, styles, code, preformatted text, blockquotes and
 * inline quotations, tags removed and entities decoded.
 */
export function pageProse(html) {
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
  const desc = /<meta\b[^>]*\bname="description"[^>]*\bcontent="([^"]*)"/.exec(html)?.[1] ?? "";
  const body = html.replace(/^[\s\S]*?<body\b[^>]*>/i, "");
  const text = [title, desc, body]
    .join("\n")
    .replace(/<(script|style|code|pre|blockquote|q|kbd|samp|template|noscript)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rsquo;/g, "’")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&lt;/g, "‹")
    .replace(/&gt;/g, "›")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}
