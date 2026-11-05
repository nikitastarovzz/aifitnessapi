"use client";

import { useEffect, useMemo, useState } from "react";
import type { OAuthVendor, OAuthSource } from "@/data/oauthVendors";
import { buildAuthorizeUrl, generateState, pkceDefault, pkcePair, refreshCurl, tokenCurl } from "@/lib/oauthPlayground";

/**
 * The interactive half of /tools/oauth-playground.
 *
 * It sends nothing. There is no fetch in this file and no link it renders
 * is followed automatically: the authorize URL is printed for the reader to
 * open, and the curl commands are printed for the reader to run. No client
 * secret is asked for; the commands read it from $CLIENT_SECRET. Nothing is
 * stored. PKCE pairs come from WebCrypto in this tab
 * (src/lib/oauthPlayground.ts, tested in scripts/oauth-playground.test.mjs).
 */

type Props = { vendors: OAuthVendor[]; sources: Record<string, OAuthSource> };

const field =
  "mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-[13px] text-[var(--fg)] placeholder:font-sans placeholder:text-[var(--muted)]";

function Copyable({ label, value, id }: { label: string; value: string; id: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id={id} className="text-sm font-bold text-[var(--fg)]">
          {label}
        </h3>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard?.writeText(value).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--fg)] hover:border-brand-400"
          aria-describedby={id}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-[var(--bg)] p-3 font-mono text-[12.5px] leading-relaxed text-[var(--fg)]">
        {value}
      </pre>
    </div>
  );
}

export default function OAuthPlayground({ vendors, sources }: Props) {
  const [vendorId, setVendorId] = useState(vendors[0].id);
  const vendor = useMemo(() => vendors.find((v) => v.id === vendorId) ?? vendors[0], [vendors, vendorId]);
  const [clientId, setClientId] = useState("");
  const [redirectUri, setRedirectUri] = useState("http://localhost:3000/callback");
  const [picked, setPicked] = useState<string[]>([]);
  const [extraScopes, setExtraScopes] = useState("");
  const [state, setState] = useState("");
  const [usePkce, setUsePkce] = useState(true);
  const [method, setMethod] = useState<"S256" | "plain">("S256");
  const [pair, setPair] = useState<{ verifier: string; challenge: string } | null>(null);
  const [authorizeUrl, setAuthorizeUrl] = useState("");

  // Reset per vendor: its own state length, its PKCE default.
  useEffect(() => {
    setPicked([]);
    setExtraScopes("");
    setState(generateState(vendor));
    setUsePkce(pkceDefault(vendor));
    setMethod("S256");
    setAuthorizeUrl(vendor.authorizeUrl);
  }, [vendor]);

  useEffect(() => {
    let live = true;
    if (!usePkce) {
      setPair(null);
      return;
    }
    void pkcePair(method).then((p) => live && setPair(p));
    return () => {
      live = false;
    };
  }, [usePkce, method, vendor]);

  const scopes = [...picked, ...extraScopes.split(/[\s,]+/).filter(Boolean)];
  const cid = clientId.trim() || "YOUR_CLIENT_ID";
  const url = buildAuthorizeUrl(vendor, {
    clientId: cid,
    redirectUri: redirectUri.trim(),
    scopes,
    state,
    pkce: usePkce && pair ? { challenge: pair.challenge, method } : null,
    authorizeUrl: authorizeUrl || undefined,
  });
  const tokenInput = { clientId: cid, redirectUri: redirectUri.trim(), verifier: usePkce && pair ? pair.verifier : null };
  const token = tokenCurl(vendor, tokenInput);
  const refresh = refreshCurl(vendor, tokenInput);
  const addresses = [{ url: vendor.authorizeUrl, text: "Default" }, ...vendor.altAuthorize.map((a) => ({ url: a.url, text: a.text }))];

  return (
    <div className="mt-8">
      <p className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm leading-relaxed text-[var(--fg)]">
        <strong>This page sends no request.</strong> It prints a URL for you to open and commands for you to run. It never
        asks for your client secret: the commands read it from <code className="font-mono text-xs">$CLIENT_SECRET</code> in
        your own shell, and the code and refresh token from <code className="font-mono text-xs">$AUTH_CODE</code> and{" "}
        <code className="font-mono text-xs">$REFRESH_TOKEN</code>. Nothing you type is stored.
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-[var(--fg)]">Vendor</legend>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Vendor">
          {vendors.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={v.id === vendorId}
              onClick={() => setVendorId(v.id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                v.id === vendorId
                  ? "border-brand-500 bg-brand-600 text-white"
                  : "border-[var(--border)] text-[var(--fg)] hover:border-brand-400"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[var(--fg)]">
          client_id
          <input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="from the vendor's developer dashboard" spellCheck={false} autoComplete="off" className={field} />
        </label>
        <label className="block text-sm font-semibold text-[var(--fg)]">
          redirect_uri <span className="font-normal text-[var(--muted)]">(must match the one you registered)</span>
          <input value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} spellCheck={false} autoComplete="off" className={field} />
        </label>
      </div>

      {addresses.length > 1 && (
        <label className="mt-4 block text-sm font-semibold text-[var(--fg)]">
          Authorization address
          <select value={authorizeUrl} onChange={(e) => setAuthorizeUrl(e.target.value)} className={field}>
            {addresses.map((a) => (
              <option key={a.url} value={a.url}>
                {a.url}
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-[var(--fg)]">
          Scopes{" "}
          <span className="font-normal text-[var(--muted)]">
            (joined with {vendor.scopeSeparator === "," ? "commas" : "spaces"}
            {vendor.requiredScopes?.length ? `; ${vendor.requiredScopes.join(", ")} always sent` : ""})
          </span>
        </legend>
        {vendor.scopes.length ? (
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {vendor.scopes.map((s) => (
              <li key={s.scope}>
                <label className="flex items-start gap-2 text-sm text-[var(--fg)]">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={picked.includes(s.scope)}
                    onChange={(e) => setPicked((p) => (e.target.checked ? [...p, s.scope] : p.filter((x) => x !== s.scope)))}
                  />
                  <span>
                    <code className="break-all font-mono text-xs">{s.scope.replace("https://www.googleapis.com/auth/", "…/auth/")}</code>
                    <span className="block text-xs text-[var(--muted)]">{s.grants}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">{vendor.scopeNote?.text}</p>
        )}
        <label className="mt-3 block text-sm font-semibold text-[var(--fg)]">
          Other scopes <span className="font-normal text-[var(--muted)]">(optional, any separator)</span>
          <input value={extraScopes} onChange={(e) => setExtraScopes(e.target.value)} spellCheck={false} className={field} />
        </label>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-[var(--fg)]">
          state
          <span className="mt-1.5 flex gap-2">
            <input value={state} onChange={(e) => setState(e.target.value)} spellCheck={false} className={`${field} mt-0`} />
            <button type="button" onClick={() => setState(generateState(vendor))} className="shrink-0 rounded-full border border-[var(--border)] px-3 text-xs font-medium text-[var(--fg)] hover:border-brand-400">
              New
            </button>
          </span>
        </label>
        <div className="text-sm text-[var(--fg)]">
          <label className="flex items-center gap-2 font-semibold">
            <input type="checkbox" checked={usePkce} onChange={(e) => setUsePkce(e.target.checked)} /> PKCE
          </label>
          <p className="mt-1 text-xs text-[var(--muted)]">{vendor.pkce.text}</p>
          {vendor.pkce.methods.length > 1 && usePkce && (
            <label className="mt-2 block text-xs font-semibold">
              Method{" "}
              <select value={method} onChange={(e) => setMethod(e.target.value as "S256" | "plain")} className="ml-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1">
                {vendor.pkce.methods.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
          )}
          {usePkce && vendor.pkce.status === "not-documented" && (
            <p className="mt-1 text-xs font-semibold text-amber-600">{vendor.name} does not document PKCE; its server may ignore or reject these parameters.</p>
          )}
        </div>
      </div>

      <section aria-live="polite" className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <Copyable id="out-authorize" label="1. Authorization URL (open it in a browser)" value={url} />
        {usePkce && pair && (
          <>
            <Copyable id="out-verifier" label="PKCE code_verifier (keep it for step 2)" value={pair.verifier} />
            <Copyable id="out-challenge" label={`PKCE code_challenge (${method})`} value={pair.challenge} />
          </>
        )}
        <Copyable id="out-token" label="2. Exchange the code for tokens" value={`export AUTH_CODE='the code from the redirect'\nread -rs CLIENT_SECRET && export CLIENT_SECRET   # paste it; not echoed or saved\n${token}`} />
        {refresh ? (
          <Copyable id="out-refresh" label="3. Refresh" value={refresh} />
        ) : (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-[var(--fg)]">3. Refresh</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{vendor.refresh.text}</p>
          </div>
        )}
        <p className="mt-4 text-xs text-[var(--muted)]">
          Token lifetime: {vendor.lifetime.text}{" "}
          <a href={sources[vendor.lifetime.source].url} className="font-medium text-brand-600 hover:text-brand-500" rel="noopener">
            Source
          </a>
          .
        </p>
      </section>
    </div>
  );
}
