"use client";

import Link from "next/link";
import { useLetter } from "./LetterExperience";

/** Inner pages only — home letter ends with the seal, not a copyright bar. */
export function Footer() {
  const year = new Date().getFullYear();
  const { isHome } = useLetter();

  if (isHome) return null;

  return (
    <footer className="relative z-10 border-t border-pa-border/20 bg-[rgba(3,5,11,0.92)]">
      <div className="letter-pad flex flex-wrap items-center justify-between gap-4 py-8 text-[10px] tracking-[0.14em] text-pa-muted/50">
        <p>© {year} pa.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/about" className="transition-opacity hover:text-[#F3EDE3]">
            About
          </Link>
          <Link href="/privacy" className="transition-opacity hover:text-[#F3EDE3]">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
