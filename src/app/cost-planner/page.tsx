import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import CostPlanner from "@/components/CostPlanner";
import ClusterCta from "@/components/ClusterCta";
import { Mdx } from "@/components/mdx";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

const PLANNER_PATH = "/cost-planner";
const UPDATED = "2026-08-11";

export const metadata: Metadata = {
  title: { absolute: "Fitness API Cost Planner: What Your Stack Really Costs" },
  description:
    "Pick your fitness API stack and get the cost structure: what is free, what meters, what needs a quote, what your users pay, and where the eng time goes.",
  alternates: { canonical: PLANNER_PATH },
  openGraph: {
    type: "website",
    title: "Fitness API Cost Planner",
    description:
      "The cost structure of your fitness API stack — billing models, user-side costs, approval gates, and engineering effort. No stale prices, on purpose.",
    url: PLANNER_PATH,
    images: ["/opengraph-image"],
  },
};

const ANSWER =
  "This planner returns the cost structure of a fitness API stack rather than a dollar total. Tick the wearables, aggregators, content APIs, motion SDKs, and models you expect to use, and it reports how each vendor bills you (free, free tier, usage-based, or contact-sales), what each of your end users has to own or pay for before their data can flow, which approvals gate your launch, and roughly where the engineering time goes. It publishes no prices on purpose: most serious tiers in this category are contact-sales, public figures move, and a stale number is worse than no number. Verify every figure with the vendor before you budget.";

const FAQS = [
  {
    q: "Why does this cost planner refuse to show prices?",
    a: "Because a number we could show you would probably be wrong by the time you read it. In this category the serious tiers are mostly contact-sales — Garmin settles terms privately with approved partners, aggregator per-user rates are rarely listed, and motion SDK pricing sits behind a form — so any dollar figure would be a third-party report rather than a vendor-published fact. The figures that are public change: Strava's developer terms shifted in 2026, Fitbit is migrating to the Google Health API, and marketplace quotas change without notice. What does not change month to month is the structure: who bills whom, what meters, what gates you. That is what the planner models, and it is the part you can actually design against.",
  },
  {
    q: "How reliable is the engineering-effort estimate in this planner?",
    a: "Treat it as our rough judgement, which is exactly how the tool labels it. Every other field in the output is backed by a sentence published on this site and links to the page it came from; the effort tally is not, because no vendor publishes it and nobody could. It is a coarse three-band read — low is roughly days, medium roughly weeks, high roughly months — covering integration plus first-year maintenance, and it assumes an engineer who has not built this before. A team that already runs OAuth token refresh at scale will find the wearable items cheaper than the tally suggests. A team building its first pose pipeline will find the high band optimistic.",
  },
  {
    q: "Does using an aggregator remove the approval gates?",
    a: "It removes most of them, not all. The point of an aggregator is that it brokers provider auth for you, so you skip the per-vendor partner reviews and connected-user caps you would otherwise clear one at a time. What survives is anything tied to your own app rather than to the data source: if you ship on iOS you still face App Store review of your health usage strings, and on Android the Play Console still enforces a health-data declaration before launch. Some aggregators also still ask you to bring your own developer credentials for particular underlying providers. The planner keeps those rows visible when you pick an aggregator alongside a platform store, which is usually the honest picture of a real stack.",
  },
  {
    q: "Which parts of a fitness stack will need a sales call?",
    a: "As a rule: anything where the vendor's value is a negotiated relationship rather than a metered endpoint. On the pages we source, that means Garmin among the first-party wearable APIs, Spike among the aggregators, the enterprise top tiers of the commercial nutrition APIs, and most of the AI coaching SDKs including KinesteX, this site's own product. The planner collects those into a separate checklist so you can start them early, because a quote has lead time the way an approval does. The counter-examples worth knowing: Polar's client registration is self-serve, QuickPose publishes a self-serve free tier, and the pose models themselves need no conversation with anyone.",
  },
];

const PROSE = `
## What this is

A planner for the cost of a fitness API stack that deliberately returns no total.

Tick what you expect to integrate — wearable APIs, an aggregator or two, the platform health stores, nutrition and exercise content, a motion SDK, a pose model, an LLM feature — and the tool reports four things back. How each vendor bills you. What each of your end users has to own or pay for before their data can even exist. Which approvals stand between your code and your launch. And roughly where the engineering time goes.

What it will not do is add those up into a monthly figure, because the honest version of that figure does not exist.

## Why there are no numbers here

This is the part most cost calculators get wrong, so it is worth being direct about it.

Most of the money in this category is not visible from outside. Garmin does not publish pricing for its developer APIs at all; access runs through a partner program and the commercial terms are settled privately, which means you cannot see them until you are far enough into the process to be quoted. Aggregator per-user rates are almost never listed publicly. Motion SDK pricing routes through a contact form. When roughly half of a market is contact-sales, a calculator that produces a total is producing fiction for half its inputs.

The figures that *are* public do not hold still either. Strava's developer access terms reportedly changed during 2026 and the membership figure involved is US-specific and varies by country. Fitbit is mid-migration to the Google Health API and the successor's pricing model is not clearly public yet. RapidAPI marketplace quotas and prices change without notice. Nutritionix reportedly curtailed its open free tier. A number captured today and rendered into a page is a liability with a shelf life.

So the planner models the layer underneath the numbers, which turns out to be the layer you actually make decisions on. Whether a vendor meters you or quotes you. Whether your addressable market is capped by who already owns a subscription. Whether launch waits on someone else's review queue. Those facts survive a repricing.

There is a second reason, and it is the more useful one: for a lot of teams the API fee is the smallest line in the budget. The costs that bite are your users' device and membership dependencies, the calendar time spent in approval queues, the maintenance every time a provider changes its terms, and your own infrastructure for storing and re-syncing high-volume history. None of those appear on a price list. All of them appear in this planner.

## How to read the output

The output comes back in five blocks. Each does a different job.

**How each one bills you.** One row per item you picked, with a badge for the shape of the bill. *Free* means no fee is documented for calling it — not that it is free to ship. *Free tier* means a real free entry point that runs out, and the interesting question is what happens at the boundary. *Usage-based* means the bill scales with connected users, events, or tokens, so your job is to model the growth curve rather than the unit price. *Contact sales* means there is no public price and you will be quoting a relationship, not a plan. Every row links the page on this site that sources its cost model, so you can check our work rather than take it.

**Your users pay.** Items where the data only exists if your end user owns the hardware and, increasingly, holds a subscription. These cost you nothing directly, which is precisely why they get missed. Read this block as a market-size constraint: if your product depends on WHOOP data, every prospective user is already paying WHOOP. That is a ceiling on who can connect, and it belongs in a business case, not a cost sheet.

**Approval gates and lead time.** Calendar time is a real cost at a fee of zero. A partner review, a connected-user cap that only lifts after someone reads your submission, a store-level health-data declaration — each of these is a dependency with a queue in front of it. The list exists so you start them before you need them rather than after.

**Engineering effort.** The one block that is judgement rather than sourced fact, and the tool says so on the panel. It bands each item as low, medium, or high, meaning roughly days, weeks, or months of integration plus first-year maintenance. The team profile toggle changes only the framing — a high-effort item reads differently when you are the entire engineering team than when you have someone to assign it to — and never the underlying band. It is a sanity check on scope, not an estimate you should put in a plan.

**Get real quotes.** The contact-sales items, collected into a checklist, each linking the page that explains what the vendor's model actually is. Read that before the call. The difference between asking "what does it cost" and asking "is that priced per connected user or per event, and what happens to the credit allowance at high sync frequency" is usually the difference between one call and three.

## What the planner does not model

It does not price your own infrastructure, and for wearable data at scale that is a genuine line item — continuous high-volume history, token refresh, webhook handling, monitoring. It does not price compliance work, which health data carries regardless of what the API costs. It does not price the licence obligations attached to the free and open options, where the cost arrives as legal review or an architecture constraint rather than an invoice. And it makes no attempt to guess your volumes, because a usage-based bill without your growth curve is not a number, it is a shape.

Use it to find the questions worth asking. Then go ask the vendors.
`;

export default function CostPlannerPage() {
  const url = absoluteUrl(PLANNER_PATH);

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fitness API Cost Planner",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: metadata.description,
    url,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: orgRef(),
    datePublished: UPDATED,
    dateModified: UPDATED,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Cost Planner", path: PLANNER_PATH }]} />

        <ClusterHero label="Interactive Tool" seed={9} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitness API Cost Planner
        </h1>

        {/* Answer-first capsule — quotable, speakable. */}
        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </div>

        <div className="mt-8">
          <CostPlanner />
        </div>

        <div className="prose prose-neutral mt-14 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <Mdx source={PROSE} />
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

        <ClusterCta
          pitch="Vendors reprice; the structure doesn't. We track the pricing-model changes, approval-gate shifts, and deprecations that would change this plan — get the update when one moves."
          source="pillar-inline"
          id="cta-cost-planner"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Cost models sourced from our own verified pages —{" "}
          <Link href="/pricing" className="text-brand-600 hover:text-brand-500">
            start at the pricing overview
          </Link>{" "}
          to check the work.
        </p>
      </div>
    </Container>
  );
}
