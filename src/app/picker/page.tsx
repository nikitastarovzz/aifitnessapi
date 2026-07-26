import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ApiPicker from "@/components/ApiPicker";
import ClusterCta from "@/components/ClusterCta";
import { absoluteUrl, site } from "@/lib/site";
import { orgRef } from "@/lib/schema";

const PICKER_PATH = "/picker";
const UPDATED = "2026-07-24";

export const metadata: Metadata = {
  title: { absolute: "Which Fitness API Should I Use? Picker" },
  description:
    "Answer three quick questions — what you're building, your platform, and your top priority — and get a tailored fitness API recommendation with next steps.",
  alternates: { canonical: PICKER_PATH },
  openGraph: {
    type: "website",
    title: "Which Fitness API Should I Use? Interactive Picker",
    description:
      "A 3-question picker that recommends the right fitness or health API approach for your app and links you to the comparisons, guides, and pricing.",
    url: PICKER_PATH,
    images: ["/opengraph-image"],
  },
};

// Crawlable fallback so the page has substance without running the client tool.
const BROWSE: { title: string; href: string }[] = [
  { title: "Wearable & device data APIs", href: "/fitness-apis/wearable-data-apis" },
  { title: "Health-data aggregators (many devices)", href: "/fitness-apis/health-data-aggregator-apis" },
  { title: "AI workout tracking APIs", href: "/fitness-apis/ai-workout-tracking-apis" },
  { title: "Exercise database APIs", href: "/fitness-apis/exercise-database-apis" },
  { title: "Nutrition APIs", href: "/fitness-apis/nutrition-apis" },
  { title: "Health data by metric", href: "/data" },
];

export default function PickerPage() {
  const url = absoluteUrl(PICKER_PATH);

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fitness API Picker",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: metadata.description,
    url,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: orgRef(),
    datePublished: UPDATED,
    dateModified: UPDATED,
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "API Picker", path: PICKER_PATH }]} />

        <ClusterHero label="Interactive Tool" seed={4} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Which Fitness API Should You Use?
        </h1>

        <p className="mt-4 text-lg text-[var(--muted)]">
          Answer three quick questions — what you&rsquo;re building, your platform, and what matters most —
          and get a tailored recommendation with the exact comparisons, integration guides, and pricing to
          read next. Independent and free; we&rsquo;re not paid to recommend anything.
        </p>

        <div className="mt-8">
          <ApiPicker />
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Prefer to browse?
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Jump straight into the categories, or start from{" "}
            <Link href="/fitness-apis" className="text-brand-600 hover:text-brand-500">
              the full API landscape
            </Link>
            .
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {BROWSE.map((b) => (
              <li key={b.href}>
                <Link
                  href={b.href}
                  className="block rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {b.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="prose prose-neutral mt-14 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <h2>How the picker decides</h2>
          <p>
            There&rsquo;s no single best fitness API — the right choice depends on the job. The picker maps
            your answers to a category and an approach: if you need many devices at once or want to ship
            fast across platforms, it points you to a{" "}
            <Link href="/fitness-apis/health-data-aggregator-apis">health-data aggregator</Link>; if you
            want depth on one platform, to{" "}
            <Link href="/fitness-apis/wearable-data-apis">direct wearable APIs</Link> or the on-device
            stores; for camera-based coaching, to{" "}
            <Link href="/motion">AI motion &amp; pose estimation</Link>; and it factors in cost, privacy,
            and <Link href="/compliance">compliance</Link> from your priority. It&rsquo;s a starting point,
            not a verdict.
          </p>
        </section>

        <ClusterCta
          pitch="Want a second opinion as the landscape shifts? We track the API changes, deprecations, and pricing moves that would change this recommendation. Get the updates."
          source="pillar-inline"
          id="cta-picker"
        />

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Independent guidance, not sponsored.
        </p>
      </div>
    </Container>
  );
}
