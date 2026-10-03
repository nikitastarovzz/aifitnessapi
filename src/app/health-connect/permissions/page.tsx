import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ClusterCta from "@/components/ClusterCta";
import ContentAge from "@/components/ContentAge";
import PermissionTable, { type PermissionRow } from "@/components/hc/PermissionTable";
import {
  HC_FETCHED_ON,
  HC_FRAMEWORK_PERMISSIONS,
  HC_FW_PERMISSIONS_URL,
  HC_FW_PERMISSIONS_UPDATED,
  HC_JETPACK_PERMISSION_URL,
  HC_JETPACK_PERMISSION_CONSTANTS,
  HC_DATA_TYPES_URL,
  HC_ADDITIONAL_READ_PERMISSIONS,
  HC_UNRESOLVED_PERMISSIONS,
} from "@/data/healthConnectRecords";
import {
  HC_BASE,
  HC_PERMISSIONS_PATH,
  HC_PUBLISHED,
  hcModified,
  PERMISSION_GROUPS,
  groupedFrameworkPermissions,
  recordsForPermission,
  recordPath,
  permissionAnchor,
  shortAvailability,
  shortPermission,
  orderedRecords,
  hcTotals,
  GUIDE_QUOTES,
} from "@/data/hcPages";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { stringSeed } from "@/lib/cluster";

/**
 * Every android.permission.health.* string Google's framework reference
 * defines, grouped mechanically (record / additional / medical / symptom /
 * framework-only / system) and linked to the record pages that declare it.
 * The data-types table is the record mapping; the framework reference is the
 * list of strings and their availability; where the two disagree the page
 * says so rather than picking one.
 */

const T = hcTotals();
const PATH = HC_PERMISSIONS_PATH;
const TITLE = "Health Connect Permissions: Every android.permission.health";
const DESCRIPTION = `All ${T.frameworkPermissions} android.permission.health strings from Google's HealthPermissions reference, grouped, with API level and the record each unlocks.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    publishedTime: HC_PUBLISHED,
    modifiedTime: hcModified(),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function toRow(p: (typeof HC_FRAMEWORK_PERMISSIONS)[number]): PermissionRow {
  return {
    id: permissionAnchor(p.value),
    value: p.value,
    constant: p.constant,
    access: p.constant.startsWith("READ_") ? "Read" : p.constant.startsWith("WRITE_") ? "Write" : "—",
    records: recordsForPermission(p.value).map((r) => ({ className: r.className, href: recordPath(r) })),
    availability: shortAvailability(p.added),
    protectionLevel: p.protectionLevel,
    description: p.description,
  };
}

function Code({ children }: { children: string }) {
  return <code className="break-all font-mono text-[13px] text-[var(--fg)]">{children}</code>;
}

export default function HcPermissionsPage() {
  const url = absoluteUrl(PATH);
  const pageId = `${url}#webpage`;
  const groups = groupedFrameworkPermissions();
  const faqId = (i: number) => `faq-${i + 1}`;
  const routes = HC_FRAMEWORK_PERMISSIONS.find((p) => p.constant === "READ_EXERCISE_ROUTES");
  const onboarding = HC_FRAMEWORK_PERMISSIONS.find((p) => p.constant === "START_ONBOARDING");
  const protection = new Map<string, number>();
  for (const p of HC_FRAMEWORK_PERMISSIONS) protection.set(p.protectionLevel ?? "not stated", (protection.get(p.protectionLevel ?? "not stated") ?? 0) + 1);
  const symptoms = groups.get("symptom") ?? [];
  const medical = groups.get("medical") ?? [];
  const medicalExperimental = HC_JETPACK_PERMISSION_CONSTANTS.filter(
    (c) => /MEDICAL_DATA/.test(c.constant ?? "") && c.annotations.includes("ExperimentalPersonalHealthRecordApi"),
  ).length;
  const symptomAvail = [...new Set(symptoms.map((s) => shortAvailability(s.added)).filter(Boolean))];
  const medicalAvail = [...new Set(medical.map((s) => shortAvailability(s.added)).filter(Boolean))];

  const faqs: { q: string; a: string }[] = [];
  for (const u of HC_UNRESOLVED_PERMISSIONS) {
    const plural = HC_FRAMEWORK_PERMISSIONS.find((p) => p.value === `${u.permission}S`);
    if (!plural) continue;
    faqs.push({
      q: `Is it ${shortPermission(u.permission)} or ${shortPermission(plural.value)}?`,
      a: `${plural.value}. Google's Health Connect data-types table prints ${u.permission} in the ${u.className} row, but the framework HealthPermissions reference defines ${plural.constant} with the value ${plural.value}, and no reference page defines the singular read string. The write string is singular in both: ${
        HC_FRAMEWORK_PERMISSIONS.find((p) => p.constant === "WRITE_EXERCISE_ROUTE")?.value ?? "WRITE_EXERCISE_ROUTE"
      }. As read on ${HC_FETCHED_ON}.`,
    });
  }
  if (routes || onboarding) {
    faqs.push({
      q: "Which Health Connect permissions can an app not request itself?",
      a: [
        routes
          ? `${routes.value}: the framework reference says it "can only be granted manually by a user in Health Connect settings or in the route request activity" and that "Attempts to request the permission by applications will be ignored."`
          : null,
        onboarding
          ? `${onboarding.value}: the reference describes it as a permission that "can only be held by the system" (protection level ${onboarding.protectionLevel}).`
          : null,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }
  faqs.push({
    q: "What protection level do Health Connect permissions have?",
    a: `Of the ${T.frameworkPermissions} constants on Google's HealthPermissions reference (read ${HC_FETCHED_ON}), ${[...protection.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `${n} ${n === 1 ? "is" : "are"} ${k}`)
      .join(", ")}. The level is printed on each constant as "Protection level".`,
  });
  if (symptoms.length || medical.length) {
    faqs.push({
      q: "Does Health Connect have permissions for symptoms and medical records?",
      a: `Yes, on the framework side. Google's HealthPermissions reference defines ${symptoms.length} symptom strings (${symptomAvail.join(", ")}) and ${medical.length} medical-data strings (${medicalAvail.join(", ")}). None of the symptom types appears as a Jetpack record class on Google's data-types page as of ${HC_FETCHED_ON}, and ${medicalExperimental} of the Jetpack medical-data constants carry @ExperimentalPersonalHealthRecordApi.`,
    });
  }

  const graphJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: "Every Health Connect permission string",
        alternativeHeadline: "android.permission.health permissions list",
        description: DESCRIPTION,
        datePublished: HC_PUBLISHED,
        dateModified: hcModified(),
        author: orgRef(),
        publisher: orgRef(),
        inLanguage: "en",
        articleSection: "Health Connect reference",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: { "@id": pageId },
        url,
        citation: [
          { "@type": "TechArticle", url: HC_FW_PERMISSIONS_URL, name: "Google — HealthPermissions" },
          { "@type": "TechArticle", url: HC_JETPACK_PERMISSION_URL, name: "Google — HealthPermission (Jetpack)" },
          { "@type": "TechArticle", url: HC_DATA_TYPES_URL, name: "Google — Health Connect data types" },
        ],
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: TITLE,
        isPartOf: { "@id": WEBSITE_ID },
        lastReviewed: HC_FETCHED_ON,
        reviewedBy: orgRef(),
      },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#${faqId(i)}`,
      url: `${url}#${faqId(i)}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
    })),
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Health Connect", path: HC_BASE },
            { name: "Permissions", path: PATH },
          ]}
        />
        <ClusterHero label="Health Connect reference" seed={stringSeed("health-connect-permissions")} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Every Health Connect permission string
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {T.frameworkPermissions} strings · read from Google&rsquo;s HealthPermissions reference on {HC_FETCHED_ON}
          <ContentAge date={HC_FETCHED_ON} />
          {HC_FW_PERMISSIONS_UPDATED && <> · reference last updated {HC_FW_PERMISSIONS_UPDATED}</>}
        </p>

        <p
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          Health Connect permissions are manifest strings of the form <Code>android.permission.health.READ_STEPS</Code>.
          Google&rsquo;s framework HealthPermissions reference defines {T.frameworkPermissions} of them;{" "}
          {T.recordPermissionStringsInFramework} are read and write strings its data-types table declares for the {T.records}{" "}
          Jetpack record classes, and the rest
          cover background and history reads, exercise routes, medical records, symptoms, other framework-only data types and
          system use. Google&rsquo;s
          data-types page says an app must declare a permission in its manifest before requesting it.
        </p>

        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2 text-sm">
          {PERMISSION_GROUPS.filter((g) => (groups.get(g.key) ?? []).length).map((g) => (
            <a
              key={g.key}
              href={`#group-${g.key}`}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              {g.title} <span className="font-semibold tabular-nums text-[var(--fg)]">{(groups.get(g.key) ?? []).length}</span>
            </a>
          ))}
          {HC_UNRESOLVED_PERMISSIONS.length > 0 && (
            <a
              href="#disagreements"
              className="rounded-full border border-amber-400/50 px-3 py-1 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              Where Google&rsquo;s pages disagree
            </a>
          )}
          <a
            href="#faq"
            className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
          >
            Questions
          </a>
        </nav>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Google&rsquo;s data-types page: &ldquo;{GUIDE_QUOTES.declareFirst.text}&rdquo; It lists two read permissions apart from
          the data types:{" "}
          {HC_ADDITIONAL_READ_PERMISSIONS.map((a, i) => (
            <span key={a.permission}>
              {i > 0 ? " and " : ""}
              <a href={`#${permissionAnchor(a.permission)}`} className="font-mono text-[12px] text-brand-600 hover:text-brand-500">
                {shortPermission(a.permission)}
              </a>{" "}
              ({a.label.toLowerCase()})
            </span>
          ))}
          .
        </p>

        {PERMISSION_GROUPS.map((g) => {
          const list = groups.get(g.key) ?? [];
          if (!list.length) return null;
          return (
            <section key={g.key} id={`group-${g.key}`} className="mt-14 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
                {g.title}{" "}
                <span className="ml-1 text-base font-normal tabular-nums text-[var(--muted)]">{list.length}</span>
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{g.blurb}</p>
              {g.key === "medical" && medicalExperimental > 0 && (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  On the Jetpack side, {medicalExperimental} medical-data constants on <Code>HealthPermission</Code> carry{" "}
                  <Code>@ExperimentalPersonalHealthRecordApi</Code>.
                </p>
              )}
              <PermissionTable rows={list.map(toRow)} label={g.title} />
            </section>
          );
        })}

        {HC_UNRESOLVED_PERMISSIONS.length > 0 && (
          <section id="disagreements" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Where Google&rsquo;s pages disagree</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Strings Google&rsquo;s data-types table prints that neither the framework HealthPermissions reference nor a
              Jetpack HealthPermission constant defines. Published as found — we do not correct Google&rsquo;s table, we
              show you both.
            </p>
            <ul className="mt-4 space-y-3">
              {HC_UNRESOLVED_PERMISSIONS.map((u) => {
                const rec = orderedRecords().find((r) => r.className === u.className);
                const plural = HC_FRAMEWORK_PERMISSIONS.find((p) => p.value === `${u.permission}S`);
                return (
                  <li
                    key={u.permission}
                    id={permissionAnchor(u.permission)}
                    className="scroll-mt-24 rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm text-[var(--fg)]"
                  >
                    <Code>{u.permission}</Code> — printed in the data-types row for{" "}
                    {rec ? (
                      <Link href={recordPath(rec)} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">
                        {u.className}
                      </Link>
                    ) : (
                      <Code>{u.className}</Code>
                    )}
                    .
                    {plural && (
                      <>
                        {" "}
                        The framework reference defines <a href={`#${permissionAnchor(plural.value)}`} className="font-mono text-[13px] text-brand-600 hover:text-brand-500">{plural.value}</a> ({plural.constant}).
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section id="faq" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Questions</h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {faqs.map((f, i) => (
              <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ClusterCta
          pitch="Subscribe and we'll tell you when Google adds a Health Connect permission string, with the record it unlocks."
          source="spoke-inline"
          id="cta-hc-permissions"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          Strings, descriptions, protection levels and availability are copied from{" "}
          <a href={HC_FW_PERMISSIONS_URL} className="text-brand-600 hover:text-brand-500" rel="noopener">
            Google&rsquo;s HealthPermissions reference
          </a>
          ; the record mapping is from{" "}
          <a href={HC_DATA_TYPES_URL} className="text-brand-600 hover:text-brand-500" rel="noopener">
            Google&rsquo;s data-types table
          </a>
          ; the Jetpack annotations from the{" "}
          <a href={HC_JETPACK_PERMISSION_URL} className="text-brand-600 hover:text-brand-500" rel="noopener">
            HealthPermission reference
          </a>
          — all read {HC_FETCHED_ON} by {site.name}&rsquo;s generator. How to request them at runtime is on{" "}
          <Link href="/integrate/google-health-connect" className="font-medium text-brand-600 hover:text-brand-500">
            integrating Health Connect
          </Link>
          ; every record is on the{" "}
          <Link href={HC_BASE} className="font-medium text-brand-600 hover:text-brand-500">
            Health Connect reference
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
