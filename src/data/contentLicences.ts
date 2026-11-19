import { NOT_STATED, unstated } from "../lib/contentLicencesCore.mjs";

/**
 * "Can I ship it?" — is each exercise or nutrition source free, what does it
 * cost, and may a commercial app use it. Hand-sourced, like
 * deprecationSignatures.ts: not generated, and no fact in it is new.
 *
 * Every stated cell cites [evidenceFile, row, key]: a row of
 * ops/sources/evidence/<evidenceFile>.json, the file one of the site's pages
 * was written from (claim, url, verbatim quote, re-checked against the live
 * source by source-quotes.yml), and wording that quote must contain.
 * scripts/content-licences.test.mjs fails when a row is missing, a quote lacks
 * its key wording, or a quote comes from another vendor's host. "not stated"
 * means the passages read do not say; it is never a guess at "no".
 *
 * Rendered by src/components/ContentLicences.tsx on the English pages listed
 * in src/lib/contentLicences.ts. Logic: src/lib/contentLicencesCore.mjs.
 */

export type LicenceKind = "exercise" | "nutrition";
/** [evidence file name without .json, row index, wording the quote must contain] */
export type LicenceRef = [string, number, string];
export type LicenceCell = { value: string; text?: string; ev: LicenceRef[] };
export type LicenceColumnId = "free" | "paid" | "commercial" | "attribution" | "media" | "copy" | "licence";
export type LicenceRow = {
  id: string;
  name: string;
  kind: LicenceKind;
  /** The page on this site that covers the source in full. */
  page: { href: string; label: string };
  /** Every quote the row cites must come from one of these hosts. */
  hosts: string[];
  cells: Record<LicenceColumnId, LicenceCell>;
};
export type LicenceNote = { text: string; ev: LicenceRef[] };

const U = unstated;
const ref = (file: string, i: number, key: string): LicenceRef => [file, i, key];

// The evidence files cited, by page.
const XP = (i: number, key: string) => ref("pricing-exercise-database-api-pricing", i, key);
const XA = (i: number, key: string) => ref("alternatives-exercisedb-alternatives", i, key);
const XF = (i: number, key: string) => ref("compare-exercisedb-vs-free-exercise-db", i, key);
const XW = (i: number, key: string) => ref("compare-exercisedb-vs-wger", i, key);
const WA = (i: number, key: string) => ref("alternatives-wger-alternatives", i, key);
const YN = (i: number, key: string) => ref("compare-your-move-vs-api-ninjas", i, key);
const NP = (i: number, key: string) => ref("pricing-nutrition-api-pricing", i, key);
const NX = (i: number, key: string) => ref("pricing-nutritionix-api-pricing", i, key);
const NE = (i: number, key: string) => ref("compare-nutritionix-vs-edamam", i, key);
const UO = (i: number, key: string) => ref("compare-usda-fooddata-central-vs-open-food-facts", i, key);
const ES = (i: number, key: string) => ref("compare-edamam-vs-spoonacular", i, key);

const ASCEND_HOSTS = ["exercisedb.dev", "ascendapi.com", "raw.githubusercontent.com"];
const ASCEND_TERMS =
  "AscendAPI's terms of use, linked from its README, could not be opened when the pages here were written, so whether its free tiers allow commercial use is unknown";

export const CONTENT_LICENCES: { rows: LicenceRow[]; notes: LicenceNote[] } = {
  rows: [
    {
      id: "exercisedb-v1",
      name: "ExerciseDB V1 (AscendAPI, oss.exercisedb.dev)",
      kind: "exercise",
      page: { href: "/integrate/exercisedb-api", label: "ExerciseDB API integration guide" },
      hosts: ASCEND_HOSTS,
      cells: {
        free: { value: "yes", text: "1,500 exercises with 180p GIFs, no authentication", ev: [XP(2, "No authentication required")] },
        paid: { value: NOT_STATED, text: "A paid V1 tier is sold on RapidAPI; its price was on pages we could not read", ev: [XP(5, "paid RapidAPI tier")] },
        commercial: { value: NOT_STATED, text: ASCEND_TERMS, ev: [XP(20, "Terms Of Use")] },
        attribution: U(),
        media: { value: "yes", text: "GIFs: 180p free; 360p to 1080p images and GIFs on the paid tier", ev: [XP(6, "180p GIFs only"), XP(6, "Multi-resolution images and GIFs")] },
        copy: U(),
        licence: { value: NOT_STATED, text: "Terms of use not readable; the exercisedb-api repository carries an AGPL-3.0 LICENSE file", ev: [XP(20, "Terms Of Use"), XP(19, "GNU AFFERO GENERAL PUBLIC LICENSE")] },
      },
    },
    {
      id: "exercisedb-v2",
      name: "ExerciseDB V2 (AscendAPI, on RapidAPI)",
      kind: "exercise",
      page: { href: "/integrate/exercisedb-api", label: "ExerciseDB API integration guide" },
      hosts: ASCEND_HOSTS,
      cells: {
        free: {
          value: "yes",
          text: "Basic plan: 2,000 requests a month, 200 exercises, no credit card",
          ev: [XP(7, "completely free"), XP(8, "2,000 requests / month"), XP(9, "200 exercises in library"), XP(11, "No credit card required")],
        },
        paid: { value: NOT_STATED, text: "Paid plans on RapidAPI serve watermark-free media; their prices were on pages we could not read", ev: [XP(13, "watermark-free")] },
        commercial: { value: NOT_STATED, text: ASCEND_TERMS, ev: [XP(20, "Terms Of Use")] },
        attribution: U(),
        media: { value: "yes", text: "An MP4 video per exercise, plus images; free-tier media is watermarked", ev: [XA(5, "MP4 demonstration video"), XP(10, "Exercise images & videos"), XP(12, "free tier media is watermarked")] },
        copy: U(),
        licence: { value: NOT_STATED, text: "Both tiers are accessed via RapidAPI; AscendAPI's terms of use were not readable", ev: [XP(12, "accessed via RapidAPI"), XP(20, "Terms Of Use")] },
      },
    },
    {
      id: "api-ninjas",
      name: "API Ninjas Exercises",
      kind: "exercise",
      page: { href: "/compare/exercisedb-vs-api-ninjas", label: "ExerciseDB vs API Ninjas" },
      hosts: ["api-ninjas.com"],
      cells: {
        free: { value: "yes", text: "3,000 calls a month, for evaluation and demo only", ev: [XP(23, "API calls per month 3,000"), XP(22, "Evaluation and demo purposes only")] },
        paid: { value: "price", text: "$59 a month, or $39 a month billed yearly (Developer)", ev: [XP(25, "$ 59 $ 39 / month"), XP(24, "Monthly Yearly 34% off")] },
        commercial: {
          value: "allowed with conditions",
          text: "Not on the free tier; Developer and above say \"Commercial use Yes\", and storing data starts at Business",
          ev: [XP(36, "not permitted on the free tier"), XP(26, "Commercial use Yes"), XP(28, "Data caching/storing allowed Yes")],
        },
        attribution: { value: "required", text: "On the Free plan; the passages read do not say for paid plans", ev: [XP(23, "Attribution required Yes")] },
        media: { value: "yes", text: "Start and finish photos, on premium plans only", ev: [XP(34, "On premium plans")] },
        copy: { value: "on some plans", text: "Caching or storing data: no on Developer, yes on Business", ev: [XP(26, "Data caching/storing allowed No"), XP(28, "Data caching/storing allowed Yes")] },
        licence: U(),
      },
    },
    {
      id: "your-move-api",
      name: "Your Move Exercise API (ymove.app)",
      kind: "exercise",
      page: { href: "/integrate/your-move-exercise-api", label: "Your Move Exercise API integration guide" },
      hosts: ["ymove.app", "github.com"],
      cells: {
        free: { value: "trial only", text: "A 7-day free trial on every paid plan", ev: [XP(47, "Every paid plan starts with a 7-day free trial")] },
        paid: { value: "price", text: "$19 a month (Starter)", ev: [XA(56, "$19 /mo")] },
        commercial: {
          value: NOT_STATED,
          text:
            "The API Terms give every subscription a Brand License for one website and one mobile app per brand; the general terms, last updated August 07, 2025, say \"personal, non-commercial use or internal business purpose only\"",
          ev: [XP(66, "Every API subscription includes a Brand License"), XP(70, "personal, non-commercial use or internal business purpose only")],
        },
        attribution: U(),
        media: { value: "yes", text: "An HD video per exercise as HLS and MP4; Starter videos are watermarked", ev: [XA(45, "HD video (HLS + MP4)"), XP(55, "small Your Move watermark")] },
        copy: {
          value: "separate deal",
          text: "Self-hosting the files is a separate license; Scale and Enterprise may cache videos on the user's device",
          ev: [XP(59, "separate self-hosting license"), XP(58, "cache videos on the user's device")],
        },
        licence: {
          value: "stated",
          text: "Brand License per registered brand; videos licensed only while subscribed; no redistribution, sub-licensing or resale",
          ev: [XP(66, "Brand License"), XP(68, "only while your subscription is active"), XP(56, "cannot redistribute, sub-license, or resell")],
        },
      },
    },
    {
      id: "your-move-free-clips",
      name: "Your Move free exercise clips (25 videos)",
      kind: "exercise",
      page: { href: "/fitness-apis/exercise-video-apis", label: "Exercise video APIs compared" },
      hosts: ["ymove.app", "raw.githubusercontent.com"],
      cells: {
        free: { value: "yes", text: "25 HD clips, free to download", ev: [XA(70, "25 of the most-used gym exercises"), XA(71, "free to download")] },
        paid: { value: "free", text: "Free to download as MP4", ev: [XA(71, "free to download as MP4")] },
        commercial: {
          value: "allowed with conditions",
          text: "Free for commercial use; not to be sold or redistributed as a standalone product or library",
          ev: [YN(23, "Free for commercial use"), XP(71, "may not sell or redistribute the videos as a standalone product or library")],
        },
        attribution: {
          value: "sources disagree",
          text: "The web page asks for \"Exercise video by Your Move\" with a link; the GitHub copy calls a link appreciated but not required",
          ev: [XA(72, "Exercise video by Your Move"), XA(73, "appreciated but not required")],
        },
        media: { value: "yes", text: "Royalty-free HD video, as MP4", ev: [XA(70, "royalty-free HD video"), XA(71, "MP4")] },
        copy: { value: "yes", text: "Downloadable MP4 files", ev: [XA(71, "free to download as MP4")] },
        licence: { value: "stated", text: "Royalty-free", ev: [XA(70, "royalty-free")] },
      },
    },
    {
      id: "wger",
      name: "wger",
      kind: "exercise",
      page: { href: "/alternatives/wger-alternatives", label: "wger alternatives" },
      hosts: ["raw.githubusercontent.com"],
      cells: {
        free: { value: "yes", text: "A free, self-hostable application; its README points to wger.de as a live system", ev: [XW(20, "is a free workout and fitness manager"), XW(28, "https://wger.de")] },
        paid: { value: "free", text: "Free", ev: [XW(20, "free workout and fitness manager")] },
        commercial: {
          value: NOT_STATED,
          text: "Code AGPL-3.0-or-later, data Creative Commons per entry; the passages read do not address commercial use directly",
          ev: [XW(15, "AGPL-3.0-or-later"), XW(16, "Creative Commons (see individual entries)")],
        },
        attribution: {
          value: "per entry",
          text: "Each exercise, image and video carries its own license and author fields, for TASL attribution",
          ev: [XW(16, "see individual entries"), WA(25, "for proper attribution")],
        },
        media: {
          value: "yes",
          text: "Static images (animated images are rejected); its code accepts video files you supply",
          ev: [XW(26, "IMAGE_ALLOWED_FORMATS"), XW(27, "Animated images are not supported"), XW(25, "VIDEO_EXTENSIONS")],
        },
        copy: { value: "yes", text: "Self-host with docker compose", ev: [XW(18, "docker compose up -d")] },
        licence: {
          value: "stated",
          text: "Code AGPL-3.0-or-later; exercise data Creative Commons per entry; new uploads default to CC-BY-SA 4",
          ev: [XW(15, "AGPL-3.0-or-later"), XW(16, "Creative Commons"), XW(24, "CC_BY_SA_4_LICENSE_ID")],
        },
      },
    },
    {
      id: "free-exercise-db",
      name: "free-exercise-db",
      kind: "exercise",
      page: { href: "/compare/exercisedb-vs-free-exercise-db", label: "ExerciseDB vs free-exercise-db" },
      hosts: ["raw.githubusercontent.com"],
      cells: {
        free: { value: "yes", text: "A public-domain JSON dataset on GitHub", ev: [XF(29, "free and unencumbered"), XF(15, "Open Public Domain Exercise Dataset")] },
        paid: { value: "free", text: "Free", ev: [XF(29, "free and unencumbered")] },
        commercial: { value: "allowed", text: "\"for any purpose, commercial or non-commercial\"", ev: [XF(30, "for any purpose, commercial or non-commercial")] },
        attribution: U(),
        media: { value: "yes", text: "JPEG images, two per exercise for most records", ev: [XA(12, ".jpg")] },
        copy: { value: "yes", text: "Use the JSON files and images locally", ev: [XF(24, "use the `JSON` files and images locally")] },
        licence: { value: "stated", text: "Released into the public domain (its LICENSE.md is the Unlicense)", ev: [XF(29, "released into the public domain")] },
      },
    },
    {
      id: "gymvisual",
      name: "GymVisual (stock media library)",
      kind: "exercise",
      page: { href: "/alternatives/exercisedb-alternatives", label: "ExerciseDB alternatives" },
      hosts: ["web.archive.org"],
      cells: {
        free: U(),
        paid: U(),
        commercial: {
          value: "allowed with conditions",
          text: "Its license lists Android and iOS apps; no resale or redistribution, and no posting on or generating with AI tools (archived July 29, 2026)",
          ev: [XA(28, "Android or iOS mobile application"), XA(29, "to resell or redistribute"), XA(30, "Artificial Intelligence (AI) platform")],
        },
        attribution: U(),
        media: { value: "yes", text: "Workout animations, GIFs and illustrations", ev: [XA(27, "workout animations , GIFs , and fitness illustrations")] },
        copy: U(),
        licence: { value: "stated", text: "Royalty-free", ev: [XA(27, "royalty-free")] },
      },
    },
    {
      id: "usda-fooddata-central",
      name: "USDA FoodData Central",
      kind: "nutrition",
      page: { href: "/compare/usda-fooddata-central-vs-open-food-facts", label: "USDA FoodData Central vs Open Food Facts" },
      hosts: ["fdc.nal.usda.gov"],
      cells: {
        free: {
          value: "yes",
          text: "Anyone may use the API, with a data.gov key on every request; 1,000 requests an hour per IP by default",
          ev: [UO(3, "Anyone may access and use the API"), UO(4, "1,000 requests per hour per IP address")],
        },
        paid: U(),
        commercial: { value: "allowed", text: "Public domain: \"No permission is needed for their use\"", ev: [UO(0, "in the public domain"), UO(2, "No permission is needed for their use")] },
        attribution: { value: "requested", text: "USDA asks users to list FoodData Central as the source, without requiring it", ev: [UO(2, "we request that users list FoodData Central as the source")] },
        media: U(),
        copy: { value: "yes", text: "Public-domain data, not copyrighted", ev: [UO(0, "not copyrighted")] },
        licence: { value: "stated", text: "CC0 1.0 Universal (public domain)", ev: [UO(1, "CC0 1.0 Universal")] },
      },
    },
    {
      id: "open-food-facts",
      name: "Open Food Facts",
      kind: "nutrition",
      page: { href: "/compare/usda-fooddata-central-vs-open-food-facts", label: "USDA FoodData Central vs Open Food Facts" },
      hosts: ["openfoodfacts.org", "openfoodfacts.github.io"],
      cells: {
        free: { value: "yes", text: "Database and API free of charge; reads need only a custom User-Agent", ev: [UO(23, "100% free of charge"), UO(29, "do not require authentication other than the custom User-Agent")] },
        paid: { value: "free", text: "Free of charge", ev: [UO(23, "100% free of charge")] },
        commercial: {
          value: "allowed with conditions",
          text: "Commercial use \"under certain conditions\": share-alike for an adapted database used publicly, and one API call per real user scan",
          ev: [UO(27, "including commercial use, under certain conditions"), UO(21, "must also offer that adapted database under the ODbL"), UO(24, "1 API call = 1 real scan by a user")],
        },
        attribution: { value: "required", text: "Any public use must be attributed", ev: [UO(22, "You must attribute any public use")] },
        media: { value: "yes", text: "Product images, under CC-BY-SA", ev: [UO(20, "Products images are available under the Creative Commons Attribution ShareAlike licence")] },
        copy: { value: "yes", text: "Full daily exports; scraping the API is likely to be blocked", ev: [UO(26, "full daily exports are available")] },
        licence: {
          value: "stated",
          text: "ODbL for the database, DbCL for its contents, CC-BY-SA for images",
          ev: [UO(18, "Open Database License (ODbL)"), UO(19, "Database Contents License (DbCL)"), UO(20, "(CC-BY-SA)")],
        },
      },
    },
    {
      id: "nutritionix",
      name: "Nutritionix",
      kind: "nutrition",
      page: { href: "/pricing/nutritionix-api-pricing", label: "Nutritionix API pricing" },
      hosts: ["nutritionix.com"],
      cells: {
        free: {
          value: "trial only",
          text: "No public free-access tier; a limited trial through its team",
          ev: [NX(15, "no longer able to maintain a public free-access tier"), NX(16, "limited trial account")],
        },
        paid: { value: "price", text: "$499 a month (Starter), billed annually", ev: [NX(1, "$ 499 /Month"), NX(6, "billed annually")] },
        commercial: {
          value: NOT_STATED,
          text: "Freemium apps, hardware products and apps over 100K monthly active users are told to ask for a custom plan",
          ev: [NE(11, "If you have a freemium app business model, sell a hardware product")],
        },
        attribution: { value: "required", text: "Required on every plan except Unicorn, where it is removable", ev: [NX(5, "Attribution Requirement Required Required Required Removable Option")] },
        media: U(),
        copy: { value: "separate deal", text: "Bulk licensing: a monthly CSV export of its whole database", ev: [NX(18, "monthly export of our entire database in CSV")] },
        licence: U(),
      },
    },
    {
      id: "edamam",
      name: "Edamam",
      kind: "nutrition",
      page: { href: "/compare/nutritionix-vs-edamam", label: "Nutritionix vs Edamam" },
      hosts: ["developer.edamam.com"],
      cells: {
        free: {
          value: "yes",
          text: "Only the Meal Planner API: a free Developer plan with 10,000 meal-plan calls a month; the other APIs start with trials",
          ev: [ES(30, "Developer FREE"), ES(31, "Meal plan calls per month - 10,000"), ES(22, "30 days Trial period")],
        },
        paid: {
          value: "price",
          text: "$9 a month (Recipe Search); Food Database from $14, Nutrition Analysis from $29, prepaid",
          ev: [ES(26, "Enterprise Basic $9 per month"), ES(22, "Enterprise Basic Vision $14 per month"), ES(20, "Enterprise Basic Multilingual $29 per month")],
        },
        commercial: {
          value: NOT_STATED,
          text: "Only human, end-user-driven requests; automated requests to collect, scrape or save data are prohibited",
          ev: [ES(24, "All plans allow only human, end user driven requests"), NP(30, "collect, scrape or save data")],
        },
        attribution: { value: "required", text: "Missing attribution is a breach of contract, followed by suspension", ev: [ES(25, "Not providing attribution is considered breach of contract")] },
        media: {
          value: "yes",
          text: "A food image field; images on its 20,000+ own recipes",
          ev: [NE(29, "food image"), ES(29, "over 20,000 recipes with images")],
        },
        copy: {
          value: "on some plans",
          text: "Only the four basic macronutrients (plus ID, label and image) may be cached, where a plan allows it",
          ev: [NE(29, "can cache only the four basic macro nutrient datapoints")],
        },
        licence: U(),
      },
    },
    {
      id: "spoonacular",
      name: "Spoonacular",
      kind: "nutrition",
      page: { href: "/compare/edamam-vs-spoonacular", label: "Edamam vs Spoonacular" },
      hosts: ["spoonacular.com"],
      cells: {
        free: { value: "yes", text: "50 points a day, then no more calls", ev: [ES(1, "50 points/day then no more calls")] },
        paid: { value: "price", text: "$29 a month (Cook), month to month", ev: [ES(2, "Cook $ 29 /mo"), ES(10, "month to month")] },
        commercial: U(),
        attribution: { value: "required", text: "A backlink on the free plan", ev: [ES(6, "Backlink Required")] },
        media: U(),
        copy: { value: "no", text: "User-requested data may be cached for at most 1 hour", ev: [ES(11, "for a maximum of 1 hour")] },
        licence: U(),
      },
    },
  ],
  /**
   * "Which ExerciseDB is this?" — only what the site's ExerciseDB pages and
   * their evidence already distinguish. A note with no `ev` restates what the
   * pages say about their own reading, not a vendor fact.
   */
  notes: [
    {
      text: "exercisedb.dev now carries the AscendAPI name, with \"Previously ExerciseDB\" above it.",
      ev: [XP(0, "Previously ExerciseDB")],
    },
    {
      text: "ExerciseDB V1 is the free, keyless one: 1,500 exercises with 180p GIFs at oss.exercisedb.dev/api/v1/exercises, plus a paid V1 tier on RapidAPI.",
      ev: [XP(2, "No authentication required"), XP(3, "oss.exercisedb.dev/api/v1/exercises"), XP(5, "paid RapidAPI tier")],
    },
    {
      text: "ExerciseDB V2 is on RapidAPI only, free and paid alike; AscendAPI describes it as 11,000+ exercises, and its free Basic plan gives 2,000 requests a month and 200 exercises, with watermarked media.",
      ev: [XP(12, "Both free and paid tiers are accessed via RapidAPI"), XP(14, "11,000+ exercises"), XP(8, "2,000 requests / month"), XP(9, "200 exercises in library")],
    },
    {
      text: "The github.com/ExerciseDB/exercisedb-api repository that AscendAPI's docs name holds an AGPL-3.0 LICENSE file; when the site cloned it on October 22, 2026 it held no code, so there is nothing to self-host.",
      ev: [XP(1, "github.com/ExerciseDB/exercisedb-api"), XP(19, "GNU AFFERO GENERAL PUBLIC LICENSE")],
    },
    {
      text: "An older ExerciseDB listing on RapidAPI, published by justin-WFnsXH_t6, rendered only its title to our reader on October 22, 2026, so its terms, and whether it is the same product as AscendAPI's listings, are not established here.",
      ev: [],
    },
  ],
};
