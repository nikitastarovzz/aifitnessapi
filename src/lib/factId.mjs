/**
 * The fact id for one evidence row (scheme in src/lib/factCardCore.mjs):
 * `<cluster>-<slug>.<first 10 hex of sha256(url + "\n" + quote)>`. Separate
 * from factCardCore.mjs only because it needs node:crypto, which must not
 * reach the browser bundle; src/lib/keyFacts.ts calls it at build.
 */
import { createHash } from "node:crypto";
import { FACT_HASH_LEN, factBase } from "./factCardCore.mjs";

/** The hash part of an id, from an evidence row's url and quote (trimmed). */
export function factHash(url, quote) {
  return createHash("sha256")
    .update(`${String(url)}\n${String(quote).trim()}`)
    .digest("hex")
    .slice(0, FACT_HASH_LEN);
}

/** The fact id for one evidence row of the page at `enPath`. */
export function factId(enPath, url, quote) {
  return `${factBase(enPath)}.${factHash(url, quote)}`;
}
