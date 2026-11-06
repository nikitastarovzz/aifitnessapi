"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import ShareRow from "@/components/ShareRow";
import {
  DATA_SOURCES,
  EFFORT_NOTE,
  FEATURES,
  PAYERS,
  PLATFORMS,
  PLATFORM_LABELS,
  STATUS_LABELS,
  STORE_LABELS,
  buildPlan,
  decodePlan,
  encodePlan,
  planMarkdown,
  prdMarkdown,
  type PlanAnswers,
  type PlanBundle,
} from "@/lib/plannerLogic.mjs";
import { Chip, CopyLink, Field, Select, btn, btnPrimary, downloadText, toggle, useUrlState } from "./plannerUi";

/**
 * The build-plan generator and PRD template. Answers in, a plan out: the
 * architecture outline as links to the pages that cover each layer, the
 * products from the cost model that fit, the cost shape (how each bills and
 * our labeled effort judgment, never a price), the regimes the compliance
 * wizard would route these answers to, the store checklist items that apply,
 * and the platform edge cases the PRD quotes. All of it comes from the bundle
 * the server page builds and from src/lib/plannerLogic.mjs; this component
 * renders and downloads.
 */

const SOURCE_ORDER = DATA_SOURCES.map((s) => s[0]);
const FEATURE_ORDER = FEATURES.map((f) => f.id);
const YES_NO: [string, string][] = [
  ["yes", "Yes"],
  ["no", "No"],
];

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const h3 = "mt-8 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]";

export default function BuildPlanTool({ bundle, origin, initial, date }: { bundle: PlanBundle; origin: string; initial: PlanAnswers; date: string }) {
  const ids = useMemo(() => bundle.appTypes.map((t) => t.id), [bundle]);
  const decode = useCallback((s: string) => decodePlan(s, ids), [ids]);
  const [a, setA] = useUrlState<PlanAnswers>(initial, decode, encodePlan);
  const [preview, setPreview] = useState<"none" | "spec" | "prd">("none");
  const plan = buildPlan(a, bundle);
  const regimeById = Object.fromEntries(bundle.regimes.map((r) => [r.id, r]));
  const slug = plan.appType.id;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      <Select
        label="What are you building?"
        value={a.type}
        options={bundle.appTypes.map((t) => [t.id, t.label])}
        onChange={(type) => setA({ ...a, type })}
      />
      <Field legend="Platforms">
        {PLATFORMS.map((p) => (
          <Chip key={p} on={a.p.includes(p)} onClick={() => setA({ ...a, p: toggle(a.p, p, PLATFORMS) })}>
            {PLATFORM_LABELS[p]}
          </Chip>
        ))}
      </Field>
      <Field legend="Where the health data comes from">
        {DATA_SOURCES.map(([id, label]) => (
          <Chip key={id} on={a.src.includes(id)} onClick={() => setA({ ...a, src: toggle(a.src, id, SOURCE_ORDER) })}>
            {label}
          </Chip>
        ))}
      </Field>
      <Field legend="Features">
        {FEATURES.map((f) => (
          <Chip key={f.id} on={a.f.includes(f.id)} onClick={() => setA({ ...a, f: toggle(a.f, f.id, FEATURE_ORDER) })}>
            {f.label}
          </Chip>
        ))}
      </Field>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Select label="Who offers or pays for it?" value={a.payer} options={PAYERS} onChange={(payer) => setA({ ...a, payer })} />
        <Select label="Users in the United States?" value={a.us} options={YES_NO} onChange={(us) => setA({ ...a, us })} />
        <Select label="Offered to people in the EU?" value={a.eu} options={YES_NO} onChange={(eu) => setA({ ...a, eu })} />
        <Select
          label="Consumers in Washington State?"
          value={a.wa}
          options={[...YES_NO, ["unsure", "Not sure"]]}
          onChange={(wa) => setA({ ...a, wa })}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--border)] pt-6">
        <button type="button" className={btnPrimary} onClick={() => downloadText(`build-plan-${slug}.md`, planMarkdown(plan, bundle, { origin, date }))}>
          Download the spec (.md)
        </button>
        <button type="button" className={btnPrimary} onClick={() => downloadText(`prd-${slug}.md`, prdMarkdown(plan, bundle, { origin, date }))}>
          Download the PRD template (.md)
        </button>
        <button type="button" className={btn} onClick={() => setPreview(preview === "prd" ? "none" : "prd")} aria-expanded={preview === "prd"}>
          {preview === "prd" ? "Hide PRD preview" : "Preview the PRD"}
        </button>
        <button type="button" className={btn} onClick={() => setPreview(preview === "spec" ? "none" : "spec")} aria-expanded={preview === "spec"}>
          {preview === "spec" ? "Hide spec preview" : "Preview the spec"}
        </button>
        <CopyLink path={plan.links.self} />
      </div>
      <ShareRow place="build-plan" text={`A fitness app build plan: ${plan.appType.label}. Architecture, APIs, compliance and a PRD template:`} label="Share this plan" />
      {preview !== "none" && (
        <pre className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-xs text-[var(--fg)]">
          {preview === "prd" ? prdMarkdown(plan, bundle, { origin, date }) : planMarkdown(plan, bundle, { origin, date })}
        </pre>
      )}

      <div data-plan-type={plan.appType.id}>
        <h3 className="mt-8 text-2xl font-bold tracking-tight text-[var(--fg)]">Build plan: {plan.appType.label}</h3>
        {plan.guide ? (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Build guide:{" "}
            <Link href={plan.guide.href} className={linkCls}>
              {plan.guide.label}
            </Link>
          </p>
        ) : null}
        {plan.notes.map((n) => (
          <p key={n} className="mt-3 rounded-lg border border-amber-400 bg-amber-500/10 p-3 text-sm text-[var(--fg)]">
            {n}
          </p>
        ))}

        <p className={h3}>Architecture outline</p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
          {plan.arch.map((l) => (
            <li key={l.title}>
              <span className="text-[var(--fg)]">{l.title}:</span>{" "}
              {l.links.map((x, i) => (
                <span key={x.href}>
                  {i > 0 ? ", " : ""}
                  <Link href={x.href} className={linkCls}>
                    {x.label}
                  </Link>
                </span>
              ))}
            </li>
          ))}
        </ol>

        {plan.hk.length > 0 && (
          <>
            <p className={h3}>Health data types this app type touches</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                    <th scope="col" className="py-2 pr-4 font-semibold">HealthKit</th>
                    <th scope="col" className="py-2 pr-4 font-semibold">Aggregate with</th>
                    <th scope="col" className="py-2 font-semibold">Health Connect</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.hk.map((r) => (
                    <tr key={r.name} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-4 font-mono text-xs text-[var(--fg)]">{r.name}</td>
                      <td className="py-2 pr-4 text-[var(--muted)]">{r.aggregation ?? "not stated by Apple"}</td>
                      <td className="py-2 font-mono text-xs text-[var(--muted)]">{r.android ?? "no verified pair"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className={h3}>Products that fit ({plan.apis.length})</p>
        {plan.apis.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">No products match these answers.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th scope="col" className="py-2 pr-3 font-semibold">Product</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">How it bills you</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Approval gate</th>
                  <th scope="col" className="py-2 font-semibold">Effort (our judgment)</th>
                </tr>
              </thead>
              <tbody>
                {plan.apis.map((x) => (
                  <tr key={x.id} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-3">
                      <Link href={x.sourceHref} className={linkCls}>
                        {x.label}
                      </Link>
                      <span className="block text-xs text-[var(--muted)]">
                        {x.categoryLabel}
                        {x.inGuide ? " · in the build guide" : ""}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-[var(--muted)]">{x.devCostLabel}</td>
                    <td className="py-2 pr-3 text-[var(--muted)]">{x.approvalGate ?? "None recorded"}</td>
                    <td className="py-2 text-[var(--muted)]">{x.engEffort}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {plan.showsFunder && (
          <p className="mt-3 rounded-lg border border-[var(--border)] p-3 text-xs text-[var(--muted)]" data-plan-disclosure>
            <strong className="text-[var(--fg)]">Disclosure:</strong> KinesteX, one of the motion SDKs listed, makes the product that funds this site. It is listed
            because the plan includes camera motion tracking, not ranked, and the other options are listed beside it.
          </p>
        )}

        <p className={h3}>Cost shape</p>
        {plan.apis.length ? (
          <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
            {plan.cost.byDevCost.map((g) => (
              <li key={g.key}>
                <span className="text-[var(--fg)]">{bundle.devCostLabels[g.key]}:</span> {g.items.map((x) => x.label).join(", ")}
              </li>
            ))}
            {plan.cost.effortRange && (
              <li>
                <span className="text-[var(--fg)]">Integration effort per product:</span> from {plan.cost.effortRange[0]} to {plan.cost.effortRange[1]}. {EFFORT_NOTE}
              </li>
            )}
            <li>
              No prices, on purpose: the{" "}
              <Link href="/cost-planner" className={linkCls}>
                cost model
              </Link>{" "}
              records how each product bills, not what it charges today.
            </li>
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">No products in the plan, so no cost shape.</p>
        )}

        <p className={h3}>Compliance: what likely applies</p>
        <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
          {plan.compliance.map((f) => {
            const g = regimeById[f.id];
            if (!g) return null;
            return (
              <li key={f.id}>
                <Link href={g.page} className={linkCls}>
                  {g.name}
                </Link>
                : <span className="text-[var(--fg)]">{STATUS_LABELS[f.status]}.</span> {f.reason}
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-sm">
          <Link href={plan.links.wizard} className={linkCls}>
            Open these answers in the compliance wizard, with each rule quoted →
          </Link>
        </p>

        <p className={h3}>Store submission</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {plan.storeItems.length} checklist items apply ({plan.stores.map((s) => STORE_LABELS[s]).join(" and ") || "no store chosen"}).{" "}
          <Link href={plan.links.checklist} className={linkCls}>
            Open them in the store submission checklist →
          </Link>
        </p>

        {plan.edgeCases.length > 0 && (
          <>
            <p className={h3}>Edge cases the platforms document</p>
            <ul className="mt-2 space-y-3 text-sm">
              {plan.edgeCases.map((e) => (
                <li key={e.id}>
                  <Link href={e.page} className={linkCls}>
                    {e.title}
                  </Link>
                  <blockquote className="mt-1 border-l-2 border-brand-400 pl-3 text-[var(--muted)]">
                    {e.quote}{" "}
                    <a href={bundle.sources[e.source].url} rel="noopener" className="text-xs font-medium text-brand-600 hover:text-brand-500">
                      ({bundle.sources[e.source].publisher})
                    </a>
                  </blockquote>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
