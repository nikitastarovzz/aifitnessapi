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
// Serial position effect (Ebbinghaus): the first and last items in a row
// are the ones remembered. Ordered on Search Console clicks, 2026-08-13 to
// 2026-11-10: the category hub first, the deadline tracker that is this
// site's reason to return last, and Pricing (the section with the most search
// clicks, 91 of 607) in the row. Cookbook (no search clicks in that window)
// moves to the phone menu's Reference group and the footer.
const nav = [
  { href: "/fitness-apis", label: "Fitness APIs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/picker", label: "API Picker" },
  { href: "/changes", label: "Changes" },
];

// The phone menu (UX laws, 2026-11-11 and 2026-11-12).
//
// Hick's law: it opens on nine rows, not twenty-one. Miller's law: the guides
// are two named chunks of seven and eight instead of one fold of thirteen.
// Serial position effect: the first rows are the sections people come to this
// site for, by Search Console clicks over 90 days to 2026-11-10 (Pricing 91,
// Alternatives 71, Fitness APIs 40 of 607), and the last row is the deadline
// tracker. Grouped rows render inside a <details> in MobileNav. Clusters with
// no search clicks in that window (market map, accessibility, audio coaching,
// own-your-data) stay one tap away in the footer; the panel only renders
// while open, so the menu carries no crawl weight either way.
const GUIDES = "Guides";
const REFERENCE = "Reference";
const MOBILE_LINKS = [
  { href: "/fitness-apis", label: "Fitness APIs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/alternatives", label: "Alternatives" },
  { href: "/picker", label: "API Picker" },
  { href: "/tools", label: "Free tools" },
  { href: "/integrate", label: "Integration guides", group: GUIDES },
  { href: "/fix", label: "Troubleshooting", group: GUIDES },
  { href: "/compare", label: "Comparisons", group: GUIDES },
  { href: "/motion", label: "AI motion tracking", group: GUIDES },
  { href: "/devices", label: "Connected devices", group: GUIDES },
  { href: "/watch-apps", label: "Watch apps", group: GUIDES },
  { href: "/engagement", label: "Engagement", group: GUIDES },
  { href: "/apis", label: "API directory", group: REFERENCE },
  { href: "/health-connect", label: "Health Connect records", group: REFERENCE },
  { href: "/health-connect-api", label: "Health Connect API", group: REFERENCE },
  { href: "/healthkit-queries", label: "HealthKit queries", group: REFERENCE },
  { href: "/phone-sensors", label: "Phone sensors", group: REFERENCE },
  { href: "/libraries", label: "Open-source libraries", group: REFERENCE },
  { href: "/cookbook", label: "Cookbook", group: REFERENCE },
  { href: "/site-index", label: "All topics", group: REFERENCE },
  { href: "/blog", label: "Blog" },
  { href: "/changes", label: "Changes & deadlines" },
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
