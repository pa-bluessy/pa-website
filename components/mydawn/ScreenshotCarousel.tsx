"use client";

import Image from "next/image";
import { useRef } from "react";

type Shot = {
  src: string;
  alt: string;
};

type Props = {
  shots: Shot[];
};

export function ScreenshotCarousel({ shots }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(280, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar md:gap-6"
        aria-label="MyDawnスクリーンショット"
      >
        {shots.map((shot) => (
          <figure
            key={shot.src}
            className="relative aspect-[9/16] w-[220px] flex-none overflow-hidden md:w-[260px]"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              className="object-cover object-top"
              sizes="260px"
            />
          </figure>
        ))}
      </div>
      <div className="mt-4 hidden justify-end gap-2 md:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="inline-flex h-10 w-10 items-center justify-center text-pa-muted/70 transition-opacity hover:text-[#F3EDE3]"
          aria-label="前のスクリーンショット"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="inline-flex h-10 w-10 items-center justify-center text-pa-muted/70 transition-opacity hover:text-[#F3EDE3]"
          aria-label="次のスクリーンショット"
        >
          →
        </button>
      </div>
    </div>
  );
}
