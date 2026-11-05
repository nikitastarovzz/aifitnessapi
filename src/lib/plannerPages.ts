import { EDGE_CASES, PLANNER_READ_ON, PLANNER_SOURCES, REGIMES, STORE_ITEMS } from "@/data/plannerSources.mjs";
import { PAGE_H1 } from "@/data/pageTitles";

/**
 * The words of the three planning-tool pages, held once so the HTML page and
 * its markdown mirror (src/lib/pageMirrors/plannerTools.ts) print the same
 * sentences. A paragraph is a list of segments: plain text, or a link. The
 * page renders links with next/link; the mirror as markdown links. qa's
 * GEO-PAGE-MD-TEXT gate holds the two to each other.
 */

export type Seg = string | { text: string; href: string };
export type Block = { kind: "p"; segs: Seg[] } | { kind: "ul"; items: Seg[][] };
export type Section = { heading: string; blocks: Block[] };

export type PlannerPage = {
  path: "/tools/build-plan" | "/tools/store-submission-checklist" | "/tools/compliance-wizard";
  /** <title>, at most 45 characters: the layout appends " · AIFitnessAPI". */
  title: string;
  h1: string;
  description: string;
  capsule: string;
  updated: string;
  sections: Section[];
};

const p = (...segs: Seg[]): Block => ({ kind: "p", segs });
const ul = (...items: Seg[][]): Block => ({ kind: "ul", items });
const a = (text: string, href: string): Seg => ({ text, href });

export const PLANNER_UPDATED = PLANNER_READ_ON;

const appleCount = STORE_ITEMS.filter((i) => i.store === "apple").length;
const googleCount = STORE_ITEMS.filter((i) => i.store === "google").length;
const READ_ON_TEXT = "November 5, 2026";

export const BUILD_PLAN_PAGE: PlannerPage = {
  path: "/tools/build-plan",
  title: "Fitness App Build Plan and PRD Generator",
  h1: PAGE_H1["/tools/build-plan"],
  description:
    "Pick an app type, platforms, data sources and features; get a shareable build plan and a PRD template from sourced pages: APIs, compliance, cost shape.",
  capsule:
    "Pick the app type, platforms, data sources and features, and this generator writes a build plan you can share as a link or download as Markdown: an architecture outline linking the page that covers each layer, the products from this site's cost model that fit, the cost shape (how each product bills and our labeled effort judgment, never a price), the health-data rules your answers point to, and the store-review items that apply. The same answers fill a PRD template that quotes Apple's and Google's documentation on edge cases such as HealthKit read denial and Health Connect's 30-day read window. It is a starting plan, not legal advice.",
  updated: PLANNER_UPDATED,
  sections: [
    {
      heading: "Where each part of the plan comes from",
      blocks: [
        ul(
          ["App types and health data types: the ", a("build guides", "/build"), " and the concrete stack each one names, joined to Apple's identifier dataset and, for Android, only to pairs both platforms' documentation confirms."],
          ["Products and the cost shape: the provenance-tracked model behind the ", a("cost planner", "/cost-planner"), " and the ", a("API directory", "/apis"), ", which records how each product bills, what each user must own and which approval gates a launch, and states no prices."],
          ["Compliance: the quoted rules of the ", a("compliance wizard", "/tools/compliance-wizard"), ", routed from your answers."],
          ["Store review: the items of the ", a("store submission checklist", "/tools/store-submission-checklist"), " that your platforms and features trigger."],
          ["Architecture: one line per layer, each linking the page on this site that covers it, from on-device sync to deletion and export."],
        ),
      ],
    },
    {
      heading: "What it will not do",
      blocks: [
        p("It will not price the plan. The cost model behind it holds no dollar figures, because most serious tiers in this market are contact-sales and public prices move; the plan groups products by how they bill and gives the span of our effort judgment (low is roughly days, medium roughly weeks, high roughly months), labeled as ours."),
        p("It will not rank. Products the build guide for your app type already names sort first, then by how they bill; nothing is scored. KinesteX, which funds this site, appears only in a plan that includes camera motion tracking, and then with the disclosure beside it."),
        p("It will not decide your legal position. The compliance section is a routing from your answers to rules quoted from their sources; the ", a("compliance wizard", "/tools/compliance-wizard"), " asks the questions that settle HIPAA status, and a qualified professional should confirm the result."),
      ],
    },
    {
      heading: "The edge cases the PRD template quotes",
      blocks: [
        p("The PRD's edge-case section quotes the platforms' own documentation for the platforms you pick, read on ", READ_ON_TEXT, ":"),
        ul(
          ...EDGE_CASES.map((e): Seg[] => [
            a(e.title, e.page),
            `: “${e.quote}” (${PLANNER_SOURCES[e.source].publisher}, ${PLANNER_SOURCES[e.source].title})`,
          ]),
        ),
      ],
    },
    {
      heading: "Related planners",
      blocks: [
        p(
          "For the stack alone, the ",
          a("stack generator", "/tools/stack-generator"),
          " narrows a build guide's products with four questions. For a starting recommendation before you know the app type, the ",
          a("API picker", "/picker"),
          " asks three. If you would rather not write code, the ",
          a("no-code fitness app guide", "/no-code-fitness-app"),
          " covers the builder platforms.",
        ),
      ],
    },
  ],
};

export const STORE_CHECKLIST_PAGE: PlannerPage = {
  path: "/tools/store-submission-checklist",
  title: "Health App Store Submission Checklist",
  h1: PAGE_H1["/tools/store-submission-checklist"],
  description:
    "Every App Store and Google Play rule a health or fitness app is reviewed against, quoted from Apple's guidelines and Google's policies, as a checklist.",
  capsule: `This checklist holds the App Store and Google Play rules a health or fitness app is reviewed against, each in the store's own words: ${appleCount} items from Apple's App Review Guidelines (1.4.1, 2.5.1, 2.5.18, 3.1.3(d), 5.1.1, 5.1.2 and 5.1.3) and ${googleCount} from Google Play's Health apps, User Data and Health Connect policies and Google's Health Connect publishing guide. Pick your stores and what the app does, and the list narrows to the items that apply; your ticks are saved in this browser. Read on ${READ_ON_TEXT}. It is not legal advice and not a guarantee of approval.`,
  updated: PLANNER_UPDATED,
  sections: [
    {
      heading: "How the list is built",
      blocks: [
        p("Each item is one sentence a store publishes, quoted as it appears, with the section it sits in and a link to the page. The bold line above each quote is our summary of what to do; where the two differ, the quote is the rule."),
        p("Items marked with a condition, such as user accounts, HealthKit, Health Connect, medical claims or health research, appear only when you pick it. The rest apply to every health or fitness app on that store. Items your answers do not trigger stay on the page, folded under each store, so nothing is hidden."),
        p("Your answers live in the page's address, so a copied link reproduces the list. Your ticks are kept in this browser's local storage and nowhere else; this site has no server code behind the page."),
      ],
    },
    {
      heading: "Sources",
      blocks: [
        ul(
          ...["appReview", "playHealth", "playHealthCategories", "playUserData", "playPermissions", "hcPublish"].map((k): Seg[] => {
            const s = PLANNER_SOURCES[k];
            return [a(`${s.publisher}, ${s.title}`, s.url), s.note ? `: ${s.note}; read ${READ_ON_TEXT}.` : `: read ${READ_ON_TEXT}.`];
          }),
        ),
      ],
    },
    {
      heading: "What the checklist cannot tell you",
      blocks: [
        p("Whether your app will be approved. Review applies these rules to your binary, metadata and behavior, and the stores change them: Apple dates its guidelines, and the Google Play pages carry no date, so check the live text before you submit."),
        p(
          "The page-by-page explanations are in the compliance section: ",
          a("Apple's health data rules", "/compliance/app-store-health-data-rules"),
          ", ",
          a("Google Play's health data policy", "/compliance/google-play-health-data-policy"),
          " and ",
          a("the Health Connect publishing requirements", "/compliance/google-play-health-connect-publishing-requirements"),
          ". For the laws behind them, use the ",
          a("compliance wizard", "/tools/compliance-wizard"),
          ".",
        ),
      ],
    },
  ],
};

const REGIME_SOURCES = [...new Set(REGIMES.flatMap((r) => r.quotes.map((q) => q.source)))];

export const COMPLIANCE_WIZARD_PAGE: PlannerPage = {
  path: "/tools/compliance-wizard",
  title: "Health App Compliance Wizard: HIPAA to GDPR",
  h1: PAGE_H1["/tools/compliance-wizard"],
  description:
    "Nine questions route a health or fitness app to the rules that likely apply: HIPAA, the FTC breach rule, GDPR Article 9, Washington, FDA, app stores.",
  capsule:
    "Answer nine questions about who offers the app, your relationship to health plans and providers, where your users are, what the app claims and where it ships, and the wizard routes you to the rules that likely apply: HIPAA as a covered entity or business associate, the FTC Health Breach Notification Rule, the FTC's warning about HIPAA claims, GDPR Article 9, Washington's My Health My Data Act, the FDA's general-wellness line, and the App Store and Google Play health rules. Each result quotes the rule from its source and links the page here that explains it. It is a starting map, not legal advice.",
  updated: PLANNER_UPDATED,
  sections: [
    {
      heading: "How the routing works",
      blocks: [
        ul(
          ["HIPAA turns on relationships, not on the data: whether your company is a covered entity, and whether you build or run the app on behalf of one. The questions are the ones the FTC's Mobile Health Apps Interactive Tool asks."],
          ["The FTC's breach rule is checked against the HIPAA answers, because the rule excludes covered entities and business-associate activity."],
          ["GDPR, Washington's Act and the store rules are switched on by where your users are and where the app ships."],
          ["Every status is one of four: likely applies, may apply, likely does not apply, or answer needed. The reason beside it is ours; the rule under it is the source's."],
        ),
      ],
    },
    {
      heading: "Every rule the wizard can show",
      blocks: REGIMES.map((r) =>
        p(
          a(r.name, r.page),
          ": ",
          r.quotes.map((q) => `“${q.quote}” (${PLANNER_SOURCES[q.source].publisher})`).join(" "),
        ),
      ),
    },
    {
      heading: "Where the quotes come from",
      blocks: [
        p(
          "The HHS, FTC, eCFR, GDPR, Washington and FDA passages are the ones this site's compliance pages are written from, re-checked against the live sources every week; EUR-Lex could not be reached, so the GDPR text is the Regulation as adopted, on legislation.gov.uk. The store passages were read on ",
          READ_ON_TEXT,
          ".",
        ),
        ul(
          ...REGIME_SOURCES.map((k): Seg[] => {
            const s = PLANNER_SOURCES[k];
            return [a(`${s.publisher}, ${s.title}`, s.url)];
          }),
        ),
      ],
    },
    {
      heading: "What the wizard does not cover",
      blocks: [
        p("Other US state health-privacy laws: this site has sourced Washington's Act and not the others, so the wizard names only Washington. Countries outside the EU and the US. Contracts such as a Business Associate Agreement or a data processing agreement, which a result may point to but cannot draft."),
        p(
          "For the questions behind the answers, start with ",
          a("whether your fitness app needs to be HIPAA compliant", "/compliance/hipaa-compliance-fitness-app"),
          " and ",
          a("whether fitness data is PHI", "/compliance/is-fitness-data-phi"),
          ". To turn a result into a plan with products and store items, use the ",
          a("build plan generator", "/tools/build-plan"),
          ".",
        ),
      ],
    },
  ],
};

export const PLANNER_PAGES = [BUILD_PLAN_PAGE, STORE_CHECKLIST_PAGE, COMPLIANCE_WIZARD_PAGE];

/** The three tools as /llms-full.txt and /llms-index.txt list them. */
export const PLANNER_LLMS = [
  { label: "Fitness app build plan and PRD generator", path: BUILD_PLAN_PAGE.path, primaryQuery: "fitness app prd template", text: BUILD_PLAN_PAGE.capsule },
  { label: "App Store and Google Play submission checklist", path: STORE_CHECKLIST_PAGE.path, primaryQuery: "app store review guidelines health app checklist", text: STORE_CHECKLIST_PAGE.capsule },
  { label: "Health app compliance wizard", path: COMPLIANCE_WIZARD_PAGE.path, primaryQuery: "does hipaa apply to my fitness app", text: COMPLIANCE_WIZARD_PAGE.capsule },
];

/** Segments → markdown, for the mirror. */
export function segsMarkdown(segs: Seg[], link: (text: string, href: string) => string): string {
  return segs.map((s) => (typeof s === "string" ? s : link(s.text, s.href))).join("");
}
