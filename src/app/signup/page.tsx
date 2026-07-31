import type { Metadata } from "next";
import Container from "@/components/Container";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Get AIFitnessAPI breakdowns and playbooks matched to what you're building.",
  alternates: { canonical: "/signup" },
  robots: { index: false }, // a form page has nothing to rank for
};

export default function SignupPage() {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
          Get the good stuff, matched to what you&rsquo;re building
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Tell us a little about yourself and what you&rsquo;re working on, and
          the breakdowns you get will actually be relevant — camera-based
          tracking if that&rsquo;s your thing, wearable data plumbing if
          that&rsquo;s yours.
        </p>
        <div className="mt-8">
          <SignupForm source="signup-page" />
        </div>
      </div>
    </Container>
  );
}
