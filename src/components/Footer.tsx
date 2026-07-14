import Link from "next/link";
import Container from "./Container";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <Container className="flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <p className="text-sm text-[var(--muted)]">
          © {year} {site.name}. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          <Link href="/fitness-apis" className="hover:text-[var(--fg)]">
            Fitness APIs
          </Link>
          <Link href="/guides" className="hover:text-[var(--fg)]">
            Guides
          </Link>
          <Link href="/build" className="hover:text-[var(--fg)]">
            Build
          </Link>
          <Link href="/integrate" className="hover:text-[var(--fg)]">
            Integrate
          </Link>
          <Link href="/fix" className="hover:text-[var(--fg)]">
            Troubleshooting
          </Link>
          <Link href="/learn" className="hover:text-[var(--fg)]">
            Concepts
          </Link>
          <Link href="/alternatives" className="hover:text-[var(--fg)]">
            Alternatives
          </Link>
          <Link href="/compliance" className="hover:text-[var(--fg)]">
            Compliance
          </Link>
          <Link href="/blog" className="hover:text-[var(--fg)]">
            Blog
          </Link>
          <Link href="/about" className="hover:text-[var(--fg)]">
            About
          </Link>
          <Link href="/site-index" className="hover:text-[var(--fg)]">
            Site index
          </Link>
          <a href="/feed.xml" className="hover:text-[var(--fg)]">
            RSS
          </a>
          {site.social.github && (
            <a
              href={site.social.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--fg)]"
            >
              GitHub
            </a>
          )}
        </nav>
      </Container>
    </footer>
  );
}
