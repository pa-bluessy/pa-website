"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data";
import { FilmGrain } from "./space/FilmGrain";

export function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }
    const t = window.setTimeout(() => setVisible(true), 280);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section className="relative grid h-full min-h-[100svh] flex-1 grid-cols-2 grid-rows-2 overflow-hidden">
      <FilmGrain className="z-[1] opacity-[0.035]" />

      {/* Bottom-left quadrant — letter opening */}
      <div
        className={`letter-pad relative z-10 col-start-1 row-start-2 flex items-end justify-start pb-24 pt-4 transition-opacity duration-[1.4s] ease-out md:pb-28 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="w-full text-left">
          <span
            className="block font-display font-medium text-[#F3EDE3]"
            style={{
              fontSize: "clamp(3.76rem, 13.16vw, 6.39rem)",
              lineHeight: 0.94,
              letterSpacing: "-0.035em",
            }}
          >
            {SITE.taglineLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </span>
        </h1>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-[2s] ease-out md:bottom-10 ${
          visible ? "opacity-60" : "opacity-0"
        }`}
      >
        <span className="text-[10px] tracking-[0.28em] text-pa-muted uppercase">
          Scroll
        </span>
        <span className="block h-8 w-px bg-gradient-to-b from-[#F3EDE3]/35 to-transparent" aria-hidden />
      </div>
    </section>
  );
}
