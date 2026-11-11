import Link from "next/link";
import Container from "./Container";
import SiteSearch from "./SiteSearch";
import MobileNav from "./MobileNav";
import { site } from "@/lib/site";
import { clusterMap } from "@/lib/clusterRegistry";

// Four items, and a fifth does not fit: adding "Tools" here pushes the
// document 20px wider than a 768px iPad in portrait, which is the exact
// regression scripts/responsive-audit.mjs exists to catch. /tools is reached
// from the phone menu and the footer instead.
const nav = [
  { href: "/fitness-apis", label: "Fitness APIs" },
  { href: "/picker", label: "API Picker" },
  { href: "/cookbook", label: "Cookbook" },
  { href: "/changes", label: "Changes" },
];

// The phone menu. Seven rows a first visit asks for, then the thirteen topic
// guides folded under one disclosure (Hick's law: the menu used to open on
// twenty-one flat rows, and a reader scanned all of them to find the one they
// wanted), then the full index. Grouped rows render inside a <details> in
// MobileNav; they are still in the served HTML.
const GUIDES = "Guides by topic";
const MOBILE_LINKS = [
  { href: "/fitness-apis", label: "Fitness APIs" },
  { href: "/apis", label: "API directory" },
  { href: "/picker", label: "API Picker" },
  { href: "/tools", label: "Free tools" },
  { href: "/cookbook", label: "Cookbook" },
  { href: "/changes", label: "Changes & deadlines" },
  { href: "/blog", label: "Blog" },
  { href: "/integrate", label: "Integration guides", group: GUIDES },
  { href: "/devices", label: "Connected devices", group: GUIDES },
  { href: "/engagement", label: "Engagement", group: GUIDES },
  { href: "/watch-apps", label: "Watch apps", group: GUIDES },
  { href: "/accessibility", label: "Accessibility", group: GUIDES },
  { href: "/audio-coaching", label: "Audio coaching", group: GUIDES },
  { href: "/healthkit-queries", label: "HealthKit queries", group: GUIDES },
  { href: "/phone-sensors", label: "Phone sensors", group: GUIDES },
  { href: "/health-connect-api", label: "Health Connect API", group: GUIDES },
  { href: "/health-connect", label: "Health Connect records", group: GUIDES },
  { href: "/libraries", label: "Open-source libraries", group: GUIDES },
  { href: "/own-your-data", label: "Export your own data", group: GUIDES },
  { href: "/market-map", label: "API market map", group: GUIDES },
  { href: "/site-index", label: "All topics" },
];

export default function Header() {
  // Drop any cluster with no released pages: its hub 404s by design.
  const map = clusterMap();
  const mobileLinks = MOBILE_LINKS.filter(
    (l) => !(l.href in map) || (map[l.href]?.length ?? 0) > 0,
  );
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="group flex min-h-[44px] items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            AF
          </span>
          <span className="hidden text-[var(--fg)] min-[360px]:inline">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <span className="hidden md:contents">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link rounded-md px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              {item.label}
            </Link>
          ))}
          </span>
          <SiteSearch />
          <Link
            href="/#subscribe"
            className="ml-1 inline-flex min-h-[44px] items-center rounded-md bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          >
            Subscribe
          </Link>
          <MobileNav links={mobileLinks} />
        </nav>
      </Container>
    </header>
  );
}
