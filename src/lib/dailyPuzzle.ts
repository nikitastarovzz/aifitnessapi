/**
 * The daily developer puzzle behind /daily: pure and deterministic.
 *
 * Two halves, both free of I/O, clocks and randomness:
 *
 *  - `buildDailyBank(inputs)` turns rows of the site's generated datasets into
 *    the pool each puzzle kind draws from. Every bank item keeps the row it
 *    came from (its id, the source sentence, the vendor URL and the page on
 *    this site that renders the row), and a row whose answer the dataset marks
 *    null — an undocumented error case, a quantity type whose aggregation
 *    Apple does not state, an Apple joint with no index — never becomes an
 *    item. Nothing is typed by hand here except the question wording.
 *
 *  - `puzzleFor(date, bank)` picks five questions for a UTC calendar date
 *    from a PRNG seeded by that date, so every visitor on the same date gets
 *    the same puzzle without a server. The kind of each slot rotates with the
 *    puzzle number, so each day leads with a different kind.
 *
 * The data modules are passed in rather than imported so this file has no
 * path aliases and runs as-is under `node --test` (Node's type stripping):
 * scripts/daily-puzzle.test.mjs builds the bank from the same modules
 * src/lib/dailyBank.ts does.
 *
 * Same date, same bank → same puzzle. A regenerated dataset can change the
 * bank, and with it a future (or re-rendered past) day's draw; the puzzle is
 * a game over the data as it stands, not a ledger.
 */

// ── Inputs: the dataset row shapes this module reads (structural subsets). ──

export type HkErrorRow = { case: string; abstract: string | null; deprecated: boolean; docUrl: string };
export type HcErrorRow = { name: string; description: string | null; deprecated: boolean; docUrl: string };
export type GhaErrorRow = { reason: string; httpStatus: number; description: string };
export type MatrixRowIn = { id: string; label: string; href: string; apple: string; android: string; watchOut?: string };
export type HkIdentifierRow = {
  case: string;
  family: string;
  familyType: string;
  aggregation: "cumulative" | "discrete" | null;
  aggregationEvidence: string | null;
  deprecated: boolean;
  docUrl: string;
};
export type PosePointIn = { index: number | null; name: string; key: string };
export type PoseSchemeIn = { slug: string; name: string; shortName: string; sourceId: string; nameSource: string; indexed: boolean; points: PosePointIn[] };
export type PoseSourceIn = { id: string; page: string };

export type DailyInputs = {
  hkErrors: HkErrorRow[];
  hcErrors: HcErrorRow[];
  ghaErrors: GhaErrorRow[];
  /** Google's error catalog page, the source of every GHA row. */
  ghaErrorsUrl: string;
  matrixRows: MatrixRowIn[];
  hkIdentifiers: HkIdentifierRow[];
  /** The /healthkit-identifiers/<slug> page for a Swift case, or null when that
   *  identifier has no page of its own. */
  hkPagePath: (caseName: string) => string | null;
  poseSchemes: PoseSchemeIn[];
  poseSources: PoseSourceIn[];
};

// ── The bank ──────────────────────────────────────────────────────────────

export type Platform = "healthkit" | "health-connect" | "google-health-api";
export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "healthkit", label: "HealthKit" },
  { id: "health-connect", label: "Health Connect" },
  { id: "google-health-api", label: "Google Health API" },
];

export type ErrorItem = {
  id: string;
  platform: Platform;
  /** The constant / case / reason as the vendor names it. */
  name: string;
  /** The vendor's message, verbatim — the question's prompt and its evidence. */
  text: string;
  sourceUrl: string;
  href: string;
};
export type TranslateItem = {
  id: string;
  /** e.g. "HKQuantityTypeIdentifier.heartRate". */
  identifier: string;
  rowId: string;
};
export type TranslateRow = { id: string; label: string; apple: string; android: string; watchOut: string | null; href: string };
export type AggregationItem = {
  id: string;
  identifier: string;
  aggregation: "cumulative" | "discrete";
  evidence: string;
  sourceUrl: string;
  href: string;
};
/** A scheme's quizzable points, as [index, name] pairs. */
export type KeypointScheme = { slug: string; name: string; nameSource: string; sourceUrl: string; points: [number, string][] };

export type DailyBank = {
  errors: Record<Platform, ErrorItem[]>;
  translate: TranslateItem[];
  translateRows: TranslateRow[];
  aggregation: AggregationItem[];
  keypoints: KeypointScheme[];
};

/** Messages that name a platform or vendor would answer their own question. */
const GIVEAWAY = /healthkit|health\s*connect|fitbit|google|apple|android|\bios\b|ipados|watchos|visionos|ipad|iphone|\bhk[A-Z]/i;

/** COCO-WholeBody's 68 face points are named face-0 … face-67: a number for a
 *  number, not a keypoint anyone can reason about, so they are not asked. */
const UNNAMED_POINT = /^face-\d+$/;

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

export function buildDailyBank(inp: DailyInputs): DailyBank {
  const errors: Record<Platform, ErrorItem[]> = { healthkit: [], "health-connect": [], "google-health-api": [] };
  for (const r of inp.hkErrors) {
    if (!r.abstract || r.deprecated) continue;
    errors.healthkit.push({
      id: `hk-error:${r.case}`,
      platform: "healthkit",
      name: `HKError.Code.${r.case}`,
      text: r.abstract,
      sourceUrl: r.docUrl,
      href: `/healthkit-errors#err-${r.case.toLowerCase()}`,
    });
  }
  for (const r of inp.hcErrors) {
    if (!r.description || r.deprecated) continue;
    errors["health-connect"].push({
      id: `hc-error:${r.name}`,
      platform: "health-connect",
      name: `HealthConnectException.${r.name}`,
      text: r.description,
      sourceUrl: r.docUrl,
      href: `/error-codes/health-connect#code-${r.name.toLowerCase()}`,
    });
  }
  for (const r of inp.ghaErrors) {
    if (!r.description) continue;
    errors["google-health-api"].push({
      id: `gha-error:${r.reason}`,
      platform: "google-health-api",
      name: `${r.reason} (HTTP ${r.httpStatus})`,
      text: r.description,
      sourceUrl: inp.ghaErrorsUrl,
      href: `/google-health-api/errors#error-${r.reason.toLowerCase()}`,
    });
  }
  // A message two platforms share has no single right answer; one that names
  // its platform has no puzzle in it. Both are dropped.
  const seen = new Map<string, Set<Platform>>();
  for (const p of PLATFORMS) for (const e of errors[p.id]) {
    const k = norm(e.text);
    seen.set(k, (seen.get(k) ?? new Set()).add(p.id));
  }
  for (const p of PLATFORMS) {
    errors[p.id] = errors[p.id]
      .filter((e) => seen.get(norm(e.text))!.size === 1 && !GIVEAWAY.test(e.text))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  // Translate: only the verified matrix. The Apple side is parsed exactly as
  // /tools/identifier-translator parses it, and an identifier must also exist
  // in Apple's identifier dataset, which supplies its family type.
  const hkByCase = new Map(inp.hkIdentifiers.map((r) => [r.case, r]));
  const translateRows: TranslateRow[] = inp.matrixRows.map((r) => ({
    id: r.id,
    label: r.label,
    apple: r.apple,
    android: r.android,
    watchOut: r.watchOut ?? null,
    href: r.href,
  }));
  const translate: TranslateItem[] = [];
  const androidOwners = new Map<string, number>();
  for (const r of inp.matrixRows) androidOwners.set(r.android, (androidOwners.get(r.android) ?? 0) + 1);
  for (const r of inp.matrixRows) {
    if (androidOwners.get(r.android)! > 1) continue;
    for (const m of r.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
      const row = hkByCase.get(m[1]);
      if (!row) continue;
      translate.push({ id: `matrix:${r.id}:${row.case}`, identifier: `${row.familyType}.${row.case}`, rowId: r.id });
    }
  }
  translate.sort((a, b) => a.id.localeCompare(b.id));

  // Sum or average: quantity types where Apple's prose states the style and
  // the sentence is stored. Never a null.
  const aggregation: AggregationItem[] = inp.hkIdentifiers
    .filter((r) => r.family === "quantity" && r.aggregation && r.aggregationEvidence && !r.deprecated)
    .map((r) => ({
      id: `hk-aggregation:${r.case}`,
      identifier: `${r.familyType}.${r.case}`,
      aggregation: r.aggregation!,
      evidence: r.aggregationEvidence!,
      sourceUrl: r.docUrl,
      href: inp.hkPagePath(r.case) ?? "/tools/aggregation-checker",
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  // Keypoints: indexed schemes only (Apple Vision's joints have no index).
  const sourcePage = new Map(inp.poseSources.map((s) => [s.id, s.page]));
  const keypoints: KeypointScheme[] = inp.poseSchemes
    .filter((s) => s.indexed)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      nameSource: s.nameSource,
      sourceUrl: sourcePage.get(s.sourceId) ?? "",
      points: s.points
        .filter((p) => p.index !== null && !UNNAMED_POINT.test(p.name))
        .map((p) => [p.index!, p.name] as [number, string]),
    }))
    .filter((s) => s.points.length >= 4 && s.sourceUrl);

  return { errors, translate, translateRows, aggregation, keypoints };
}

// ── Dates and numbering ───────────────────────────────────────────────────

/** Puzzle #1 is this UTC date. */
export const LAUNCH_DATE = "2026-10-31";
export const QUESTIONS_PER_DAY = 5;

const DAY_MS = 86_400_000;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

/** The UTC calendar date of an instant, "YYYY-MM-DD". */
export function utcDate(at: Date): string {
  return at.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  if (!isoDate.test(date)) throw new Error(`not a YYYY-MM-DD date: ${date}`);
  return utcDate(new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS));
}

/** 1 on launch day, 2 the next UTC day, …; 0 or less before launch. */
export function puzzleNumber(date: string): number {
  if (!isoDate.test(date)) throw new Error(`not a YYYY-MM-DD date: ${date}`);
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${LAUNCH_DATE}T00:00:00Z`)) / DAY_MS) + 1;
}

// ── Seeded randomness ─────────────────────────────────────────────────────

/** FNV-1a, 32-bit. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: a small, well-mixed 32-bit PRNG. Returns [0, 1). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(xs: T[], r: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Questions ─────────────────────────────────────────────────────────────

export type Kind = "platform" | "translate" | "aggregation" | "keypoint";
export const KINDS: Kind[] = ["platform", "translate", "aggregation", "keypoint"];
export const KIND_LABEL: Record<Kind, string> = {
  platform: "Which platform throws this?",
  translate: "Translate it",
  aggregation: "Sum or average?",
  keypoint: "Name the keypoint",
};

export type Question = {
  /** The bank item, traceable to one dataset row. */
  id: string;
  kind: Kind;
  /** The question, in words. */
  prompt: string;
  /** The thing being asked about, shown as code or a quotation. */
  subject: string;
  subjectIsQuote: boolean;
  options: string[];
  /** Index into options. */
  correct: number;
  /** One line naming the right answer, for the reveal. */
  answer: string;
  /** The source sentence the answer rests on, verbatim from the dataset. */
  evidence: string;
  /** True when `evidence` is the source's own words; false when it is a
   *  sentence built from a dataset row (the matrix pair, a keypoint index). */
  evidenceIsQuote: boolean;
  /** Who said it: "Apple's HKError.Code reference", … */
  evidenceBy: string;
  /** The vendor page the dataset row was read from; null for the matrix. */
  sourceUrl: string | null;
  /** The page on this site that owns the row. */
  href: string;
  hrefLabel: string;
};

export type Puzzle = { date: string; number: number; questions: Question[] };

const PLATFORM_EVIDENCE: Record<Platform, { by: string; page: string }> = {
  healthkit: { by: "Apple's HKError.Code reference", page: "Every HealthKit error code" },
  "health-connect": { by: "Google's HealthConnectException reference", page: "Health Connect error codes" },
  "google-health-api": { by: "Google's Google Health API v4 error catalog", page: "Google Health API error catalog" },
};

function platformQuestion(e: ErrorItem): Question {
  const correct = PLATFORMS.findIndex((p) => p.id === e.platform);
  return {
    id: e.id,
    kind: "platform",
    prompt: "Which platform's error reference uses this exact message?",
    subject: e.text,
    subjectIsQuote: true,
    options: PLATFORMS.map((p) => p.label),
    correct,
    answer: `${PLATFORMS[correct].label}: ${e.name}`,
    evidence: e.text,
    evidenceIsQuote: true,
    evidenceBy: PLATFORM_EVIDENCE[e.platform].by,
    sourceUrl: e.sourceUrl,
    href: e.href,
    hrefLabel: PLATFORM_EVIDENCE[e.platform].page,
  };
}

function translateQuestion(t: TranslateItem, rows: TranslateRow[], r: () => number): Question {
  const own = rows.find((x) => x.id === t.rowId)!;
  const others = shuffle(rows.filter((x) => x.id !== own.id && x.android !== own.android), r).slice(0, 3);
  const options = shuffle([own, ...others], r);
  const evidence = `The “${own.label}” row pairs ${own.apple} with ${own.android}.${own.watchOut ? ` ${own.watchOut}` : ""}`;
  return {
    id: t.id,
    kind: "translate",
    prompt: "Which Health Connect record type(s) does this site's verified HealthKit ↔ Health Connect matrix pair with it?",
    subject: t.identifier,
    subjectIsQuote: false,
    options: options.map((o) => o.android),
    correct: options.indexOf(own),
    answer: own.android,
    evidence,
    evidenceIsQuote: false,
    evidenceBy: "This site's HealthKit ↔ Health Connect matrix, each row checked against Apple's and Google's documentation",
    sourceUrl: null,
    href: `/matrix#${own.id}`,
    hrefLabel: "HealthKit ↔ Health Connect matrix",
  };
}

const AGG_OPTIONS = ["Cumulative: sum it", "Discrete: average it"];

function aggregationQuestion(a: AggregationItem): Question {
  const correct = a.aggregation === "cumulative" ? 0 : 1;
  return {
    id: a.id,
    kind: "aggregation",
    prompt: "Does Apple describe this quantity type as cumulative (you sum it) or discrete (you average it)?",
    subject: a.identifier,
    subjectIsQuote: false,
    options: AGG_OPTIONS,
    correct,
    answer: AGG_OPTIONS[correct],
    evidence: a.evidence,
    evidenceIsQuote: true,
    evidenceBy: "Apple's documentation for the type",
    sourceUrl: a.sourceUrl,
    href: a.href,
    hrefLabel: a.href.startsWith("/tools/") ? "Sum it or average it? checker" : `${a.identifier.split(".").pop()} reference page`,
  };
}

/** The left/right counterpart of a name, as spelt in its own scheme. */
function mirrorOf(name: string): string[] {
  const swaps: [RegExp, string][] = [
    [/LEFT/g, "RIGHT"], [/RIGHT/g, "LEFT"],
    [/left/g, "right"], [/right/g, "left"],
    [/^L(?=[A-Z])/, "R"], [/^R(?=[A-Z])/, "L"],
  ];
  const out: string[] = [];
  for (const [re, to] of swaps) {
    re.lastIndex = 0;
    if (re.test(name)) out.push(name.replace(re, to));
  }
  return out;
}

function keypointQuestion(s: KeypointScheme, point: [number, string], r: () => number): Question {
  const [index, name] = point;
  const names = s.points.map((p) => p[1]);
  const mirror = mirrorOf(name).find((m) => m !== name && names.includes(m));
  const pool = shuffle(names.filter((n) => n !== name && n !== mirror && n.toLowerCase() !== name.toLowerCase()), r);
  const distractors = [...(mirror ? [mirror] : []), ...pool].slice(0, 3);
  const options = shuffle([name, ...distractors], r);
  return {
    id: `pose:${s.slug}:${index}`,
    kind: "keypoint",
    prompt: `In ${s.name}, which keypoint is index ${index}?`,
    subject: `${s.name} · index ${index}`,
    subjectIsQuote: false,
    options,
    correct: options.indexOf(name),
    answer: `${index} = ${name}`,
    evidence: `Index ${index} is ${name} in ${s.nameSource}.`,
    evidenceIsQuote: false,
    evidenceBy: "The scheme's own source file",
    sourceUrl: s.sourceUrl,
    href: `/pose-keypoints/${s.slug}#kp-${index}`,
    hrefLabel: `${s.name} keypoint table`,
  };
}

/** Every distinct question each kind can draw from (for the page and tests). */
export function bankSizes(bank: DailyBank): Record<Kind, number> {
  return {
    platform: PLATFORMS.reduce((n, p) => n + bank.errors[p.id].length, 0),
    translate: bank.translate.length,
    aggregation: bank.aggregation.length,
    keypoint: bank.keypoints.reduce((n, s) => n + s.points.length, 0),
  };
}

/** The kind of each of the day's five slots: all four kinds, led by a
 *  different one each day, the lead kind asked twice. */
export function kindsFor(number: number): Kind[] {
  const lead = ((number - 1) % KINDS.length + KINDS.length) % KINDS.length;
  return Array.from({ length: QUESTIONS_PER_DAY }, (_, i) => KINDS[(lead + i) % KINDS.length]);
}

export function puzzleFor(date: string, bank: DailyBank): Puzzle {
  const number = puzzleNumber(date);
  const r = rng(hash(`aifitnessapi-daily:${date}`));
  const used = new Set<string>();
  const pick = <T extends { id: string }>(xs: T[]): T => {
    const free = xs.filter((x) => !used.has(x.id));
    const from = free.length ? free : xs;
    const x = from[Math.floor(r() * from.length)];
    used.add(x.id);
    return x;
  };

  const questions = kindsFor(number).map((kind): Question => {
    if (kind === "platform") {
      const platforms = PLATFORMS.filter((p) => bank.errors[p.id].length > 0);
      const p = platforms[Math.floor(r() * platforms.length)];
      return platformQuestion(pick(bank.errors[p.id]));
    }
    if (kind === "translate") return translateQuestion(pick(bank.translate), bank.translateRows, r);
    if (kind === "aggregation") return aggregationQuestion(pick(bank.aggregation));
    const all = bank.keypoints.flatMap((s) => s.points.map((p) => ({ id: `pose:${s.slug}:${p[0]}`, s, p })));
    const k = pick(all);
    return keypointQuestion(k.s, k.p, r);
  });
  return { date, number, questions };
}

// ── Results ───────────────────────────────────────────────────────────────

/** picks[i] is the option index chosen for question i, or null. */
export function score(puzzle: Puzzle, picks: (number | null)[]): number {
  return puzzle.questions.reduce((n, q, i) => n + (picks[i] === q.correct ? 1 : 0), 0);
}

/** "🟩🟥🟩🟩🟩" — right or wrong per question, in order, nothing else. */
export function grid(puzzle: Puzzle, picks: (number | null)[]): string {
  return puzzle.questions.map((q, i) => (picks[i] === q.correct ? "🟩" : "🟥")).join("");
}

export function shareText(puzzle: Puzzle, picks: (number | null)[], url: string): string {
  return `aifitnessapi daily #${puzzle.number} ${grid(puzzle, picks)}\n${url}`;
}

/**
 * Consecutive completed UTC days ending today — or ending yesterday when
 * today is not finished yet, so the streak does not read 0 before you play.
 */
export function streak(completedDates: string[], today: string): number {
  const done = new Set(completedDates);
  let day = done.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (done.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}
