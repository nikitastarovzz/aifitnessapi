import Link from "next/link";
import Container from "./Container";
import { SDK_REPOS } from "@/data/sdkReleases";
import { site } from "@/lib/site";
import { clusterMap } from "@/lib/clusterRegistry";

export default function Footer() {
  const year = new Date().getFullYear();
  // Never link a cluster that has no released pages — its hub 404s.
  const populated = clusterMap();
  const has = (p: string) => (populated[p]?.length ?? 0) > 0;
  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <Container className="flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <p className="text-sm text-[var(--muted)]">
          © {year} {site.name}. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          <Link href="/fitness-apis" className="py-1 hover:text-[var(--fg)]">
            Fitness APIs
          </Link>
          <Link href="/guides" className="py-1 hover:text-[var(--fg)]">
            Guides
          </Link>
          <Link href="/build" className="py-1 hover:text-[var(--fg)]">
            Build
          </Link>
          <Link href="/integrate" className="py-1 hover:text-[var(--fg)]">
            Integrate
          </Link>
          <Link href="/fix" className="py-1 hover:text-[var(--fg)]">
            Troubleshooting
          </Link>
          <Link href="/learn" className="py-1 hover:text-[var(--fg)]">
            Concepts
          </Link>
          <Link href="/alternatives" className="py-1 hover:text-[var(--fg)]">
            Alternatives
          </Link>
          <Link href="/compliance" className="py-1 hover:text-[var(--fg)]">
            Compliance
          </Link>
          <Link href="/migrate" className="py-1 hover:text-[var(--fg)]">
            Migrations
          </Link>
          <Link href="/pricing" className="py-1 hover:text-[var(--fg)]">
            Pricing
          </Link>
          <Link href="/compare" className="py-1 hover:text-[var(--fg)]">
            Comparisons
          </Link>
          <Link href="/data" className="py-1 hover:text-[var(--fg)]">
            Health Data
          </Link>
          <Link href="/motion" className="py-1 hover:text-[var(--fg)]">
            AI Motion
          </Link>
          <Link href="/ai" className="py-1 hover:text-[var(--fg)]">
            AI Features
          </Link>
          <Link href="/architecture" className="py-1 hover:text-[var(--fg)]">
            Architecture
          </Link>
          <Link href="/test" className="py-1 hover:text-[var(--fg)]">
            Testing
          </Link>
          <Link href="/cookbook" className="py-1 hover:text-[var(--fg)]">
            Cookbook
          </Link>
          <Link href="/devices" className="py-1 hover:text-[var(--fg)]">
            Connected Devices
          </Link>
          <Link href="/engagement" className="py-1 hover:text-[var(--fg)]">
            Engagement &amp; Retention
          </Link>
          {has("/accessibility") && (
            <Link href="/accessibility" className="py-1 hover:text-[var(--fg)]">
              Accessibility
            </Link>
          )}
          {has("/watch-apps") && (
            <Link href="/watch-apps" className="py-1 hover:text-[var(--fg)]">
              Watch Apps
            </Link>
          )}
          <Link href="/apis" className="py-1 hover:text-[var(--fg)]">
            API Directory
          </Link>
          <Link href="/compare-apis" className="py-1 hover:text-[var(--fg)]">
            Compare APIs
          </Link>
          <Link href="/picker" className="py-1 hover:text-[var(--fg)]">
            API Picker
          </Link>
          <Link href="/cost-planner" className="py-1 hover:text-[var(--fg)]">
            Cost Planner
          </Link>
          <Link href="/ai-fitness-app" className="py-1 hover:text-[var(--fg)]">
            Build an AI Fitness App
          </Link>
          <Link href="/no-code-fitness-app" className="py-1 hover:text-[var(--fg)]">
            No-Code Fitness App
          </Link>
          <Link href="/state-of-fitness-apis-2026" className="py-1 hover:text-[var(--fg)]">
            State of Fitness APIs
          </Link>
          <Link href="/changes" className="py-1 hover:text-[var(--fg)]">
            Changes &amp; Deadlines
          </Link>
          <Link href="/alerts" className="py-1 hover:text-[var(--fg)]">
            Change Alerts
          </Link>
          <Link href="/digest" className="py-1 hover:text-[var(--fg)]">
            Monthly Digest
          </Link>
          <Link href="/matrix" className="py-1 hover:text-[var(--fg)]">
            Type Reference
          </Link>
          <Link href="/healthkit-identifiers" className="py-1 hover:text-[var(--fg)]">
            Every HealthKit identifier
          </Link>
          <Link href="/healthkit-errors" className="py-1 hover:text-[var(--fg)]">
            Every HealthKit error code
          </Link>
          {SDK_REPOS.length > 0 && (
            <Link href="/sdk-releases" className="py-1 hover:text-[var(--fg)]">
              SDK release tracker
            </Link>
          )}
          <Link href="/blog" className="py-1 hover:text-[var(--fg)]">
            Blog
          </Link>
          <Link href="/about" className="py-1 hover:text-[var(--fg)]">
            About
          </Link>
          <Link href="/signup" className="py-1 hover:text-[var(--fg)]">
            Newsletter
          </Link>
          <Link href="/datasets" className="py-1 hover:text-[var(--fg)]">
            Open Datasets
          </Link>
          <Link href="/badges" className="py-1 hover:text-[var(--fg)]">
            Embeds &amp; Badges
          </Link>
          <Link href="/healthkit" className="py-1 hover:text-[var(--fg)]">
            HealthKit reference
          </Link>
          <Link href="/changelog" className="py-1 hover:text-[var(--fg)]">
            Changelog
          </Link>
          <Link href="/corrections" className="py-1 hover:text-[var(--fg)]">
            Corrections
          </Link>
          <Link href="/methodology" className="py-1 hover:text-[var(--fg)]">
            How We Verify
          </Link>
          <Link href="/privacy" className="py-1 hover:text-[var(--fg)]">
            Privacy
          </Link>
          <Link href="/glossary" className="py-1 hover:text-[var(--fg)]">
            Glossary
          </Link>
          <Link href="/site-index" className="py-1 hover:text-[var(--fg)]">
            Site index
          </Link>
          <Link href="/search" className="py-1 hover:text-[var(--fg)]">
            Search
          </Link>
          <a href="/feed.xml" className="py-1 hover:text-[var(--fg)]">
            RSS
          </a>
          {site.social.github && (
            <a
              href={site.social.github}
              target="_blank"
              rel="me noreferrer"
              className="py-1 hover:text-[var(--fg)]"
            >
              GitHub
            </a>
          )}
        </nav>
      </Container>
    </footer>
  );
}
