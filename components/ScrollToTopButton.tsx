"use client";

import { useEffect, useState } from "react";
import { useLetter } from "./LetterExperience";

export function ScrollToTopButton() {
  const { state, isHome, endingInView } = useLetter();
  const [visible, setVisible] = useState(false);
  const allowed = !isHome || state === "open";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!allowed) return null;

  const show = visible && !endingInView;

  return (
    <button
      type="button"
      aria-label="ページ上部へ戻る"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 z-30 inline-flex h-11 w-11 items-center justify-center border border-pa-border/50 bg-[#07101F]/75 text-[#F3EDE3]/80 transition-opacity duration-500 md:hidden ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-5 5m5-5l5 5" />
      </svg>
    </button>
  );
}
