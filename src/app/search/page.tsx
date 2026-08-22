import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchResults from "@/components/SearchResults";
import PageSummary from "@/components/PageSummary";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search every page on AIFitnessAPI — guides, comparisons, integration walkthroughs, and the individual answers inside them.",
  alternates: { canonical: "/search" },
  // A results page is generated from a query, not authored. Indexing it would
  // put thousands of near-identical URLs in front of a crawler; the pages it
  // points at are the content. It stays followable so the links still count.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Search", path: "/search" }]} />
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">Search</h1>
        <PageSummary path="/search" name="Search AIFitnessAPI" className="mt-3 text-[var(--muted)]">
          Every page, plus every individual question answered inside one. Searching runs
          entirely in your browser against an index we publish; the query never leaves the
          page unless it finds nothing, in which case we keep the words so we know what to
          write next.
        </PageSummary>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading search…</p>}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
