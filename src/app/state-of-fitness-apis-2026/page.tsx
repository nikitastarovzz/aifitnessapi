import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import { Mdx } from "@/components/mdx";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

/**
 * Original research: the annual access-structure survey. Every number on this
 * page is computed from public/datasets/fitness-apis-2026.json (itself derived
 * from the provenance-tracked cost model) — the page presents the dataset, it
 * never invents figures. Dataset JSON-LD + CC BY 4.0 downloads make this the
 * site's citation magnet; keep the version pinned (2026.1) and version, don't
 * overwrite, at the next edition.
 *
 * Revised in place on 2026-10-18, not re-editioned: only the four aggregator
 * rows, the three AI motion SDK rows and five of the six direct wearable rows
 * (Garmin, Strava, Oura, WHOOP, Polar) were re-verified, and six rows changed
 * classification (Spike's devCost, Terra's approval gate, Sency's devCost and
 * approval gate, Garmin's and Strava's devCost, Polar's user-side cost).
 * REVISION states the before and after figures; the other 13 rows keep their
 * 2026-08-11 verification, which is why the visible "Updated 11 August 2026"
 * stamp stays.
 *
 * Revised in place again on 2026-10-22: Garmin reorganised its developer
 * program, the Garmin row was re-verified against the new pages, and its text
 * changed while every classification and figure stayed the same.
 */

const PAGE_PATH = "/state-of-fitness-apis-2026";
/** dateModified: the day the latest revision was published (2026-10-22, the
 *  Garmin row re-verified that day; the 2026-10-18 revision's rows were
 *  re-verified on 2026-10-17). The sitemap reads this constant by name, so it
 *  keeps the name UPDATED. */
const UPDATED = "2026-10-22";
/** datePublished, and the verification date of the 13 rows not re-checked. */
const FIRST_PUBLISHED = "2026-08-11";

const RELATED: { href: string; label: string }[] = [
  {
    "href": "/cost-planner",
    "label": "Fitness API Cost Planner"
  },
  {
    "href": "/pricing/are-fitness-apis-free",
    "label": "Are fitness APIs free? An honest overview"
  },
  {
    "href": "/fitness-apis/wearable-data-apis",
    "label": "Wearable data APIs compared"
  },
  {
    "href": "/fix/refresh-token-not-working",
    "label": "Fix: refresh token not working"
  }
];

export const metadata: Metadata = {
  title: { absolute: "The State of Fitness APIs 2026: 25-API Dataset" },
  description: "Original research on 25 fitness APIs, SDKs and models: 56% are free to call, 52% gate your launch on an approval, 4% hide terms. Open CC BY 4.0 dataset.",
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    type: "article",
    title: "The State of Fitness APIs 2026",
    description: "Original research on 25 fitness APIs, SDKs and models: 56% are free to call, 52% gate your launch on an approval, 4% hide terms. Open CC BY 4.0 dataset.",
    url: PAGE_PATH,
    images: ["/opengraph-image"],
  },
};

const ANSWER = "Of the 25 fitness APIs, SDKs and models surveyed for this report, as revised on 18 October 2026, 14 are free to call (56%) — but 13 gate your launch behind someone else's approval (52%), and 6 need the end user to have a device, an account or a membership before any data flows. Only 1 item (4%) is contact-sales-only: KinesteX, which funds this site. The free layer and the gated layer are not the same items: all 3 pose-estimation models are free, Apache-2.0 or platform-bundled and ungated, while five of the six direct wearable APIs carry both an approval gate and a user-side cost. Every figure comes from an open, per-item-sourced dataset published under CC BY 4.0, and no dollar figure appears anywhere in it by design.";

const FAQS: { q: string; a: string }[] = [
  {
    "q": "How many of the 25 fitness APIs in this report are free to call?",
    "a": "14 of the 25 items are free to call, which is 56% of the survey: Fitbit, Garmin, Oura, WHOOP, Strava, Polar, Apple HealthKit, Google Health Connect, USDA FoodData Central, Open Food Facts, wger, MediaPipe Pose Landmarker, TensorFlow MoveNet and Apple Vision body pose. Free to call means no per-request fee is documented for the developer — it does not mean free to ship. Several of those items are simultaneously gated behind an approval (Fitbit, Garmin, Oura, WHOOP, Strava, HealthKit, Health Connect), carry a cost or requirement on your end user (Fitbit, Garmin, Oura, WHOOP, Strava, Polar), or attach licence obligations that arrive as legal work rather than an invoice (wger is AGPL-3.0 copyleft, Open Food Facts is ODbL share-alike)."
  },
  {
    "q": "Which fitness APIs in this survey require the end user to own hardware or hold an account or membership?",
    "a": "6 of the 25 items carry a documented user-side cost or requirement, and all six are direct wearable APIs. Fitbit requires each user to own a Fitbit device and account. Garmin's users sync their own Garmin devices, and if you want to offer Garmin wearables, Garmin asks you to contact it through its inquiry form when you request its program. Oura requires an Oura Ring and an active Oura Membership, and its API returns 403 when a user's subscription has expired. WHOOP's users authorize your app with their own WHOOP accounts, so they are WHOOP members already. Strava needs each athlete's own Strava account, and Standard Tier apps may require specified end users to hold an active Strava subscription. Polar requires a Polar Flow account with all of Polar's mandatory consents accepted; without them, its user endpoints return 403. Treat this column as a market-size ceiling rather than a cost line: it is free to you and expensive to your funnel."
  },
  {
    "q": "How was the 25-item sample for the State of Fitness APIs 2026 chosen?",
    "a": "The 25 items are the APIs, SDKs and models that this site's own verified pages already cover in depth, which makes it a coverage-driven sample rather than a census. It is not exhaustive, it implies nothing about market share or popularity, and it skews toward vendors whose developer documentation is published in English. One row stands for a whole feature category rather than a named vendor: the LLM API item. The eight categories are our taxonomy, not an industry standard. Every field was verified against vendor primary sources during 2026 with per-item provenance published, and anything we could not verify is null rather than guessed."
  },
  {
    "q": "Can I cite or redistribute the State of Fitness APIs 2026 dataset?",
    "a": "Yes. The dataset is published under CC BY 4.0 as fitness-apis-2026.json and fitness-apis-2026.csv, version 2026.1, with a source link on every row so you can check each claim against the page it came from. Attribution is the only condition. Cite it as: AIFitnessAPI, 'The State of Fitness APIs 2026,' aifitnessapi.com, updated 11 August 2026, revised 22 October 2026, https://aifitnessapi.com/state-of-fitness-apis-2026. The 18 October revision changed two aggregator rows, the Sency row and three direct wearable rows (Garmin, Strava and Polar) in place, and the revision note at the top of the report keeps the earlier figures on record; future editions will be versioned rather than overwritten."
  },
  {
    "q": "Does KinesteX get special treatment in its own dataset?",
    "a": "No, and the report says so in the open: KinesteX funds this site. It appears as one of the 25 items and, since the 18 October revision, as the only contact-sales item — no public pricing, access through a contact form and an issued API key. The same rule moved Garmin, Spike and Sency out of that class once their own pages were re-read in October, and kept KinesteX in it. There is no ranking in this dataset, no accuracy or performance claim for any vendor including KinesteX, and no exemption from the 'could not verify' treatment applied to competitors. The report also states plainly that the pose-estimation layer underneath the commercial motion SDKs is free and Apache-2.0 or platform-bundled, which is the strongest argument against buying a motion SDK at all."
  }
];

const BODY = `
Most surveys of this market are price lists, and every price list is wrong within a quarter. This one measures something else: **access structure**. Who is allowed to call the API, what stands between working code and a live product, and who has to already be paying someone before a single data point exists.

That layer moves slowly. A vendor can reprice twice a year without changing the fact that its API sits behind a partner review, or that its data only exists for people who bought the hardware. Structure is what you design against; price is what you negotiate later.

The dataset behind this report covers **25 APIs, SDKs and models** across eight layers of a fitness stack. Every field is verified against vendor primary sources and published openly; downloads and the full method are at the end.

## Key findings

### 1. Free to call is not free to ship

**14 of the 25 items (56%) are free to call.** That list: Fitbit, Garmin, Oura, WHOOP, Strava, Polar, Apple HealthKit, Google Health Connect, USDA FoodData Central, Open Food Facts, wger, MediaPipe Pose Landmarker, TensorFlow MoveNet and Apple Vision body pose.

Now look at where the cost went. Fitbit, Garmin, Oura, WHOOP, Strava, HealthKit and Health Connect are free *and* gated — someone else's review stands between your code and your launch. All six direct wearable APIs are free *and* carry a user-side cost or requirement. Garmin publishes no price for Starter Access and says Enterprise commercial terms are tailored; Strava charges nothing for API access, but creating an app requires a Strava subscription. wger is free *and* AGPL-3.0 copyleft, so the bill arrives as legal review; Open Food Facts is free *and* ODbL share-alike, which can force you to open a derived database.

**What it means:** "free" here describes one column of a spreadsheet that has four columns in it. Read it as "no per-request fee documented," then go find where the vendor took its cut instead. The [cost planner](/cost-planner) keeps those columns separate; [are fitness APIs free?](/pricing/are-fitness-apis-free) works the same distinction from the buyer's side.

### 2. The approval-gate economy: 52% of the market makes you ask permission

**13 of the 25 items (52%) carry an approval gate** — a review, declaration, cap, provider registration or sales process you must clear before launch. All thirteen, because the shapes differ enormously:

- **WHOOP** — new apps start on a Sandbox tier of 10 members and move up through reviewed tiers of 100, 1,000, 5,000 and unlimited; developers need a WHOOP membership to build.
- **Oura** — a new API application is limited to 10 users until Oura approves it, with no limit once approved.
- **Garmin** — Garmin Connect Developer Program approval, as Starter or Enterprise Access; Garmin's pages state no review time.
- **Strava** — a Strava subscription is a prerequisite for creating an app, which starts in single-player mode; a self-service upgrade raises its athlete capacity to 10, and connecting more than 10 needs Strava's review.
- **Fitbit** — developer app registration; access to other users' intraday data is case-by-case (verify).
- **Apple HealthKit** — App Store review checks that your health usage-description strings match what you do.
- **Google Health Connect** — a Play Console health-data declaration and review before you can publish.
- **Terra** — its docs say some providers "require special processes before being able to start using them" and name WHOOP, Dexcom, Huawei, Strava and Virtuagym.
- **Rook** — Dexcom, Samsung Health, Strava and WHOOP need your own developer accounts, which Rook says can take several weeks.
- **Spike** — sales-assisted onboarding: every plan is bought through a demo call, with a dedicated implementation engineer from sandbox.
- **Nutritionix** — higher tiers gated through a Syndigo sales contact, not a self-serve checkout.
- **KinesteX** — a contact form and an issued API key; no self-serve signup.
- **Sency** — sign-up through a contact form that leads to a call, and a separate paid service agreement for commercial or production use under its Terms of Use.

**What it means:** the currency here is calendar time, charged at a list price of zero. A partner review and a store declaration both sit on your critical path and neither appears in a budget. Start the gates before you need them — see [Garmin API approval](/fix/garmin-api-approval).

### 3. The membership wall: 6 items that need your user's device, account or membership

**6 of the 25 items carry a documented user-side cost or requirement** — something the end user must own, hold or accept before their data can flow at all. All six are direct wearable APIs:

| Item | What the end user must have |
| --- | --- |
| Fitbit Web API | A Fitbit device and account |
| Garmin Health / Activity API | Their own Garmin device, which they sync; if you want to offer Garmin wearables, Garmin asks you to use its inquiry form when you request its program |
| Oura Cloud API | An Oura Ring and an active Oura Membership; the API returns 403 when a user's subscription has expired |
| WHOOP Developer Platform | Their own WHOOP account, so they are WHOOP members already |
| Strava API | Their own Strava account, authorized by the athlete; Standard Tier apps may require specified end users to hold an active Strava subscription |
| Polar Open AccessLink | A Polar Flow account with all of Polar's mandatory consents accepted; without them, user endpoints return 403 |

That is every item in the wearable-direct category. **Polar Open AccessLink is still the exception on gates:** no approval gate is documented — any registered Polar Flow user can create an API client — which keeps it the most self-serve first-party wearable API in the survey.

**What it means:** this is a market-size constraint wearing a cost-model costume. If your product needs WHOOP data, every prospective user is already a WHOOP subscriber — a ceiling that belongs in the business case, not the engineering budget. [Wearable data APIs compared](/fitness-apis/wearable-data-apis) walks it per vendor.

### 4. Only 4% hides its terms completely — one motion SDK

**1 of the 25 items (4%) is contact-sales-only:** KinesteX.

The list keeps shrinking. In the AI motion layer, QuickPose publishes a self-serve free tier and per-device plans, and Sency, classed contact-sales on 11 August, now publishes per-user plans, though on two pages that disagree about its first 100 users (see the revision note). KinesteX still requires a conversation before you can see terms. The wearables have left this list: Garmin, classed contact-sales on 11 August, documents no fee for its Starter Access, though since its October reorganisation its pages say Enterprise options and commercial terms are tailored to business and technical requirements. The aggregator layer has left it too: Spike, the one aggregator classed contact-sales on 11 August, now publishes a starting price and bills on usage.

**Disclosure:** KinesteX funds this site. It appears in the dataset on exactly the same terms as everyone else — classified contact-sales, approval gate recorded, no ranking, no accuracy claim, no exemption from the "could not verify pricing" treatment applied to its competitors. See [KinesteX vs Sency](/compare/kinestex-vs-sency).

**What it means:** where a vendor's value is a negotiated relationship rather than a metered endpoint, expect a quote with the lead time of an approval. Budget the conversation, not just the licence.

### 5. Every major wearable OAuth API rotates refresh tokens — all five of them

This is the one place in the survey where an entire category behaves identically. **Strava, WHOOP, Oura, Garmin and Fitbit all rotate the refresh token**: the refresh response contains a new refresh token and the old one dies immediately.

The resulting outage is the most reproducible failure in fitness-API engineering. Refresh works once in testing, ships, then every user breaks with \`400 invalid_grant\` on the second attempt, because the integration saved the new access token and dropped the new refresh token. Two aggravating factors recur: concurrent refreshes for one user race each other, and WHOOP only issues a refresh token when you request the \`offline\` scope.

**What it means:** treat every refresh token as single-use, persist the returned one atomically with the access token, and serialize refreshes per user. Full taxonomy in [refresh token not working](/fix/refresh-token-not-working).

### 6. The pose layer is free and the layer above it is not — the value moved up the stack

All **3 pose-estimation models** in the survey are free: MediaPipe Pose Landmarker (BlazePose), TensorFlow MoveNet and Apple Vision body pose. The first two are Apache-2.0; Apple's runs inside its own SDK with no model file to ship. None carries an approval gate or a per-frame cost.

Directly above them, the **3 AI motion SDKs** are all commercial: KinesteX behind sales, Sency billed per active user, QuickPose on a free tier that runs out.

That gap is the finding. BlazePose returns 33 landmarks per frame; MoveNet returns 17 keypoints. Both stop there. Rep counting, per-exercise form rules, calibration, exercise content and cross-device tuning are not in the box, and they are not a one-time build — they recur as maintenance every time a new phone or a new exercise arrives.

**What it means:** the build-versus-buy question in AI fitness is not "can I get keypoints for free" (yes, trivially) but "who maintains everything between keypoints and a workout." Compare [MediaPipe and MoveNet](/motion/pose-estimation-models-compared#mediapipe-vs-movenet-head-to-head) at the model layer, [KinesteX vs MediaPipe](/compare/kinestex-vs-mediapipe) across the gap, and [fitness API vs build your own](/fitness-apis/fitness-api-vs-build-your-own) for scope.

### 7. Usage-based billing is a minority, and it is mostly a way to buy back time

Only **6 of the 25 items bill on usage**: all four aggregators (Terra, Junction, Rook and Spike), Sency's motion SDK, which bills per monthly active user, plus the LLM feature layer, which meters tokens with output priced above input.

Read that against finding 2. Aggregators exist precisely to broker provider authentication — the gates you would otherwise clear one wearable vendor at a time — and their own gates are narrow: Junction carries no documented approval gate at all, Terra's and Rook's cover a named handful of providers that need your own setup, and Spike's is a sales-assisted start. The middle of the stack offers a real trade: pay a metered bill and skip most of the queue, or clear the queues yourself and pay nothing per call.

**What it means:** the aggregator decision is a schedule decision as much as a cost one. What no aggregator removes is anything attached to your own app rather than the data source — App Store review and the Play Console declaration survive regardless. [Terra vs Vital/Junction](/fitness-apis/terra-vs-vital) and the [aggregator overview](/fitness-apis/health-data-aggregator-apis) cover what each broker actually brokers.

## The market, layer by layer

| Layer | Items | How it bills you | Gates and user-side costs |
| --- | --- | --- | --- |
| Wearable APIs (direct) | 6 | Free to call, all six; Garmin says Enterprise commercial terms are tailored | Gated everywhere except Polar, and Strava's gate starts with a Strava subscription; all six need the user's device, account or membership |
| Platform health stores | 2 | Free (HealthKit, Health Connect) | Store review both sides: usage-description strings on iOS, health-data declaration on Android |
| Health-data aggregators | 4 | Usage-based (Terra, Junction, Rook, Spike) | Narrow gates: Terra's and Rook's provider setups for a named handful of providers, Spike's sales onboarding; none documented on Junction |
| Nutrition and food data | 4 | Open data (USDA FoodData Central, Open Food Facts) versus freemium (Nutritionix, Edamam) | Only Nutritionix's higher tiers; open options charge in licence obligations |
| Exercise content | 2 | Marketplace freemium (ExerciseDB); free self-hosted (wger) | None documented; wger's AGPL-3.0 copyleft is the real constraint |
| AI motion / coaching SDKs | 3 | Contact-sales (KinesteX); usage-based (Sency); free-tier-then-paid (QuickPose) | A sales process or a separate paid service agreement is the gate; none documented on QuickPose |
| Pose-estimation models | 3 | Free, Apache-2.0 or bundled in the platform SDK | None |
| LLM features | 1 | Usage-based per token, output priced above input | None |

Per-vendor structure is broken out on [Fitbit API pricing](/pricing/fitbit-api-pricing), [aggregator pricing](/pricing/health-data-aggregator-pricing), [nutrition API pricing](/pricing/nutrition-api-pricing) and [exercise database API pricing](/pricing/exercise-database-api-pricing).

## Methodology

**The sample.** 25 items, chosen as the APIs, SDKs and models this site's own verified pages already cover in depth. That makes it coverage-driven, not a census: it is not exhaustive, implies nothing about market share, and skews toward vendors with English-language developer documentation. One row ("LLM API") stands for a feature category rather than a named vendor. The eight categories are ours, not an industry taxonomy.

**Verification.** Every non-judgement field was verified against vendor primary sources — developer documentation, public repositories, registries — during 2026, each backed by a sentence published on this site, with per-item provenance recorded in the cost model the dataset is generated from. Where the vendor's own material was absent or unreadable and only third-party reports existed, the claim is marked "reportedly" and carries a verify flag inline rather than being laundered into a fact. The four aggregator rows and five of the six direct wearable rows (Garmin, Strava, Oura, WHOOP and Polar) were re-verified on 17 October 2026 and the three AI motion SDK rows on 17 and 18 October 2026, and the Garmin row again on 22 October 2026; the other 13 rows carry their 11 August 2026 verification.

**Nulls are honest.** A null means we could not verify it — never that the answer is zero, never a guess. Polar's empty approval gate means no sentence on our pages documents one, not that none exists.

**No prices, by design.** There is not one monetary figure in this report or the dataset. Public figures move within quarters, and a stale number damages a citable source more than a missing one. This report is the editorial sibling of the [cost planner](/cost-planner), which likewise refuses to produce a total.

**What we left out.** Our engineering-effort estimate is judgement, not a vendor fact, so it stays in the planner where it is labelled as judgement and is excluded from the dataset. Counting gates is also binary and therefore lossy: an App Store review and Garmin's Developer Program approval are both one gate here and are nothing alike. Read the per-item gate text, not just the count.

**First-party disclosure.** KinesteX funds this site. It is one of the 25 items and the only contact-sales item, recorded on the same terms as every competitor.

**Licence and downloads.** CC BY 4.0, version 2026.1 as revised on 18 October 2026, with a per-item source link on every row: [fitness-apis-2026.json](/datasets/fitness-apis-2026.json) and [fitness-apis-2026.csv](/datasets/fitness-apis-2026.csv).

**Cite as:** AIFitnessAPI, "The State of Fitness APIs 2026," aifitnessapi.com, updated 11 August 2026, revised 22 October 2026, https://aifitnessapi.com/state-of-fitness-apis-2026

## What to watch into 2027

Five things in this data look unstable. All of them are hedges, not predictions.

**Fitbit is mid-migration to the Google Health API**, and the successor's pricing model is not clearly public. Fitbit's free-to-call classification is the least stable cell in the table, and the thing to budget is a re-integration, not a fee. The [Google Fit shutdown](/google-fit-shutdown) is the precedent for how this vendor retires things.

**Strava updated its API terms on 1 June 2026.** Its API Agreement says access is currently provided at no charge, with notice promised if Strava decides to start charging, and its API Policy makes Standard Tier apps subject to subscription requirements for the developer or specified end users; its getting-started guide calls a Strava subscription a prerequisite for creating an app. The consequential part is architectural, not commercial: an athlete's data may be shown only to that athlete, it may not be used in developing, training, evaluating or operating any AI application, and it may not sit in a cache for more than seven days. If those restrictions spread, the binding constraint on this market shifts from price to permission — and no cost model would show it.

**WHOOP's API terms took effect on 6 October 2026.** They say access to the APIs is currently provided at no charge, with prior notice if WHOOP decides to start charging. They let WHOOP limit the requests you make and the users you serve, and decline a request to go beyond those limits or make acceptance conditional on additional terms or charges. They also forbid using WHOOP data to train or improve any machine-learning or AI model. The free-to-call row is WHOOP's current position, and its terms already reserve the right to charge.

**Nutritionix's free tier is contested.** Reports conflict on whether the open free tier still exists; if it is gone, that row looks closer to sales-gated — see [Nutritionix vs Edamam](/compare/nutritionix-vs-edamam).

**MoveNet MultiPose has a licence gap.** The MultiPose model card we read carried no licence line, while the single-person models are Apache-2.0. Until that resolves, "the pose layer is uniformly free" deserves an asterisk wherever multi-person tracking is involved. Confirm it independently before shipping commercially.

The next edition will re-verify every row and version the dataset rather than overwrite it. Within 2026.1, the 18 October 2026 revision changed two aggregator rows, the Sency row and three direct wearable rows (Garmin, Strava and Polar) in place, the 22 October 2026 revision rewrote the Garmin row's text, and the revision note at the top keeps the earlier figures on record.
`;

const REVISION = `
**Revised 22 October 2026.** Garmin reorganised its Connect Developer Program between our 17 and 22 October reads: access now comes as Starter Access and Enterprise Access, with a separate Personal API for individuals' own data, and the program FAQ moved to a new address. We re-read Garmin's pages on 22 October and rewrote the Garmin row to match them. Its approval gate now reads "Garmin Connect Developer Program approval, as Starter or Enterprise Access; Garmin's pages state no review time", and its user-side text points to Garmin's inquiry form for anyone offering Garmin wearables, where it used to ask for a device count. The classification stays free to call, because Garmin documents no fee for Starter Access. The FAQ sentence it rested on, "There are no licensing or maintenance fees", is gone, though, and Garmin's overview says Enterprise commercial terms are tailored, so that cell is now the least certain in the wearable layer. No figure moved. This is recorded as an update rather than a correction, because the 18 October text matched Garmin's FAQ as a Wayback Machine capture shows it on 17 October. The [changes tracker](/changes) dates the restructure.

**Revised 18 October 2026.** On 17 October 2026 we re-verified the four aggregator rows (Terra, Junction, Rook and Spike) and five of the six direct wearable rows (Garmin, Strava, Oura, WHOOP and Polar), and on 17 and 18 October 2026 the three AI motion SDK rows (KinesteX, QuickPose and Sency), against the vendors' own pages, docs and repositories; the other 13 rows keep their 11 August 2026 verification. Six classifications changed:

- **Spike: contact-sales → usage-based.** Its pricing page now publishes a starting price for its Sandbox plan and calls its pricing usage-driven. That is recorded as an update rather than a correction, because we hold no copy of Spike's pricing page from August to show the price was public then.
- **Terra: an approval gate is now recorded.** Its docs say some providers "require special processes before being able to start using them" and name WHOOP, Dexcom, Huawei, Strava and Virtuagym. Our own aggregator pages already said, before this report went up, that some providers need your own developer credentials with Terra, so the missing gate was an error; it is logged on the [corrections page](/corrections).
- **Sency: contact-sales → usage-based, and a restated approval gate.** Sency's pricing packages page now lists per-active-user plans with prices, and its main pricing page describes a free trial, then a fixed monthly fee for up to 100 users, then usage-based billing; the two pages disagree about whether those first users are free. Its approval gate now records what its pages and Terms of Use say: sign-up through a contact form that leads to a call, and a separate paid service agreement for commercial or production use. The earlier "no credit card" detail is not on the pages we read, so it is gone. Recorded as an update rather than a correction, because we hold no readable copy of Sency's pricing pages from August.
- **Garmin: contact-sales → free.** Garmin's program FAQ says there are no licensing or maintenance fees for access to the Garmin Connect Developer Program, which is only for business use, and that access to some metrics may require a licence fee or a minimum device order for commercial use. Its approval gate now records that the program is for business use only and that Garmin confirms an application's status within two business days, in place of third-party reports that sign-ups were paused. Two of our own pages, the wearable data APIs comparison and Fitbit API vs Garmin API, already said before this report went up that Garmin was documented as free to use with approval; the report followed our Garmin pricing page instead, which said Garmin did not publish its terms. The contact-sales classification was an error, and it is logged on the [corrections page](/corrections).
- **Strava: free-tier-then-paid → free.** Strava's API Agreement says access to its API is currently provided at no charge, so the subscription is recorded as a gate rather than a developer fee: Strava's getting-started guide calls a Strava subscription a prerequisite for creating an app, and its API Policy makes Standard Tier apps subject to subscription requirements for the developer or specified end users. New apps start in single-player mode, a self-service upgrade raises their athlete capacity to 10, and connecting more than 10 athletes needs Strava's review. Our Strava pricing page, the row's source, already said before this report went up that the API had no per-call developer fee and that the subscription it reported gated Standard-tier access, so the free-tier-then-paid classification was an error; it is logged on the [corrections page](/corrections) too.
- **Polar: a user-side requirement is now recorded.** Each user needs a Polar Flow account, through which they authorize your app, and must accept all of Polar's mandatory consents: Polar's AccessLink documentation says each user needs them accepted before you can access their data, and that user endpoints return 403 Forbidden until they are. Polar still has no approval gate on record, since any registered Polar Flow user can create an API client. Recorded as an update rather than a correction: when the report went up, no page of ours mentioned Polar's mandatory consents.

| Figure | 11 August 2026 | 18 October 2026 |
| --- | --- | --- |
| Free-to-call items | 12 (48%) | 14 (56%) |
| Contact-sales items | 4 (16%) | 1 (4%) |
| Free-tier-then-paid items | 5 | 4 |
| Usage-based items | 4 | 6 |
| Approval-gated items | 12 (48%) | 13 (52%) |
| Items with a user-side cost or requirement | 5 | 6 |

Evidence, with the vendor pages each one checked: [health-data aggregator APIs](/fitness-apis/health-data-aggregator-apis) and [aggregator pricing](/pricing/health-data-aggregator-pricing) for Spike's pricing, [how to integrate Terra](/integrate/terra-api) for Terra's provider setup, [Sency pricing](/pricing/sency-pricing) for Sency's plans, [Garmin API pricing](/pricing/garmin-api-pricing) for Garmin's fees and approval, [Strava API pricing](/pricing/strava-api-pricing) for Strava's agreement and subscription rule, and [how to integrate Polar](/integrate/polar-api) for Polar's consents.
`;

export default function StateOfFitnessApis2026Page() {
  const url = absoluteUrl(PAGE_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The State of Fitness APIs 2026",
    description: metadata.description,
    datePublished: FIRST_PUBLISHED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "State of Fitness APIs 2026",
    version: "2026.1",
    description:
      "Access-structure survey of 25 fitness/health APIs, SDKs and pose models: developer cost model, user-side costs, and approval gates. No prices by design; per-item provenance links.",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: orgRef(),
    url,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: absoluteUrl("/datasets/fitness-apis-2026.json"),
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: absoluteUrl("/datasets/fitness-apis-2026.csv"),
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <article className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "State of Fitness APIs 2026", path: PAGE_PATH }]} />

        <ClusterHero label="Original Research" seed={3} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          The State of Fitness APIs 2026
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Version 2026.1 · Updated 11 August 2026 · Revised 18 October 2026 · Open dataset, CC BY 4.0
        </p>

        <aside
          role="note"
          className="mt-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
        >
          <strong>Disclosure:</strong> KinesteX, the company that funds this site, is one of the 25
          items surveyed. It is recorded on the same terms as every competitor — the methodology
          section details how.
        </aside>

        {/* Answer-first capsule — the citable headline numbers. */}
        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </div>

        {/* Revised in place, not re-editioned: what moved, with the old figures. */}
        <aside
          role="note"
          id="revision-2026-10-18"
          className="prose prose-sm prose-neutral mt-6 max-w-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left"
        >
          <Mdx source={REVISION} />
        </aside>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left">
          <Mdx source={BODY} />
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta pitch="Access structure changes quietly: an approval gate opens, a membership requirement lands, a licence line appears. We re-verify this dataset and publish what moved — get the next edition when it ships." source="pillar-inline" id="cta-state-of-2026" />

        <section className="mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Keep reading
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {RELATED.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-sm text-[var(--muted)]">
          By {site.name}. Cite as: AIFitnessAPI, &ldquo;The State of Fitness APIs 2026,&rdquo; version 2026.1, revised 22 October 2026 — the dataset downloads carry per-item source links.
        </p>
      </article>
    </Container>
  );
}
