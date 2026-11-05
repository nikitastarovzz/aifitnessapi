import type { Metadata } from "next";
import Link from "next/link";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import MoreTools from "@/components/tools/MoreTools";
import ToolNextStep from "@/components/ToolNextStep";
import OAuthPlayground from "@/components/tools/OAuthPlayground";
import { OAUTH_FETCHED_ON, OAUTH_OMITTED, OAUTH_SOURCES } from "@/data/oauthVendors";
import {
  PLAYGROUND_DESCRIPTION,
  PLAYGROUND_H1,
  PLAYGROUND_PATH,
  PLAYGROUND_TITLE,
  PLAYGROUND_VENDORS,
  playgroundCapsule,
  scopeSource,
  vendorRows,
  HOW_IT_WORKS,
} from "@/lib/oauthPlaygroundData";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * "What are this vendor's OAuth endpoints and scopes, and what do I send?" —
 * asked by an integrator with a client_id in one tab and five vendors' docs
 * in the others.
 *
 * Facts: src/data/oauthVendors.ts (each with its quote; evidence in
 * ops/sources/evidence/tools-oauth-playground.json), joined with the Google
 * Health API's generated scope list in src/lib/oauthPlaygroundData.ts. The
 * blocks below are server-rendered so they read without JavaScript; the
 * client tool builds URLs and commands and sends nothing.
 */

export const metadata: Metadata = {
  title: PLAYGROUND_TITLE,
  description: PLAYGROUND_DESCRIPTION,
  alternates: pageMirrorAlternates(PLAYGROUND_PATH),
  openGraph: { type: "website", title: PLAYGROUND_TITLE, description: PLAYGROUND_DESCRIPTION, url: PLAYGROUND_PATH, images: ["/opengraph-image"] },
};

const link = "font-medium text-brand-600 hover:text-brand-500";

export default function OAuthPlaygroundPage() {
  const jsonLd = toolGraph({
    path: PLAYGROUND_PATH,
    name: PLAYGROUND_TITLE,
    description: PLAYGROUND_DESCRIPTION,
    datePublished: OAUTH_FETCHED_ON,
    dateModified: OAUTH_FETCHED_ON,
    webPage: { lastReviewed: OAUTH_FETCHED_ON },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "OAuth playground", path: PLAYGROUND_PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={7} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{PLAYGROUND_H1}</h1>
        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {playgroundCapsule()}
        </p>

        <section data-tool="oauth-playground" aria-label="Wearable OAuth playground">
          <OAuthPlayground vendors={PLAYGROUND_VENDORS} sources={OAUTH_SOURCES} />
        </section>

        <section className="mt-14" aria-labelledby="facts">
          <h2 id="facts" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Each vendor&rsquo;s OAuth facts, with sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            The playground builds from exactly these rows. Each was read from the vendor&rsquo;s own page on {OAUTH_FETCHED_ON}; where a page
            leaves something out, the row says so instead of filling it in.
          </p>
          <div className="mt-6 space-y-6">
            {PLAYGROUND_VENDORS.map((v) => (
              <article key={v.id} id={`vendor-${v.id}`} data-oauth-vendor={v.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="text-lg font-bold text-[var(--fg)]">{v.name}</h3>
                <dl className="mt-3 space-y-2 text-sm leading-relaxed">
                  {vendorRows(v).map((r, i) => (
                    <div key={i} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
                      <dt className="font-semibold text-[var(--fg)]">{r.label}</dt>
                      <dd className="break-words text-[var(--fg)]">
                        {r.text}{" "}
                        <a href={r.source.url} className={`text-xs ${link}`} rel="noopener">
                          Source
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
                {v.scopes.length > 0 && (
                  <>
                    <h4 className="mt-4 text-sm font-bold text-[var(--fg)]">Scopes ({v.scopes.length})</h4>
                    <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-[var(--fg)]">
                      {v.scopes.map((s) => (
                        <li key={s.scope}>
                          <code className="break-all font-mono text-xs">{s.scope}</code>: {s.grants}{" "}
                          <a href={scopeSource(v, s).url} className={`text-xs ${link}`} rel="noopener">
                            Source
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-4 text-xs text-[var(--muted)]">
                  Guide:{" "}
                  <Link href={v.guide} className={link}>
                    {v.guide === "/google-health-api" ? "Google Health API reference" : `${v.name} integration guide`}
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
            {OAUTH_OMITTED.map((o) => (
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

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            {HOW_IT_WORKS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Once tokens flow, the next thing a wearable sends you is a webhook: see the{" "}
          <Link href="/webhooks" className={link}>
            webhook payload library
          </Link>{" "}
          and{" "}
          <Link href="/tools/webhook-verifier" className={link}>
            check a webhook&rsquo;s signature
          </Link>
          . More at{" "}
          <Link href="/tools" className={link}>
            free tools for health-app builders
          </Link>
          .
        </p>

        <MoreTools path={PLAYGROUND_PATH} />
        <ToolNextStep path={PLAYGROUND_PATH} />
      </div>
    </Container>
  );
}
