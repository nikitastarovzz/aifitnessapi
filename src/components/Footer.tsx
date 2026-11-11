import Link from "next/link";
import type { ComponentProps } from "react";
import Container from "./Container";
import FooterFunding from "./FooterFunding";
import FooterGroup from "./FooterGroup";
import { SDK_REPOS } from "@/data/sdkReleases";
import { site } from "@/lib/site";
import { clusterMap } from "@/lib/clusterRegistry";

// No prefetch: ~90 footer links on every page would each fetch a route payload
// once scrolled into view (or hovered) — edge requests nobody asked for.
function FooterLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} prefetch={false} />;
}

type FooterEntry = { href: string; label: string; cluster?: string; external?: boolean };

/**
 * The footer's links, in five titled groups. Every href the flat footer
 * carried is still here (qa's ORPHAN and inbound counts read them), only
 * sorted by the question a reader brings: which section, which tool, what
 * changed, which reference table, who runs this. Rows are 44px on phones
 * (Fitts's law, the 2.5.5 target size) and denser on wider screens.
 */
const GROUPS: { title: string; links: FooterEntry[] }[] = [
  {
    title: "Sections",
    links: [
      { href: "/fitness-apis", label: "Fitness APIs" },
      { href: "/guides", label: "Guides" },
      { href: "/build", label: "Build" },
      { href: "/integrate", label: "Integrate" },
      { href: "/fix", label: "Troubleshooting" },
      { href: "/learn", label: "Concepts" },
      { href: "/alternatives", label: "Alternatives" },
      { href: "/compliance", label: "Compliance" },
      { href: "/migrate", label: "Migrations" },
      { href: "/pricing", label: "Pricing" },
      { href: "/compare", label: "Comparisons" },
      { href: "/data", label: "Health Data" },
      { href: "/motion", label: "AI Motion" },
      { href: "/ai", label: "AI Features" },
      { href: "/architecture", label: "Architecture" },
      { href: "/test", label: "Testing" },
      { href: "/cookbook", label: "Cookbook" },
      { href: "/devices", label: "Connected Devices" },
      { href: "/engagement", label: "Engagement & Retention" },
      { href: "/accessibility", label: "Accessibility", cluster: "/accessibility" },
      { href: "/audio-coaching", label: "Audio Coaching", cluster: "/audio-coaching" },
      { href: "/healthkit-queries", label: "HealthKit Queries", cluster: "/healthkit-queries" },
      { href: "/phone-sensors", label: "Phone Sensors", cluster: "/phone-sensors" },
      { href: "/health-connect-api", label: "Health Connect API", cluster: "/health-connect-api" },
      { href: "/own-your-data", label: "Own Your Data", cluster: "/own-your-data" },
      { href: "/watch-apps", label: "Watch Apps", cluster: "/watch-apps" },
    ],
  },
  {
    title: "Directory & tools",
    links: [
      { href: "/apis", label: "API Directory" },
      { href: "/market-map", label: "API Market Map" },
      { href: "/fitness-api-index", label: "Fitness API Index" },
      { href: "/graveyard", label: "API Graveyard" },
      { href: "/compare-apis", label: "Compare APIs" },
      { href: "/picker", label: "API Picker" },
      { href: "/cost-planner", label: "Cost Planner" },
      { href: "/tools", label: "Tools" },
      { href: "/daily", label: "Daily Puzzle" },
      { href: "/play/ship-it", label: "Ship It (game)" },
      { href: "/challenge", label: "Rep Challenge" },
      { href: "/paths", label: "Reading paths" },
      { href: "/saved", label: "Saved pages" },
      { href: "/glossary", label: "Glossary" },
      { href: "/questions", label: "All questions" },
      { href: "/search", label: "Search" },
      { href: "/site-index", label: "Site index" },
    ],
  },
  {
    title: "Reports & updates",
    links: [
      { href: "/ai-fitness-app", label: "Build an AI Fitness App" },
      { href: "/no-code-fitness-app", label: "No-Code Fitness App" },
      { href: "/state-of-fitness-apis-2026", label: "State of Fitness APIs" },
      { href: "/2026", label: "Fitness APIs in 2026" },
      { href: "/press", label: "Press numbers" },
      { href: "/research", label: "Research" },
      { href: "/changes", label: "Changes & Deadlines" },
      { href: "/alerts", label: "Change Alerts" },
      { href: "/digest", label: "Monthly Digest" },
      { href: "/weekly", label: "Weekly Roundup" },
      { href: "/history", label: "Fitness API History" },
      { href: "/blog", label: "Blog" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/signup", label: "Free decision kit" },
      { href: "/changelog", label: "Changelog" },
      { href: "/feed.xml", label: "RSS", external: true },
    ],
  },
  {
    title: "Reference data",
    links: [
      { href: "/matrix", label: "Type Reference" },
      { href: "/healthkit", label: "HealthKit reference" },
      { href: "/healthkit-identifiers", label: "Every HealthKit identifier" },
      { href: "/healthkit-errors", label: "Every HealthKit error code" },
      { href: "/healthkit-units", label: "HKUnit families by type" },
      { href: "/healthkit-metadata-keys", label: "HealthKit metadata keys" },
      { href: "/healthkit-versions", label: "HealthKit types by iOS version" },
      { href: "/health-connect", label: "Health Connect record types" },
      { href: "/error-codes", label: "Error code reference" },
      { href: "/health-connect-releases", label: "Health Connect SDK releases" },
      { href: "/wear-os-data-types", label: "Wear OS Health Services data types" },
      { href: "/pose-keypoints", label: "Pose keypoint maps" },
      { href: "/google-health-api", label: "Google Health API reference" },
      { href: "/health-mcp-servers", label: "Health MCP servers" },
      { href: "/bluetooth-fitness", label: "Bluetooth GATT byte layouts" },
      { href: "/workout-types", label: "Workout type crosswalk" },
      { href: "/sdk-releases", label: "SDK release tracker", cluster: "sdk" },
      { href: "/libraries", label: "Open-source libraries" },
      { href: "/datasets", label: "Open Datasets" },
      { href: "/developers", label: "Developer API & MCP" },
      { href: "/badges", label: "Embeds & Badges" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About" },
      { href: "/contributors", label: "Contributors" },
      { href: "/methodology", label: "How We Verify" },
      { href: "/gates", label: "What We Refuse To Ship" },
      { href: "/corrections", label: "Corrections" },
      { href: "/privacy", label: "Privacy" },
      ...(site.social.github ? [{ href: site.social.github, label: "GitHub", external: true }] : []),
    ],
  },
];

const LINK_CLASS =
  "inline-flex min-h-[44px] items-center text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)] md:min-h-[32px]";

export default function Footer() {
  const year = new Date().getFullYear();
  // Never link a cluster that has no released pages — its hub 404s.
  const populated = clusterMap();
  const shown = (l: FooterEntry) => {
    if (!l.cluster) return true;
    if (l.cluster === "sdk") return SDK_REPOS.length > 0;
    return (populated[l.cluster]?.length ?? 0) > 0;
  };
  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <Container className="py-10">
        <nav aria-label="Footer" className="grid gap-x-8 gap-y-2 md:grid-cols-3 md:gap-y-8 lg:grid-cols-5">
          {GROUPS.map((g) => (
            <FooterGroup key={g.title} title={g.title}>
              <ul className="pb-2 md:pb-0 md:pt-3">
                {g.links.filter(shown).map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a
                        href={l.href}
                        className={LINK_CLASS}
                        {...(l.href.startsWith("http") ? { target: "_blank", rel: "me noreferrer" } : {})}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <FooterLink href={l.href} className={LINK_CLASS}>
                        {l.label}
                      </FooterLink>
                    )}
                  </li>
                ))}
              </ul>
            </FooterGroup>
          ))}
        </nav>
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-[var(--border)] pt-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            © {year} {site.name}. All rights reserved.
          </p>
          <FooterFunding />
        </div>
      </Container>
    </footer>
  );
}
