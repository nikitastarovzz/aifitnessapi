import type { Metadata } from "next";
import Link from "next/link";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import MoreTools from "@/components/tools/MoreTools";
import ToolNextStep from "@/components/ToolNextStep";
import StarterScaffold from "@/components/tools/StarterScaffold";
import { SCAFFOLD_CHECKED_ON, SCAFFOLD_EXCLUDED, SCAFFOLD_STACKS, SCAFFOLD_VENDORS } from "@/lib/starterScaffold.mjs";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * "Give me a project that already does OAuth and webhooks for these
 * vendors" (ops/AUDIENCE-30-2026-11-05.md item 8). The templates are
 * src/lib/starterScaffold.mjs; every fact in them is one the site already
 * sources (the integration guides for OAuth endpoints, the webhook verifier
 * for signing rules), and scripts/starter-scaffold.test.mjs compiles and runs
 * every stack with every vendor. The zip is built in the browser.
 */

const PATH = "/tools/starter-scaffold";
const TITLE = "Fitness API Starter Scaffold Generator";
const UPDATED = "2026-11-05";
const DESCRIPTION =
  "Pick Express, Next.js or FastAPI and Oura, WHOOP, Polar, Strava or Wahoo: download a tested skeleton with OAuth, token storage and verified webhooks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "A project skeleton for fitness API integrations, built in your browser: OAuth start and callback, a token-store interface, and webhook endpoints that check each vendor's documented signature.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const KIND: Record<string, string> = {
  hmac: "HMAC signature",
  token: "Shared token in the body",
  handshake: "Validation handshake; events unsigned",
};

export default function StarterScaffoldPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });
  const names = SCAFFOLD_VENDORS.map((v) => v.name);

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Starter scaffold", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={11} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          A starter project for your fitness API integration
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Pick a stack ({SCAFFOLD_STACKS.map((s) => s.name).join(", ").replace(/, ([^,]*)$/, " or $1")}) and
          the vendors you integrate ({names.join(", ").replace(/, ([^,]*)$/, " and $1")}), and download a
          project skeleton as a .zip built in your browser: an OAuth start and callback route per vendor with
          a state check and PKCE where the vendor documents it, a token-store interface with an in-memory
          stand-in, a webhook endpoint that answers each vendor&rsquo;s handshake and checks its documented
          signature or token, a .env.example and a README. Every endpoint and header comes from a page this
          site already sources, and every combination is compiled and run in the site&rsquo;s tests.
        </p>

        <section data-tool="starter-scaffold" aria-label="Starter scaffold generator">
          <StarterScaffold />
        </section>

        <section className="mt-14" aria-labelledby="vendors">
          <h2 id="vendors" className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            What each vendor gets
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            As the site had them on {SCAFFOLD_CHECKED_ON}. The OAuth details are from each vendor&rsquo;s
            integration guide; the webhook rules are the ones the{" "}
            <Link href="/tools/webhook-verifier" className="font-medium text-brand-600 hover:text-brand-500">
              webhook verifier
            </Link>{" "}
            quotes from the vendor&rsquo;s own page.
          </p>
          <div className="mt-6 space-y-5">
            {SCAFFOLD_VENDORS.map((v) => (
              <article key={v.id} id={`vendor-${v.id}`} data-scaffold-vendor={v.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold text-[var(--fg)]">{v.name}</h3>
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)]">
                    {KIND[v.webhook.kind]}
                  </span>
                </div>
                <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[9rem_minmax(0,1fr)]">
                  <dt className="text-[var(--muted)]">Authorize</dt>
                  <dd className="break-all font-mono text-[12.5px] text-[var(--fg)]">{v.authorizeUrl}</dd>
                  <dt className="text-[var(--muted)]">Token</dt>
                  <dd className="break-all font-mono text-[12.5px] text-[var(--fg)]">
                    {v.tokenUrl} ({v.tokenAuth === "basic" ? "HTTP Basic" : "credentials in the form body"})
                  </dd>
                  <dt className="text-[var(--muted)]">Default scopes</dt>
                  <dd className="font-mono text-[12.5px] text-[var(--fg)]">{v.scopes.join(v.scopeSeparator)}</dd>
                  <dt className="text-[var(--muted)]">PKCE</dt>
                  <dd className="text-[var(--fg)]">{v.pkce ? "S256, as the vendor documents" : "not sent: the guide does not document it"}</dd>
                  <dt className="text-[var(--muted)]">Webhooks</dt>
                  <dd className="text-[var(--fg)]">{v.webhook.summary}</dd>
                </dl>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--fg)]">
                  {v.tokenNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[var(--muted)]">
                  Sources:{" "}
                  <Link href={v.guide} className="font-medium text-brand-600 hover:text-brand-500">
                    {v.name} integration guide
                  </Link>{" "}
                  and{" "}
                  <a href={v.webhook.source} className="font-medium text-brand-600 hover:text-brand-500" rel="noopener">
                    {v.name}&rsquo;s webhook documentation
                  </a>
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
            {SCAFFOLD_EXCLUDED.map((x) => (
              <li key={x.name}>
                <strong className="text-[var(--fg)]">{x.name}.</strong> {x.reason}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 space-y-3 text-sm leading-relaxed text-[var(--fg)]" aria-labelledby="tested">
          <h2 id="tested" className="text-2xl font-bold tracking-tight">
            How the templates are tested
          </h2>
          <p>
            <code className="font-mono text-xs">scripts/starter-scaffold.test.mjs</code> generates every
            stack with each vendor alone and with all five. The Express skeleton passes{" "}
            <code className="font-mono text-xs">node --check</code>, is started on a free port, and is driven
            over HTTP: the authorize redirect, the code exchange against a fake token endpoint, a single-use
            state, and each vendor&rsquo;s webhook as the webhook verifier builds it from the vendor&rsquo;s
            own example, accepted unchanged and refused when tampered with. The Next.js skeleton passes{" "}
            <code className="font-mono text-xs">tsc --noEmit</code> in strict mode against Next.js and Node
            types, and its webhook module runs the same cases. The FastAPI skeleton passes{" "}
            <code className="font-mono text-xs">python -m py_compile</code>, and its standard-library webhook
            module runs the same cases. The ZIP is read back by the site&rsquo;s own ZIP reader and by
            Python&rsquo;s zipfile.
          </p>
          <p>
            What it does not do: the stores keep tokens in memory, the start route takes the user id as a
            query parameter, and the event handler only logs. The README in each download says what to
            replace, and the{" "}
            <Link href="/cookbook" className="font-medium text-brand-600 hover:text-brand-500">
              cookbook
            </Link>{" "}
            has tested code for each: token encryption at rest, refresh rotation and a replay-safe receiver.
          </p>
        </section>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. More at{" "}
          <Link href="/tools" className="font-medium text-brand-600 hover:text-brand-500">
            free tools for health-app builders
          </Link>
          .
        </p>

        <MoreTools path={PATH} />
        <ToolNextStep path={PATH} />
      </div>
    </Container>
  );
}
