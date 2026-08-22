import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";
import { releasedGuides, GUIDES_PATH } from "@/data/guides";
import { releasedBuilds, BUILD_PATH } from "@/data/build";
import { releasedIntegrations, INTEGRATE_PATH } from "@/data/integrate";
import { releasedFixes, FIX_PATH } from "@/data/fix";
import { releasedLearn, LEARN_PATH } from "@/data/learn";
import { releasedAlternatives, ALTERNATIVES_PATH } from "@/data/alternatives";
import { releasedCompliance, COMPLIANCE_PATH } from "@/data/compliance";
import { releasedMigrate, MIGRATE_PATH } from "@/data/migrate";
import { releasedPricing, PRICING_PATH } from "@/data/pricing";
import { releasedCompare, COMPARE_PATH } from "@/data/compare";
import { releasedData, DATA_PATH } from "@/data/healthData";
import { releasedMotion, MOTION_PATH } from "@/data/motion";
import { releasedAi, AI_PATH } from "@/data/ai";
import { releasedArchitecture, ARCHITECTURE_PATH } from "@/data/architecture";
import { releasedTesting, TEST_PATH } from "@/data/testing";
import { releasedCookbook, COOKBOOK_PATH } from "@/data/cookbook";
import { releasedDevices, DEVICES_PATH } from "@/data/devices";
import { releasedEngagement, ENGAGEMENT_PATH } from "@/data/engagement";
import { releasedWatchApps, WATCH_PATH } from "@/data/watchApps";
import { clusterMap } from "@/lib/clusterRegistry";
import { changesSorted } from "@/data/changes";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const spokes = releasedEntries();
  const guides = releasedGuides();
  const builds = releasedBuilds();
  const integrations = releasedIntegrations();
  const fixes = releasedFixes();
  const learn = releasedLearn();
  const alternatives = releasedAlternatives();
  const compliance = releasedCompliance();
  const migrate = releasedMigrate();
  const pricing = releasedPricing();
  const compare = releasedCompare();
  const healthData = releasedData();
  const motion = releasedMotion();
  const ai = releasedAi();
  const architecture = releasedArchitecture();
  const testing = releasedTesting();
  const cookbook = releasedCookbook();
  const devices = releasedDevices();
  const engagement = releasedEngagement();
  const watchApps = releasedWatchApps();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(PILLAR_PATH), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(GUIDES_PATH), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(BUILD_PATH), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(INTEGRATE_PATH), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(FIX_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(LEARN_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(ALTERNATIVES_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(COMPLIANCE_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(MIGRATE_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(PRICING_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(COMPARE_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(DATA_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(MOTION_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(AI_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(ARCHITECTURE_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(TEST_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(COOKBOOK_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(DEVICES_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(ENGAGEMENT_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl(WATCH_PATH), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/google-fit-shutdown"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/methodology"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/day-boundaries"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/glossary"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/picker"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/cost-planner"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/ai-fitness-app"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/no-code-fitness-app"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/fitbit-api-shutdown"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/state-of-fitness-apis-2026"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/changes"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/matrix"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/site-index"), changeFrequency: "monthly", priority: 0.3 },
  ];

  const spokeRoutes: MetadataRoute.Sitemap = spokes.map((e) => ({
    url: absoluteUrl(`${PILLAR_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((e) => ({
    url: absoluteUrl(`${GUIDES_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const buildRoutes: MetadataRoute.Sitemap = builds.map((e) => ({
    url: absoluteUrl(`${BUILD_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const integrateRoutes: MetadataRoute.Sitemap = integrations.map((e) => ({
    url: absoluteUrl(`${INTEGRATE_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const fixRoutes: MetadataRoute.Sitemap = fixes.map((e) => ({
    url: absoluteUrl(`${FIX_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const learnRoutes: MetadataRoute.Sitemap = learn.map((e) => ({
    url: absoluteUrl(`${LEARN_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const alternativesRoutes: MetadataRoute.Sitemap = alternatives.map((e) => ({
    url: absoluteUrl(`${ALTERNATIVES_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const complianceRoutes: MetadataRoute.Sitemap = compliance.map((e) => ({
    url: absoluteUrl(`${COMPLIANCE_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const migrateRoutes: MetadataRoute.Sitemap = migrate.map((e) => ({
    url: absoluteUrl(`${MIGRATE_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const pricingRoutes: MetadataRoute.Sitemap = pricing.map((e) => ({
    url: absoluteUrl(`${PRICING_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const compareRoutes: MetadataRoute.Sitemap = compare.map((e) => ({
    url: absoluteUrl(`${COMPARE_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const dataRoutes: MetadataRoute.Sitemap = healthData.map((e) => ({
    url: absoluteUrl(`${DATA_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const motionRoutes: MetadataRoute.Sitemap = motion.map((e) => ({
    url: absoluteUrl(`${MOTION_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const aiRoutes: MetadataRoute.Sitemap = ai.map((e) => ({
    url: absoluteUrl(`${AI_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const architectureRoutes: MetadataRoute.Sitemap = architecture.map((e) => ({
    url: absoluteUrl(`${ARCHITECTURE_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const testingRoutes: MetadataRoute.Sitemap = testing.map((e) => ({
    url: absoluteUrl(`${TEST_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const cookbookRoutes: MetadataRoute.Sitemap = cookbook.map((e) => ({
    url: absoluteUrl(`${COOKBOOK_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const deviceRoutes: MetadataRoute.Sitemap = devices.map((e) => ({
    url: absoluteUrl(`${DEVICES_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const engagementRoutes: MetadataRoute.Sitemap = engagement.map((e) => ({
    url: absoluteUrl(`${ENGAGEMENT_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const watchRoutes: MetadataRoute.Sitemap = watchApps.map((e) => ({
    url: absoluteUrl(`${WATCH_PATH}/${e.slug}`),
    lastModified: new Date(e.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Freshness for the non-spoke routes: a hub is as fresh as its newest
  // page, and the home/index surfaces are as fresh as the newest page on the
  // site. Without this, every hub reports no lastmod and looks static to
  // anything that schedules recrawls by change rate.
  const map = clusterMap();
  const newestIn = (base: string) =>
    map[base]?.map((e) => e.updated).sort().at(-1);
  const newestAll = Object.values(map)
    .flatMap((l) => l.map((e) => e.updated))
    .sort()
    .at(-1);
  const newestChange = changesSorted()
    .map((c) => c.verifiedOn)
    .sort()
    .at(-1);

  // An empty cluster's hub 404s, so it must not appear in the sitemap.
  const populatedHubs = new Set(
    Object.entries(map).filter(([, e]) => e.length > 0).map(([b]) => absoluteUrl(b)),
  );
  const allHubs = new Set(Object.keys(map).map((b) => absoluteUrl(b)));
  const listed = staticRoutes.filter((r) => !allHubs.has(r.url) || populatedHubs.has(r.url));

  const dated: MetadataRoute.Sitemap = listed.map((r) => {
    const path = r.url.replace(absoluteUrl(""), "") || "/";
    const stamp =
      newestIn(path) ??
      (path === "/changes" ? newestChange : undefined) ??
      (["/", "/site-index", "/blog"].includes(path) ? newestAll : undefined);
    return stamp ? { ...r, lastModified: new Date(stamp) } : r;
  });

  return [
    ...dated,
    ...spokeRoutes,
    ...guideRoutes,
    ...buildRoutes,
    ...integrateRoutes,
    ...fixRoutes,
    ...learnRoutes,
    ...alternativesRoutes,
    ...complianceRoutes,
    ...migrateRoutes,
    ...pricingRoutes,
    ...compareRoutes,
    ...dataRoutes,
    ...motionRoutes,
    ...aiRoutes,
    ...architectureRoutes,
    ...testingRoutes,
    ...cookbookRoutes,
    ...deviceRoutes,
    ...engagementRoutes,
    ...watchRoutes,
    ...postRoutes,
  ];
}
