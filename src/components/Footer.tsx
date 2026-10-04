import Link from "next/link";
import type { ComponentProps } from "react";
import Container from "./Container";
import { SDK_REPOS } from "@/data/sdkReleases";
import { site } from "@/lib/site";
import { clusterMap } from "@/lib/clusterRegistry";

// No prefetch: ~50 footer links on every page would each fetch a route payload
// once scrolled into view (or hovered) — edge requests nobody asked for.
function FooterLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} prefetch={false} />;
}

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
          <FooterLink href="/fitness-apis" className="py-1 hover:text-[var(--fg)]">
            Fitness APIs
          </FooterLink>
          <FooterLink href="/guides" className="py-1 hover:text-[var(--fg)]">
            Guides
          </FooterLink>
          <FooterLink href="/build" className="py-1 hover:text-[var(--fg)]">
            Build
          </FooterLink>
          <FooterLink href="/integrate" className="py-1 hover:text-[var(--fg)]">
            Integrate
          </FooterLink>
          <FooterLink href="/fix" className="py-1 hover:text-[var(--fg)]">
            Troubleshooting
          </FooterLink>
          <FooterLink href="/learn" className="py-1 hover:text-[var(--fg)]">
            Concepts
          </FooterLink>
          <FooterLink href="/alternatives" className="py-1 hover:text-[var(--fg)]">
            Alternatives
          </FooterLink>
          <FooterLink href="/compliance" className="py-1 hover:text-[var(--fg)]">
            Compliance
          </FooterLink>
          <FooterLink href="/migrate" className="py-1 hover:text-[var(--fg)]">
            Migrations
          </FooterLink>
          <FooterLink href="/pricing" className="py-1 hover:text-[var(--fg)]">
            Pricing
          </FooterLink>
          <FooterLink href="/compare" className="py-1 hover:text-[var(--fg)]">
            Comparisons
          </FooterLink>
          <FooterLink href="/data" className="py-1 hover:text-[var(--fg)]">
            Health Data
          </FooterLink>
          <FooterLink href="/motion" className="py-1 hover:text-[var(--fg)]">
            AI Motion
          </FooterLink>
          <FooterLink href="/ai" className="py-1 hover:text-[var(--fg)]">
            AI Features
          </FooterLink>
          <FooterLink href="/architecture" className="py-1 hover:text-[var(--fg)]">
            Architecture
          </FooterLink>
          <FooterLink href="/test" className="py-1 hover:text-[var(--fg)]">
            Testing
          </FooterLink>
          <FooterLink href="/cookbook" className="py-1 hover:text-[var(--fg)]">
            Cookbook
          </FooterLink>
          <FooterLink href="/devices" className="py-1 hover:text-[var(--fg)]">
            Connected Devices
          </FooterLink>
          <FooterLink href="/engagement" className="py-1 hover:text-[var(--fg)]">
            Engagement &amp; Retention
          </FooterLink>
          {has("/accessibility") && (
            <FooterLink href="/accessibility" className="py-1 hover:text-[var(--fg)]">
              Accessibility
            </FooterLink>
          )}
          {has("/audio-coaching") && (
            <FooterLink href="/audio-coaching" className="py-1 hover:text-[var(--fg)]">
              Audio Coaching
            </FooterLink>
          )}
          {has("/healthkit-queries") && (
            <FooterLink href="/healthkit-queries" className="py-1 hover:text-[var(--fg)]">
              HealthKit Queries
            </FooterLink>
          )}
          {has("/phone-sensors") && (
            <FooterLink href="/phone-sensors" className="py-1 hover:text-[var(--fg)]">
              Phone Sensors
            </FooterLink>
          )}
          {has("/health-connect-api") && (
            <FooterLink href="/health-connect-api" className="py-1 hover:text-[var(--fg)]">
              Health Connect API
            </FooterLink>
          )}
          {has("/watch-apps") && (
            <FooterLink href="/watch-apps" className="py-1 hover:text-[var(--fg)]">
              Watch Apps
            </FooterLink>
          )}
          <FooterLink href="/apis" className="py-1 hover:text-[var(--fg)]">
            API Directory
          </FooterLink>
          <FooterLink href="/compare-apis" className="py-1 hover:text-[var(--fg)]">
            Compare APIs
          </FooterLink>
          <FooterLink href="/picker" className="py-1 hover:text-[var(--fg)]">
            API Picker
          </FooterLink>
          <FooterLink href="/cost-planner" className="py-1 hover:text-[var(--fg)]">
            Cost Planner
          </FooterLink>
          <FooterLink href="/ai-fitness-app" className="py-1 hover:text-[var(--fg)]">
            Build an AI Fitness App
          </FooterLink>
          <FooterLink href="/no-code-fitness-app" className="py-1 hover:text-[var(--fg)]">
            No-Code Fitness App
          </FooterLink>
          <FooterLink href="/state-of-fitness-apis-2026" className="py-1 hover:text-[var(--fg)]">
            State of Fitness APIs
          </FooterLink>
          <FooterLink href="/changes" className="py-1 hover:text-[var(--fg)]">
            Changes &amp; Deadlines
          </FooterLink>
          <FooterLink href="/alerts" className="py-1 hover:text-[var(--fg)]">
            Change Alerts
          </FooterLink>
          <FooterLink href="/digest" className="py-1 hover:text-[var(--fg)]">
            Monthly Digest
          </FooterLink>
          <FooterLink href="/matrix" className="py-1 hover:text-[var(--fg)]">
            Type Reference
          </FooterLink>
          <FooterLink href="/healthkit-identifiers" className="py-1 hover:text-[var(--fg)]">
            Every HealthKit identifier
          </FooterLink>
          <FooterLink href="/healthkit-errors" className="py-1 hover:text-[var(--fg)]">
            Every HealthKit error code
          </FooterLink>
          <FooterLink href="/healthkit-units" className="py-1 hover:text-[var(--fg)]">
            HKUnit families by type
          </FooterLink>
          <FooterLink href="/healthkit-metadata-keys" className="py-1 hover:text-[var(--fg)]">
            HealthKit metadata keys
          </FooterLink>
          <FooterLink href="/healthkit-versions" className="py-1 hover:text-[var(--fg)]">
            HealthKit types by iOS version
          </FooterLink>
          <FooterLink href="/health-connect" className="py-1 hover:text-[var(--fg)]">
            Health Connect record types
          </FooterLink>
          <FooterLink href="/error-codes" className="py-1 hover:text-[var(--fg)]">
            Error code reference
          </FooterLink>
          <FooterLink href="/health-connect-releases" className="py-1 hover:text-[var(--fg)]">
            Health Connect SDK releases
          </FooterLink>
          <FooterLink href="/wear-os-data-types" className="py-1 hover:text-[var(--fg)]">
            Wear OS Health Services data types
          </FooterLink>
          {SDK_REPOS.length > 0 && (
            <FooterLink href="/sdk-releases" className="py-1 hover:text-[var(--fg)]">
              SDK release tracker
            </FooterLink>
          )}
          <FooterLink href="/libraries" className="py-1 hover:text-[var(--fg)]">
            Open-source libraries
          </FooterLink>
          <FooterLink href="/blog" className="py-1 hover:text-[var(--fg)]">
            Blog
          </FooterLink>
          <FooterLink href="/about" className="py-1 hover:text-[var(--fg)]">
            About
          </FooterLink>
          <FooterLink href="/signup" className="py-1 hover:text-[var(--fg)]">
            Free decision kit
          </FooterLink>
          <FooterLink href="/datasets" className="py-1 hover:text-[var(--fg)]">
            Open Datasets
          </FooterLink>
          <FooterLink href="/badges" className="py-1 hover:text-[var(--fg)]">
            Embeds &amp; Badges
          </FooterLink>
          <FooterLink href="/paths" className="py-1 hover:text-[var(--fg)]">
            Reading paths
          </FooterLink>
          <FooterLink href="/saved" className="py-1 hover:text-[var(--fg)]">
            Saved pages
          </FooterLink>
          <FooterLink href="/tools" className="py-1 hover:text-[var(--fg)]">
            Tools
          </FooterLink>
          <FooterLink href="/newsletter" className="py-1 hover:text-[var(--fg)]">
            Newsletter
          </FooterLink>
          <FooterLink href="/healthkit" className="py-1 hover:text-[var(--fg)]">
            HealthKit reference
          </FooterLink>
          <FooterLink href="/changelog" className="py-1 hover:text-[var(--fg)]">
            Changelog
          </FooterLink>
          <FooterLink href="/corrections" className="py-1 hover:text-[var(--fg)]">
            Corrections
          </FooterLink>
          <FooterLink href="/methodology" className="py-1 hover:text-[var(--fg)]">
            How We Verify
          </FooterLink>
          <FooterLink href="/gates" className="py-1 hover:text-[var(--fg)]">
            What We Refuse To Ship
          </FooterLink>
          <FooterLink href="/privacy" className="py-1 hover:text-[var(--fg)]">
            Privacy
          </FooterLink>
          <FooterLink href="/glossary" className="py-1 hover:text-[var(--fg)]">
            Glossary
          </FooterLink>
          <FooterLink href="/questions" className="py-1 hover:text-[var(--fg)]">
            All questions
          </FooterLink>
          <FooterLink href="/site-index" className="py-1 hover:text-[var(--fg)]">
            Site index
          </FooterLink>
          <FooterLink href="/search" className="py-1 hover:text-[var(--fg)]">
            Search
          </FooterLink>
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
