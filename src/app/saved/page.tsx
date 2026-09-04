import type { Metadata } from "next";
import Container from "@/components/Container";
import { SavedList } from "@/components/BookmarkButton";

/**
 * The reader's saved pages.
 *
 * Everything on this page comes out of the visitor's own browser, so there is
 * nothing here for a crawler to index and nothing stable to rank — hence
 * `robots: { index: false }`, the same call /signup makes. The route itself is
 * a server component purely so it can carry that metadata; the body is
 * client-only.
 */

export const metadata: Metadata = {
  title: "Saved pages",
  description:
    "The pages you saved on this site, kept in your own browser — no account, nothing sent anywhere, and nothing that follows you to another device.",
  alternates: { canonical: "/saved" },
  robots: { index: false }, // a per-visitor list has nothing to rank for
};

export default function SavedPage() {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
          Saved pages
        </h1>
        <SavedList />
      </div>
    </Container>
  );
}
