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
        <nav className="flex items-center gap-5 text-sm text-[var(--muted)]">
          <Link href="/blog" className="hover:text-[var(--fg)]">
            Blog
          </Link>
          <Link href="/about" className="hover:text-[var(--fg)]">
            About
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
