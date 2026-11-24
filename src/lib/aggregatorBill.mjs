/**
 * The aggregator bill calculator on /tools/aggregator-chooser: what each
 * health-data aggregator would bill at a given number of active users and
 * connected sources, from its published price sheet and nothing else.
 *
 * Plain ESM with no dependencies, imported by the page, its client component
 * and scripts/aggregator-bill.test.mjs, so the tests run the code a reader
 * runs.
 *
 * Every number a formula uses is a `price` with `as`, the exact text of the
 * number in its quote, and `src`: the vendor URL, the vendor's own words and
 * `ev`, the evidence file that already holds that quote
 * (ops/sources/evidence/pricing-health-data-aggregator-pricing.json for most,
 * re-checked against the live pages by .github/workflows/source-quotes.yml).
 * The test fails if a quote is missing from its evidence file, or if `as` is
 * not in the quote or does not read as `value`. A vendor whose bill cannot be
 * computed from what it publishes returns `computable: false` with the reason
 * and its quotes; nothing is estimated.
 *
 * Where a price sheet leaves a reading open (which plan you land on past a
 * ceiling, whether a per-user rate is monthly, how a partial block of users
 * is billed), the reading this site's own pricing pages use is applied and
 * printed as an assumption beside the result.
 */

const P = "ops/sources/evidence/pricing-health-data-aggregator-pricing.json";
const SAHHA = "ops/sources/evidence/pricing-sahha-api-pricing.json";
const AGG = "ops/sources/evidence/fitness-apis-health-data-aggregator-apis.json";

const src = (url, quote, ev = P) => ({ url, quote, ev });
const price = (value, as, s) => ({ value, as, src: s });

const Q = {
  terraBase: src(
    "https://tryterra.co/pricing",
    "Subscriptions start from $399 per month billed annually, or $499 per month billed monthly. That includes 100,000 Unified API credits each month, and you only pay extra if your usage goes beyond them.",
  ),
  terraAuth: src(
    "https://tryterra.co/pricing",
    "Two things consume Unified API credits: active authentications and events. An active authentication is one connected data source for one end user, and costs 200 Unified API credits per month. Events are the payloads Terra sends you, and the first 400 per active authentication each month are free.",
  ),
  terraEvents: src(
    "https://tryterra.co/pricing",
    "The Unified API includes 400 events per active authentication free each month, and events beyond that cost 0.5 Unified API credits each. Terra's pricing docs note that 95% of customers are never charged for events.",
  ),
  terraTiers: src("https://docs.tryterra.co/unified-api/pricing", "100,001 - 1,000,000 $0.005 1,000,001+ $0.003"),
  rookBasis: src(
    "https://tryrook.io/pricing/",
    "ROOK pricing is based on the plan and the number of active users, with usage-based billing and the flexibility to activate only the products and add-ons needed.",
  ),
  rookCore: src("https://tryrook.io/pricing/", "For getting started with ROOK. $399 USD per month Up to 750 active users"),
  rookCorePlus: src("https://tryrook.io/pricing/", "For teams growing past their first user base. $999 USD per month Up to 5,000 active users"),
  rookBusiness: src("https://tryrook.io/pricing/", "For companies that need to scale. $1,999 USD per month Up to 15,000 active users"),
  rookEnterprise: src(
    "https://tryrook.io/pricing/",
    "For organizations with custom security or integration requirements. Custom Custom pricing Unlimited users",
  ),
  rookPastLimit: src("https://tryrook.io/pricing/", "Each plan includes an active user limit. Beyond that limit, billing adjusts based on usage."),
  rookTerm: src(
    "https://tryrook.io/pricing/",
    "ROOK's standard contract term is 12 months, with the flexibility to cancel with 30 days' prior notice.",
  ),
  junctionLaunch: src(
    "https://www.junction.com/pricing",
    "it covers the Link widget, 300+ device integrations, and usage analytics for a flat $300 a month.",
  ),
  junctionUsers: src("https://www.junction.com/pricing", "Launch covers 1-500 connected users."),
  junctionMonthly: src("https://www.junction.com/pricing", "Launch is billed monthly, so there is no annual contract to get started."),
  junctionEnterprise: src("https://www.junction.com/pricing", "Enterprise Custom Billed annually"),
  junctionMove: src(
    "https://www.junction.com/pricing",
    "Move to Enterprise when you need lab testing, unlimited users, uptime SLAs, or a signed BAA.",
  ),
  spikeFloor: src(
    "https://www.spikeapi.com/pricing",
    "Purpose-built for fast innovation, Sandbox gives your team everything needed to build, test, and launch into production. Starts from $450 /month",
  ),
  spikeUsage: src("https://www.spikeapi.com/pricing", "Usage-driven, transparent, and flexible", AGG),
  spikeDemo: src("https://www.spikeapi.com/pricing", "Dedicated Implementation Engineer Standartized data Support via Slack & Email Book a demo", AGG),
  sahhaStarter: src(
    "https://sahha.ai/",
    "Start free with 25 development users and every product unlocked in sandbox. Production plans start at $299 a month billed annually, with 1,000 users included and per-user pricing as you grow.",
  ),
  sahhaStarterExtra: src("https://sahha.ai/pricing/", "1,000 users included, then $0.40/user"),
  sahhaPro: src("https://sahha.ai/pricing/", "$1,499 $1,999 /month, billed annually"),
  sahhaProExtra: src("https://sahha.ai/pricing/", "10,000 users included, then $0.20/user"),
  sahhaToggle: src("https://sahha.ai/pricing/", "Monthly Annual −25%", SAHHA),
  sahhaUser: src("https://sahha.ai/pricing/", "What counts as a user?"),
  thryveStartUp: src("https://www.thryve.health/pricing", "Start Up Starts at 499 € / Per Month"),
  thryveStartUpUsers: src("https://www.thryve.health/pricing", "Get started with 500 users, one app connection, and access to real-time data."),
  thryveExtra: src("https://www.thryve.health/pricing", "Additional users billed at €0.50 each."),
  thryveScaleUp: src("https://www.thryve.health/pricing", "Scale Up Starts at 1.000 € / Per Month"),
  thryveScaleUpWho: src(
    "https://www.thryve.health/pricing",
    "Special plan for startups with growth-stage needs (less than 10 years of founding).",
  ),
  thryveScaleUpUsers: src(
    "https://www.thryve.health/pricing",
    "Up to 5000 users 1 app connected Own data source tenant / Custom Auth credentials Up to 14 days of Fetching historical data Up to 1 month of data storage",
  ),
  thryveBlock: src("https://www.thryve.health/pricing", "Scale your user base with additional €999 per 10,000 users."),
  validicFree: src(
    "https://validic.com/blog/Validic-Inform-Is-Now-Free/",
    "Starting today, people can sign up for Inform at no cost. No contract. No credit card. No sales call.",
  ),
  validicLimits: src(
    "https://validic.com/inform-signup/",
    "5 users Streaming API (SSE) + REST API preview 5 cloud integrations to start building immediately 90-day data retention",
  ),
  validicEnterprise: src("https://validic.com/inform-signup/", "Negotiated pricing. Production-ready from day one."),
  validicBusiness: src("https://validic.com/inform-signup/", "COMING SOON Business More functionality, and priority support."),
  owCore: src(
    "https://openwearables.io/pricing",
    "For engineering teams that set up and run Open Wearables themselves, with community support. $0 Forever",
  ),
  owDeploy: src(
    "https://openwearables.io/pricing",
    "From $4,800, one-time. Production and staging in your cloud and region, providers onboarded under your credentials.",
  ),
  owEnterprise: src(
    "https://openwearables.io/pricing",
    "Enterprise License For organisations that need Open Wearables built around their use case, with the security and support a production product requires. Custom",
  ),
};

/** Every number a formula uses, with the text it is read from. */
export const PRICES = {
  terraAnnual: price(399, "$399", Q.terraBase),
  terraMonthly: price(499, "$499", Q.terraBase),
  terraIncluded: price(100000, "100,000", Q.terraBase),
  terraPerAuth: price(200, "200", Q.terraAuth),
  terraTier1Rate: price(0.005, "$0.005", Q.terraTiers),
  terraTier1End: price(1000000, "1,000,000", Q.terraTiers),
  terraTier2Rate: price(0.003, "$0.003", Q.terraTiers),
  rookCore: price(399, "$399", Q.rookCore),
  rookCoreCap: price(750, "750", Q.rookCore),
  rookCorePlus: price(999, "$999", Q.rookCorePlus),
  rookCorePlusCap: price(5000, "5,000", Q.rookCorePlus),
  rookBusiness: price(1999, "$1,999", Q.rookBusiness),
  rookBusinessCap: price(15000, "15,000", Q.rookBusiness),
  junctionLaunch: price(300, "$300", Q.junctionLaunch),
  junctionCap: price(500, "500", Q.junctionUsers),
  spikeFloor: price(450, "$450", Q.spikeFloor),
  sahhaStarter: price(299, "$299", Q.sahhaStarter),
  sahhaStarterIncluded: price(1000, "1,000", Q.sahhaStarterExtra),
  sahhaStarterExtra: price(0.4, "$0.40", Q.sahhaStarterExtra),
  sahhaPro: price(1499, "$1,499", Q.sahhaPro),
  sahhaProIncluded: price(10000, "10,000", Q.sahhaProExtra),
  sahhaProExtra: price(0.2, "$0.20", Q.sahhaProExtra),
  thryveStartUp: price(499, "499 €", Q.thryveStartUp),
  thryveStartUpIncluded: price(500, "500", Q.thryveStartUpUsers),
  thryveExtra: price(0.5, "€0.50", Q.thryveExtra),
  thryveScaleUp: price(1000, "1.000 €", Q.thryveScaleUp),
  thryveScaleUpIncluded: price(5000, "5000", Q.thryveScaleUpUsers),
  thryveBlock: price(999, "€999", Q.thryveBlock),
  thryveBlockSize: price(10000, "10,000", Q.thryveBlock),
  validicFreeUsers: price(5, "5", Q.validicLimits),
  owCore: price(0, "$0", Q.owCore),
  owDeploy: price(4800, "$4,800", Q.owDeploy),
};

/** Reads "$1,999", "1.000 €" (a European thousands point) or "€0.50" as a number. */
export function readStated(as) {
  const t = String(as).replace(/[^\d.,]/g, "");
  if (/^[1-9]\d{0,2}(\.\d{3})+$/.test(t)) return Number(t.replace(/\./g, ""));
  return Number(t.replace(/,/g, ""));
}

export const BOUNDS = { users: [1, 1000000], sources: [1, 10], months: [1, 60] };
export const DEFAULT_INPUTS = { users: 1000, sources: 1, months: 12, billing: "annual" };

const n = (x) => x.toLocaleString("en-US", { maximumFractionDigits: 2 });
const usd = (x) => `$${n(x)}`;
const eur = (x) => `${n(x)} euros`;

/** One vendor. `compute` returns { computable, options, notes } or { computable: false, reason, sources }. */
export const BILL_VENDORS = [
  {
    id: "terra",
    name: "Terra",
    currency: "USD",
    page: { href: "/pricing/terra-api-pricing", label: "Terra API pricing" },
    unit: "connected data sources (active authentications): users times sources per user",
    periods: ["annual", "monthly"],
    compute({ users, sources, billing }) {
      const p = PRICES;
      const base = billing === "monthly" ? p.terraMonthly : p.terraAnnual;
      const auths = users * sources;
      const credits = auths * p.terraPerAuth.value;
      const extra = Math.max(0, credits - p.terraIncluded.value);
      const tier1 = Math.min(extra, p.terraTier1End.value - p.terraIncluded.value);
      const tier2 = Math.max(0, credits - p.terraTier1End.value);
      const monthly = base.value + tier1 * p.terraTier1Rate.value + tier2 * p.terraTier2Rate.value;
      const lines = [
        `${n(users)} users × ${sources} source${sources === 1 ? "" : "s"} = ${n(auths)} active authentications × ${p.terraPerAuth.value} credits = ${n(credits)} credits a month`,
        `Plan fee ${usd(base.value)} (${billing === "monthly" ? "billed monthly" : "billed annually"}), which includes ${n(p.terraIncluded.value)} credits`,
      ];
      if (tier1) lines.push(`${n(tier1)} extra credits × ${usd(p.terraTier1Rate.value)} = ${usd(tier1 * p.terraTier1Rate.value)}`);
      if (tier2) lines.push(`${n(tier2)} credits past ${n(p.terraTier1End.value)} × ${usd(p.terraTier2Rate.value)} = ${usd(tier2 * p.terraTier2Rate.value)}`);
      return {
        computable: true,
        options: [{ plan: "Quick Start", monthly, lines, uses: [base, p.terraIncluded, p.terraPerAuth, p.terraTier1Rate, p.terraTier2Rate] }],
        notes: [
          { text: "Events are assumed to stay inside the free 400 per active authentication each month; past that, each costs 0.5 credits.", src: Q.terraEvents },
          { text: "The tier table names no billing period, so the same credit rates are applied to both, and $0.003 to the credits past 1,000,000 only, the reading this site's Terra pricing page uses.", src: Q.terraTiers },
        ],
      };
    },
  },
  {
    id: "rook",
    name: "ROOK",
    currency: "USD",
    page: { href: "/pricing/rook-api-pricing", label: "ROOK API pricing" },
    unit: "active users; sources per user do not change the plan",
    periods: ["monthly"],
    compute({ users }) {
      const p = PRICES;
      const plans = [
        ["Core", p.rookCore, p.rookCoreCap],
        ["Core+", p.rookCorePlus, p.rookCorePlusCap],
        ["Business", p.rookBusiness, p.rookBusinessCap],
      ];
      const fit = plans.find(([, , cap]) => users <= cap.value);
      if (!fit) {
        return {
          computable: false,
          reason: `Past ${n(p.rookBusinessCap.value)} active users only Enterprise is left, and its price is custom.`,
          sources: [Q.rookEnterprise, Q.rookPastLimit],
        };
      }
      const [plan, fee, cap] = fit;
      return {
        computable: true,
        options: [
          {
            plan,
            monthly: fee.value,
            lines: [`${n(users)} active users fit ${plan}, up to ${n(cap.value)}: ${usd(fee.value)} a month`],
            uses: [fee, cap],
          },
        ],
        notes: [
          { text: "ROOK bills by plan and active users.", src: Q.rookBasis },
          { text: "Past a plan's ceiling ROOK says billing adjusts based on usage, at a rate it does not publish; the calculator puts you on the smallest plan whose ceiling covers your count.", src: Q.rookPastLimit },
          { text: "The page lists monthly prices on a standard 12-month term and no separate annual price, so the billing choice does not change this row.", src: Q.rookTerm },
        ],
      };
    },
  },
  {
    id: "junction",
    name: "Junction",
    currency: "USD",
    page: { href: "/pricing/junction-api-pricing", label: "Junction API pricing" },
    unit: "connected users",
    periods: ["monthly"],
    compute({ users }) {
      const p = PRICES;
      if (users > p.junctionCap.value) {
        return {
          computable: false,
          reason: `Launch covers up to ${n(p.junctionCap.value)} connected users; past that Junction moves you to Enterprise, which is custom and billed annually.`,
          sources: [Q.junctionUsers, Q.junctionEnterprise, Q.junctionMove],
        };
      }
      return {
        computable: true,
        options: [
          {
            plan: "Launch",
            monthly: p.junctionLaunch.value,
            lines: [`${n(users)} connected users fit Launch (1 to ${n(p.junctionCap.value)}): a flat ${usd(p.junctionLaunch.value)} a month`],
            uses: [p.junctionLaunch, p.junctionCap],
          },
        ],
        notes: [{ text: "Launch is billed monthly only, so the billing choice does not change this row.", src: Q.junctionMonthly }],
      };
    },
  },
  {
    id: "spike",
    name: "Spike",
    currency: "USD",
    page: { href: "/alternatives/spike-api-alternatives", label: "Spike API alternatives" },
    unit: "not published",
    periods: [],
    compute() {
      return {
        computable: false,
        reason: `Spike publishes a starting price, "Starts from ${usd(PRICES.spikeFloor.value)} /month" for Sandbox, and calls its pricing usage-driven, but does not say how the bill grows with users or sources; each plan is bought through "Book a demo".`,
        sources: [Q.spikeFloor, Q.spikeUsage, Q.spikeDemo],
      };
    },
  },
  {
    id: "sahha",
    name: "Sahha",
    currency: "USD",
    page: { href: "/pricing/sahha-api-pricing", label: "Sahha API pricing" },
    unit: "users, with a number included per plan",
    periods: ["annual"],
    compute({ users, billing }) {
      const p = PRICES;
      if (billing === "monthly") {
        return {
          computable: false,
          reason: `Sahha's prices are stated billed annually, beside a toggle that reads "Monthly Annual −25%"; the monthly-billed prices are not in the passages this site holds. Switch to annual billing to see Sahha's figure.`,
          sources: [Q.sahhaStarter, Q.sahhaPro, Q.sahhaToggle],
        };
      }
      const starterExtra = Math.max(0, users - p.sahhaStarterIncluded.value);
      const proExtra = Math.max(0, users - p.sahhaProIncluded.value);
      const starter = p.sahhaStarter.value + starterExtra * p.sahhaStarterExtra.value;
      const pro = p.sahhaPro.value + proExtra * p.sahhaProExtra.value;
      const opt = (plan, fee, included, rate, extra, monthly) => ({
        plan,
        monthly,
        lines: [
          `${plan} ${usd(fee.value)} a month billed annually, ${n(included.value)} users included`,
          extra ? `${n(extra)} extra users × ${usd(rate.value)} = ${usd(extra * rate.value)}` : `${n(users)} users are inside the included ${n(included.value)}`,
        ],
        uses: [fee, included, rate],
      });
      const options = [
        opt("Starter", p.sahhaStarter, p.sahhaStarterIncluded, p.sahhaStarterExtra, starterExtra, starter),
        opt("Pro", p.sahhaPro, p.sahhaProIncluded, p.sahhaProExtra, proExtra, pro),
      ].sort((a, b) => a.monthly - b.monthly);
      return {
        computable: true,
        options,
        notes: [
          { text: 'The per-user rates are read as monthly, like the plan fee; the page says "then $0.40/user" without naming a period.', src: Q.sahhaStarterExtra },
          { text: "Sahha's pricing page has an FAQ titled \"What counts as a user?\" whose answer this site could not read; confirm it before you model growth.", src: Q.sahhaUser },
        ],
      };
    },
  },
  {
    id: "thryve",
    name: "Thryve",
    currency: "EUR",
    page: { href: "/pricing/thryve-api-pricing", label: "Thryve API pricing" },
    unit: "end users, with a number included per plan",
    periods: ["monthly"],
    compute({ users }) {
      const p = PRICES;
      const startExtra = Math.max(0, users - p.thryveStartUpIncluded.value);
      const startUp = p.thryveStartUp.value + startExtra * p.thryveExtra.value;
      const blocks = Math.ceil(Math.max(0, users - p.thryveScaleUpIncluded.value) / p.thryveBlockSize.value);
      const scaleUp = p.thryveScaleUp.value + blocks * p.thryveBlock.value;
      return {
        computable: true,
        options: [
          {
            plan: "Start Up",
            monthly: startUp,
            lines: [
              `Start Up from ${eur(p.thryveStartUp.value)} a month, ${n(p.thryveStartUpIncluded.value)} users included`,
              startExtra ? `${n(startExtra)} extra users × €${p.thryveExtra.value.toFixed(2)} = ${eur(startExtra * p.thryveExtra.value)}` : `${n(users)} users are inside the included ${n(p.thryveStartUpIncluded.value)}`,
            ],
            uses: [p.thryveStartUp, p.thryveStartUpIncluded, p.thryveExtra],
          },
          {
            plan: "Scale Up",
            monthly: scaleUp,
            conditional: "Only for startups under ten years old",
            conditionalSrc: Q.thryveScaleUpWho,
            lines: [
              `Scale Up from ${eur(p.thryveScaleUp.value)} a month, up to ${n(p.thryveScaleUpIncluded.value)} users`,
              blocks ? `${blocks} further block${blocks === 1 ? "" : "s"} of ${n(p.thryveBlockSize.value)} users × ${eur(p.thryveBlock.value)} = ${eur(blocks * p.thryveBlock.value)}` : `${n(users)} users are inside the ${n(p.thryveScaleUpIncluded.value)}`,
            ],
            uses: [p.thryveScaleUp, p.thryveScaleUpIncluded, p.thryveBlock, p.thryveBlockSize],
          },
        ],
        notes: [
          { text: "Both prices are floors (\"Starts at\"), in euros; nothing here converts them.", src: Q.thryveStartUp },
          { text: "The per-user charge is read as monthly, like the plan fee, which the page does not state; and 999 euros as the price of each further block of 10,000 users or part of one, a reading to confirm in writing.", src: Q.thryveBlock },
          { text: "The page lists per-month prices and no separate annual price, so the billing choice does not change this row.", src: Q.thryveStartUp },
        ],
      };
    },
  },
  {
    id: "open-wearables",
    name: "Open Wearables",
    currency: "USD",
    page: { href: "/compare/terra-vs-open-wearables", label: "Terra vs Open Wearables" },
    unit: "no per-user price: software you host",
    periods: [],
    compute() {
      const p = PRICES;
      return {
        computable: true,
        options: [
          {
            plan: "Core (self-hosted)",
            monthly: p.owCore.value,
            lines: [`Core license ${usd(p.owCore.value)}, forever; your hosting, security and provider registrations are not priced here`],
            uses: [p.owCore],
          },
        ],
        notes: [
          { text: `An optional Deployment service is a one-time fee from ${usd(p.owDeploy.value)}, not included above.`, src: Q.owDeploy },
          { text: "Enterprise is a custom-priced license.", src: Q.owEnterprise },
        ],
      };
    },
  },
  {
    id: "validic",
    name: "Validic",
    currency: "USD",
    page: null,
    unit: "users on the free Developer plan",
    periods: [],
    compute({ users }) {
      const p = PRICES;
      if (users > p.validicFreeUsers.value) {
        return {
          computable: false,
          reason: `The free Inform Developer plan covers ${p.validicFreeUsers.value} users; past that, Enterprise pricing is negotiated and the Business plan is listed as coming soon.`,
          sources: [Q.validicLimits, Q.validicEnterprise, Q.validicBusiness],
        };
      }
      return {
        computable: true,
        options: [
          {
            plan: "Inform Developer",
            monthly: 0,
            lines: [`${n(users)} users fit the free Developer plan (up to ${p.validicFreeUsers.value} users, 5 cloud integrations)`],
            uses: [p.validicFreeUsers],
          },
        ],
        notes: [{ text: "Inform is free to sign up for.", src: Q.validicFree }],
      };
    },
  },
];

/** One sentence per vendor saying how its row is computed, built from PRICES so it cannot drift from the formula. */
export function billMethods() {
  const p = PRICES;
  return {
    terra: `Plan fee of ${usd(p.terraAnnual.value)} a month billed annually or ${usd(p.terraMonthly.value)} billed monthly, with ${n(p.terraIncluded.value)} credits included; each connected source costs ${p.terraPerAuth.value} credits a month, credits past the included ones cost ${usd(p.terraTier1Rate.value)} each, and ${usd(p.terraTier2Rate.value)} past ${n(p.terraTier1End.value)}.`,
    rook: `The smallest plan whose ceiling covers your active users: Core ${usd(p.rookCore.value)} (up to ${n(p.rookCoreCap.value)}), Core+ ${usd(p.rookCorePlus.value)} (${n(p.rookCorePlusCap.value)}), Business ${usd(p.rookBusiness.value)} (${n(p.rookBusinessCap.value)}); past that, Enterprise is custom.`,
    junction: `Launch, a flat ${usd(p.junctionLaunch.value)} a month for 1 to ${n(p.junctionCap.value)} connected users; past that, Enterprise is custom.`,
    spike: `Not computable: Spike publishes only a starting price, from ${usd(p.spikeFloor.value)} a month for Sandbox.`,
    sahha: `The cheaper of Starter (${usd(p.sahhaStarter.value)} a month billed annually, ${n(p.sahhaStarterIncluded.value)} users included, then ${usd(p.sahhaStarterExtra.value)} a user) and Pro (${usd(p.sahhaPro.value)}, ${n(p.sahhaProIncluded.value)} users, then ${usd(p.sahhaProExtra.value)}); prices are stated for annual billing only.`,
    thryve: `Start Up from ${eur(p.thryveStartUp.value)} a month with ${n(p.thryveStartUpIncluded.value)} users, then €${p.thryveExtra.value.toFixed(2)} a user; Scale Up, for startups under ten years old, from ${eur(p.thryveScaleUp.value)} for up to ${n(p.thryveScaleUpIncluded.value)} users, then ${eur(p.thryveBlock.value)} per further ${n(p.thryveBlockSize.value)}.`,
    "open-wearables": `Core is free software you host, a ${usd(p.owCore.value)} license; hosting is yours, and an optional one-time Deployment service starts from ${usd(p.owDeploy.value)}.`,
    validic: `The free Inform Developer plan, up to ${p.validicFreeUsers.value} users; past that, Enterprise pricing is negotiated.`,
  };
}

/** Every quote the calculator can show, for the evidence test. */
export const BILL_SOURCES = Q;

const clampInt = (v, [lo, hi], d) => {
  const x = Math.round(Number(v));
  return v === null || v === undefined || v === "" || !Number.isFinite(x) ? d : Math.min(hi, Math.max(lo, x));
};

export function clampInputs(i) {
  return {
    users: clampInt(i.users, BOUNDS.users, DEFAULT_INPUTS.users),
    sources: clampInt(i.sources, BOUNDS.sources, DEFAULT_INPUTS.sources),
    months: clampInt(i.months, BOUNDS.months, DEFAULT_INPUTS.months),
    billing: i.billing === "monthly" ? "monthly" : "annual",
  };
}

/** Results for every vendor: the cheapest unconditional option is the headline. */
export function billAll(inputs) {
  const i = clampInputs(inputs);
  return BILL_VENDORS.map((v) => {
    const r = v.compute(i);
    if (!r.computable) return { vendor: v, ...r };
    const pick = r.options.find((o) => !o.conditional) ?? r.options[0];
    return {
      vendor: v,
      ...r,
      pick,
      monthly: pick.monthly,
      annual: pick.monthly * 12,
      total: pick.monthly * i.months,
    };
  });
}

/** "#users=1000&sources=2&months=12&billing=monthly" → inputs. null when the hash is not the calculator's. */
export function parseBillHash(hash) {
  const h = String(hash ?? "").replace(/^#/, "");
  if (!/(^|&)(users|sources|months|billing)=/.test(h)) return null;
  const p = new URLSearchParams(h);
  return clampInputs({ users: p.get("users"), sources: p.get("sources"), months: p.get("months"), billing: p.get("billing") });
}

/** The hash for a state; always carries all four keys so a link reproduces it exactly. */
export function billHash(inputs) {
  const i = clampInputs(inputs);
  return `#users=${i.users}&sources=${i.sources}&months=${i.months}&billing=${i.billing}`;
}

export function money(x, currency) {
  return currency === "EUR" ? eur(x) : usd(x);
}
