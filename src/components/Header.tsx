import Link from "next/link";
import Container from "./Container";
import { site } from "@/lib/site";

const nav = [
  { href: "/fitness-apis", label: "Fitness APIs" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            AF
          </span>
          <span className="text-[var(--fg)]">{site.name}</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#subscribe"
            className="ml-1 rounded-md bg-brand-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500"
          >
            Subscribe
          </Link>
        </nav>
      </Container>
    </header>
  );
}
