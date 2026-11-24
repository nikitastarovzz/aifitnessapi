/**
 * @aifitnessapi/exercise-adapter — one Exercise type over three free exercise
 * sources: free-exercise-db (a public-domain JSON file), wger (its public REST
 * API v2) and ExerciseDB V1's free tier (oss.exercisedb.dev). No API keys, no
 * paid providers, no dependencies.
 *
 * Every field mapping below was written from real responses read on
 * 2026-11-24 (test/fixtures, with their URLs and snapshot run ids in
 * test/fixtures/sources.json). A field a source does not give is an empty list
 * or null, never a guess, and `raw` keeps the upstream record unchanged.
 */

export type ProviderId = "free-exercise-db" | "wger" | "exercisedb-v1";

export interface ExerciseMedia {
  url: string;
  kind: "image" | "gif";
}

/** The license a source attaches to the record itself; null where it attaches none. */
export interface ExerciseLicense {
  name: string;
  url: string | null;
  author: string | null;
}

export interface Exercise {
  provider: ProviderId;
  /** The source's own id, as a string. */
  id: string;
  name: string;
  /** free-exercise-db's category, wger's category name; null for ExerciseDB V1, which has bodyParts instead. */
  category: string | null;
  /** ExerciseDB V1's bodyParts; empty for the other two, which give none. */
  bodyParts: string[];
  equipment: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  /** Step-by-step instructions where the source gives steps (free-exercise-db, ExerciseDB V1), verbatim. */
  instructions: string[];
  /** wger's translation description, verbatim HTML; null for the other two. */
  description: string | null;
  /** free-exercise-db's level; null for the other two. */
  level: string | null;
  media: ExerciseMedia[];
  license: ExerciseLicense | null;
  /** Where this record can be read again. */
  sourceUrl: string;
  /** The upstream record, unchanged. */
  raw: unknown;
}

export interface Page {
  items: Exercise[];
  /** Pass as `cursor` to read the next page; null on the last page. */
  next: string | null;
  /** The source's total, where it reports one. */
  total: number | null;
  /** Records left out of `items`: wger records with no translation in the requested language. */
  skipped: number;
}

export interface ListOptions {
  limit?: number;
  cursor?: string | null;
}

export interface ExerciseProvider {
  readonly id: ProviderId;
  list(options?: ListOptions): Promise<Page>;
  /** null when the source answers 404 or has no such record. */
  get(id: string): Promise<Exercise | null>;
}

/** The part of fetch the providers use. */
export type FetchLike = (url: string, init?: { headers?: Record<string, string> }) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export class ProviderError extends Error {
  constructor(
    readonly provider: ProviderId,
    readonly status: number,
    readonly url: string,
  ) {
    super(`${provider}: ${status} from ${url}`);
    this.name = "ProviderError";
  }
}

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => v !== null && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const str = (v: unknown): string | null => (typeof v === "string" && v !== "" ? v : null);

function defaultFetch(): FetchLike {
  const f = (globalThis as { fetch?: FetchLike }).fetch;
  if (!f) throw new Error("no global fetch: pass { fetch } to the provider");
  return f;
}

async function getJson(provider: ProviderId, fetchImpl: FetchLike, url: string, allow404 = false): Promise<unknown | null> {
  const res = await fetchImpl(url, { headers: { Accept: "application/json" } });
  if (allow404 && res.status === 404) return null;
  if (!res.ok) throw new ProviderError(provider, res.status, url);
  return res.json();
}

/* ── free-exercise-db ──────────────────────────────────────────────────── */

export const FREE_EXERCISE_DB_REPO = "yuhonas/free-exercise-db";
export const FREE_EXERCISE_DB_LICENSE: ExerciseLicense = { name: "Unlicense (public domain)", url: "https://unlicense.org", author: null };

/** One free-exercise-db record. `ref` is the commit (or branch) its image paths resolve against. */
export function fromFreeExerciseDb(rec: unknown, ref = "main"): Exercise {
  if (!isObj(rec) || typeof rec.id !== "string" || typeof rec.name !== "string") throw new TypeError("not a free-exercise-db record");
  const raw = `https://raw.githubusercontent.com/${FREE_EXERCISE_DB_REPO}/${ref}`;
  return {
    provider: "free-exercise-db",
    id: rec.id,
    name: rec.name,
    category: str(rec.category),
    bodyParts: [],
    equipment: str(rec.equipment) ? [rec.equipment as string] : [],
    primaryMuscles: strings(rec.primaryMuscles),
    secondaryMuscles: strings(rec.secondaryMuscles),
    instructions: strings(rec.instructions),
    description: null,
    level: str(rec.level),
    // The README: prefix each image path with .../main/exercises/; a pinned commit works the same way.
    media: strings(rec.images).map((p) => ({ url: `${raw}/exercises/${p}`, kind: "image" as const })),
    license: FREE_EXERCISE_DB_LICENSE,
    sourceUrl: `https://github.com/${FREE_EXERCISE_DB_REPO}/blob/${ref}/exercises/${rec.id}.json`,
    raw: rec,
  };
}

export interface FreeExerciseDbOptions {
  /** The parsed dist/exercises.json (or a local copy); when absent it is fetched once from raw.githubusercontent.com. */
  data?: unknown[];
  /** Commit or branch to read and resolve images against. Pin a commit: main moves. */
  ref?: string;
  fetch?: FetchLike;
}

export function freeExerciseDb(options: FreeExerciseDbOptions = {}): ExerciseProvider {
  const ref = options.ref ?? "main";
  let all: Promise<Exercise[]> | null = null;
  const load = () =>
    (all ??= (async () => {
      const data =
        options.data ??
        (await getJson("free-exercise-db", options.fetch ?? defaultFetch(), `https://raw.githubusercontent.com/${FREE_EXERCISE_DB_REPO}/${ref}/dist/exercises.json`));
      if (!Array.isArray(data)) throw new TypeError("free-exercise-db: exercises.json is not an array");
      return data.map((r) => fromFreeExerciseDb(r, ref));
    })());
  return {
    id: "free-exercise-db",
    async list({ limit = 20, cursor = null } = {}) {
      const items = await load();
      const offset = cursor ? Number(cursor) : 0;
      if (!Number.isInteger(offset) || offset < 0) throw new RangeError(`free-exercise-db: bad cursor ${cursor}`);
      const end = offset + limit;
      return { items: items.slice(offset, end), next: end < items.length ? String(end) : null, total: items.length, skipped: 0 };
    },
    async get(id) {
      return (await load()).find((e) => e.id === id) ?? null;
    },
  };
}

/* ── wger ──────────────────────────────────────────────────────────────── */

/** wger's language id for English (/api/v2/language/: {"id":2,"short_name":"en"}). */
export const WGER_ENGLISH = 2;

/** One wger /api/v2/exerciseinfo/ record, named and described in `language`; null when it has no translation in it. */
export function fromWger(rec: unknown, { language = WGER_ENGLISH, baseUrl = "https://wger.de" } = {}): Exercise | null {
  if (!isObj(rec) || typeof rec.id !== "number" || !Array.isArray(rec.translations)) throw new TypeError("not a wger exerciseinfo record");
  const t = rec.translations.find((x): x is Json => isObj(x) && x.language === language);
  if (!t || typeof t.name !== "string") return null;
  const muscle = (m: unknown) => (isObj(m) ? (str(m.name_en) ?? str(m.name)) : null);
  const names = (v: unknown, f: (x: unknown) => string | null) => (Array.isArray(v) ? v.map(f).filter((x): x is string => x !== null) : []);
  const lic = isObj(rec.license) ? rec.license : null;
  return {
    provider: "wger",
    id: String(rec.id),
    name: t.name,
    category: isObj(rec.category) ? str(rec.category.name) : null,
    bodyParts: [],
    equipment: names(rec.equipment, (e) => (isObj(e) ? str(e.name) : null)),
    primaryMuscles: names(rec.muscles, muscle),
    secondaryMuscles: names(rec.muscles_secondary, muscle),
    instructions: [],
    description: str(t.description),
    level: null,
    media: names(rec.images, (i) => (isObj(i) ? str(i.image) : null)).map((url) => ({ url, kind: "image" as const })),
    license: lic && str(lic.short_name) ? { name: lic.short_name as string, url: str(lic.url), author: str(rec.license_author) } : null,
    sourceUrl: `${baseUrl}/api/v2/exerciseinfo/${rec.id}/`,
    raw: rec,
  };
}

export interface WgerOptions {
  /** A self-hosted wger instance; default https://wger.de. */
  baseUrl?: string;
  /** wger language id for name and description; default 2 (English). */
  language?: number;
  fetch?: FetchLike;
}

export function wger(options: WgerOptions = {}): ExerciseProvider {
  const baseUrl = (options.baseUrl ?? "https://wger.de").replace(/\/$/, "");
  const language = options.language ?? WGER_ENGLISH;
  const f = () => options.fetch ?? defaultFetch();
  return {
    id: "wger",
    async list({ limit = 20, cursor = null } = {}) {
      const offset = cursor ? Number(cursor) : 0;
      if (!Number.isInteger(offset) || offset < 0) throw new RangeError(`wger: bad cursor ${cursor}`);
      const url = `${baseUrl}/api/v2/exerciseinfo/?format=json&limit=${limit}&offset=${offset}`;
      const body = await getJson("wger", f(), url);
      if (!isObj(body) || !Array.isArray(body.results)) throw new TypeError("wger: not a paginated exerciseinfo response");
      const mapped = body.results.map((r) => fromWger(r, { language, baseUrl }));
      const items = mapped.filter((e): e is Exercise => e !== null);
      // wger's `next` is a full URL with limit and offset; the cursor is its offset.
      const next = typeof body.next === "string" ? new URL(body.next).searchParams.get("offset") : null;
      return { items, next, total: typeof body.count === "number" ? body.count : null, skipped: mapped.length - items.length };
    },
    async get(id) {
      if (!/^\d+$/.test(id)) return null;
      const body = await getJson("wger", f(), `${baseUrl}/api/v2/exerciseinfo/${id}/?format=json`, true);
      return body === null ? null : fromWger(body, { language, baseUrl });
    },
  };
}

/* ── ExerciseDB V1, free tier ──────────────────────────────────────────── */

/** One ExerciseDB V1 record from the free host (oss.exercisedb.dev). */
export function fromExerciseDbV1(rec: unknown, baseUrl = "https://oss.exercisedb.dev"): Exercise {
  if (!isObj(rec) || typeof rec.exerciseId !== "string" || typeof rec.name !== "string") throw new TypeError("not an ExerciseDB V1 record");
  const gif = str(rec.gifUrl);
  return {
    provider: "exercisedb-v1",
    id: rec.exerciseId,
    name: rec.name,
    category: null,
    bodyParts: strings(rec.bodyParts),
    equipment: strings(rec.equipments),
    primaryMuscles: strings(rec.targetMuscles),
    secondaryMuscles: strings(rec.secondaryMuscles),
    instructions: strings(rec.instructions),
    description: null,
    level: null,
    media: gif ? [{ url: gif, kind: "gif" }] : [],
    // The free host's responses carry no license field, and AscendAPI's terms of use could not be read.
    license: null,
    sourceUrl: `${baseUrl}/api/v1/exercises/${encodeURIComponent(rec.exerciseId)}`,
    raw: rec,
  };
}

export interface ExerciseDbV1Options {
  /** Default https://oss.exercisedb.dev, the free, keyless V1 host. */
  baseUrl?: string;
  fetch?: FetchLike;
}

export function exerciseDbV1(options: ExerciseDbV1Options = {}): ExerciseProvider {
  const baseUrl = (options.baseUrl ?? "https://oss.exercisedb.dev").replace(/\/$/, "");
  const f = () => options.fetch ?? defaultFetch();
  return {
    id: "exercisedb-v1",
    async list({ limit, cursor = null } = {}) {
      const q = new URLSearchParams();
      if (limit !== undefined) q.set("limit", String(limit));
      // AscendAPI's pagination guide: pass nextCursor as `after`.
      if (cursor) q.set("after", cursor);
      const qs = q.toString();
      const url = `${baseUrl}/api/v1/exercises${qs ? `?${qs}` : ""}`;
      const body = await getJson("exercisedb-v1", f(), url);
      if (!isObj(body) || !Array.isArray(body.data)) throw new TypeError("exercisedb-v1: not a list response");
      const meta = isObj(body.meta) ? body.meta : {};
      return {
        items: body.data.map((r) => fromExerciseDbV1(r, baseUrl)),
        next: meta.hasNextPage === true ? str(meta.nextCursor) : null,
        total: typeof meta.total === "number" ? meta.total : null,
        skipped: 0,
      };
    },
    async get(id) {
      const body = await getJson("exercisedb-v1", f(), `${baseUrl}/api/v1/exercises/${encodeURIComponent(id)}`, true);
      if (body === null || !isObj(body) || !isObj(body.data)) return null;
      return fromExerciseDbV1(body.data, baseUrl);
    },
  };
}

/** Read every page of a provider (mind the source's rate limits). */
export async function* all(provider: ExerciseProvider, options: { limit?: number } = {}): AsyncGenerator<Exercise> {
  let cursor: string | null = null;
  do {
    const page: Page = await provider.list({ limit: options.limit, cursor });
    yield* page.items;
    cursor = page.next;
  } while (cursor);
}
