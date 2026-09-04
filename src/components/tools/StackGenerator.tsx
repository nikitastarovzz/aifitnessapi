"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

/**
 * The stack generator — four answers in, one concrete stack out.
 *
 * /build/<slug> tells you what to build and AppStack shows the types that
 * category touches, but both assume the general case: every platform, every
 * wearable need, every team. This narrows that same data with the four
 * constraints that actually remove options, and — this is the point — it says
 * WHY each product survived or did not, using only fields that already exist
 * in the directory model: how it bills developers, what the end user must
 * own, what approval gates the launch, and our published rough judgement of
 * integration effort.
 *
 * Two rules it will not break:
 *
 *  - Nothing is ranked by anything that is not in the data. The ordering key
 *    is printed on screen so a reader can disagree with it, and the only
 *    judgement in it (`engEffort`) is labelled as ours everywhere it appears.
 *  - When the answers exclude everything, it says so. An empty result is a
 *    real answer — "no product in this category survives what you told me" —
 *    and inventing a consolation pick would be the dishonest branch.
 *
 * All of it is composed by the server page from the identifier dataset, the
 * verified platform matrix and the cost model; this component chooses and
 * explains, it does not know any facts of its own.
 */

export type HkRow = {
  name: string;
  abstract: string;
  aggregation: "cumulative" | "discrete" | null;
  family: string;
  valueEnum: string | null;
  /** Health Connect name, only where /matrix verified it on both platforms. */
  android: string | null;
};

export type ApiPick = {
  id: string;
  label: string;
  short: string;
  /** Raw cost-model category key, used for filtering. */
  category: string;
  categoryLabel: string;
  /** Raw devCost key, used for ordering. */
  devCost: string;
  devCostLabel: string;
  userSideCost: string | null;
  approvalGate: string | null;
  engEffort: "low" | "medium" | "high";
  notes: string;
  sourceHref: string;
  /** The roundup page for this product's category, where one is released. */
  roundup: { href: string; label: string } | null;
};

export type CategoryOption = {
  slug: string;
  label: string;
  guideHref: string;
  guideTitle: string;
  hk: HkRow[];
  apiIds: string[];
};

export type Platform = "ios" | "android" | "both" | "web";
export type Wearables = "none" | "platform-store" | "one-brand" | "many-brands";
export type Constraint = "ship-fast" | "control";

const PLATFORM_OPTIONS: { value: Platform; label: string; hint: string }[] = [
  { value: "ios", label: "iOS only", hint: "One client, Apple platforms" },
  { value: "android", label: "Android only", hint: "One client, Android" },
  { value: "both", label: "iOS and Android", hint: "Both stores, both health stores" },
  { value: "web", label: "Web / backend only", hint: "No phone client of your own" },
];

const WEARABLE_OPTIONS: { value: Wearables; label: string; hint: string }[] = [
  { value: "none", label: "None", hint: "Nothing comes from a wearable" },
  { value: "platform-store", label: "Platform store only", hint: "Whatever Apple Health or Health Connect already holds" },
  { value: "one-brand", label: "One brand", hint: "You integrate a single vendor directly" },
  { value: "many-brands", label: "Many brands", hint: "Your users are on whatever they already own" },
];

const CONSTRAINT_OPTIONS: { value: Constraint; label: string; hint: string }[] = [
  { value: "ship-fast", label: "Fastest to ship", hint: "Least integration work, soonest launch" },
  { value: "control", label: "Most control", hint: "Fewest gatekeepers between you and the data" },
];

/** Published effort wording — the same labels the comparison tool uses. */
const EFFORT_LABEL: Record<ApiPick["engEffort"], string> = {
  low: "Low — days",
  medium: "Medium — weeks",
  high: "High — months",
};

const EFFORT_RANK: Record<ApiPick["engEffort"], number> = { low: 0, medium: 1, high: 2 };

/** Ordering key for "most control": how much of the product's terms you can
 *  read and act on without asking anyone. Every value is a devCost from the
 *  cost model; the ordering itself is stated on screen. */
const DEV_COST_RANK: Record<string, number> = {
  free: 0,
  "free-tier-then-paid": 1,
  "usage-based": 2,
  "contact-sales": 3,
};

/**
 * The two platform stores are the only products in the directory whose reach
 * is bounded by the platform, and both say so in their own `notes` — which is
 * why each exclusion below prints that note as its evidence.
 */
const PLATFORM_BOUND: Record<string, "ios" | "android"> = {
  healthkit: "ios",
  "health-connect": "android",
  "apple-vision": "ios",
};

type Kept = { api: ApiPick; facts: string[] };
type Dropped = { api: ApiPick; reason: string };

function platformExclusion(api: ApiPick, platform: Platform): string | null {
  const bound = PLATFORM_BOUND[api.id];
  if (!bound) return null;
  if (platform === "web") {
    return "you are building web and backend only. This is an on-device store — there is no server-to-server pull to point a backend at.";
  }
  if (platform === "ios" && bound === "android") {
    return "you picked iOS only, and this store exists only on Android.";
  }
  if (platform === "android" && bound === "ios") {
    return "you picked Android only, and this store exists only on the Apple platforms.";
  }
  return null;
}

function wearableExclusion(api: ApiPick, wearables: Wearables, aggregatorsKept: number): string | null {
  const cloud = api.category === "wearable-direct" || api.category === "aggregator";
  if (cloud && wearables === "none") {
    return "you said no wearable data, and this product exists to move wearable data.";
  }
  if (cloud && wearables === "platform-store") {
    return "you said platform store only. This reads from a vendor cloud, not from the health store on the phone.";
  }
  if (api.category === "aggregator" && wearables === "one-brand") {
    return "you need one brand. An aggregator is built and billed for breadth across many.";
  }
  if (api.category === "wearable-direct" && wearables === "many-brands" && aggregatorsKept > 0) {
    return `you need many brands, and this category lists an aggregator that covers them in one integration. Going direct adds this product's own terms — ${
      api.approvalGate ?? "no approval gate documented"
    }`;
  }
  return null;
}

function effortExclusion(api: ApiPick, constraint: Constraint): string | null {
  if (constraint === "ship-fast" && api.engEffort === "high") {
    return "you picked fastest to ship, and our rough judgement of the integration work here is high — months, not weeks.";
  }
  return null;
}

function factsFor(api: ApiPick): string[] {
  return [
    `Bills developers: ${api.devCostLabel}.`,
    api.approvalGate
      ? `Has an approval gate: ${api.approvalGate}`
      : "No approval gate documented — which is not the same as there not being one.",
    api.userSideCost
      ? `Every end user: ${api.userSideCost}`
      : "Nothing documented that each end user has to own or pay for.",
    `Integration effort: ${EFFORT_LABEL[api.engEffort]} (our rough judgement, not a vendor fact).`,
  ];
}

type Composed = {
  kept: Kept[];
  dropped: Dropped[];
  orderNote: string;
  /** Said out loud when the answers leave a shape worth warning about. */
  advisory: string | null;
  roundups: { href: string; label: string }[];
};

function compose(
  category: CategoryOption,
  apis: Record<string, ApiPick>,
  platform: Platform,
  wearables: Wearables,
  constraint: Constraint,
): Composed {
  const all = category.apiIds
    .map((id) => apis[id])
    .filter((a): a is ApiPick => Boolean(a));

  // The many-brands rule depends on whether an aggregator actually survives
  // the other answers, so count those first. No wearable rule can exclude an
  // aggregator under "many brands", which is exactly what it is for — only
  // the platform and effort answers can.
  const aggregatorsKept =
    wearables === "many-brands"
      ? all.filter(
          (a) =>
            a.category === "aggregator" &&
            !platformExclusion(a, platform) &&
            !effortExclusion(a, constraint),
        ).length
      : 0;

  const kept: Kept[] = [];
  const dropped: Dropped[] = [];
  for (const api of all) {
    const reason =
      platformExclusion(api, platform) ??
      wearableExclusion(api, wearables, aggregatorsKept) ??
      effortExclusion(api, constraint);
    if (reason) dropped.push({ api, reason });
    else kept.push({ api, facts: factsFor(api) });
  }

  const gate = (k: Kept) => (k.api.approvalGate ? 1 : 0);
  const cost = (k: Kept) => DEV_COST_RANK[k.api.devCost] ?? 9;
  const effort = (k: Kept) => EFFORT_RANK[k.api.engEffort];
  if (constraint === "ship-fast") {
    kept.sort((x, y) => effort(x) - effort(y) || gate(x) - gate(y) || cost(x) - cost(y));
  } else {
    kept.sort((x, y) => gate(x) - gate(y) || cost(x) - cost(y) || effort(x) - effort(y));
  }

  const orderNote =
    constraint === "ship-fast"
      ? "Ordered by integration effort (our rough judgement) lowest first, then by whether an approval gate is documented, then by how it bills developers."
      : "Ordered by whether an approval gate is documented (none first), then by how it bills developers — free, free tier, usage-based, contact sales — then by integration effort.";

  const roundups: { href: string; label: string }[] = [];
  for (const k of kept) {
    if (k.api.roundup && !roundups.some((r) => r.href === k.api.roundup!.href)) {
      roundups.push(k.api.roundup);
    }
  }

  const advisory =
    wearables === "many-brands" && aggregatorsKept === 0
      ? "This category lists no aggregator, so \u201cmany brands\u201d here means one direct integration per brand — each with its own approval gate and its own user-side requirement, both shown on every card below."
      : null;

  return { kept, dropped, orderNote, advisory, roundups };
}

function hkNote(platform: Platform): string {
  if (platform === "ios") {
    return "You picked iOS only, so the HealthKit column is the one that applies. The Health Connect names are shown anyway, for the day the Android client happens.";
  }
  if (platform === "android") {
    return "You picked Android only, so HealthKit is not reachable — read the Health Connect column. It is filled only where the type is verified on both platforms; blank means we have not verified an equivalent, not that none exists.";
  }
  if (platform === "web") {
    return "You picked web and backend only. Neither of these stores is reachable from a server: both are on-device SDKs. The table is what a phone client would have to read or write on your behalf.";
  }
  return "You are shipping both clients, so both columns apply — and the two stores disagree often enough that the Android column is worth reading before you design the schema.";
}

function aggregationText(row: HkRow): string {
  if (row.aggregation === "cumulative") return ".cumulativeSum";
  if (row.aggregation === "discrete") return ".discreteAverage";
  if (row.family === "category") return `category — ${row.valueEnum ?? "enum value"}`;
  return "not stated";
}

function buildMarkdown(
  origin: string,
  category: CategoryOption,
  platform: Platform,
  wearables: Wearables,
  constraint: Constraint,
  result: Composed,
): string {
  const answer = (label: string, value: string) => `- ${label}: ${value}`;
  const platformLabel = PLATFORM_OPTIONS.find((o) => o.value === platform)?.label ?? platform;
  const wearableLabel = WEARABLE_OPTIONS.find((o) => o.value === wearables)?.label ?? wearables;
  const constraintLabel = CONSTRAINT_OPTIONS.find((o) => o.value === constraint)?.label ?? constraint;

  const lines: string[] = [];
  lines.push(`# Stack for a ${category.label.toLowerCase()}`);
  lines.push("");
  lines.push(`Generated at ${origin}/tools/stack-generator from these answers:`);
  lines.push("");
  lines.push(answer("App category", category.label));
  lines.push(answer("Platforms", platformLabel));
  lines.push(answer("Wearable data", wearableLabel));
  lines.push(answer("Team constraint", constraintLabel));
  lines.push("");
  lines.push("## Health data types");
  lines.push("");
  lines.push("| Apple HealthKit | Aggregate with | Android Health Connect |");
  lines.push("| --- | --- | --- |");
  for (const row of category.hk) {
    lines.push(
      `| \`${row.name}\` | ${aggregationText(row)} | ${row.android ?? "not verified on both platforms"} |`,
    );
  }
  lines.push("");
  lines.push("## APIs that survive these answers");
  lines.push("");
  if (result.kept.length === 0) {
    lines.push("None. Every product this category lists was excluded by the answers above — see the list below.");
  } else {
    lines.push(`_${result.orderNote}_`);
    lines.push("");
    for (const k of result.kept) {
      lines.push(`### ${k.api.label} (${k.api.categoryLabel})`);
      for (const f of k.facts) lines.push(`- ${f}`);
      lines.push(`- Directory page: ${origin}/apis/${k.api.id}`);
      lines.push("");
    }
  }
  if (result.dropped.length > 0) {
    lines.push("## Excluded by these answers");
    lines.push("");
    for (const d of result.dropped) lines.push(`- **${d.api.label}** — ${d.reason}`);
    lines.push("");
  }
  lines.push("## Read next");
  lines.push("");
  lines.push(`- Build guide: ${origin}${category.guideHref}`);
  for (const r of result.roundups) lines.push(`- ${r.label}: ${origin}${r.href}`);
  lines.push(`- Permission strings: ${origin}/tools/permission-builder`);
  lines.push(`- Every HealthKit type identifier: ${origin}/healthkit-identifiers`);
  lines.push("");
  lines.push(
    "Every field above is copied from the same provenance-tracked model the rest of the site uses. Integration effort is this site's rough judgement and is labelled as such; nothing here is ranked by anything outside that data.",
  );
  return lines.join("\n");
}

const QUESTIONS = [
  "What are you building?",
  "Which platforms ship?",
  "How much wearable data do you need?",
  "What is the team constraint?",
] as const;

export default function StackGenerator({
  categories,
  apis,
  origin,
  hkFetchedOn,
}: {
  categories: CategoryOption[];
  apis: Record<string, ApiPick>;
  origin: string;
  hkFetchedOn: string;
}) {
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [wearables, setWearables] = useState<Wearables | null>(null);
  const [constraint, setConstraint] = useState<Constraint | null>(null);
  const [copied, setCopied] = useState<"idle" | "done" | "manual">("idle");
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const category = categories.find((c) => c.slug === slug) ?? null;

  const result = useMemo(
    () =>
      category && platform && wearables && constraint
        ? compose(category, apis, platform, wearables, constraint)
        : null,
    [category, apis, platform, wearables, constraint],
  );

  const markdown =
    category && platform && wearables && constraint && result
      ? buildMarkdown(origin, category, platform, wearables, constraint, result)
      : "";

  function reset() {
    setStep(0);
    setSlug(null);
    setPlatform(null);
    setWearables(null);
    setConstraint(null);
    setCopied("idle");
  }

  function copyMarkdown() {
    const el = markdownRef.current;
    if (!el) return;
    el.focus();
    el.select();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(el.value)
        .then(() => setCopied("done"))
        .catch(() => setCopied("manual"));
      return;
    }
    setCopied("manual");
  }

  const choice = (
    key: string,
    label: string,
    hint: string,
    selected: boolean,
    onPick: () => void,
  ) => (
    <button
      key={key}
      type="button"
      onClick={onPick}
      aria-pressed={selected}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        selected
          ? "border-brand-400 bg-brand-500/10"
          : "border-[var(--border)] hover:border-brand-400 hover:bg-[var(--bg)]"
      }`}
    >
      <span className="block text-sm font-semibold text-[var(--fg)]">{label}</span>
      <span className="mt-0.5 block text-xs text-[var(--muted)]">{hint}</span>
    </button>
  );

  return (
    <section
      data-tool="stack-generator"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7"
    >
      {!result && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Question {step + 1} of 4
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--fg)]">
            {QUESTIONS[step]}
          </h2>

          {step === 0 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {categories.map((c) =>
                choice(
                  c.slug,
                  c.label,
                  `${c.hk.length} health types · ${c.apiIds.length} APIs listed`,
                  slug === c.slug,
                  () => {
                    setSlug(c.slug);
                    setStep(1);
                  },
                ),
              )}
            </div>
          )}

          {step === 1 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {PLATFORM_OPTIONS.map((o) =>
                choice(o.value, o.label, o.hint, platform === o.value, () => {
                  setPlatform(o.value);
                  setStep(2);
                }),
              )}
            </div>
          )}

          {step === 2 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {WEARABLE_OPTIONS.map((o) =>
                choice(o.value, o.label, o.hint, wearables === o.value, () => {
                  setWearables(o.value);
                  setStep(3);
                }),
              )}
            </div>
          )}

          {step === 3 && (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {CONSTRAINT_OPTIONS.map((o) =>
                choice(o.value, o.label, o.hint, constraint === o.value, () => setConstraint(o.value)),
              )}
            </div>
          )}

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="mt-5 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
            >
              ← Back
            </button>
          )}
        </>
      )}

      {result && category && platform && wearables && constraint && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            Your stack
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)]">
            {category.label} · {PLATFORM_OPTIONS.find((o) => o.value === platform)?.label}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Wearable data: {WEARABLE_OPTIONS.find((o) => o.value === wearables)?.label.toLowerCase()} ·
            Constraint: {CONSTRAINT_OPTIONS.find((o) => o.value === constraint)?.label.toLowerCase()}
          </p>

          <h3 className="mt-7 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Health data types you will touch
          </h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{hkNote(platform)}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-4 font-semibold">Apple HealthKit</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">Aggregate with</th>
                  <th scope="col" className="py-2 font-semibold">Android Health Connect</th>
                </tr>
              </thead>
              <tbody>
                {category.hk.map((row) => (
                  <tr key={row.name} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4">
                      <Link
                        href={`/healthkit-identifiers#id-${row.name.toLowerCase()}`}
                        className="font-mono text-[13px] font-semibold text-brand-600 hover:text-brand-500"
                      >
                        {row.name}
                      </Link>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">{row.abstract}</span>
                    </td>
                    <td className="py-2 pr-4 text-[var(--muted)]">
                      {row.aggregation || row.family === "category" ? (
                        <code className="font-mono text-xs">{aggregationText(row)}</code>
                      ) : (
                        <span className="text-xs">not stated</span>
                      )}
                    </td>
                    <td className="py-2 text-[var(--muted)]">
                      {row.android ? (
                        <span className="font-mono text-[12px]">{row.android}</span>
                      ) : (
                        <span className="text-xs">not verified on both platforms</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            APIs that survive your answers
          </h3>
          {result.kept.length === 0 ? (
            <p className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--fg)]">
              Nothing. Every product this category lists was excluded by what you told me, and the
              honest answer is to say so rather than offer a consolation pick. The exclusions are
              listed below — loosen whichever one you can live with, or build that layer yourself.
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-[var(--muted)]">{result.orderNote}</p>
              {result.advisory && (
                <p className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--fg)]">
                  {result.advisory}
                </p>
              )}
              <ul className="mt-3 space-y-3">
                {result.kept.map(({ api, facts }) => (
                  <li
                    key={api.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link
                        href={`/apis/${api.id}`}
                        className="text-sm font-semibold text-[var(--fg)] hover:text-brand-600"
                      >
                        {api.label}
                      </Link>
                      <span className="text-xs uppercase tracking-wide text-[var(--muted)]">
                        {api.categoryLabel}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                      {facts.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {api.notes}{" "}
                      <Link href={api.sourceHref} className="text-brand-600 hover:text-brand-500">
                        Where this came from
                      </Link>
                      .
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {result.dropped.length > 0 && (
            <>
              <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                Excluded, and why
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
                {result.dropped.map(({ api, reason }) => (
                  <li key={api.id}>
                    <Link href={`/apis/${api.id}`} className="font-semibold text-[var(--fg)] hover:text-brand-600">
                      {api.label}
                    </Link>{" "}
                    — {reason}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Read next
          </h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            <li>
              <Link
                href={category.guideHref}
                className="flex h-full items-center rounded-xl border border-brand-400 bg-brand-500/10 p-3 text-sm font-medium text-[var(--fg)] hover:bg-brand-500/20"
              >
                {category.guideTitle}
              </Link>
            </li>
            {result.roundups.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="flex h-full items-center rounded-xl border border-[var(--border)] p-3 text-sm font-medium text-[var(--fg)] hover:border-brand-400"
                >
                  {r.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tools/permission-builder"
                className="flex h-full items-center rounded-xl border border-[var(--border)] p-3 text-sm font-medium text-[var(--fg)] hover:border-brand-400"
              >
                Write the permission strings for these types
              </Link>
            </li>
            <li>
              <Link
                href="/healthkit-identifiers"
                className="flex h-full items-center rounded-xl border border-[var(--border)] p-3 text-sm font-medium text-[var(--fg)] hover:border-brand-400"
              >
                Every HealthKit type identifier
              </Link>
            </li>
          </ul>

          <h3 className="mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Copy this stack as markdown
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Paste it into the ticket, the README or the design doc. Every line is data from this
            site, with the reason attached.
          </p>
          <textarea
            ref={markdownRef}
            readOnly
            value={markdown}
            rows={10}
            aria-label="This stack as markdown"
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--fg)] focus:border-brand-400 focus:outline-none"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyMarkdown}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400"
            >
              {copied === "done"
                ? "Markdown copied"
                : copied === "manual"
                  ? "Selected — press Cmd/Ctrl-C"
                  : "Copy this stack as markdown"}
            </button>
            <button
              type="button"
              onClick={() => {
                setConstraint(null);
                setStep(3);
                setCopied("idle");
              }}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
            >
              Change an answer
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg)]"
            >
              ↺ Start over
            </button>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
            Types read from Apple&rsquo;s documentation on {hkFetchedOn}; Android names shown only
            where{" "}
            <Link href="/matrix" className="text-brand-600 hover:text-brand-500">
              verified on both platforms
            </Link>
            . Every API field comes from the same provenance-tracked model behind{" "}
            <Link href="/apis" className="text-brand-600 hover:text-brand-500">
              the directory
            </Link>{" "}
            and{" "}
            <Link href="/compare-apis" className="text-brand-600 hover:text-brand-500">
              the comparison tool
            </Link>
            . There is no score here: products are filtered and ordered by those fields and nothing
            else, and &ldquo;none documented&rdquo; means we did not find one.
          </p>
        </>
      )}
    </section>
  );
}
