import { probeVendorStatus, statusEndpoints } from "@/lib/vendorStatusProbe";
import { answerLabel, REVALIDATE_SECONDS, TIMEOUT_MS } from "@/lib/vendorStatus.mjs";

/**
 * "Are vendor APIs up?" on /alerts: the answers to one GET per public vendor
 * endpoint (src/lib/vendorStatusProbe.ts), taken when the page was last
 * regenerated. Rendered inside <Suspense>, and /alerts is regenerated in the
 * background (its `revalidate`), so no reader waits on a vendor.
 */

const VERDICT: Record<string, { label: string; cls: string }> = {
  up: { label: "Answering", cls: "border-brand-400 bg-brand-500/10 text-[var(--fg)]" },
  unexpected: { label: "Unexpected answer", cls: "border-amber-400/60 bg-amber-500/10 text-[var(--fg)]" },
  "no-answer": { label: "No answer", cls: "border-red-400/60 bg-red-500/10 text-[var(--fg)]" },
};

const fmt = (iso: string) => `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;

export default async function VendorStatus() {
  const { checkedAt, results } = await probeVendorStatus();
  const up = results.filter((r) => r.verdict === "up").length;
  return (
    <div data-vendor-status>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Checked <time dateTime={checkedAt}>{fmt(checkedAt)}</time>: {up} of {results.length} endpoints answered the
        way they normally do.
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-[var(--surface)] text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th scope="col" className="px-3 py-2">Endpoint</th>
              <th scope="col" className="px-3 py-2">State</th>
              <th scope="col" className="px-3 py-2">HTTP</th>
              <th scope="col" className="px-3 py-2">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {results.map((r) => (
              <tr key={r.id} data-status-endpoint={r.id} data-verdict={r.verdict} className="align-top">
                <td className="px-3 py-2">
                  <span className="font-medium text-[var(--fg)]">{r.vendor}</span>
                  <span className="block text-xs text-[var(--muted)]">
                    {r.what}:{" "}
                    <a href={r.url} rel="nofollow" className="break-all underline decoration-[var(--border)] underline-offset-2 hover:text-brand-600">
                      {r.url.replace(/^https:\/\//, "")}
                    </a>
                  </span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">
                    {r.rule} Seen on 2026-11-24: {r.observed}.
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${VERDICT[r.verdict].cls}`}>
                    {VERDICT[r.verdict].label}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-[var(--fg)]">{answerLabel(r)}</td>
                <td className="px-3 py-2 font-mono text-xs text-[var(--fg)]">{r.ms === null ? "–" : `${r.ms} ms`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Shown while the first check runs (in development; a built page has the answers already). */
export function VendorStatusPending() {
  return (
    <p className="mt-3 text-sm text-[var(--muted)]">
      Checking {statusEndpoints().length} endpoints, at most {TIMEOUT_MS / 1000} seconds each… The answers are refreshed at
      most every {REVALIDATE_SECONDS / 60} minutes.
    </p>
  );
}
