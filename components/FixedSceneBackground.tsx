"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Survive client navigations — fade in only once per session */
let hasSceneFadedIn = false;

/**
 * Single viewport-fixed night scene for the whole site.
 * Never remounts a second copy on inner pages (that caused crop jitter).
 */
export function FixedSceneBackground() {
  const [ready, setReady] = useState(hasSceneFadedIn);

  useEffect(() => {
    if (hasSceneFadedIn) {
      setReady(true);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      hasSceneFadedIn = true;
      setReady(true);
      return;
    }
    const id = window.requestAnimationFrame(() => {
      hasSceneFadedIn = true;
      setReady(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
      style={{
        width: "100%",
        height: "100%",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-[2.4s] ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src="/images/basement-night.png"
          alt=""
          fill
          priority
          quality={85}
          draggable={false}
          className="object-cover object-[center_40%]"
          sizes="100vw"
          style={{
            transform: "translateZ(0)",
          }}
        />
        <div className="absolute inset-0 bg-[#03050B]/48" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#03050B]/40 via-transparent to-[#03050B]/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03050B]/35 via-transparent to-[#03050B]/25" />
      </div>
    </div>
  );
}
