import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import MoreTools from "@/components/tools/MoreTools";
import WebhookVerifier from "@/components/tools/WebhookVerifier";
import { WEBHOOK_VENDORS } from "@/lib/webhookVerifier.mjs";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * "Is this webhook real, and what do I do with it?" — asked with a request
 * body in one hand and a vendor's docs page in the other.
 *
 * The vendor rules live in src/lib/webhookVerifier.mjs, each with the URL it
 * was read from, the date, and the sentence that states it; this page renders
 * those blocks server-side so the rules are readable (and quotable) without
 * running any script, and mounts the client verifier on top. Every vendor
 * page was read on 2026-10-31: Google's directly, the rest through
 * .github/workflows/source-snapshot.yml because their hosts are unreachable
 * from the writing environment (claims and quotes in
 * ops/sources/evidence/tools-webhook-verifier.json).
 */

const PATH = "/tools/webhook-verifier";
const TITLE = "Verify a Wearable Webhook Signature";
const UPDATED = "2026-10-31";
const DESCRIPTION =
  "Paste a webhook from Oura, WHOOP, Terra, Polar, Strava, Withings, Wahoo or Google Health: check its signature in your browser and see what to send back.";

export const metadata: Metadata = {
  // Plain, not `absolute` — the layout template appends the site suffix.
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Client-side webhook debugger for eight fitness and health APIs: each vendor's documented signature or token check, field meanings, expected response and the next API call.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const KIND_LABEL: Record<string, string> = {
  hmac: "HMAC signature",
  token: "Shared token, no signature",
  handshake: "Validation handshake, events unsigned",
};

export default function WebhookVerifierPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });
  const signed = WEBHOOK_VENDORS.filter((v) => v.kind === "hmac");

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Webhook verifier", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={5} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Is this webhook real?
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Pick the vendor, paste the request you received and your secret, and this checks it the
          way that vendor documents. {signed.map((v) => v.name).join(", ").replace(/, ([^,]*)$/, " and $1")}{" "}
          sign each delivery with HMAC-SHA256, each over a different string; Strava, Withings, Wahoo
          and the Google Health API instead rely on a validation handshake or a secret you chose. It
          then explains each field, states the response and time limit the vendor expects, and names
          the API call that fetches the data. Each rule was read from the vendor&rsquo;s own page on{" "}
          {UPDATED}. It all runs in your browser: the secret never leaves the tab.
        </p>

        <section data-tool="webhook-verifier" aria-label="Wearable webhook verifier">
          <WebhookVerifier />
        </section>

        <section className="mt-14" aria-labelledby="rules">
          <h2 id="rules" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Each vendor&rsquo;s rule, in its own words
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            The verifier encodes exactly these sentences. Where a vendor&rsquo;s page leaves
            something unstated, the block says so rather than filling it in.
          </p>
          <div className="mt-6 space-y-6">
            {WEBHOOK_VENDORS.map((v) => (
              <article
                key={v.id}
                id={`vendor-${v.id}`}
                data-webhook-vendor={v.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold text-[var(--fg)]">{v.name}</h3>
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)]">
                    {KIND_LABEL[v.kind]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--fg)]">{v.summary}</p>
                <blockquote className="mt-3 border-l-2 border-brand-400 pl-3 text-sm italic leading-relaxed text-[var(--muted)]">
                  {v.source.quote.map((q) => (
                    <p key={q} className="font-mono text-[12.5px] not-italic first:mt-0 mt-1">
                      {q}
                    </p>
                  ))}
                </blockquote>
                {"caveat" in v && v.caveat && <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{v.caveat}</p>}
                <h4 className="mt-4 text-sm font-bold text-[var(--fg)]">What to send back</h4>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--fg)]">
                  {v.respond.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                {"handshake" in v && v.handshake && (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--fg)]">
                    <span className="font-semibold">Handshake:</span> {v.handshake}
                  </p>
                )}
                <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">
                  Source:{" "}
                  <a href={v.source.url} className="font-medium text-brand-600 hover:text-brand-500" rel="noopener">
                    {v.source.label}
                  </a>{" "}
                  — read {v.source.fetched}
                  {v.source.via === "snapshot" ? " (via the site's source-snapshot workflow)" : ""}. Guide:{" "}
                  <Link href={v.integrate} className="font-medium text-brand-600 hover:text-brand-500">
                    {v.integrate === "/google-health-api" ? "Google Health API reference" : `${v.name} integration guide`}
                  </Link>
                  .
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14" aria-labelledby="not-included">
          <h2 id="not-included" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Not included, and why
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Garmin.</strong>{" "}Garmin&rsquo;s public Health API
              page offers &ldquo;Push or *Ping/Pull Architecture&rdquo; but states no request format
              or signing rule, so there is no public rule to verify against. See the{" "}
              <Link href="/integrate/garmin-api" className="font-medium text-brand-600 hover:text-brand-500">
                Garmin integration guide
              </Link>
              .
            </li>
            <li>
              <strong className="text-[var(--fg)]">Fitbit Web API.</strong>{" "}Google&rsquo;s Google Health
              API pages, read {UPDATED}, say the legacy Fitbit Web API and Fitbit OAuth endpoints will
              be turned off on November 2, 2026; its successor, the Google Health API, is covered
              above.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Suunto, COROS, Dexcom and others.</strong> Their
              webhook documentation was not read for this tool, so they are not listed. A vendor is
              added only once its own page states the rule.
            </li>
          </ul>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              The page makes no network request with what you paste. Signatures are recomputed with the
              browser&rsquo;s WebCrypto API (<code className="font-mono text-xs">crypto.subtle</code>,
              HMAC with SHA-256) and compared in constant time; the secret field is a password input
              with autocomplete off, and nothing is written to storage.
            </p>
            <p>
              Paste the body exactly as it arrived. Every signed scheme here except Oura&rsquo;s signs
              the raw bytes, and a framework that parses and re-serializes JSON before your handler
              sees it is the most common reason a genuine request fails verification.
            </p>
            <p>
              &ldquo;Load an example&rdquo; builds a request from the vendor&rsquo;s own example
              payload, signed now with a demo secret, so it verifies; change one character of the body
              or signature and it stops verifying. The same verifier code is tested that way for every
              vendor on each change.
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Choosing between these APIs in the first place:{" "}
          <Link href="/integrate" className="font-medium text-brand-600 hover:text-brand-500">
            integration guides for every major fitness API
          </Link>
          . More at{" "}
          <Link href="/tools" className="font-medium text-brand-600 hover:text-brand-500">
            free tools for health-app builders
          </Link>
          .
        </p>

        <MoreTools path={PATH} />
      </div>
    </Container>
  );
}
