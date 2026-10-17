import { allSpokes, CLUSTER_LABELS } from "@/lib/clusterRegistry";
import { LIBRARIES_BASE, LIBRARY_COMPARISONS, libraryPages } from "@/data/librariesEditorial";
import { hkStandaloneEntries } from "@/data/hkStandalone.entries";
import { PAGE_H1 } from "@/data/pageTitles";
import { API_ENTRIES, APIS_PATH } from "@/data/apis";
import { POSE_SCHEMES } from "@/data/poseKeypoints";
import { schemeH1, schemePath } from "@/data/poseKeypointPages";
import { hkPageIdentifiers, hkIdentifierPath, hkPageH1 } from "@/data/hkIdentifierPages";
import { hsPageTypes, hsDataTypePath, hsPageH1 } from "@/data/hsDataTypePages";

/**
 * A page's name, for links built from data rather than written by hand (the
 * search-demand lists on the /apis pages, the vendor menus). Cluster spokes,
 * library pages, the HealthKit reference pages and the directory entries give
 * their own title; the hand-built pages in data/pageTitles.ts the H1 they
 * render from it; cluster hubs their hub label; the hubs below the H1 they
 * render (keep in step). A route not known here returns undefined and the
 * caller drops the link: printing a bare path as link text is what the site
 * never does.
 */
const STANDALONE: Record<string, string> = {
  "/pricing": "Fitness & Health API Pricing",
  "/fix": "Fitness & Health API Troubleshooting",
  "/alternatives": "Fitness & Health API Alternatives",
  "/compare": "Fitness & Health API Comparisons",
  "/healthkit-queries": "HealthKit Queries",
  "/health-connect-api": "Health Connect API",
  "/pose-keypoints": "Pose Estimation Keypoint Maps",
};

let INDEX: Map<string, string> | null = null;

function build(): Map<string, string> {
  const m = new Map<string, string>();
  for (const [base, label] of Object.entries(CLUSTER_LABELS)) m.set(base, label);
  for (const { basePath, entry } of allSpokes()) m.set(`${basePath}/${entry.slug}`, entry.h1);
  for (const { lib, ed } of libraryPages()) m.set(`${LIBRARIES_BASE}/${lib.slug}`, ed.h1);
  for (const c of LIBRARY_COMPARISONS) m.set(`${LIBRARIES_BASE}/compare/${c.slug}`, c.h1);
  for (const e of hkStandaloneEntries) m.set(`/${e.slug}`, e.title);
  // The directory page's H1 is the product's full label (app/apis/[id]).
  for (const a of API_ENTRIES) m.set(`${APIS_PATH}/${a.id}`, a.label);
  for (const [path, label] of Object.entries(PAGE_H1)) m.set(path, label);
  for (const s of POSE_SCHEMES) m.set(schemePath(s), schemeH1(s));
  // Generated per-type reference pages: the H1 each renders.
  for (const id of hkPageIdentifiers()) m.set(hkIdentifierPath(id), hkPageH1(id));
  for (const t of hsPageTypes()) m.set(hsDataTypePath(t), hsPageH1(t));
  for (const [path, label] of Object.entries(STANDALONE)) m.set(path, label);
  return m;
}

export function routeLabel(href: string): string | undefined {
  INDEX ??= build();
  return INDEX.get(href.split("#")[0]);
}
