"use client";

import { useEffect, useRef } from "react";
import { useLetter } from "@/components/LetterExperience";

/** Hides Back-to-Top when the page end is in view (same as Ending). */
export function LetterEndSensor() {
  const ref = useRef<HTMLDivElement>(null);
  const { setEndingInView } = useLetter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setEndingInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setEndingInView(false);
    };
  }, [setEndingInView]);

  return <div ref={ref} className="h-px w-full" aria-hidden />;
}
