import type { Metadata } from "next";
import Link from "next/link";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ToolNextStep from "@/components/ToolNextStep";
import { PAGE_H1 } from "@/data/pageTitles";
import { SUUNTO_FIELDS, WEBHOOK_SOURCES, WEBHOOK_VENDORS, WEBHOOKS_FETCHED_ON, WEBHOOKS_NOT_COVERED } from "@/data/webhookPayloads";
import {
  RELATED,
  SCHEMAS_PATH,
  SENDER_PATH,
  SENDER_TEXT,
  SENDER_USAGE,
  WEBHOOKS_DESCRIPTION,
  WEBHOOKS_PATH,
  WEBHOOKS_TITLE,
  headerLines,
  schemaFor,
  schemaId,
  verifierHref,
  webhooksCapsule,
} from "@/lib/webhooksPage";
import { toolGraph } from "@/lib/schema";

/**
 * /webhooks — the documented webhook payloads per wearable vendor, with a
 * JSON Schema each, the vendor's signature, response and retry rules, and
 * a mock sender (public/webhooks/send-sample.mjs).
 *
 * It owns "what does a <vendor> webhook payload look like". The concept
 * (/learn/what-are-webhooks), ingestion design (/architecture/webhook-ingestion),
 * receiver code (/cookbook/webhook-receiver), local testing
 * (/test/webhooks-locally) and signature checking (/tools/webhook-verifier)
 * stay on their own pages and are linked, not repeated.
 *
 * Data: src/data/webhookPayloads.ts, evidence in ops/sources/evidence/webhooks.json.
 */

export const metadata: Metadata = {
  title: WEBHOOKS_TITLE,
  description: WEBHOOKS_DESCRIPTION,
  alternates: pageMirrorAlternates(WEBHOOKS_PATH),
  openGraph: { type: "website", title: WEBHOOKS_TITLE, description: WEBHOOKS_DESCRIPTION, url: WEBHOOKS_PATH, images: ["/opengraph-image"] },
};

const link = "font-medium text-brand-600 hover:text-brand-500";
const pre = "mt-1.5 max-h-96 overflow-auto rounded-xl bg-[var(--bg)] p-3 font-mono text-[12px] leading-relaxed text-[var(--fg)]";

export default function WebhooksPage() {
  const jsonLd = toolGraph({
    path: WEBHOOKS_PATH,
    name: WEBHOOKS_TITLE,
    description: WEBHOOKS_DESCRIPTION,
    datePublished: WEBHOOKS_FETCHED_ON,
    dateModified: WEBHOOKS_FETCHED_ON,
    webPage: { lastReviewed: WEBHOOKS_FETCHED_ON },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Webhook payloads", path: WEBHOOKS_PATH },
          ]}
        />
        <ClusterHero label="Reference" seed={11} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{PAGE_H1["/webhooks"]}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {webhooksCapsule()}
        </p>

        <section className="mt-10" aria-labelledby="glance">
          <h2 id="glance" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            At a glance
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--muted)]">
                  <th className="py-2 pr-3">Vendor</th>
                  <th className="py-2 pr-3">Payloads</th>
                  <th className="py-2 pr-3">Signature</th>
                  <th className="py-2">Retries</th>
                </tr>
              </thead>
              <tbody>
                {WEBHOOK_VENDORS.map((v) => (
                  <tr key={v.id} className="border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-3 font-semibold">
                      <a href={`#${v.id}`} className={link}>
                        {v.name}
                      </a>
                    </td>
                    <td className="py-2 pr-3">{v.payloads.length}</td>
                    <td className="py-2 pr-3">{v.signature.text}</td>
                    <td className="py-2">{v.retries.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {WEBHOOK_VENDORS.map((v) => {
          const verifier = verifierHref(v);
          return (
            <section key={v.id} id={v.id} className="mt-14" aria-labelledby={`h-${v.id}`} data-webhook-library={v.id}>
              <h2 id={`h-${v.id}`} className="text-2xl font-bold tracking-tight text-[var(--fg)]">
                {v.name}
              </h2>
              <dl className="mt-3 space-y-2 text-sm leading-relaxed">
                {[
                  ["Signature", v.signature],
                  ["Respond", v.respond],
                  ["Retries", v.retries],
                  ...v.notes.map((n) => ["Note", n] as const),
                ].map(([label, f], i) => (
                  <div key={i} className="grid gap-1 sm:grid-cols-[7rem_1fr]">
                    <dt className="font-semibold text-[var(--fg)]">{label as string}</dt>
                    <dd className="text-[var(--fg)]">
                      {(f as { text: string }).text}{" "}
                      <a href={WEBHOOK_SOURCES[(f as { source: keyof typeof WEBHOOK_SOURCES }).source].url} className={`text-xs ${link}`} rel="noopener">
                        Source
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {verifier ? (
                  <>
                    <Link href={verifier} className={link}>
                      Verify a {v.name} delivery
                    </Link>{" "}
                    ·{" "}
                  </>
                ) : null}
                <Link href={v.guide} className={link}>
                  {v.guide === "/google-health-api" ? "Google Health API reference" : `${v.name} integration guide`}
                </Link>
              </p>

              {v.id === "suunto" && (
                <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--fg)]">
                  {SUUNTO_FIELDS.text}{" "}
                  <a href={WEBHOOK_SOURCES[SUUNTO_FIELDS.source].url} className={`text-xs ${link}`} rel="noopener">
                    Source
                  </a>
                </p>
              )}

              {v.payloads.map((p) => (
                <article key={p.id} id={schemaId(v, p)} className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h3 className="text-lg font-bold text-[var(--fg)]">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--fg)]">{p.trigger}</p>
                  {headerLines(p) && (
                    <>
                      <h4 className="mt-3 text-sm font-bold text-[var(--fg)]">Headers in the example</h4>
                      <pre className={pre}>{headerLines(p)}</pre>
                    </>
                  )}
                  <h4 className="mt-3 text-sm font-bold text-[var(--fg)]">
                    {p.encoding === "form" ? "Example body (form-encoded fields)" : "Example body"}
                  </h4>
                  <pre className={pre}>{p.example}</pre>
                  {p.sampleNote && <p className="mt-2 text-xs text-[var(--muted)]">{p.sampleNote}</p>}
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">JSON Schema</summary>
                    <pre className={pre}>{schemaFor(v, p)}</pre>
                  </details>
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    From{" "}
                    <a href={WEBHOOK_SOURCES[p.evidence.source].url} className={link} rel="noopener">
                      {WEBHOOK_SOURCES[p.evidence.source].label}
                    </a>
                    , read {WEBHOOKS_FETCHED_ON}
                    {WEBHOOK_SOURCES[p.evidence.source].via === "snapshot" ? " (via the site's source-snapshot workflow)" : ""}.
                  </p>
                </article>
              ))}
            </section>
          );
        })}

        <section className="mt-14" aria-labelledby="sender">
          <h2 id="sender" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Send a signed sample to your own handler
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--fg)]">
            <a href={SENDER_PATH} className={link} download>
              send-sample.mjs
            </a>{" "}
            posts any example above to a URL on your machine, signed the way its vendor documents.
          </p>
          <pre className={pre}>{SENDER_USAGE.join("\n")}</pre>
          {SENDER_TEXT.map((t) => (
            <p key={t} className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {t}
            </p>
          ))}
        </section>

        <section className="mt-14" aria-labelledby="schemas">
          <h2 id="schemas" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Download every schema
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--fg)]">
            <a href={SCHEMAS_PATH} className={link}>
              schemas.json
            </a>{" "}
            is one JSON Schema (draft 2020-12) bundle with each payload under $defs; reference one as schemas.json#&lt;vendor&gt;-&lt;payload&gt;, the id on its
            section above. Each property says in x-type-from whether its type comes from the vendor&rsquo;s field table or only from its example, and only
            fields a vendor calls required are required.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="not-covered">
          <h2 id="not-covered" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Not covered, and why
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">
            {WEBHOOKS_NOT_COVERED.map((o) => (
              <li key={o.name}>
                <strong className="text-[var(--fg)]">{o.name}.</strong> {o.reason}{" "}
                <Link href={o.guide} className={link}>
                  {o.guide === "/fitbit-api-shutdown" ? "Fitbit Web API retirement" : `${o.name} guide`}
                </Link>
                .
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14" aria-labelledby="related">
          <h2 id="related" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Related pages
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
            {RELATED.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={link}>
                  {r.text}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ToolNextStep path={WEBHOOKS_PATH} />
      </div>
    </Container>
  );
}
