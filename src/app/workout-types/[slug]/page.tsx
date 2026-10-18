import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PLATFORM_ORDER,
  WT_FETCHED,
  activityDescription,
  activityPath,
  activityRows,
  activityTitle,
  getActivity,
  isPlatformSlug,
  platformDescription,
  platformPath,
  platformTitle,
} from "@/data/workoutTypePages";
import PlatformPage from "../_platform";
import ActivityPage from "../_activity";

/**
 * /workout-types/<slug>: the four platform list pages (healthkit,
 * health-connect, wear-os, google-health-api) and one page per crosswalk row
 * that clears the activity page rule. Both kinds share the segment; a slug is
 * a platform or an activity, never both (activityRows() throws on a clash).
 */

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return [...PLATFORM_ORDER.map((slug) => ({ slug })), ...activityRows().map((r) => ({ slug: r.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (isPlatformSlug(slug)) {
    const path = platformPath(slug);
    const title = platformTitle(slug);
    const description = platformDescription(slug);
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: path },
      openGraph: { type: "article", title, description, url: path, modifiedTime: WT_FETCHED },
      twitter: { card: "summary_large_image", title, description },
    };
  }
  const row = getActivity(slug);
  if (!row) return {};
  const path = activityPath(row);
  const title = activityTitle(row);
  const description = activityDescription(row);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { type: "article", title, description, url: path, modifiedTime: WT_FETCHED },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WorkoutTypeSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (isPlatformSlug(slug)) return <PlatformPage slug={slug} />;
  const row = getActivity(slug);
  if (!row) notFound();
  return <ActivityPage row={row} />;
}
