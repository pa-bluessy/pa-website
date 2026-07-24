"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLetter } from "./LetterExperience";

/**
 * Final cut of the letter — not a website footer.
 * Hero opens the letter; Ending seals it.
 */
export function EndingSection() {
  const { state, isHome, setEndingInView } = useLetter();
  const sectionRef = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showSign, setShowSign] = useState(false);
  const [showSeal, setShowSeal] = useState(false);

  const active = !isHome || state === "open";

  useEffect(() => {
    if (!active) return;
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setEndingInView(entry.isIntersecting);
        if (entry.isIntersecting) setArmed(true);
      },
      { threshold: 0.65 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setEndingInView(false);
    };
  }, [active, setEndingInView]);

  useEffect(() => {
    if (!armed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShowCopy(true);
      setShowSign(true);
      setShowSeal(true);
      return;
    }

    const tCopy = window.setTimeout(() => setShowCopy(true), 300);
    const tSign = window.setTimeout(() => setShowSign(true), 1200);
    const tSeal = window.setTimeout(() => setShowSeal(true), 3000);
    return () => {
      window.clearTimeout(tCopy);
      window.clearTimeout(tSign);
      window.clearTimeout(tSeal);
    };
  }, [armed]);

  return (
    <section
      ref={sectionRef}
      id="ending"
      className="ending-section relative min-h-[100svh] overflow-hidden"
    >
      {/* Portrait — right-weighted; desktop uses a narrower plane so face isn't mid-cropped */}
      <div className="absolute inset-0 md:left-[32%] lg:left-[36%]">
        <Image
          src="/images/ending-portrait.png"
          alt=""
          fill
          className="object-cover object-[70%_18%] md:object-[62%_14%] lg:object-[58%_12%]"
          sizes="(min-width: 768px) 68vw, 100vw"
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,5,11,0.94) 0%, rgba(2,5,11,0.78) 40%, rgba(2,5,11,0.42) 72%, rgba(2,5,11,0.5) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,5,11,0.88) 0%, rgba(2,5,11,0.35) 28%, rgba(2,5,11,0.12) 55%, rgba(2,5,11,0.28) 100%)",
          }}
          aria-hidden
        />
      </div>

      {/* Soft fill behind text column on desktop */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42%] bg-[#02050B]/55 md:block lg:w-[40%]"
        aria-hidden
      />

      {/* Typography column — aligns with Hero letter-pad */}
      <div className="letter-pad relative z-10 flex min-h-[100svh] w-full flex-col justify-center pt-[8svh] md:w-[55%] md:max-w-[40rem] md:pt-0 lg:w-[50%]">
        <div className="max-w-[16ch] md:max-w-[15ch]">
          <p
            className={`ending-copy font-signature font-normal leading-[1.12] text-[#F3EDE3] transition-opacity duration-[1100ms] ease-out ${
              showCopy ? "opacity-100" : "opacity-0"
            }`}
          >
            See you
            <br />
            another night.
          </p>

          <div className="mt-10 flex items-center gap-5 md:mt-12 md:gap-7">
            <p
              className={`ending-signature font-signature text-[#F3EDE3]/90 transition-opacity duration-[1000ms] ease-out ${
                showSign ? "opacity-100" : "opacity-0"
              }`}
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Pa.
            </p>

            <div className="ending-seal relative flex h-[72px] w-[72px] shrink-0 items-center justify-center md:h-[88px] md:w-[88px]">
              {showSeal ? (
                <Image
                  src="/images/pa-wax-seal.png"
                  alt=""
                  width={88}
                  height={88}
                  className="h-full w-full object-contain animate-seal-stamp"
                  style={{
                    filter:
                      "drop-shadow(0 6px 10px rgba(0,0,0,0.35)) drop-shadow(0 1px 2px rgba(0,0,0,0.28))",
                  }}
                  unoptimized
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
