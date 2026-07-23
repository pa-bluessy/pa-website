"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";
import { useLetter } from "./LetterExperience";
import { MobileNavDrawer } from "./MobileNavDrawer";

export function Header() {
  const { state, isHome, endingInView } = useLetter();
  const letterOpen = !isHome || state === "open";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (endingInView && window.scrollY < window.innerHeight * 0.5) {
        setRevealed(true);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [endingInView]);

  useEffect(() => {
    if (!endingInView) setRevealed(false);
  }, [endingInView]);

  useEffect(() => {
    if (!letterOpen) return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, letterOpen]);

  if (!letterOpen) return null;

  const dimmed = endingInView && !menuOpen && !revealed;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-opacity duration-700 ${
          scrolled || menuOpen ? "bg-[#03050B]/70" : "bg-transparent"
        } ${dimmed ? "opacity-25" : "opacity-100"}`}
      >
        <div className="letter-pad flex h-14 items-center justify-end md:h-16">
          <nav className="hidden items-center gap-8 md:flex" aria-label="メインナビゲーション">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-[0.14em] text-[#F3EDE3]/55 transition-opacity hover:text-[#F3EDE3]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/privacy"
              className="text-xs tracking-[0.14em] text-[#F3EDE3]/40 transition-opacity hover:text-[#F3EDE3]"
            >
              Privacy
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-[#F3EDE3]/80 md:hidden"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => {
              setMenuOpen((v) => !v);
              setRevealed(true);
            }}
          >
            <span className="sr-only">メニュー</span>
            <span className="relative block h-[12px] w-5">
              <span
                className={`absolute left-0 top-0 block h-px w-full bg-current transition-transform duration-200 ${
                  menuOpen ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[5px] block h-px w-full bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[10px] block h-px w-full bg-current transition-transform duration-200 ${
                  menuOpen ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
