import Link from "next/link";

/**
 * The standard end-of-article exit. Identical on every spoke on purpose — a
 * reader who has learned where it is should find it in the same place on the
 * next page — and it points at the three things reading is supposed to lead
 * to: a decision, a budget, and knowing when the ground moves.
 */
const STEPS: { href: string; label: string; blurb: string }[] = [
  {
    href: "/picker",
    label: "Narrow it to your stack",
    blurb: "Three questions, then a recommendation you can argue with.",
  },
  {
    href: "/cost-planner",
    label: "Price the decision",
    blurb: "Billing models, user-side costs and the effort nobody quotes.",
  },
  {
    href: "/signup",
    label: "Get what changes",
    blurb: "Deprecations and deadlines that affect what you just read.",
  },
];

export default function NextSteps() {
  return (
    <section aria-labelledby="next-steps" className="defer-paint not-prose mt-14">
      <h2
        id="next-steps"
        className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]"
      >
        Next steps
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="flex h-full flex-col rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              <span className="text-sm font-semibold text-[var(--fg)]">{s.label}</span>
              <span className="mt-1 text-xs text-[var(--muted)]">{s.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
