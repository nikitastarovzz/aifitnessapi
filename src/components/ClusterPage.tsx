import Link from "next/link";
import { entityAnchor } from "@/data/headTerms";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import ArchDiagram from "@/components/ArchDiagram";
import { Mdx } from "@/components/mdx";
import PageActions from "@/components/PageActions";
import BookmarkButton from "@/components/BookmarkButton";
import PageToc from "@/components/PageToc";
import FaqJump from "@/components/FaqJump";
import NextSteps from "@/components/NextSteps";
import MetricFacts from "@/components/MetricFacts";
import MetricPlatforms from "@/components/MetricPlatforms";
import ContentAge from "@/components/ContentAge";
import ReferenceCallout from "@/components/ReferenceCallout";
import SeeAlsoCallout from "@/components/SeeAlsoCallout";
import KinestexNote, { KINESTEX_NOTE_PATHS } from "@/components/KinestexNote";
import AppStack from "@/components/AppStack";
import PostLinks from "@/components/PostLinks";
import Feedback from "@/components/Feedback";
import VendorHubMenu from "@/components/VendorHubMenu";
import KeyFacts from "@/components/KeyFacts";
import CiteBox from "@/components/CiteBox";
import { keyFacts } from "@/lib/keyFacts";
import { formatDate } from "@/lib/posts";
import { site, absoluteUrl } from "@/lib/site";
import { spokeGraph, translationGraph, markdownUrl } from "@/lib/schema";
import { currentPtPath, formatDatePt, PT_PREFIX, type TranslationView } from "@/lib/translations";
import { heroSeed } from "@/lib/cluster";
import { clusterMap, clusterNeighbors } from "@/lib/clusterRegistry";
import { relatedAcrossSite } from "@/lib/related";
import { apisOnPage } from "@/lib/apiCoverage";
import { APIS_PATH } from "@/data/apis";
import { autolinkGlossary } from "@/lib/autolink";
import { offersTableEmbeds } from "@/lib/embedTables";
import { headings } from "@/lib/toc";
import readingTime from "reading-time";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";
import type { ReactNode } from "react";
import DecisionKitCta from "@/components/DecisionKitCta";

/** Sections whose pages carry the decision-kit block (ops/MORE-30-2026-11-05.md item 29). */
const KIT_SECTIONS = new Set(["/pricing", "/alternatives"]);

/**
 * Tool CTAs. The "does" line restates the /tools hub's own blurb (or the
 * tool's own capsule), so a tool is described the same way wherever it is
 * mentioned and never promises more than the tool page does.
 */
const TOOLS = {
  diagnoser: {
    href: "/tools/error-diagnoser",
    name: "Error diagnoser",
    does: "paste an error string or status line to match it against the HKError.Code cases Apple documents and the troubleshooting guides on this site.",
  },
  permissions: {
    href: "/tools/permission-builder",
    name: "HealthKit permission builder",
    does: "pick the types your app touches and get the Info.plist keys, the toShare/toRead Swift, and the Health Connect record names.",
  },
  stack: {
    href: "/tools/stack-generator",
    name: "Fitness app stack generator",
    does: "answer four questions and get the HealthKit types and APIs that survive them, with the exclusions shown.",
  },
  keypoints: {
    href: "/tools/keypoint-playground",
    name: "Pose keypoint playground",
    does: "click a joint and see its index in BlazePose, COCO, OpenPose, ML Kit and Apple Vision, then copy an index map built from matching names only.",
  },
  rateLimit: {
    href: "/tools/rate-limit-calculator",
    name: "Rate-limit calculator",
    does: "put your users, sync frequency and endpoints per sync against this vendor's documented rate limit and see which limit binds first.",
  },
  webhook: {
    href: "/tools/webhook-verifier",
    name: "Webhook verifier",
    does: "paste a webhook you received and check it the way the vendor documents, in your browser, with each field explained and the response the vendor expects.",
  },
  poseBenchmark: {
    href: "/tools/pose-benchmark",
    name: "Pose model benchmark",
    does: "time MediaPipe Pose Landmarker lite, full and heavy on your own device and copy the latency table as markdown.",
  },
  heartRate: {
    href: "/tools/heart-rate-lab",
    name: "Bluetooth heart-rate lab",
    does: "connect a BLE heart-rate strap in the browser: every 0x2A37 byte decoded, and whether it sends the RR intervals HRV needs.",
  },
  ftms: {
    href: "/tools/ftms-lab",
    name: "FTMS lab",
    does: "connect a treadmill, indoor bike, rower or cross trainer in the browser, or paste hex, and see each FTMS value decoded flag by flag against the Bluetooth SIG structure.",
  },
  cyclingPower: {
    href: "/tools/cycling-power-lab",
    name: "Cycling power and cadence lab",
    does: "decode Cycling Power (0x2A63) and CSC (0x2A5B) values and watch cadence and speed computed from cumulative revolutions and event times, live or pasted.",
  },
  gattExplorer: {
    href: "/tools/ble-gatt-explorer",
    name: "BLE GATT explorer",
    does: "connect any Bluetooth LE device in the browser, list its services and characteristics by SIG name, and decode the values the SIG defines.",
  },
  stepLab: {
    href: "/tools/step-lab",
    name: "Step lab",
    does: "walk with your phone and watch a visible step detector count; move its threshold and interval to see why two apps disagree.",
  },
  appleHealthExplorer: {
    href: "/tools/apple-health-explorer",
    name: "Apple Health export explorer",
    does: "open your Health export.zip in the browser and see every record type with counts, dates, sources, a daily chart and a CSV per type; nothing is uploaded.",
  },
  repCounter: {
    href: "/tools/rep-counter-playground",
    name: "Rep counter playground",
    does: "load a workout video, see joint angles over time, tune a hysteresis rep counter's thresholds and export the config as JSON; the video stays in your browser.",
  },
  exerciseTaxonomy: {
    href: "/tools/exercise-taxonomy-crosswalk",
    name: "Exercise taxonomy crosswalk",
    does: "see how free-exercise-db, wger and ExerciseDB v1 categories, equipment and muscles line up with HealthKit and Health Connect workout types, matched by name only.",
  },
  gymMatrix: {
    href: "/tools/gym-software-api-matrix",
    name: "Gym software API matrix",
    does: "filter the gym and studio platforms by webhooks, sandbox, bookings, members, payments and check-ins, each cell quoting its vendor source.",
  },
  aggregatorChooser: {
    href: "/tools/aggregator-chooser",
    name: "Health data aggregator chooser",
    does: "tick the sources, pricing, webhooks, BAA, data region or self-hosting you need and see which aggregators document each, every cell quoting its source.",
  },
  researchChooser: {
    href: "/tools/research-platform-chooser",
    name: "Research platform chooser",
    does: "tick what your study needs and see which research platforms document it, each answer quoting the vendor's page.",
  },
  formRules: {
    href: "/tools/exercise-form-rules",
    name: "Exercise form rules",
    does: "see the joint-angle thresholds open-source exercise trackers use for this movement, each quoted from its code, with a null where none states one.",
  },
  buildPlan: {
    href: "/tools/build-plan",
    name: "Build plan and PRD generator",
    does: "pick an app type, platforms, data sources and features and get a shareable build plan and a PRD template from the site's sourced pages.",
  },
  storeChecklist: {
    href: "/tools/store-submission-checklist",
    name: "Store submission checklist",
    does: "every App Store and Google Play rule a health app is reviewed against, quoted item by item, with your progress kept in your browser.",
  },
  complianceWizard: {
    href: "/tools/compliance-wizard",
    name: "Compliance wizard",
    does: "answer nine questions and see which rules likely apply to your app, each quoted from HHS, the FTC, the GDPR, Washington, the FDA or the stores.",
  },
  schemaConverter: {
    href: "/tools/schema-converter",
    name: "Health data schema converter",
    does: "paste a HealthKit export row, Health Connect record or Google Health API data point and see it in one unified schema, each field traced to its source.",
  },
  fitbitGoogle: {
    href: "/tools/fitbit-to-google-health",
    name: "Fitbit to Google Health API map",
    does: "search every Fitbit Web API endpoint and see its Google Health API data type, method and scopes from Google's migration tables, or that none is listed.",
  },
  sampleData: {
    href: "/tools/sample-data",
    name: "Synthetic health data generator",
    does: "seeded synthetic HealthKit, Health Connect and Google Health API fixtures as JSON or CSV, with per-record UTC offsets.",
  },
} as const;

/**
 * Keyed by spoke PATH, not by cluster: a tool earns a line on a page only
 * where it answers the question that page is about. A renamed or unreleased
 * spoke simply never matches, and every tool is a static route, so nothing
 * here can link a 404. At most one tool per page.
 */
const TOOL_FOR_PATH: Record<string, keyof typeof TOOLS> = {
  // Every HealthKit troubleshooting spoke. Each is about an HKError.Code case
  // (or about the absence of one), and the diagnoser indexes every case.
  "/fix/healthkit-no-data": "diagnoser",
  "/fix/healthkit-authorization-denied": "diagnoser",
  "/fix/healthkit-background-delivery-not-working": "diagnoser",
  "/fix/healthkit-database-inaccessible": "diagnoser",
  "/fix/healthkit-health-data-unavailable": "diagnoser",
  "/fix/healthkit-data-restricted-mdm": "diagnoser",
  "/fix/healthkit-error-no-data": "diagnoser",
  "/fix/healthkit-invalid-argument": "diagnoser",
  "/fix/healthkit-authorization-not-determined": "diagnoser",
  "/fix/healthkit-required-authorization-denied": "diagnoser",
  "/fix/healthkit-workout-session-errors": "diagnoser",
  "/fix/healthkit-guest-user-mode": "diagnoser",
  "/fix/healthkit-undocumented-errors": "diagnoser",
  // Non-HealthKit errors only where the diagnoser's authored keyword map
  // (FIX_KEYWORDS in lib/errorDiagnoserKeywords.ts) routes to the page.
  "/fix/fitbit-error-code-401": "diagnoser",
  "/fix/fitbit-api-410-gone": "diagnoser",
  "/fix/fitbit-api-429-rate-limit": "diagnoser",
  "/fix/garmin-api-approval": "diagnoser",
  "/integrate/healthkit": "permissions",
  // Every integration guide whose vendor the webhook verifier covers, and the
  // webhook troubleshooting spoke.
  "/integrate/oura-api": "webhook",
  "/integrate/whoop-api": "webhook",
  "/integrate/terra-api": "webhook",
  "/integrate/polar-api": "webhook",
  "/integrate/strava-api": "webhook",
  "/integrate/withings-api": "webhook",
  "/integrate/wahoo-api": "webhook",
  "/fix/strava-webhook-not-firing": "webhook",
  // Guides whose vendor documents a rate limit the calculator models and no
  // webhook-verifier rule.
  "/integrate/dexcom-api": "rateLimit",
  "/integrate/coros-api": "rateLimit",
  // The model comparison readers leave for the keypoint maps once a model is chosen.
  "/motion/pose-estimation-models-compared": "keypoints",
  // Model pages whose keypoint scheme the playground maps (Apple Vision; the
  // COCO 17 that Ultralytics YOLO pose emits), and the MediaPipe page whose
  // three variants the benchmark times.
  "/motion/apple-vision-body-pose": "keypoints",
  "/motion/yolo-pose-models": "keypoints",
  "/motion/mediapipe-pose-landmarker-models": "poseBenchmark",
  // Rep counting: the playground runs the state machine this page describes
  // on the reader's own video, every threshold exposed.
  "/motion/how-rep-counting-works": "repCounter",
  // Exercise pages the form-rules dataset has thresholds for, and the
  // form-feedback method page whose angle rules it collects.
  "/motion/how-form-feedback-works": "formRules",
  // Exercise-content pages whose databases the taxonomy crosswalk reads, the
  // gym roundup and the integration guides its matrix covers, and the research
  // pages the chooser is built from.
  "/fitness-apis/exercise-database-apis": "exerciseTaxonomy",
  "/compare/exercisedb-vs-wger": "exerciseTaxonomy",
  "/compare/exercisedb-vs-free-exercise-db": "exerciseTaxonomy",
  "/fitness-apis/gym-management-software-apis": "gymMatrix",
  "/integrate/mindbody-api": "gymMatrix",
  "/integrate/glofox-api": "gymMatrix",
  "/integrate/teamup-api": "gymMatrix",
  "/integrate/mariana-tek-api": "gymMatrix",
  "/integrate/wodify-api": "gymMatrix",
  // The aggregator pages the chooser's cells are quoted from: the roundup,
  // the pricing pages, the head-to-head comparisons and the alternatives
  // pages (ops/VIRAL-20-2026-11-06.md item 16). A body link only; no title or
  // description of these held pages changes.
  "/fitness-apis/health-data-aggregator-apis": "aggregatorChooser",
  "/fitness-apis/terra-vs-vital": "aggregatorChooser",
  "/alternatives/terra-alternatives": "aggregatorChooser",
  "/alternatives/rook-alternatives": "aggregatorChooser",
  "/alternatives/sahha-alternatives": "aggregatorChooser",
  "/alternatives/spike-api-alternatives": "aggregatorChooser",
  "/compare/terra-vs-rook": "aggregatorChooser",
  "/compare/terra-vs-spike": "aggregatorChooser",
  "/compare/terra-vs-thryve": "aggregatorChooser",
  "/compare/terra-vs-sahha": "aggregatorChooser",
  "/compare/terra-vs-open-wearables": "aggregatorChooser",
  "/compare/rook-vs-spike": "aggregatorChooser",
  "/pricing/health-data-aggregator-pricing": "aggregatorChooser",
  "/pricing/terra-api-pricing": "aggregatorChooser",
  "/pricing/rook-api-pricing": "aggregatorChooser",
  "/pricing/junction-api-pricing": "aggregatorChooser",
  "/pricing/sahha-api-pricing": "aggregatorChooser",
  "/pricing/thryve-api-pricing": "aggregatorChooser",
  "/fitness-apis/wearable-research-data-platforms": "researchChooser",
  "/migrate/fitbit-research-studies-after-turndown": "researchChooser",
  "/motion/squat-detection-pose-estimation": "formRules",
  "/motion/push-up-counter-computer-vision": "formRules",
  "/motion/bicep-curl-counter-pose-estimation": "formRules",
  "/motion/lunge-detection-pose-estimation": "formRules",
  "/motion/plank-detection-pose-estimation": "formRules",
  // The Bluetooth heart-rate pages: the lab decodes the standard Heart Rate
  // Measurement characteristic these guides explain, over Web Bluetooth.
  "/devices/ant-plus-vs-bluetooth": "heartRate",
  "/devices/bluetooth-heart-rate-monitor": "heartRate",
  "/devices/web-bluetooth-fitness": "heartRate",
  // FTMS and cycling sensors: the labs decode the characteristics these
  // guides name, over Web Bluetooth or from pasted hex.
  "/devices/ftms-fitness-machine-service": "ftms",
  "/devices/treadmill-app-integration": "ftms",
  "/devices/indoor-bike-trainer-integration": "ftms",
  "/devices/rowing-machine-data": "ftms",
  "/devices/cycling-sensors-power-cadence": "cyclingPower",
  // Testing and the iOS guide are about devices of every kind.
  "/devices/testing-ble-fitness-devices": "gattExplorer",
  "/devices/ios-ble-fitness-devices": "gattExplorer",
  // The phone step-counter APIs: they return a count, and the lab shows a
  // step detector deciding one from the accelerometer, thresholds visible.
  "/phone-sensors/android-step-counter-sensor": "stepLab",
  "/phone-sensors/cmpedometer": "stepLab",
  // The export how-to: the explorer opens the file that page tells you to make.
  "/own-your-data/apple-health-export": "appleHealthExplorer",
  // Normalizing wearable data: the converter turns three platforms' payloads into one shape.
  "/architecture/normalize-wearable-data": "schemaConverter",
  // The Fitbit move: the map lists every endpoint beside its Google Health API answer.
  "/migrate/fitbit-web-api-to-google-health": "fitbitGoogle",
  // The platform comparison: the generator emits both platforms' fixtures.
  "/fitness-apis/apple-healthkit-vs-google-health-connect": "sampleData",
  // Every build guide: the generator is these guides' stacks, narrowed.
  "/build/personal-training-app": "stack",
  "/build/home-workout-app": "stack",
  "/build/ai-fitness-coaching-app": "stack",
  "/build/rehab-physical-therapy-app": "stack",
  "/build/yoga-app": "stack",
  "/build/corporate-wellness-app": "stack",
  "/build/strength-training-app": "stack",
  "/build/running-app": "stack",
  "/build/nutrition-tracking-app": "stack",
  "/build/weight-loss-app": "stack",
  "/build/meal-planning-app": "stack",
  "/build/sleep-tracking-app": "stack",
  "/build/recovery-app": "stack",
  "/build/meditation-app": "stack",
  "/build/cycle-tracking-app": "stack",
  "/build/step-challenge-app": "stack",
  "/build/senior-fitness-app": "stack",
  "/build/cycling-app": "stack",
  "/build/swimming-app": "stack",
  "/build/hiking-app": "stack",
  "/build/hiit-app": "stack",
  "/build/triathlon-app": "stack",
  "/build/kids-fitness-app": "stack",
  "/build/fitness-app-tech-stack": "buildPlan",
  // Compliance spokes: the store-rule pages hand on to the checklist that
  // quotes those rules item by item; the law pages to the wizard that routes
  // an app to them (ops/AUDIENCE-30-2026-11-05.md items 19–20).
  "/compliance/app-store-health-data-rules": "storeChecklist",
  "/compliance/google-play-health-data-policy": "storeChecklist",
  "/compliance/google-play-health-connect-publishing-requirements": "storeChecklist",
  "/compliance/app-store-guideline-5-1-3-health-research": "storeChecklist",
  "/compliance/app-store-guideline-5-1-1-data-collection-storage": "storeChecklist",
  "/compliance/app-store-guideline-5-1-2-data-use-sharing": "storeChecklist",
  "/compliance/app-store-guideline-1-4-1-physical-harm": "storeChecklist",
  "/compliance/app-store-guideline-2-5-1-healthkit-software-requirements": "storeChecklist",
  "/compliance/app-store-guideline-3-1-3-d-person-to-person-fitness": "storeChecklist",
  "/compliance/hipaa-compliance-fitness-app": "complianceWizard",
  "/compliance/is-fitness-data-phi": "complianceWizard",
  "/compliance/gdpr-fitness-app": "complianceWizard",
  "/compliance/gym-gdpr-compliance": "complianceWizard",
  "/compliance/ftc-health-breach-notification-rule": "complianceWizard",
  "/compliance/washington-my-health-my-data-act": "complianceWizard",
  "/compliance/fda-fitness-app-regulation": "complianceWizard",
};

/**
 * The fixed spoke anatomy (§3), top to bottom:
 * breadcrumbs → H1 → answer capsule (speakable) → body → FAQ → related → CTA →
 * disclaimer. Plus Article (and HowTo when the entry has steps) + FAQPage
 * JSON-LD. BreadcrumbList is emitted by the <Breadcrumbs> component only.
 * Shared across clusters via `config` (base path + hub label).
 */
export default function ClusterPage({
  entry,
  config,
  translation,
  sourceBody,
  signup,
}: {
  entry: ClusterEntry;
  config: ClusterConfig;
  /**
   * English money pages only: the inline newsletter form, rendered in the
   * CTA's place. A slot rather than an import, so the form's client script
   * ships only on the routes that pass it (components/InlineSignup).
   */
  signup?: ReactNode;
  /**
   * Render as a translation (src/lib/translations.ts): `entry` holds the
   * translated text, `config.basePath` the translated section path, and the
   * chrome switches to the translation's language. English-only blocks (tool
   * and vendor menus, matrix facts, cross-site reading lists) are left out
   * rather than shown untranslated. Absent, the page renders exactly as an
   * English spoke always has.
   */
  translation?: TranslationView;
  /** With `translation`: the English body, whose links are the citations. */
  sourceBody?: string;
}) {
  const { basePath, hubLabel } = config;
  const url = absoluteUrl(`${basePath}/${entry.slug}`);
  const capsuleId = "answer";
  const tr = translation;

  const path = `${basePath}/${entry.slug}`;
  const mdUrl = markdownUrl(path);
  // The current translation of this English page, for the language switch.
  const ptPath = tr ? null : currentPtPath(path);
  // First mention of each glossary concept becomes a link (never inside code
  // or an existing link — see lib/autolink), so the vocabulary is navigable
  // without a writer remembering to wire it. The glossary is English, so a
  // translation keeps its own links only.
  const body = tr ? entry.body : autolinkGlossary(entry.body, path);
  const toc = headings(entry.body);
  const minutes = Math.max(1, Math.round(readingTime(entry.body).minutes));
  const alsoRead = relatedAcrossSite(basePath, entry.slug);
  // The products this page actually discusses, linked to their directory
  // entries — access terms, gates and everything else we have written about
  // each one, without the reader having to search for the name.
  const products = apisOnPage(basePath, entry.slug);
  const toolKey = TOOL_FOR_PATH[path];
  const tool = toolKey ? TOOLS[toolKey] : undefined;
  // /questions/<cluster> is generated for every populated cluster, and a spoke
  // rendering here means its cluster is populated. Counted exactly as that
  // page counts, so the number in the link is the number on the page.
  const clusterEntries = clusterMap()[basePath] ?? [];
  const clusterQuestions = clusterEntries.reduce((n, e) => n + e.faqs.length, 0);
  // Verbatim, numbered quotes from the page's checked sources (lib/keyFacts).
  // A translation shows the English page's, which its sources list is — and
  // a stale translation has no sources list, so it shows none.
  const facts = keyFacts(tr ? tr.enPath : path, entry);

  // TechArticle + WebPage graph (review metadata, glossary `about` links,
  // citations, markdown encoding). Built centrally so every spoke agrees.
  const graphJsonLd = tr
    ? translationGraph({
        entry,
        path,
        enPath: tr.enPath,
        inLanguage: tr.lang,
        translatedOn: tr.translatedOn,
        hubLabel,
        sourceBody: sourceBody ?? "",
        capsuleId,
      })
    : spokeGraph({ entry, basePath, hubLabel, capsuleId });

  // Emit HowTo alongside Article for step-based how-to pages (§7).
  const howToJsonLd = entry.steps?.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: entry.h1,
        description: entry.metaDescription,
        step: entry.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      }
    : null;

  // Each FAQ gets a stable anchor so an assistant can deep-link the exact
  // answer it quoted, rather than the top of a long page.
  const faqId = (i: number) => `faq-${i + 1}`;
  const faqJsonLd = entry.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entry.faqs.map((f, i) => ({
          "@type": "Question",
          "@id": `${url}#${faqId(i)}`,
          url: `${url}#${faqId(i)}`,
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#${faqId(i)}` },
        })),
      }
    : null;

  return (
    <Container className="py-14">
      {/* Markdown mirror of this page, discoverable per the llms.txt
          convention. React hoists these into <head>. */}
      <link rel="alternate" type="text/markdown" href={mdUrl} />
      <link rel="describedby" type="text/plain" href={absoluteUrl("/llms.txt")} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <PageToc headings={toc} />

      <article className="mx-auto max-w-2xl">
        <Breadcrumbs
          trail={
            tr
              ? [
                  { name: "Home", path: "/" },
                  { name: "Em português", path: PT_PREFIX },
                  { name: entry.h1, path },
                ]
              : [
                  { name: "Home", path: "/" },
                  { name: hubLabel, path: basePath },
                  { name: entry.h1, path: `${basePath}/${entry.slug}` },
                ]
          }
        />

        <ClusterHero label={hubLabel} seed={heroSeed(basePath)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          {entry.h1}
        </h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {tr ? (
            // A translation is not a re-verification: the date is the English
            // page's, and says so (qa's PTBR-DATES holds it to that date).
            <p className="text-sm text-[var(--muted)]" data-ptbr-verified={entry.updated}>
              Verificado em {formatDatePt(entry.updated)} (versão em inglês)
              <ContentAge date={entry.updated} locale="pt-BR" /> · Traduzido em{" "}
              {formatDatePt(tr.translatedOn)} · {minutes} min de leitura ·{" "}
              <Link
                href={tr.enPath}
                hrefLang="en"
                lang="en"
                data-lang-switch="en"
                className="text-brand-600 hover:text-brand-500"
              >
                Read in English
              </Link>
            </p>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Last verified {formatDate(entry.updated)}
              <ContentAge date={entry.updated} /> · {minutes} min read
              {ptPath && (
                <>
                  {" · "}
                  <Link
                    href={ptPath}
                    hrefLang="pt-BR"
                    lang="pt-BR"
                    data-lang-switch="pt-BR"
                    className="text-brand-600 hover:text-brand-500"
                  >
                    Leia em português
                  </Link>
                </>
              )}
            </p>
          )}
          {/* Save-for-later. Browser-local, no account — see BookmarkButton. */}
          {!tr && <BookmarkButton path={path} title={entry.h1} />}
        </div>

        {tr?.status === "stale" && (
          <aside
            role="note"
            data-ptbr-stale-notice
            className="mt-6 rounded-xl border border-amber-400/50 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
          >
            <strong>Tradução desatualizada.</strong> A página em inglês mudou depois desta
            tradução, feita em {formatDatePt(tr.translatedOn)}, e o texto abaixo pode não
            refletir o que ela diz hoje. A versão atual é a original em inglês:{" "}
            <Link href={tr.enPath} hrefLang="en" lang="en" className="text-brand-600 underline hover:text-brand-500">
              {tr.enH1}
            </Link>
            .
          </aside>
        )}

        {/* What the "Last verified" date above was checked against. Collapsed
            so it stays one line until a reader asks; renders nothing for an
            entry whose re-verification predates the field. */}
        {entry.sources && entry.sources.length > 0 && (() => {
          const sources = entry.sources;
          // One date in the summary when every source was checked the same
          // day (the usual case: one re-verification pass); per-item otherwise.
          const sameDay = sources.every((s) => s.checked === sources[0].checked);
          return (
            <details className="mt-2 text-sm text-[var(--muted)]">
              <summary className="cursor-pointer select-none hover:text-[var(--fg)]">
                {tr ? "Fontes conferidas na versão em inglês" : "Sources checked"} ({sources.length})
                {sameDay && <> · {tr ? formatDatePt(sources[0].checked) : formatDate(sources[0].checked)}</>}
              </summary>
              <ul className="mt-2 space-y-1.5 border-l border-[var(--border)] pl-4">
                {sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      rel="nofollow"
                      className="break-words text-[var(--fg)] underline decoration-[var(--border)] underline-offset-2 hover:text-brand-600"
                    >
                      {s.url.replace(/^https?:\/\//, "")}
                    </a>
                    {s.note && <span> — {s.note}</span>}
                    {!sameDay && (
                      <span className="text-xs">
                        {tr ? ` · conferida em ${formatDatePt(s.checked)}` : ` · checked ${formatDate(s.checked)}`}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          );
        })()}

        {entry.firstParty && tr && (
          <aside
            role="note"
            data-ptbr-disclosure
            className="mt-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
          >
            <strong>Aviso de conflito de interesse:</strong> a KinesteX, empresa que financia este
            site, vende um SDK de rastreamento de movimento, e esta página trata dele ou de produtos
            que concorrem com ele. Os fatos abaixo vêm de repositórios públicos e das páginas
            publicadas pelos próprios fornecedores, os pontos fortes dos concorrentes estão
            declarados, e o que não conseguimos verificar está indicado — veja{" "}
            <Link href="/methodology" className="text-brand-600 underline hover:text-brand-500">
              como verificamos
            </Link>{" "}
            (em inglês).
          </aside>
        )}

        {entry.firstParty && !tr && (
          <aside
            role="note"
            className="mt-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-[var(--fg)]"
          >
            <strong>Disclosure:</strong> KinesteX, the company that funds this
            site, sells a motion-tracking SDK, and this page covers it or
            products that compete with it. Facts below come from public
            repositories and the vendors’ own published pages, competitor
            strengths are stated, and anything we could not verify is labeled
            — see{" "}
            <Link href="/methodology" className="text-brand-600 underline hover:text-brand-500">
              how we verify
            </Link>
            .
          </aside>
        )}

        {/* Answer-first capsule — the block voice assistants read and LLMs quote. */}
        <div
          id={capsuleId}
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          {entry.answer}
        </div>

        <KeyFacts facts={facts} locale={tr ? "pt-BR" : undefined} />

        {/* Mechanism diagram, on architecture spokes only. Renders nothing for
            a slug with no hand-authored drawing. */}
        {basePath === "/architecture" && <ArchDiagram slug={entry.slug} />}

        {!tr && <PageActions path={path} url={url} title={entry.h1} updated={entry.updated} citeHref="#cite" />}

        <FaqJump
          questions={entry.faqs.map((f) => f.q)}
          label={tr ? "Perguntas respondidas aqui" : undefined}
          navLabel={tr ? "Perguntas respondidas nesta página" : undefined}
        />

        {/* On a vendor's hub (data/vendorHubs.ts), every page about the vendor,
            up front. Renders nothing on any other page. */}
        {!tr && <VendorHubMenu path={path} placement="top" />}

        {!tr && products.length > 0 && (
          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
            <span>Covered here:</span>
            {products.map((p) => (
              <Link
                key={p.id}
                href={`${APIS_PATH}/${p.id}`}
                className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--fg)] transition-colors hover:border-brand-400"
              >
                {entityAnchor(p)}
              </Link>
            ))}
          </p>
        )}

        {!tr && tool && (
          <aside
            data-try-tool
            aria-label="Related tool"
            className="mt-6 rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)]"
          >
            <span className="font-semibold text-[var(--fg)]">Try it:</span>{" "}
            <Link
              href={tool.href}
              data-cta={`try-tool-${entry.slug}`}
              data-cta-source="spoke-inline"
              className="font-medium text-brand-600 hover:text-brand-500"
            >
              {tool.name}
            </Link>{" "}
            — {tool.does}
          </aside>
        )}

        <div data-article-body className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-th:text-left prose-pre:rounded-xl prose-pre:border prose-pre:border-[var(--border)]">
          <Mdx
            source={body}
            tableEmbeds={
              !tr && offersTableEmbeds(basePath)
                ? { basePath, slug: entry.slug, title: entry.h1 }
                : undefined
            }
          />
        </div>

        {/* The metric's type on every platform with a generated reference,
            from data/metricTypeMap.ts. Renders nothing off the /data guides
            the map covers. */}
        {!tr && <MetricPlatforms path={path} />}

        {entry.faqs.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
              {tr ? "Perguntas frequentes" : "Frequently asked questions"}
            </h2>
            {/* Each question is its own h3 under the FAQ h2, so a question-shaped
                heading can match a "People also ask" query (ops/MORE-30-2026-11-05.md
                item 8). The #faq-N anchor stays on the wrapper and the answer
                stays the wrapper's only other child: FAQPage JSON-LD links the
                anchor, and qa (FAQ-HEADING, PTBR-*) reads the item by it. */}
            <div className="mt-6 divide-y divide-[var(--border)]">
              {entry.faqs.map((f, i) => (
                <div key={f.q} id={faqId(i)} className="scroll-mt-24 py-5">
                  <h3 className="text-base font-semibold text-[var(--fg)]">{f.q}</h3>
                  <p className="mt-2 text-[var(--muted)]">{f.a}</p>
                </div>
              ))}
            </div>
            {!tr && clusterEntries.length > 0 && (
              <p className="mt-2 text-sm">
                <Link
                  href={`/questions/${basePath.replace(/^\//, "")}`}
                  className="font-medium text-brand-600 hover:text-brand-500"
                >
                  All {clusterQuestions} questions in {hubLabel} →
                </Link>
              </p>
            )}
          </section>
        )}

        {/* The decision kit, where a reader is weighing one vendor's price
            or its replacements (item 29). */}
        {!tr && KIT_SECTIONS.has(basePath) && <DecisionKitCta h1={entry.h1} slug={entry.slug} />}

        {/* Every page about the vendor(s) this page belongs to, with the hub
            marked. Renders nothing on a page that is no vendor's. */}
        {!tr && <VendorHubMenu path={path} placement="end" />}

        {/* On the money pages the route passes the inline newsletter form
            (InlineSignup, item 28), which takes the CTA's place: one per page. */}
        {signup && !tr ? (
          signup
        ) : (
          <ClusterCta
            pitch={entry.cta.pitch}
            source="spoke-inline"
            id={tr ? `cta-ptbr-${entry.slug}` : `cta-${entry.slug}`}
            locale={tr ? "pt-BR" : undefined}
          />
        )}

        {entry.related.length > 0 && (
          <section className="mt-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              {tr ? "Continue lendo" : "Keep reading"}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {entry.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                  >
                    {r.label}
                    {/* A link a translation could not localize leads to English. */}
                    {tr && !r.href.startsWith(`${PT_PREFIX}/`) && (
                      <span className="font-normal text-[var(--muted)]"> (em inglês)</span>
                    )}{" "}
                    →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!tr && (() => {
          const { prev, next } = clusterNeighbors(basePath, entry.slug);
          if (!prev && !next) return null;
          return (
            <nav aria-label="More in this section" className="mt-10 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`${basePath}/${prev.slug}`}
                  className="group rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="text-xs uppercase tracking-wider text-[var(--muted)]">← Previous in {hubLabel}</span>
                  <span className="mt-1 block text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">{prev.h1}</span>
                </Link>
              ) : (
                <span aria-hidden className="hidden sm:block" />
              )}
              {next && (
                <Link
                  href={`${basePath}/${next.slug}`}
                  className="group rounded-xl border border-[var(--border)] p-4 text-right transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Next in {hubLabel} →</span>
                  <span className="mt-1 block text-sm font-medium text-[var(--fg)] group-hover:text-brand-600">{next.h1}</span>
                </Link>
              )}
            </nav>
          );
        })()}

        {/* Verified platform facts, on the guides that have a matrix row.
            Renders nothing everywhere else. */}
        {!tr && (
          <>
            <MetricFacts path={path} />
            <AppStack path={path} />
            <ReferenceCallout path={path} />
            <SeeAlsoCallout path={path} />
            <PostLinks path={path} />
            <KinestexNote path={path} />
          </>
        )}

        {!tr && alsoRead.length > 0 && (
          <section className="defer-paint mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Elsewhere on the site
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Pages that share this one&rsquo;s concepts and sources, from other sections.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {alsoRead.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex h-full flex-col rounded-xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                  >
                    <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
                      {r.clusterLabel}
                    </span>
                    <span className="mt-1 text-sm font-medium text-[var(--fg)]">{r.h1}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!tr && <NextSteps />}

        {!tr && <Feedback path={path} title={entry.h1} repo={site.social.github || undefined} />}

        <CiteBox
          path={path}
          url={url}
          title={entry.h1}
          verified={entry.updated}
          locale={tr ? "pt-BR" : undefined}
        />

        <ClusterDisclaimer
          updated={entry.updated}
          variant={config.disclaimer}
          locale={tr ? "pt-BR" : undefined}
          funderListed={
            entry.firstParty === true ||
            (!tr && KINESTEX_NOTE_PATHS.includes(path)) ||
            /KinesteX/.test([entry.answer, entry.body, ...entry.faqs.map((f) => f.a)].join(" "))
          }
        />

        {tr ? (
          <p className="mt-8 text-sm">
            <Link href={PT_PREFIX} className="text-brand-600 hover:text-brand-500">
              ← Todas as páginas em português
            </Link>{" "}
            <span className="text-[var(--muted)]">· {site.name}</span>
          </p>
        ) : (
          <p className="mt-8 text-sm">
            <Link href={basePath} className="text-brand-600 hover:text-brand-500">
              ← All {hubLabel.toLowerCase()}
            </Link>{" "}
            <span className="text-[var(--muted)]">· by {site.name}</span>
          </p>
        )}
      </article>
    </Container>
  );
}
