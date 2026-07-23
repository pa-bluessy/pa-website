"use client";

import { useEffect, useState } from "react";

type Props = {
  className?: string;
  intensity?: "subtle" | "hero";
};

export function SpaceBackdrop({ className = "", intensity = "subtle" }: Props) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (intensity !== "hero") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [intensity]);

  const nebulaOpacity = intensity === "hero" ? "opacity-90" : "opacity-50";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-[#03050B]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07101F] via-[#03050B] to-[#03050B]" />

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(130,190,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(130,190,255,0.35) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div
        className={`absolute -right-[10%] top-[8%] h-[70%] w-[70%] ${nebulaOpacity} transition-transform duration-700 ease-out motion-safe:animate-nebula-shift`}
        style={{
          transform: `translate3d(${offset.x * 0.6}px, ${offset.y * 0.6}px, 0)`,
          background:
            "radial-gradient(ellipse at 55% 45%, rgba(139,124,255,0.28) 0%, transparent 55%), radial-gradient(ellipse at 40% 60%, rgba(101,217,255,0.16) 0%, transparent 50%), radial-gradient(ellipse at 70% 35%, rgba(70,90,180,0.22) 0%, transparent 45%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute left-[-15%] bottom-[5%] h-[45%] w-[55%] opacity-40"
        style={{
          transform: `translate3d(${offset.x * -0.3}px, ${offset.y * -0.3}px, 0)`,
          background:
            "radial-gradient(ellipse at center, rgba(101,217,255,0.12) 0%, transparent 60%)",
          filter: "blur(12px)",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(3,5,11,0.85)_100%)]" />
    </div>
  );
}
