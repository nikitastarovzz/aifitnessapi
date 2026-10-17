import { allSpokes, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { LIBRARIES_BASE, LIBRARY_COMPARISONS, libraryPages } from "@/data/librariesEditorial";
import { hkStandaloneEntries } from "@/data/hkStandalone.entries";
import { BT_BASE, BT_HUB_H1, BT_PAGES, btH1, btPath } from "@/data/btPages";

/**
 * A page's name, for links built from data rather than written by hand (the
 * search-demand lists on the /apis pages). Cluster spokes, library pages and
 * the HealthKit reference pages give their own title; cluster hubs their hub
 * label; the hand-built pages below the H1 they render (keep in step). A
 * route not known here returns undefined and the caller drops the link:
 * printing a bare path as link text is what the site never does.
 */
const STANDALONE: Record<string, string> = {
  "/matrix": "HealthKit \u2194 Health Connect: The Data-Type Reference",
  "/fitbit-api-shutdown": "Fitbit Web API Retirement: Deadlines and the Migration Path",
  "/google-fit-shutdown": "Google Fit Is Shutting Down",
  "/pricing": "Fitness & Health API Pricing",
  "/fix": "Fitness & Health API Troubleshooting",
  "/alternatives": "Fitness & Health API Alternatives",
  "/compare": "Fitness & Health API Comparisons",
  "/healthkit-queries": "HealthKit Queries",
  "/health-connect-api": "Health Connect API",
  [BT_BASE]: BT_HUB_H1,
};

let INDEX: Map<string, string> | null = null;

function build(): Map<string, string> {
  const m = new Map<string, string>();
  for (const [base, label] of Object.entries(CLUSTER_LABELS)) m.set(base, label);
  for (const { basePath, entry } of allSpokes()) m.set(`${basePath}/${entry.slug}`, entry.h1);
  for (const { lib, ed } of libraryPages()) m.set(`${LIBRARIES_BASE}/${lib.slug}`, ed.h1);
  for (const c of LIBRARY_COMPARISONS) m.set(`${LIBRARIES_BASE}/compare/${c.slug}`, c.h1);
  for (const e of hkStandaloneEntries) m.set(`/${e.slug}`, e.title);
  for (const c of BT_PAGES) m.set(btPath(c), btH1(c));
  for (const [path, label] of Object.entries(STANDALONE)) m.set(path, label);
  return m;
}

export function routeLabel(href: string): string | undefined {
  INDEX ??= build();
  return INDEX.get(href.split("#")[0]);
}
