import type { Metadata } from "next";
import Container from "@/components/Container";
import Newsletter from "@/components/Newsletter";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — a hub for builders in health, wellness, and fitness tech.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)]">
          About {site.name}
        </h1>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-a:text-brand-600">
          <p>
            {site.name} is a home for people building — or looking for —
            products in health, wellness, and fitness technology. Founders,
            engineers, designers, and operators all pass through the same hard
            problems: how to model workouts, keep users engaged, ship
            AI-powered coaching, and integrate the right APIs without
            reinventing the wheel.
          </p>
          <p>
            We publish product breakdowns, API deep-dives, and practical
            playbooks so you can spend less time on undifferentiated plumbing
            and more time on the experience that makes your product worth using.
          </p>
          <p>
            Have something to share, or want to be featured? Reach out at{" "}
            <a href={`mailto:${site.author.email}`}>{site.author.email}</a>.
          </p>
        </div>

        <div className="mt-14">
          <Newsletter />
        </div>
      </div>
    </Container>
  );
}
