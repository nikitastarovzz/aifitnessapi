import { absoluteUrl } from "@/lib/site";
import { shortDate } from "@/lib/ecosystemDerive";
import { plainCitation, bibtexCitation } from "@/lib/cite";
import { releasedPricing } from "@/data/pricing";
import { PAGE_H1 } from "@/data/pageTitles";
import {
  DRIFT_COMMITS_READ,
  DRIFT_GROUPS,
  DRIFT_HISTORY_COMMIT,
  DRIFT_HISTORY_FROM,
  DRIFT_HISTORY_THROUGH,
  NOTICE_CHANGES_READ,
  NOTICE_READ_ON,
  NOTICE_ROWS,
  PRICING_ROWS,
} from "@/data/researchStudies";
import {
  driftStats,
  headlines,
  noticeStats,
  pricingStats,
  PRICING_CLASS_ORDER,
  type Headline,
  type PricingClass,
} from "@/lib/researchStats.mjs";

/**
 * The words and figures of /research and its three studies
 * (ops/VIRAL-20-2026-11-06.md items 1-3), shared by the pages and their
 * markdown mirrors so the two say the same thing. Every number here is
 * computed by src/lib/researchStats.mjs from the rows in
 * src/data/researchStudies.ts — the rows the open datasets publish — and qa
 * recomputes the headline figures from the published files (RESEARCH-DRIFT).
 * Nothing below is a figure typed by hand.
 */

export const RESEARCH_PATH = "/research";
export const DRIFT_PATH = "/research/docs-drift";
export const NOTICE_PATH = "/research/shutdown-notice";
export const PRICING_PATH_R = "/research/pricing-transparency";

export type StudyId = "docs-drift" | "shutdown-notice" | "pricing-transparency";

export type Faq = { q: string; a: string };

export type Study = {
  id: StudyId;
  path: string;
  dataset: string;
  metaTitle: string;
  h1: string;
  description: string;
  primaryQuery: string;
  /** The day the newest input was read or written: the page's dateModified. */
  dataDate: string;
  dataDateLabel: string;
  capsule: string;
  headlines: Headline[];
  method: string[];
  limits: string[];
  faqs: Faq[];
  related: { href: string; label: string }[];
};

const n = (x: number) => x.toLocaleString("en-US");
const plural = (k: number, one: string, many = `${one}s`) => `${n(k)} ${k === 1 ? one : many}`;
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export const datasetUrl = (slug: string, ext: "json" | "csv" | "md") => `/datasets/${slug}.${ext}`;

/* ───────────────────────────── 1. Docs drift ───────────────────────────── */

export function driftView() {
  const s = driftStats(DRIFT_GROUPS, DRIFT_HISTORY_THROUGH);
  const top2 = [...s.events].sort((a, b) => b.rows - a.rows).slice(0, 2);
  const top2Rows = top2.reduce((k, e) => k + e.rows, 0);
  const w7 = s.windows.find((w) => w.days === 7)!;
  const w14 = s.windows.find((w) => w.days === 14)!;
  return { s, top2, top2Rows, w7, w14 };
}

export function driftStudy(): Study {
  const { s, top2, top2Rows, w14 } = driftView();
  const our = s.byCause["our-change"] ?? 0;
  const unreachable = s.byCause["source-unreachable"] ?? 0;
  const notStated = s.byCause["not-stated"] ?? 0;
  const topHosts = s.bySource.filter((x) => x.driftEvents === s.bySource[0].driftEvents).map((x) => x.source);
  const capsule =
    `From ${shortDate(DRIFT_HISTORY_FROM)} to ${shortDate(DRIFT_HISTORY_THROUGH)}, this site's evidence files held ${n(s.rows)} quoted rows from ${n(s.sources)} source hosts. ` +
    `Its commit messages record ${s.driftEvents} source changes (counted once per host per commit) on ${s.driftSources} hosts, which replaced ${n(s.driftRows)} rows. ` +
    `Of the rows written by ${shortDate(w14.cutoff)}, ${w14.share} had their source change within 14 days. ` +
    `The two largest changes, on ${top2.map((e) => e.source).join(" and ")}, account for ${n(top2Rows)} of the ${n(s.driftRows)} replaced rows.`;
  return {
    id: "docs-drift",
    path: DRIFT_PATH,
    dataset: "fitness-api-docs-drift-2026",
    metaTitle: "How Often Fitness API Docs Change: A Drift Study",
    h1: PAGE_H1[DRIFT_PATH],
    description:
      "From the git history of this site's quoted evidence: how often fitness and health API vendor pages changed under our quotes, per host. Dataset included.",
    primaryQuery: "how often do fitness api docs change",
    dataDate: DRIFT_HISTORY_THROUGH,
    dataDateLabel: `History read through ${shortDate(DRIFT_HISTORY_THROUGH)} (main at ${DRIFT_HISTORY_COMMIT})`,
    capsule,
    headlines: headlines("docs-drift", DRIFT_GROUPS, { historyThrough: DRIFT_HISTORY_THROUGH }),
    method: [
      `Pages on this site that are written from vendor sources keep an evidence file: one row per fact, with the claim, the source URL and a verbatim quote. A weekly workflow re-reads every URL and fails when a quote is no longer on its page, and a person then re-reads the source and fixes the page.`,
      `This study replays the git history of those files, ${plural(DRIFT_COMMITS_READ, "commit")} from ${shortDate(DRIFT_HISTORY_FROM)} to ${shortDate(DRIFT_HISTORY_THROUGH)}, and follows every row from the commit that wrote it to the commit after which its file no longer held it. A row ends one of five ways: its quote changed, its URL changed, both changed, its claim was reworded over the same quote, or it was removed.`,
      `Why a row ended comes only from the message of the commit that ended it. Each explanation is a sentence copied from that message, and the generator fails if the sentence is not there or if a commit that mentions source drift has none. Source changed means the message says the vendor's page changed. Our change means this site changed the quote or URL while the source stood still. Unreachable means the page stopped answering. Where the message also says whether a fact or only the wording moved, that is recorded; otherwise the kind is left blank.`,
      `A source change is counted once per host per commit, so one vendor redesign that touched 300 rows counts once, and the row counts are given beside it.`,
    ],
    limits: [
      `It sees only committed changes. A page that changed and changed back between two reads, a page no evidence row quotes, and a change the quote check did not catch are all invisible here.`,
      `Dates are merge dates on main. A row written in a branch days before it merged carries the merge date, which makes rows look younger than they are.`,
      `The history is short: ${plural(DRIFT_COMMITS_READ, "commit")} over ${shortDate(DRIFT_HISTORY_FROM)} to ${shortDate(DRIFT_HISTORY_THROUGH)}. The 14-day share counts only rows written at least 14 days before the end of the history, so rows written later do not dilute it.`,
      `Kind of change is recorded only where the commit message states it: ${s.kinds["not stated"]} of the ${s.driftEvents} source changes have no stated kind.`,
      `One large change weighs heavily on the row figures: the two largest account for ${n(top2Rows)} of the ${n(s.driftRows)} replaced rows, which is why the count of source changes is given beside them.`,
    ],
    faqs: [
      {
        q: "How was documentation drift measured on this site?",
        a: `By replaying the git history of the site's evidence files: ${n(s.rows)} quoted source rows across ${plural(DRIFT_COMMITS_READ, "commit")}, each followed to the commit that replaced or removed it. Why it ended is taken only from that commit's message, as a sentence copied from it.`,
      },
      {
        q: "Does a changed quote mean the vendor changed a fact?",
        a: `Not always. Of the ${s.driftEvents} source changes, the commit messages call ${s.kinds.fact} changes of fact, ${s.kinds.wording} wording only and ${s.kinds.mixed} a mix of both, and do not say for ${s.kinds["not stated"]}.`,
      },
      {
        q: "Which documentation hosts changed most often?",
        a: `${list(topHosts)}, with ${plural(s.bySource[0].driftEvents, "source change")} each in the period. By rows, the largest were ${top2.map((e) => `${e.source} (${n(e.rows)} rows on ${shortDate(e.date)})`).join(" and ")}.`,
      },
      {
        q: "Were some quotes changed by this site rather than by the vendor?",
        a: `Yes: ${plural(our, "row")} ended because this site changed the quote or URL (for example pinning a locale or lengthening a short quote), ${plural(unreachable, "row")} because a source stopped answering, and ${plural(notStated, "row")} without a stated reason. None of these count as drift.`,
      },
    ],
    related: [
      { href: "/methodology", label: "How pages are verified" },
      { href: "/corrections", label: "The corrections log" },
      { href: "/changes", label: "Fitness API changes and deadlines" },
      { href: RESEARCH_PATH, label: "All research" },
    ],
  };
}

/* ─────────────────────────── 2. Shutdown notice ────────────────────────── */

export function noticeView() {
  return noticeStats(NOTICE_ROWS);
}

export function noticeStudy(): Study {
  const s = noticeView();
  const reasons = Object.entries(s.reasons).sort((a, b) => b[1] - a[1]);
  const REASON_PHRASE: Record<string, string> = {
    "no dated announcement on the pages read": "have no dated announcement on the pages read",
    "end date given only as a year": "give the end date only as a year",
    "no end date": "have no end date",
    "end date given only to the month": "give the end date only to the month",
  };
  const reasonText = list(reasons.map(([r, k]) => `${k} ${REASON_PHRASE[r] ?? r}`));
  const measuredText = s.list.map((r) => `${r.name}: ${r.noticeDays} days`).join("; ");
  const fitbit = NOTICE_ROWS.find((r) => r.id === "fitbit-web-api");
  const capsule =
    `Of the ${s.entries} shutdowns and deprecations in this site's Fitness API Graveyard, ${s.measured} have both a vendor-dated announcement and an end date to the day. ` +
    `Their notice ran ${list(s.list.map((r) => String(r.noticeDays)))} days${s.median !== null ? ` (median ${s.median})` : ""}, in order: ${s.list.map((r) => r.name).join("; ")}. ` +
    `The other ${s.excluded} are left out: ${reasonText}. ` +
    `With so few cases, the list is the finding, not the median.`;
  return {
    id: "shutdown-notice",
    path: NOTICE_PATH,
    dataset: "fitness-api-shutdown-notice-2026",
    metaTitle: "How Much Notice Fitness API Shutdowns Gave",
    h1: PAGE_H1[NOTICE_PATH],
    description:
      "Days from announcement to end date for each shut-down or deprecated fitness API in the graveyard where both dates are sourced, with exclusions and data.",
    primaryQuery: "fitness api shutdown notice period",
    dataDate: NOTICE_READ_ON,
    dataDateLabel: `Announcement pages read ${shortDate(NOTICE_READ_ON)}`,
    capsule,
    headlines: headlines("shutdown-notice", NOTICE_ROWS),
    method: [
      `Every entry of the Fitness API Graveyard, ${s.entries} in all, is one row. The end date, its precision and the vendor's quote for it are the graveyard's own.`,
      `The announcement date is the day the vendor published the notice, and it is recorded only where a vendor page read on ${shortDate(NOTICE_READ_ON)} dates it: a changelog entry or a timestamped post, with the quote. A date when sign-ups closed, a capture date in the Internet Archive or press coverage does not count. The changes tracker's ${NOTICE_CHANGES_READ} entries were searched too; they date the events themselves, not when they were announced.`,
      `Notice is the number of whole days from announcement to end, computed only when both are dates to the day. Every other entry is listed with the reason it is left out and what its pages do say.`,
    ],
    limits: [
      `Vendors rarely date their own notices on the page that carries them, and the pages read here are the ones the graveyard quotes. A notice sent by email or posted on a page not read here is missed, so a missing announcement means not found, not none given.`,
      `A shutdown the graveyard does not record is not in this study, and the graveyard records only shutdowns whose notice it could read on a vendor page.`,
      `${s.measured} measured cases from different years and vendors are a list, not a sample, and the median of so few says little about the next shutdown.`,
    ],
    faqs: [
      {
        q: "How much notice do fitness API shutdowns give?",
        a: `Where this site could date both ends, ${measuredText}. That is ${s.measured} of the ${s.entries} graveyard entries; the rest could not be measured.`,
      },
      ...(fitbit && fitbit.noticeDays === null
        ? [
            {
              q: "Why is the Fitbit Web API turn-off not counted in the notice figures?",
              a: `${fitbit.note ?? ""} Its row is listed with the reason: ${fitbit.exclusion}.`.trim(),
            },
          ]
        : []),
      {
        q: "Which graveyard entries were left out of the notice figures, and why?",
        a: `${s.excluded} of ${s.entries}: ${reasonText}. Each excluded row in the dataset says what the pages read state instead.`,
      },
      {
        q: "Does the changes tracker record when a shutdown was announced?",
        a: `No. Its ${NOTICE_CHANGES_READ} entries date the events themselves, such as an end of support or a turn-off, so they give the end of a notice period but not its start.`,
      },
    ],
    related: [
      { href: "/graveyard", label: "The Fitness API Graveyard" },
      { href: "/changes", label: "Fitness API changes and deadlines" },
      { href: "/migrate/migrate-off-a-deprecated-fitness-api", label: "Migrate off a deprecated fitness API" },
      { href: RESEARCH_PATH, label: "All research" },
    ],
  };
}

/* ───────────────────────── 3. Pricing transparency ─────────────────────── */

export const PRICING_CLASS_LABEL: Record<PricingClass, string> = {
  "published-price": "Publishes a price",
  "no-published-price": "No published price",
  free: "Free, no paid plan named",
};

const CATEGORY_NOUN: Record<string, string> = {
  wearable: "wearable APIs",
  aggregator: "health-data aggregators",
  nutrition: "nutrition and food data vendors",
  exercise: "exercise content vendors",
  motion: "AI motion SDKs",
  gym: "gym and studio software vendors",
};

/** The review dates of the pricing pages the counted vendors come from. */
export function pricingPageDates() {
  const pages = new Set(PRICING_ROWS.filter((r) => r.class).map((r) => r.pricingPage.replace(/^\/pricing\//, "")));
  const dates = releasedPricing()
    .filter((e) => pages.has(e.slug))
    .map((e) => e.updated)
    .sort();
  return { oldest: dates[0], newest: dates[dates.length - 1], pages: pages.size };
}

export function pricingView() {
  return pricingStats(PRICING_ROWS);
}

export function pricingStudy(): Study {
  const s = pricingView();
  const d = pricingPageDates();
  const freeRows = PRICING_ROWS.filter((r) => r.class === "free");
  const freeCats = [...new Set(freeRows.map((r) => r.category))];
  const freeText =
    freeCats.length === 1
      ? `All ${s.byClass.free} free ones are ${CATEGORY_NOUN[freeCats[0]]}`
      : `The ${s.byClass.free} free ones are ${list(freeCats.map((c) => `${freeRows.filter((r) => r.category === c).length} ${CATEGORY_NOUN[c]}`))}`;
  const unpublished = PRICING_ROWS.filter((r) => r.class === "no-published-price");
  const excluded = PRICING_ROWS.filter((r) => r.excluded);
  const capsule =
    `Of ${s.included} developer-facing vendors on this site's pricing pages, ${s.byClass["published-price"]} publish a price for a paid plan, ` +
    `${s.byClass["no-published-price"]} name a paid plan or commercial terms with no price, and ${s.byClass.free} say developer access costs nothing and name no paid plan. ` +
    `${freeText}. ${s.publishedWithUnpricedTier} of the ${s.byClass["published-price"]} that publish a price also name a top tier with no price. ` +
    `Each vendor's class rests on one of its own lines, quoted in the pages' evidence files.`;
  return {
    id: "pricing-transparency",
    path: PRICING_PATH_R,
    dataset: "fitness-api-pricing-transparency-2026",
    metaTitle: "Fitness API Pricing Transparency: Who Publishes Prices",
    h1: PAGE_H1[PRICING_PATH_R],
    description:
      "Per vendor: published price, no published price or free, each with the vendor's own line as quoted in this site's evidence. Counts by category and data.",
    primaryQuery: "which fitness apis publish pricing",
    dataDate: d.newest,
    dataDateLabel: `Pricing pages reviewed ${shortDate(d.oldest)} to ${shortDate(d.newest)}`,
    capsule,
    headlines: headlines("pricing-transparency", PRICING_ROWS),
    method: [
      `Every vendor named on this site's ${d.pages} pricing pages that carry an evidence file is one row, ${PRICING_ROWS.length} in all. Each page's evidence file quotes the vendor's own pages verbatim, and a weekly workflow re-reads every quote.`,
      `The class follows one rule, applied in order. A vendor publishes a price when it lists a price for any paid developer plan. It has no published price when it names a paid plan or commercial terms without a price. It is free when it says developer access costs nothing and names no paid plan.`,
      `The line beside each vendor is the sentence its class rests on, copied from the evidence file, and the generator fails unless it is there. A free plan, trial or sandbox, and a paid tier named without a price, are recorded beside it with their own lines.`,
      `${excluded.length} vendors are listed but not counted, each with the reason: their quoted lines state no price either way, the page has no evidence file, or, for KinesteX, the vendor funds this site.`,
      `The State of Fitness APIs 2026 report counts how 25 directory products bill developers, from this site's cost model. This study asks a narrower question of a different set, the vendors on the pricing pages, and answers it from each vendor's own line, so its counts are not the report's.`,
    ],
    limits: [
      `It records what the vendor's page says, not what a customer pays: a published price is a starting price, and discounts, overages and negotiated terms are not here.`,
      `It covers the vendors this site's pricing pages discuss, not the whole market. A vendor's class can change with one edit to its pricing page; the evidence files are re-read weekly, and the pages carry their own review dates.`,
      `Prices published only inside a marketplace listing, a signed-in dashboard or a sales deck count as not published, because no quoted line shows them.`,
    ],
    faqs: [
      {
        q: "How many fitness API vendors publish their prices?",
        a: `${s.byClass["published-price"]} of the ${s.included} counted here list a price for a paid developer plan, ${s.byClass["no-published-price"]} name a paid plan or terms without one, and ${s.byClass.free} are free with no paid plan named.`,
      },
      {
        q: "Which wearable APIs say they are free for developers?",
        a: `${list(freeRows.filter((r) => r.category === "wearable").map((r) => r.vendor))}, each in a line quoted beside it on this page. Free to call is not free to use: the pricing pages linked from each row cover memberships, approvals and user-side costs.`,
      },
      {
        q: "What counts as no published price in this study?",
        a: `A vendor that names a paid plan or commercial terms without a price: ${list(unpublished.map((r) => r.vendor))}. Several of them also offer a free plan or sandbox, recorded beside the class.`,
      },
      {
        q: "Why are some vendors left out of the pricing counts?",
        a: `${list(excluded.map((r) => r.vendor))} are listed with a reason and not counted. Most have quoted lines that give a license or a limit but no price either way; KinesteX funds this site and is left out as the site's other cross-vendor counts leave it out.`,
      },
    ],
    related: [
      { href: "/pricing", label: "Fitness and health API pricing" },
      { href: "/pricing/health-data-aggregator-pricing", label: "Health-data aggregator pricing" },
      { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026" },
      { href: RESEARCH_PATH, label: "All research" },
    ],
  };
}

export const PRICING_DISCLOSURE = {
  title: "Disclosure: who funds this site",
  text: "This site is funded by KinesteX, which makes an AI motion-tracking SDK and appears on the motion SDK pricing page. It is listed below but left out of every count, and nothing here ranks vendors or names a best one.",
};

export function pricingTableRows() {
  const counted = PRICING_ROWS.filter((r) => r.class);
  return PRICING_CLASS_ORDER.flatMap((c) => counted.filter((r) => r.class === c));
}

/* ─────────────────────────────── Hub ───────────────────────────────────── */

export function studies(): Study[] {
  return [driftStudy(), noticeStudy(), pricingStudy()];
}

export function studyById(id: StudyId): Study {
  return studies().find((s) => s.id === id)!;
}

export const HUB = {
  metaTitle: "Fitness API Research: Original Studies From Our Data",
  h1: PAGE_H1[RESEARCH_PATH],
  description:
    "Original studies computed from this site's repository: how often fitness API docs change, how much notice shutdowns gave, and who publishes prices.",
};

export const HUB_OTHER = {
  how: [
    "Each study is computed by a script from files in this site's repository: the git history of its evidence files, the graveyard and the changes tracker, and the vendor lines its pricing pages quote. The rows are published as an open dataset before any figure is drawn from them.",
    "The pages compute their figures from those rows at every build, and the site's quality checks recompute the headline figures from the published files and fail the build if the two differ. Each study states what its method cannot see.",
  ],
  links: [
    { href: "/press", label: "Press numbers", text: "counts of what this site tracks, each with its source file and date" },
    { href: "/state-of-fitness-apis-2026", label: "The State of Fitness APIs 2026", text: "original research on 25 fitness APIs, SDKs and models: how they bill developers, approval gates and terms" },
    { href: "/2026", label: "Fitness APIs in 2026", text: "the year's tracked changes and releases, one figure at a time" },
    { href: "/datasets", label: "Open datasets", text: "every dataset this site publishes, these three included" },
  ],
};

export const HUB_FAQS: Faq[] = [
  {
    q: "Where does this site's original research come from?",
    a: "From files in its own repository: the git history of the evidence files that hold every quoted vendor line, the Fitness API Graveyard and changes tracker, and the pricing pages' evidence. No survey, panel or third-party dataset is used.",
  },
  {
    q: "Can I reuse the research figures and data?",
    a: "Yes. Each study's rows are an open dataset under CC BY 4.0, in JSON and CSV with a card describing every column. Quote a figure with the date its data was read and link the study page, which carries a plain-text and BibTeX citation.",
  },
  {
    q: "How are the research figures kept from going stale or wrong?",
    a: "They are not typed by hand. The pages compute them from the published rows at each build, and the build fails if a headline figure differs from what the published file gives. Regenerating the rows is one script; the dates each study states say how old its data is.",
  },
];

export function hubDataDate(): string {
  return studies().map((s) => s.dataDate).sort().at(-1) as string;
}

export function hubCapsule(): string {
  const [d, no, p] = studies();
  return (
    `Three studies computed from files in this site's repository, each with its method, its limits and an open dataset. ` +
    `${d.headlines[0].value} source changes under this site's quotes between ${shortDate(DRIFT_HISTORY_FROM)} and ${shortDate(DRIFT_HISTORY_THROUGH)}; ` +
    `${no.headlines[0].value} graveyard entries with a measurable notice period; ` +
    `${p.headlines[0].value} pricing-page vendors publishing a price. Every figure is recomputed from the published data at each build.`
  );
}

/* ───────────────────────────── Findings text ───────────────────────────── */

export function driftFindings() {
  const { s } = driftView();
  const c = (k: string) => s.byCause[k] ?? 0;
  return {
    endedText:
      `${n(s.ended)} of the ${n(s.rows)} rows ended in the period: ${n(c("source-changed"))} because their source changed, ` +
      `${n(c("our-change"))} because this site changed a quote or URL, ${n(c("source-unreachable"))} because a source stopped answering, and ${n(c("not-stated"))} for a reason the commit message does not give. ` +
      `The other ${n(s.rows - s.ended)} were still in place at the end of the history.`,
    byDateIntro: `Each bar is one commit that recorded source changes, dated by its merge; its length is the number of hosts the commit names.`,
    byDate: s.byDate.map((d) => ({ date: shortDate(d.date), commit: d.commit, hosts: d.events, rows: d.rows })),
    hostsIntro: `The ${s.driftSources} hosts with at least one source change, by number of changes, with how many of their evidence rows were written in the period and how many were replaced.`,
    bySource: s.bySource,
    kindsText:
      `Where the commit message says what kind of change it was, ${s.kinds.fact} of the ${s.driftEvents} source changes were changes of fact, ` +
      `${s.kinds.wording} were wording only and ${s.kinds.mixed} were both; ${s.kinds["not stated"]} do not say.`,
    events: s.events.map((e) => ({ ...e, dateLabel: shortDate(e.date), kindLabel: e.kind ?? "not stated" })),
  };
}

export function noticeFindings() {
  const s = noticeView();
  return {
    measuredIntro: `Days from the vendor's dated announcement to the end it announced, for the ${s.measured} entries where both are dates to the day.`,
    measured: s.list.map((r) => ({ ...r, announcedLabel: shortDate(r.announced as string), endDateLabel: shortDate(r.end as string) })),
    excludedIntro: `The ${s.excluded} entries left out, with the reason and what the pages read say instead.`,
    excluded: NOTICE_ROWS.filter((r) => r.noticeDays === null).map((r) => ({ ...r, endDateLabel: r.end ? shortDate(r.end) : "none given" })),
  };
}

export function pricingFindings() {
  const s = pricingView();
  return {
    categoryIntro: `Counted vendors by category and class.`,
    byCategory: s.byCategory,
    vendorsIntro: `Every counted vendor with the line its class rests on, the vendor's page it is quoted from, and any free entry or unpriced tier the evidence quotes.`,
    vendors: pricingTableRows(),
    excludedIntro: `Listed on the pricing pages but not counted.`,
    excluded: PRICING_ROWS.filter((r) => r.excluded),
  };
}

/* ─────────────────────────────── Citations ─────────────────────────────── */

export function studyCitation(s: { h1: string; path: string; dataDate: string }) {
  const url = absoluteUrl(s.path);
  return {
    plain: plainCitation({ title: s.h1, url, verified: s.dataDate, verifiedLabel: "Data as of" }),
    bibtex: bibtexCitation({ path: s.path, title: s.h1, url, verified: s.dataDate, note: `Data as of ${s.dataDate}` }),
  };
}
