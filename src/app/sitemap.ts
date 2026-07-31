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
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/google-fit-shutdown"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/picker"), changeFrequency: "monthly", priority: 0.8 },
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

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
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
    ...postRoutes,
  ];
}
