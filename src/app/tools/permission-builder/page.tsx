import type { Metadata } from "next";
import { pageMirrorAlternates } from "@/lib/pageMirrors/alternates";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/components/Container";
import type { PermOption } from "@/components/tools/PermissionBuilder";
import PermissionTool from "@/components/tools/PermissionTool";
import MoreTools from "@/components/tools/MoreTools";
import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { HK_READONLY } from "@/data/healthkitWritability";
import { ROWS as MATRIX_ROWS } from "@/data/matrix";
import * as HC from "@/data/healthConnectRecords";
import {
  HC_BASE,
  PERMISSION_GROUPS,
  permissionAnchor,
  permissionGroupOf,
  recordPath,
  shortAvailability,
} from "@/data/hcPages";
import { buildAndroidReference, SOURCES as XRAY_SOURCES } from "@/lib/permissionXray.mjs";
import { site } from "@/lib/site";
import { toolGraph, publishedDate } from "@/lib/schema";
import ToolNextStep from "@/components/ToolNextStep";

/**
 * HealthKit permission builder.
 *
 * The page is a thin server shell: it joins three verified datasets into the
 * option list the client tool needs, so the full identifier corpus never ships
 * to the browser and the tool cannot state anything the reference pages do
 * not.
 *
 *   healthkitIdentifiers.ts  — the identifiers themselves, read from Apple.
 *   healthkitWritability.ts  — the 14 types Apple documents as read-only,
 *                              carrying the sentence that says so.
 *   matrix.ts                — Health Connect record names, but only for
 *                              metrics confirmed against both platforms.
 *
 * The builder emits no Android permission string and no Kotlin. The second
 * mode, the Permission X-ray, reads permission strings a visitor pastes and
 * looks each one up in healthConnectRecords.ts (GENERATED from Google's
 * HealthPermissions reference and data-types table), joined here on the
 * server so only the lookup ships, not the record corpus. Its iOS half
 * quotes only sentences this site already sources; see
 * src/lib/permissionXray.mjs and npm run test:permission-xray.
 */

const PATH = "/tools/permission-builder";
const UPDATED = "2026-09-04";
const TITLE = "HealthKit Permission Builder";
const DESCRIPTION =
  "Pick HealthKit types for the Info.plist keys and toShare/toRead Swift, or paste an AndroidManifest or Info.plist to see the health access it requests.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageMirrorAlternates(PATH),
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const ANSWER =
  "Pick the HealthKit identifiers your app reads or writes and this returns three things: the Info.plist usage-description keys you actually need, the toShare and toRead sets for requestAuthorization(toShare:read:), and the Health Connect record names for the types verified on both platforms. It refuses to put a type in a write set when Apple's own documentation says the samples are read-only, and it shows you Apple's sentence rather than asking you to take its word for it. Everything runs in your browser.";

/** Health Connect record names, keyed by HealthKit case — matrix rows only. */
const androidFor = new Map<string, string>();
for (const row of MATRIX_ROWS) {
  for (const m of row.apple.matchAll(/(?:HK\w*TypeIdentifier)?\.([A-Za-z][A-Za-z0-9]*)/g)) {
    androidFor.set(m[1], row.android);
  }
}

const readOnlyEvidenceFor = new Map(HK_READONLY.map((r) => [r.case, r.evidence]));

const OPTIONS: PermOption[] = HK_IDENTIFIERS.map((r) => ({
  case: r.case,
  family: r.family,
  group: r.group,
  abstract: r.abstract,
  readOnlyEvidence: readOnlyEvidenceFor.get(r.case) ?? null,
  android: androidFor.get(r.case) ?? null,
}));

/** The Health Connect lookup the X-ray needs: Google's permission strings,
 *  descriptions and record classes, with this site's links to each. */
const XRAY_REF = buildAndroidReference(HC, {
  recordPath,
  permissionAnchor,
  availability: shortAvailability,
  groupOf: (p) =>
    PERMISSION_GROUPS.find((g) => g.key === permissionGroupOf(p.value, p.constant, p.protectionLevel))?.title ?? null,
});

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function PermissionBuilderPage() {
  // A tool, so a WebApplication (see toolGraph); dates as this page already
  // declared them.
  const graphJsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "healthkit permission request generator",
    description: DESCRIPTION,
    datePublished: publishedDate("tools/permission-builder", UPDATED),
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: TITLE, path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {OPTIONS.length} identifiers and {HK_READONLY.length}{" "}documented read-only types · read
          from Apple&rsquo;s documentation on {HK_FETCHED_ON}
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {ANSWER}
        </p>

        {/* id="xray": the target of /tools/permission-builder#xray, which
            PermissionTool reads to open the paste mode. With the id here the
            fragment also lands the reader on the tool, and qa's FRAGMENT-DEAD
            can resolve links that use it. */}
        <section id="xray" data-tool="permission-builder" aria-label="HealthKit permission builder and Permission X-ray" className="mt-10 scroll-mt-24">
          <PermissionTool options={OPTIONS} androidRef={XRAY_REF} />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            The caveat that outlives this page
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Generating a correct authorization call is the easy half. The half that breaks products
            is what happens afterwards:{" "}
            <strong className="text-[var(--fg)]">
              HealthKit does not tell you whether the user granted or denied read access.
            </strong>{" "}
            That is deliberate — reporting it would leak whether a person has health data at all.{" "}
            <code className="font-mono text-sm">authorizationStatus(for:)</code> reliably reflects
            only write and share status; for read types it typically returns{" "}
            <code className="font-mono text-sm">.notDetermined</code> even after a grant.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            So <code className="font-mono text-sm">requestAuthorization</code> succeeding means the
            sheet was shown, not that read was granted. Never gate your UI on read-authorization
            status. Run the query and treat an empty result as{" "}
            <em>no data or no permission</em> — the two are indistinguishable, by design. Design the
            empty state before the happy path.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/integrate/healthkit"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                How to integrate Apple HealthKit &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — the guide these snippets follow, step by step.
              </span>
            </li>
            <li>
              <Link
                href="/blog/healthkit-error-that-never-fires"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                The HealthKit error that never fires &rarr;
              </Link>{" "}
              <span className="text-[var(--muted)]">
                — why an empty read is not a denial, and what to build instead.
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Permission X-ray: what a pasted manifest asks for
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            The second mode reads a pasted AndroidManifest.xml, Info.plist or entitlements file and lists the
            health access it asks for, with a source for every row. Nothing you paste leaves the browser.
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Android: each <code className="font-mono text-sm">android.permission.health.*</code> string is looked up
            in the {XRAY_REF.count} permissions of Google&rsquo;s HealthPermissions reference as this site read it on{" "}
            {HC.HC_FETCHED_ON}, with Google&rsquo;s description and the record classes Google&rsquo;s data-types table
            prints for it, each linked to its{" "}
            <Link href={HC_BASE} className={linkCls}>
              Health Connect record page
            </Link>
            . A string that reference does not define is listed as not in it, never explained from its name. A
            manifest that requests health permissions without the privacy-policy rationale activity is flagged with
            Google&rsquo;s sentence, as quoted on the{" "}
            <Link href={XRAY_SOURCES.permissionController.path} className={linkCls}>
              PermissionController page
            </Link>
            .
          </p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            iOS: the NSHealth usage-description keys and the{" "}
            <code className="font-mono text-sm">com.apple.developer.healthkit</code>{" "}
            entitlements are explained in Apple&rsquo;s words as quoted in the{" "}
            <Link href={XRAY_SOURCES.integrateHealthkit.path} className={linkCls}>
              HealthKit integration guide
            </Link>
            , on{" "}
            <Link href={XRAY_SOURCES.clinicalRecords.path} className={linkCls}>
              HealthKit clinical records
            </Link>{" "}
            and in the{" "}
            <Link href={XRAY_SOURCES.backgroundDelivery.path} className={linkCls}>
              background delivery fix
            </Link>
            . A missing or empty usage string is flagged only where one of those pages states the requirement; any
            other key is listed as not documented here.
          </p>
        </section>

        <details className="mt-12 rounded-xl border border-[var(--border)] p-5">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
            Where this output comes from, and where it runs
          </summary>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Everything on this page runs client-side. Your selection and anything you paste never
              leave the browser: there is no request to a server, nothing is stored, and no health
              data is involved at any point — you are handling type and permission <em>names</em>,
              not data.
            </p>
            <p>
              The identifier list is Apple&rsquo;s own, parsed from their developer documentation on{" "}
              {HK_FETCHED_ON} and published in full at{" "}
              <Link
                href="/healthkit-identifiers"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                every HealthKit type identifier
              </Link>
              . The {HK_READONLY.length} read-only flags come from the same corpus, each carrying
              the Apple sentence it was derived from; an identifier absent from that list is{" "}
              <em>unknown</em>, not writable, because Apple states writability in prose and silence
              is not a statement.
            </p>
            <p>
              Android record names come only from the{" "}
              <Link href="/matrix" className="font-medium text-brand-600 hover:text-brand-500">
                cross-platform matrix
              </Link>
              , which is restricted to metrics confirmed against both platforms&rsquo;
              documentation. Where a type has no matrix row, the tool says so rather than guessing a
              record name. The builder emits no Health Connect permission strings or client code; the
              X-ray only looks up strings you paste, against Google&rsquo;s reference.
            </p>
            <p>
              Swift symbols are emitted only where the{" "}
              <Link
                href="/integrate/healthkit"
                className="font-medium text-brand-600 hover:text-brand-500"
              >
                integration guide
              </Link>{" "}
              establishes them. <code className="font-mono">HKQuantityType(.case)</code>{" "}is the iOS
              16+ initializer; the category and characteristic initializers are not established
              here, so the generator names those picks in a comment instead of inventing a
              constructor. Verify every signature against Apple&rsquo;s current documentation
              before you ship.
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Data read from Apple&rsquo;s published documentation on{" "}
          {HK_FETCHED_ON}; the machine-readable export is on{" "}
          <Link href="/datasets" className="font-medium text-brand-600 hover:text-brand-500">
            datasets
          </Link>
          .
        </p>

        <MoreTools path={PATH} />
        <ToolNextStep path="/tools/permission-builder" />
      </div>
    </Container>
  );
}
