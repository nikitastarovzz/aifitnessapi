"use client";

import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";
import { track, markHandled } from "@/lib/track";

/**
 * Every CTA source is a member of this union, so analytics can attribute a
 * conversion to the exact spot it was clicked. Add new sources here, not ad hoc.
 */
export type CtaSource =
  | "header"
  | "global-footer"
  | "pillar-hero"
  | "pillar-inline"
  | "hub-card"
  | "spoke-inline"
  | "spoke-footer";

type Props = {
  href: string;
  source: CtaSource;
  /** Stable identifier for this CTA (data-cta), used by the delegated listener. */
  id: string;
  children: ReactNode;
  className?: string;
  /** External/store links open in a new tab so the beacon isn't dropped. */
  external?: boolean;
};

export default function CtaLink({
  href,
  source,
  id,
  children,
  className,
  external = false,
}: Props) {
  function onClick(e: MouseEvent) {
    // Fire immediately on click, before navigation; dedupe vs the delegated
    // backstop so a single click is counted once.
    if (markHandled(e.nativeEvent)) track(id, source);
  }
  const common = {
    "data-cta": id,
    "data-cta-source": source,
    className,
    onClick,
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...common}>
      {children}
    </Link>
  );
}
