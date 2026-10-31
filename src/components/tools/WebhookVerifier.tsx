"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WEBHOOK_VENDORS,
  buildExample,
  explainPayload,
  verifyWebhook,
} from "@/lib/webhookVerifier.mjs";

/**
 * The interactive half of /tools/webhook-verifier.
 *
 * Everything runs in this tab. The secret goes into WebCrypto's importKey and
 * nowhere else: no fetch, no storage, no analytics event carries it, and the
 * input is a password field with autocomplete off so the browser does not
 * offer to remember it. The verifier itself is src/lib/webhookVerifier.mjs —
 * the same file scripts/webhook-verifier.test.mjs exercises.
 */

type Vendor = (typeof WEBHOOK_VENDORS)[number];
type Result = Awaited<ReturnType<typeof verifyWebhook>>;

const field =
  "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[13px] text-[var(--fg)] placeholder:font-sans placeholder:text-[var(--muted)]";

const STATUS_STYLE: Record<Result["status"], string> = {
  valid: "border-emerald-500/50 bg-emerald-500/10",
  invalid: "border-red-500/50 bg-red-500/10",
  unsigned: "border-amber-500/50 bg-amber-500/10",
  error: "border-[var(--border)] bg-[var(--surface)]",
};
const STATUS_LABEL: Record<Result["status"], string> = {
  valid: "Verified",
  invalid: "Rejected",
  unsigned: "Not signed",
  error: "Incomplete",
};

function usesUrl(v: Vendor, method: string) {
  return v.id === "withings" || (method === "GET" && (v.id === "strava" || v.id === "oura"));
}

export default function WebhookVerifier() {
  const [vendorId, setVendorId] = useState<string>(WEBHOOK_VENDORS[0].id);
  const vendor = useMemo(() => WEBHOOK_VENDORS.find((v) => v.id === vendorId) ?? WEBHOOK_VENDORS[0], [vendorId]);
  const [method, setMethod] = useState("POST");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [secret, setSecret] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [exampleLoaded, setExampleLoaded] = useState(false);

  const run = useCallback(
    async (input: { method: string; url: string; headers: string; body: string; secret: string }) => {
      setBusy(true);
      try {
        setResult(await verifyWebhook(vendor.id, input as Parameters<typeof verifyWebhook>[1]));
      } catch (e) {
        setResult({ status: "error", title: "Could not verify", detail: [e instanceof Error ? e.message : String(e)] });
      } finally {
        setBusy(false);
      }
    },
    [vendor.id],
  );

  // A new vendor starts clean: a Polar secret is not a WHOOP secret.
  useEffect(() => {
    setResult(null);
    setExampleLoaded(false);
    setMethod(vendor.id === "strava" ? "GET" : "POST");
  }, [vendor.id]);

  async function loadExample() {
    const ex = await buildExample(vendor.id);
    setMethod(ex.method);
    setUrl(ex.url);
    setHeaders(ex.headers);
    setBody(ex.body);
    setSecret(ex.secret);
    setExampleLoaded(true);
    await run(ex);
  }

  const explained = useMemo(() => explainPayload(vendor.id, body, url), [vendor.id, body, url]);
  const nextSteps = useMemo(() => vendor.next(explained.parsed as never), [vendor, explained.parsed]);

  return (
    <div className="mt-8">
      <fieldset>
        <legend className="text-sm font-semibold text-[var(--fg)]">Vendor</legend>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Vendor">
          {WEBHOOK_VENDORS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={v.id === vendor.id}
              data-vendor={v.id}
              onClick={() => setVendorId(v.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                v.id === vendor.id
                  ? "border-brand-500 bg-brand-500/10 font-semibold text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--fg)]"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
        <span className="font-semibold text-[var(--fg)]">{vendor.name}:</span> {vendor.summary}
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void run({ method, url, headers, body, secret });
        }}
      >
        <div className="flex flex-wrap items-end gap-4">
          <label className="text-sm font-semibold text-[var(--fg)]">
            Method
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1.5 block rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--fg)]"
            >
              <option>POST</option>
              <option>GET</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void loadExample()}
            data-action="load-example"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:border-brand-400"
          >
            Load a {vendor.name} example
          </button>
        </div>

        {usesUrl(vendor, method) && (
          <label className="block text-sm font-semibold text-[var(--fg)]">
            Request URL{" "}
            <span className="font-normal text-[var(--muted)]">
              {vendor.id === "withings" ? "(the callback URL Withings POSTed to, query string included)" : "(the validation GET, query string included)"}
            </span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} spellCheck={false} className={field} name="url" />
          </label>
        )}

        <label className="block text-sm font-semibold text-[var(--fg)]">
          Headers <span className="font-normal text-[var(--muted)]">(one “Name: value” per line)</span>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            rows={3}
            spellCheck={false}
            name="headers"
            placeholder={vendor.headers.length ? vendor.headers.map((h) => `${h}: …`).join("\n") : "Content-Type: application/json"}
            className={field}
          />
        </label>

        <label className="block text-sm font-semibold text-[var(--fg)]">
          Raw body <span className="font-normal text-[var(--muted)]">(exactly as received — not re-formatted)</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            spellCheck={false}
            name="body"
            placeholder={vendor.id === "withings" ? "userid=…&appli=…&startdate=…&enddate=…" : "{ … }"}
            className={field}
          />
        </label>

        <label className="block text-sm font-semibold text-[var(--fg)]">
          {vendor.secretLabel}
          <input
            type="password"
            autoComplete="off"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            spellCheck={false}
            name="secret"
            className={field}
          />
          <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
            Never leaves this browser tab: it is passed to WebCrypto locally, with no network request and no storage.
            {exampleLoaded && " The example uses a demo secret, not a real key."}
          </span>
        </label>

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-500 disabled:opacity-60"
        >
          {busy ? "Checking…" : "Verify"}
        </button>
      </form>

      <div aria-live="polite" className="mt-6 space-y-6">
        {result && (
          <section
            data-result={result.status}
            className={`rounded-2xl border p-5 ${STATUS_STYLE[result.status]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{STATUS_LABEL[result.status]}</p>
            <h2 className="mt-1 text-lg font-bold text-[var(--fg)]">{result.title}</h2>
            {result.detail.map((d) => (
              <p key={d} className="mt-2 text-sm leading-relaxed text-[var(--fg)]">
                {d}
              </p>
            ))}
            {result.reply && (
              <pre className="mt-2 overflow-x-auto rounded-xl bg-[var(--bg)] p-3 font-mono text-[13px] text-[var(--fg)]">{result.reply}</pre>
            )}
            {(result.computed || result.received) && (
              <dl className="mt-3 grid gap-2 text-xs">
                {result.computed && (
                  <div>
                    <dt className="font-semibold text-[var(--muted)]">Computed</dt>
                    <dd className="break-all font-mono text-[var(--fg)]">{result.computed}</dd>
                  </div>
                )}
                {result.received && (
                  <div>
                    <dt className="font-semibold text-[var(--muted)]">Received</dt>
                    <dd className="break-all font-mono text-[var(--fg)]">{result.received}</dd>
                  </div>
                )}
                {result.signedString && (
                  <div>
                    <dt className="font-semibold text-[var(--muted)]">Signed string</dt>
                    <dd className="break-all font-mono text-[var(--fg)]">{result.signedString}</dd>
                  </div>
                )}
              </dl>
            )}
          </section>
        )}

        {explained.rows.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-[var(--fg)]">What each field means</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Meanings from {vendor.name}&rsquo;s page cited below; a field that page does not describe is marked, not guessed.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs text-[var(--muted)]">
                    <th className="py-2 pr-3 font-semibold">Field</th>
                    <th className="py-2 pr-3 font-semibold">Value</th>
                    <th className="py-2 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {explained.rows.map((r) => (
                    <tr key={r.path} className="border-b border-[var(--border)] align-top">
                      <td className="py-2 pr-3 font-mono text-[12px] text-[var(--fg)]">{r.path}</td>
                      <td className="max-w-[14rem] break-all py-2 pr-3 font-mono text-[12px] text-[var(--muted)]">{r.value}</td>
                      <td className="py-2 text-[var(--fg)]">
                        {r.meaning ?? <span className="text-[var(--muted)]">Not described on the cited page.</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-base font-bold text-[var(--fg)]">What {vendor.name} expects back</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--fg)]">
            {vendor.respond.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h3 className="mt-4 text-sm font-bold text-[var(--fg)]">Then fetch the data</h3>
          <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--fg)]">
            {nextSteps.map((n) => (
              <li key={n} className="break-words">
                {n}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Rule read from{" "}
            <a href={vendor.source.url} className="font-medium text-brand-600 hover:text-brand-500" rel="noopener">
              {vendor.source.label}
            </a>{" "}
            on {vendor.source.fetched}. Full integration walkthrough:{" "}
            <Link href={vendor.integrate} className="font-medium text-brand-600 hover:text-brand-500">
              {vendor.name} guide
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
