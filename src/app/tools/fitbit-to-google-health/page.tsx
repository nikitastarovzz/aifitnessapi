import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import MoreTools from "@/components/tools/MoreTools";
import ToolNextStep from "@/components/ToolNextStep";
import FitbitGoogleMap from "@/components/tools/FitbitGoogleMap";
import {
  FG_CATEGORIES,
  FG_COUNTS,
  FG_FITBIT_READ_ON,
  FG_FITBIT_URL,
  FG_GOOGLE_READ_ON,
  FG_MIGRATION_URL,
  FG_ROWS,
  FG_SPECS_URL,
  FG_UNUSED_GOOGLE_ROWS,
  FG_UPDATED,
} from "@/lib/fitbitGoogleMap";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import { FITBIT_TOOL_DESCRIPTION, FITBIT_TOOL_TITLE, fitbitToolCapsule } from "@/lib/schemaToolsText";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * Every Fitbit Web API endpoint, and what Google's own migration tables say
 * replaces it (ops/AUDIENCE-30-2026-11-05.md item 10). Fitbit's side is
 * src/data/fitbitWebApi.ts, built from source snapshots of dev.fitbit.com
 * (evidence: ops/sources/evidence/tools-fitbit-to-google-health.json);
 * Google's is src/data/googleHealthApi.ts. The join is src/lib/fitbitGoogleMap.ts.
 */

const PATH = "/tools/fitbit-to-google-health";

export const metadata: Metadata = {
  title: FITBIT_TOOL_TITLE,
  description: FITBIT_TOOL_DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "website",
    title: FITBIT_TOOL_TITLE,
    description: "Every Fitbit Web API endpoint beside its Google Health API replacement, from Google's migration tables, with the unmapped ones stated.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const code = "font-mono text-sm";

export default function FitbitToGoogleHealthPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: FITBIT_TOOL_TITLE,
    alternativeHeadline: "Fitbit Web API endpoints mapped to Google Health API data types, methods and scopes",
    description: FITBIT_TOOL_DESCRIPTION,
    dateModified: FG_UPDATED,
    webPage: { lastReviewed: FG_UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Fitbit to Google Health API", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={9} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Fitbit Web API to Google Health API: every endpoint, mapped or not
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          {fitbitToolCapsule()}
        </p>

        <section data-tool="fitbit-to-google-health" aria-label="Fitbit Web API to Google Health API mapping">
          <FitbitGoogleMap rows={FG_ROWS} categories={FG_CATEGORIES.map((c) => ({ slug: c.slug, title: c.title }))} />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How each row is built</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Fitbit’s side, verbatim.</strong> Title, opening sentence, HTTP method, path and{" "}
              <code className={code}>Scope:</code> line from each endpoint page of{" "}
              <a href={FG_FITBIT_URL} className={linkCls} rel="noopener">
                Fitbit’s Web API reference
              </a>
              , read {FG_FITBIT_READ_ON} through a source snapshot ({FG_COUNTS.endpoints} pages in {FG_COUNTS.categories} sections).
            </li>
            <li>
              <strong className="text-[var(--fg)]">The data: Google’s data-type table.</strong> Google’s{" "}
              <a href={FG_SPECS_URL} className={linkCls} rel="noopener">
                API specifications
              </a>{" "}
              page maps {FG_COUNTS.googleRows} Fitbit data types to Google Health API data types. This site pairs an endpoint with a row only when the
              endpoint’s own page names the field or resource (the row shows it), and {FG_COUNTS.googleRowsUsed} of the {FG_COUNTS.googleRows} rows
              are used.
            </li>
            <li>
              <strong className="text-[var(--fg)]">The method: Google’s endpoint-type table.</strong> The same page says a single-day read becomes{" "}
              <code className={code}>dailyRollup</code>, an intraday read <code className={code}>list</code>, a time series <code className={code}>rollUp</code>{" "}
              or <code className={code}>dailyRollUp</code>, a log write <code className={code}>patch</code>. Which row an endpoint falls under is this
              site’s reading of its title, and the row is printed with it. Where the data type does not list that method in Google’s data-types
              table, the row says so.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Scopes: Google’s scope table</strong>, from the Fitbit scope on the endpoint’s page.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Everything else is unmapped.</strong> {FG_COUNTS.nameMatch} endpoints have a discovery method of the same name
              (Get Activity TCX and <code className={code}>exportExerciseTcx</code>, Get IRN Profile and <code className={code}>getIrnProfile</code>); those
              are labeled as this site’s name match, not Google’s statement.
            </li>
          </ol>
        </section>

        {FG_UNUSED_GOOGLE_ROWS.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Google rows no endpoint page here names</h2>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              Google’s data-type table has {FG_UNUSED_GOOGLE_ROWS.length} row{FG_UNUSED_GOOGLE_ROWS.length === 1 ? "" : "s"} this tool did not pair with a
              Fitbit endpoint, because no endpoint page carries the field by that name:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
              {FG_UNUSED_GOOGLE_ROWS.map((g) => (
                <li key={g.fitbitDataType}>
                  “{g.fitbitDataType}” →{" "}
                  {g.href ? (
                    <Link href={g.href} className={linkCls}>
                      {g.googleName}
                    </Link>
                  ) : (
                    g.googleName
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">Sources and what this cannot tell you</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Google’s tables come from its{" "}
              <a href={FG_MIGRATION_URL} className={linkCls} rel="noopener">
                migration guide
              </a>{" "}
              and API specifications page, read {FG_GOOGLE_READ_ON} by this site’s Google Health API generator. dev.fitbit.com cannot be reached from where
              this site is built, so Fitbit’s pages were read on a GitHub runner; every quoted path, scope and field is listed with its page in the
              site’s evidence file, which a weekly workflow re-checks against the live pages.
            </p>
            <p>
              A row maps names, not values. Google notes where a value changes meaning (Activity Calories is reconstructed by adding BMR, for one); read the
              data type’s page before you move a number across. Response fields inside each endpoint are not mapped here.
            </p>
            <p>
              Google’s timeline set November 2, 2026 as the Fitbit Web API’s turn-off date; see{" "}
              <Link href="/fitbit-api-shutdown" className={linkCls}>
                the Fitbit API shutdown
              </Link>{" "}
              and{" "}
              <Link href="/migrate/fitbit-web-api-to-google-health" className={linkCls}>
                the migration playbook
              </Link>
              .
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Each Google data type has its own page under{" "}
          <Link href="/google-health-api" className={linkCls}>
            the Google Health API reference
          </Link>
          . More at{" "}
          <Link href="/tools" className={linkCls}>
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
