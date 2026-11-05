/**
 * @aifitnessapi/api-client — a typed, zero-dependency client for the
 * read-only JSON API at https://aifitnessapi.com/api/v1.
 *
 * The types come from ./schema.ts, which scripts/build-api-client.mjs
 * generates from the site's own OpenAPI document; qa's API-CLIENT-DRIFT gate
 * fails the site's build when the two disagree. This file is hand-written and
 * small: one fetch per call, no retries, no cache, no runtime dependencies.
 * Every response is a static file, so the platform's HTTP cache (the API
 * sends Cache-Control) is the cache.
 */
import { COLLECTION_KEYS, type ApiIndex, type CollectionPath, type Collections } from "./schema.js";

export * from "./schema.js";

export const DEFAULT_BASE_URL = "https://aifitnessapi.com";

/** A non-2xx response. `status` 404 means the id is not in this edition. */
export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  constructor(status: number, url: string, message?: string) {
    super(message ?? `GET ${url} returned ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
  }
}

/** The subset of the WHATWG fetch signature the client uses. */
export type FetchLike = (url: string, init?: { headers?: Record<string, string>; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

export type ClientOptions = {
  /** Origin to call; defaults to https://aifitnessapi.com. */
  baseUrl?: string;
  /** Defaults to globalThis.fetch (Node 18+, browsers, Deno, Bun, workers). */
  fetch?: FetchLike;
  /** Passed to every request, e.g. to cancel on unmount. */
  signal?: AbortSignal;
};

export type ApiClient = {
  /** GET /api/v1 — every collection with its count, verified date and item URL template. */
  index(): Promise<ApiIndex>;
  /** GET /api/v1/openapi.json — the OpenAPI 3.1 document these types were generated from. */
  openapi(): Promise<Record<string, unknown>>;
  /** GET /api/v1/<path> — a whole collection, with its provenance. */
  list<P extends CollectionPath>(path: P): Promise<Collections[P]["collection"]>;
  /** GET /api/v1/<path>/<id> — one item. Rejects with ApiError(404) for an unknown id. */
  get<P extends CollectionPath>(path: P, id: string): Promise<Collections[P]["response"]>;
  /** One item, or null when the id is not in this edition. */
  find<P extends CollectionPath>(path: P, id: string): Promise<Collections[P]["response"] | null>;
  /** The item field whose value is a collection's id (e.g. "identifier" for healthkit/types). */
  keyOf<P extends CollectionPath>(path: P): Collections[P]["key"];
  /** The absolute URL a call would fetch, for logging or caching. */
  url(path: CollectionPath | "" | "openapi.json", id?: string): string;
};

/** Ids are case-sensitive and URL-safe ([A-Za-z0-9._-]); anything else cannot exist. */
const ID = /^[A-Za-z0-9._-]+$/;

export function createClient(options: ClientOptions = {}): ApiClient {
  const base = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  const doFetch: FetchLike | undefined = options.fetch ?? (globalThis.fetch as unknown as FetchLike | undefined);
  if (!doFetch) throw new Error("no fetch available: pass options.fetch");

  function url(path: CollectionPath | "" | "openapi.json", id?: string): string {
    if (path !== "" && path !== "openapi.json" && !(path in COLLECTION_KEYS)) throw new RangeError(`unknown collection "${path}"`);
    if (id !== undefined && !ID.test(id)) throw new RangeError(`"${id}" is not a valid id: ids are [A-Za-z0-9._-]`);
    return `${base}/api/v1${path ? `/${path}` : ""}${id !== undefined ? `/${id}` : ""}`;
  }

  async function getJson<T>(target: string): Promise<T> {
    const res = await doFetch!(target, { headers: { accept: "application/json" }, signal: options.signal });
    if (!res.ok) throw new ApiError(res.status, target);
    return (await res.json()) as T;
  }

  return {
    index: () => getJson<ApiIndex>(url("")),
    openapi: () => getJson<Record<string, unknown>>(url("openapi.json")),
    list: (path) => getJson(url(path)),
    get: (path, id) => getJson(url(path, id)),
    async find(path, id) {
      if (!ID.test(id)) return null;
      try {
        return await getJson(url(path, id));
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) return null;
        throw err;
      }
    },
    keyOf: (path) => COLLECTION_KEYS[path],
    url,
  };
}
