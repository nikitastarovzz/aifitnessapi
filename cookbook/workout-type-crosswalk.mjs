/**
 * workout-type-crosswalk.mjs — translate a workout type between HealthKit,
 * Health Connect, Wear OS Health Services and the Google Health API by name
 * identity only, and land everything else on each platform's documented
 * catch-all with the original name kept.
 *
 * WHAT THIS IMPLEMENTS
 *   `crosswalkKey(name)` is the site's one normalization, stated on
 *   /workout-types: remove a leading EXERCISE_TYPE_, lowercase, drop every
 *   character that is not a letter or a digit. Two constants match only when
 *   their keys are equal. Nothing is joined by meaning: "traditional strength
 *   training" and "STRENGTH_TRAINING" do not match, because deciding that
 *   they are the same activity is a product judgment, not a lookup.
 *
 *   `createCrosswalk(rows)` indexes rows shaped like the site's dataset
 *   (`{ platform, constant }`, from /datasets/workout-types-crosswalk-2026.json
 *   or /api/v1). `translate(from, constant, to)` returns
 *     { constant, matched: true }                       a same-name constant
 *     { constant: FALLBACK[to], matched: false, original }  otherwise
 *
 *   The fallbacks are what each platform's own reference documents:
 *     healthkit          other — "a workout that does not match any of the
 *                        other workout activity types"
 *     health-connect     EXERCISE_TYPE_OTHER_WORKOUT — "Any unknown new value
 *                        definition will also fall automatically into" it
 *     wear-os            UNKNOWN — what fromId returns for an unmapped id
 *     google-health-api  OTHER — the one type whose displayName keeps "the
 *                        user's custom, free-form display name"
 *   So `original` is not decoration: on the Google Health API it is the
 *   displayName to send, and everywhere else it is what you store beside the
 *   catch-all so the user's "Padel" does not come back as "Other".
 *
 * PAGES THIS SUPPORTS
 *   https://aifitnessapi.com/workout-types
 *   https://aifitnessapi.com/datasets (workout-types-crosswalk-2026)
 *
 * No dependencies. Node 20+ or any browser.
 *
 * MIT — from aifitnessapi.com/cookbook
 */

export const PLATFORMS = Object.freeze(["healthkit", "health-connect", "wear-os", "google-health-api"]);

export const FALLBACK = Object.freeze({
  healthkit: "other",
  "health-connect": "EXERCISE_TYPE_OTHER_WORKOUT",
  "wear-os": "UNKNOWN",
  "google-health-api": "OTHER",
});

/** The site's normalization: strip EXERCISE_TYPE_, lowercase, keep a-z0-9. */
export function crosswalkKey(name) {
  return String(name)
    .replace(/^EXERCISE_TYPE_/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * @param {{ platform: string, constant: string, deprecated?: string|null }[]} rows
 * @param {{ skipDeprecated?: boolean }} [opts]  prefer a current constant when a key has two
 */
export function createCrosswalk(rows, { skipDeprecated = true } = {}) {
  /** platform → key → constants[] */
  const index = new Map(PLATFORMS.map((p) => [p, new Map()]));
  const known = new Map(PLATFORMS.map((p) => [p, new Set()]));
  for (const r of rows) {
    if (!index.has(r.platform)) continue;
    known.get(r.platform).add(r.constant);
    const key = crosswalkKey(r.constant);
    const bucket = index.get(r.platform).get(key) ?? [];
    bucket.push(r);
    index.get(r.platform).set(key, bucket);
  }

  function pick(bucket) {
    if (!bucket?.length) return null;
    const current = skipDeprecated ? bucket.filter((r) => r.deprecated !== "yes") : bucket;
    return (current[0] ?? bucket[0]).constant;
  }

  /** Every constant on other platforms with the same key, like the dataset's sameNameOn. */
  function sameNameOn(platform, constant) {
    const key = crosswalkKey(constant);
    const out = [];
    for (const p of PLATFORMS) {
      if (p === platform) continue;
      for (const r of index.get(p).get(key) ?? []) out.push(`${p}:${r.constant}`);
    }
    return out;
  }

  function translate(from, constant, to) {
    if (!index.has(from) || !index.has(to)) throw new RangeError(`platforms are ${PLATFORMS.join(", ")}`);
    if (!known.get(from).has(constant)) throw new RangeError(`${constant} is not a ${from} constant in this table`);
    const hit = pick(index.get(to).get(crosswalkKey(constant)));
    if (hit) return { constant: hit, matched: true };
    return { constant: FALLBACK[to], matched: false, original: constant };
  }

  /** How many constants of `from` have a same-name partner on `to`. */
  function coverage(from, to) {
    let matched = 0;
    for (const c of known.get(from)) if (index.get(to).has(crosswalkKey(c))) matched++;
    return { matched, total: known.get(from).size };
  }

  return { translate, sameNameOn, coverage };
}

/**
 * The payload fields to write when a translation fell back, so the user's
 * own label survives. Google Health API: displayName is honored only for
 * OTHER. Elsewhere: a title or metadata field of your choosing.
 */
export function fallbackLabel(result, to) {
  if (result.matched) return null;
  return to === "google-health-api" ? { displayName: result.original } : { title: result.original };
}
