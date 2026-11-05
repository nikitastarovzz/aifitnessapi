import { RATE_LIMIT_VENDORS } from "@/lib/rateLimitCalc.mjs";
import { GHAPI_UNVERIFIED_USER_CAP } from "@/lib/ghapiCoverage";
import {
  ALL_NOT_DOCUMENTED,
  ALL_RATE_VENDORS,
  COVERAGE_PATH,
  RATE_CHECKED,
  RATE_LIMIT_PATH,
  RATE_UPDATED,
  limitRows,
  rateLimitCapsule,
} from "@/lib/coverageView";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, table, type MirrorDoc } from "./core";

/** /tools/rate-limit-calculator.md — mirrors src/app/tools/rate-limit-calculator/page.tsx:
 *  every documented limit with its quote, the not-documented list and the
 *  model, from lib/coverageView and lib/rateLimitCalc.mjs. */
export function rateLimitCalculatorMirror(): MirrorDoc {
  const limits = ALL_RATE_VENDORS.filter((v) => v.tiers.length).flatMap((v) => [
    `### ${v.name}`,
    "",
    ...table(
      ["Tier", "Limit", "Allowed", "Scope", "Vendor's words"],
      limitRows(v).map((r) => [r.tier, r.label, r.allowed, r.scope, `“${r.src.quote}” (${link("source", r.src.url)})`]),
    ),
    ...(v.scopeNote ? [v.scopeNote.text, ""] : []),
    `#### Mitigations ${v.name} documents`,
    "",
    ...(v.mitigations.length ? v.mitigations.map((m) => `- ${m.text} (${link("source", m.src.url)})`) : ["- None in the pages read."]),
    "",
    `Sources read ${RATE_CHECKED[v.id] ?? "unknown"} · ${link("guide", v.guide)}`,
    "",
  ]);
  const unlimited = RATE_LIMIT_VENDORS.filter((v) => v.unlimited);

  return {
    path: RATE_LIMIT_PATH,
    title: "Will your sync schedule fit the API’s rate limit?",
    description:
      "Users × sync frequency × endpoints against WHOOP, Strava, Oura, Polar, Withings, Google Health and more: which documented limit binds first, what to do.",
    updated: RATE_UPDATED,
    type: "tool",
    capsule: rateLimitCapsule(),
    body: [
      interactiveNote(RATE_LIMIT_PATH, "the calculator (users, syncs per day, endpoints per sync, timing), with the scenario kept in the URL"),
      "",
      "## Every documented limit",
      "",
      ...limits,
      "## No limit, or not documented",
      "",
      ...unlimited.map((v) => `- **${v.name}: no limit today.** ${v.unlimited!.text} (${link("source", v.unlimited!.src.url)}) ${link("Guide", v.guide)}.`),
      ...ALL_NOT_DOCUMENTED.map(
        (v) =>
          `- **${v.name}: not documented.** ${v.reason}${v.src ? ` (${link("source", v.src.url)})` : ""} ${link("Guide", v.guide)}${
            RATE_CHECKED[v.id] && RATE_CHECKED[v.id] !== "unknown" ? `, read ${RATE_CHECKED[v.id]}` : ""
          }.`,
      ),
      "",
      "## What the calculator assumes",
      "",
      "- Each user syncs the number of times you set, and each sync makes the number of requests you set. Paging, retries and token refreshes are extra requests the calculator does not add for you; count them in “endpoints per sync”.",
      "- “Spread evenly” is the average load in each window. “All at once” is a cron that syncs every user at the same moment, the worst case for per-minute limits, which is how a schedule that fits the daily limit can still get 429s.",
      "- A limit is applied to your whole app or to each user as the vendor states. Where the vendor gives a number without saying which (Oura, COROS, Wodify, Wahoo), it is applied to the whole app, the stricter reading, and labeled.",
      `- Polar’s limits grow with registered users; the users you enter stand in for that count. The Google Health API’s unverified-app tier caps an app at ${GHAPI_UNVERIFIED_USER_CAP} users, per Google, so its user count is not a free choice.`,
      "- Terra counts days of data requested rather than requests, so set the days each request asks for. Strava’s figures assume read requests; uploads count only against its overall limit.",
      `- On-device stores are not modeled: their quotas are per app on the phone, not per server. Health Connect’s are covered in ${link("Health Connect ERROR_RATE_LIMIT_EXCEEDED", "/fix/health-connect-rate-limit")}.`,
      "",
      `A free tool from ${site.name}. Which of these APIs carry the metrics you need, and which push them by webhook: ${link("the API coverage matrix", COVERAGE_PATH)}. A retrying fetch wrapper that reads these headers: ${link("the rate-limit fetcher recipe", "/cookbook/rate-limit-fetcher")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(RATE_LIMIT_PATH),
    ],
  };
}
