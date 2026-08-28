import Link from "next/link";

/**
 * A pointer from a guide to the generated reference that backs it.
 *
 * Explicit map, not a keyword heuristic. Matching on "HealthKit" appearing in
 * a body would attach this to the forty-odd pages that mention it in passing,
 * which is how a useful cross-link becomes boilerplate. These are the pages
 * where a reader is actively debugging and the reference is the next thing
 * they need.
 *
 * /healthkit-errors already links into these fix pages; this closes the loop
 * the other way.
 */
const MAP: Record<string, { href: string; label: string; why: string }[]> = {
  "/fix/healthkit-no-data": [
    {
      href: "/healthkit-errors",
      label: "Every HealthKit error code",
      why: "A denied read raises no error at all — the full set explains what HealthKit does and does not report.",
    },
  ],
  "/fix/healthkit-authorization-denied": [
    {
      href: "/healthkit-errors",
      label: "Every HealthKit error code",
      why: "errorAuthorizationDenied fires only on writes. The reference has Apple's wording and the other sixteen cases.",
    },
  ],
  "/fix/healthkit-background-delivery-not-working": [
    {
      href: "/healthkit-errors",
      label: "Every HealthKit error code",
      why: "Rule out an error you are not catching before assuming a delivery problem.",
    },
  ],
  "/integrate/healthkit": [
    {
      href: "/healthkit-identifiers",
      label: "Every HealthKit type identifier",
      why: "All 240 identifiers with units, availability, and whether each is summed or averaged.",
    },
    {
      href: "/healthkit-errors",
      label: "Every HealthKit error code",
      why: "What each failure means, read from Apple's documentation.",
    },
  ],
};

export default function ReferenceCallout({ path }: { path: string }) {
  const refs = MAP[path];
  if (!refs) return null;

  return (
    <aside data-reference-callout className="mt-12 rounded-xl border border-brand-400/30 bg-brand-500/5 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        Generated reference
      </h2>
      <ul className="mt-3 space-y-2">
        {refs.map((r) => (
          <li key={r.href} className="text-sm">
            <Link href={r.href} className="font-semibold text-brand-600 hover:text-brand-500">
              {r.label}
            </Link>
            <span className="text-[var(--muted)]"> — {r.why}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** Paths this component covers, for the qa gate. */
export const REFERENCE_CALLOUT_PATHS = Object.keys(MAP);
