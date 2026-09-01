import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

/**
 * Blog posts surfaced on the reference pages they belong to.
 *
 * The blog was an island. Posts were in the sitemap and the feeds, but not one
 * of the 260 cluster pages linked to a single one, so the site's own writing
 * got no internal link equity and a reader deep in a reference page never
 * learned it existed. Sitemap presence is not discovery.
 *
 * The map below is authored deliberately rather than derived from tags,
 * because tag overlap produces plausible-but-wrong pairings and a wrong
 * "related" link is worse than none. It is keyed by post slug so the placement
 * lives next to the thing being placed; the render inverts it.
 *
 * Both halves are asserted by qa: every post slug here must resolve to a real
 * post, and every path must be a route that exists. Either can rot silently
 * otherwise — a renamed slug just stops rendering.
 */
const PLACEMENTS: Record<string, string[]> = {
  "healthkit-240-types-ios-8": [
    "/integrate/healthkit",
    "/learn/what-is-a-fitness-api",
  ],
  "healthkit-58-silent-types": [
    "/integrate/healthkit",
    "/test/healthkit-integration",
  ],
  "healthkit-sum-or-average": [
    "/data/step-counting-api",
    "/data/calorie-tracking-api",
    "/architecture/timezones-and-day-boundaries",
  ],
  "healthkit-nutrition-is-biggest": [
    "/fitness-apis/nutrition-apis",
    "/build/nutrition-tracking-app",
    "/build/meal-planning-app",
  ],
  "healthkit-mobility-types-unused": [
    "/build/senior-fitness-app",
    "/build/rehab-physical-therapy-app",
  ],
  "healthkit-newest-types-roadmap": [
    "/integrate/healthkit",
    "/build/running-app",
    "/devices/cycling-sensors-power-cadence",
  ],
  "healthkit-error-that-never-fires": [
    "/fix/healthkit-authorization-denied",
    "/fix/healthkit-no-data",
  ],
  "hrv-sdnn-vs-rmssd": ["/learn/what-is-hrv", "/data/hrv-api", "/build/recovery-app"],
  "ten-metrics-two-platforms": [
    "/fitness-apis/apple-healthkit-vs-google-health-connect",
    "/architecture/normalize-wearable-data",
  ],
  "no-data-means-four-things": [
    "/fix/health-connect-no-data",
    "/architecture/missing-data-and-gaps",
  ],
  "fitness-api-approval-gates": [
    "/fix/garmin-api-approval",
    "/fitness-apis/wearable-data-apis",
  ],
  "wearable-api-user-side-cost": [
    "/fitness-apis/wearable-data-apis",
    "/build/step-challenge-app",
  ],
  "free-fitness-apis-are-expensive": [
    "/pricing/are-fitness-apis-free",
    "/fitness-apis/free-fitness-apis",
  ],
  "fitness-api-talk-to-sales": [
    "/pricing/how-much-does-a-fitness-api-cost",
    "/fitness-apis/health-data-aggregator-apis",
  ],
  "fitness-api-integration-order": [
    "/fitness-apis/fitness-api-vs-build-your-own",
    "/build/fitness-app-tech-stack",
  ],
  "react-native-health-stale": [
    "/guides/ai-workout-tracking-react-native",
    "/integrate/healthkit",
  ],
  "google-fit-timeline": [
    "/fix/google-fit-api-deprecated",
    "/migrate/google-fit-to-health-connect",
  ],
  "confirmed-vs-reported": [
    "/migrate/migrate-off-a-deprecated-fitness-api",
    "/fix/oura-personal-access-token-deprecated",
  ],
  "how-we-verify": ["/learn/what-is-a-fitness-api"],
  "building-the-healthkit-dataset": [
    "/test/healthkit-integration",
    "/architecture/data-quality-monitoring",
  ],
};

/** Inverted: path -> post slugs. Built once. */
const BY_PATH: Record<string, string[]> = {};
for (const [slug, paths] of Object.entries(PLACEMENTS)) {
  for (const p of paths) (BY_PATH[p] ??= []).push(slug);
}

/** Every referenced post slug and path, for the qa gate. */
export function allPostPlacements(): { slug: string; paths: string[] }[] {
  return Object.entries(PLACEMENTS).map(([slug, paths]) => ({ slug, paths }));
}

export default function PostLinks({ path }: { path: string }) {
  const slugs = BY_PATH[path];
  if (!slugs || slugs.length === 0) return null;

  const posts = getAllPosts().filter((p) => slugs.includes(p.slug));
  if (posts.length === 0) return null;

  return (
    <section data-post-links className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="text-lg font-bold tracking-tight text-[var(--fg)]">From the blog</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Findings counted out of this site&rsquo;s own datasets.
      </p>
      <ul className="mt-4 space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="font-semibold text-brand-600 hover:text-brand-500"
            >
              {p.title}
            </Link>
            <span className="mt-0.5 block text-sm text-[var(--muted)]">{p.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
