import Image from "next/image";
import { MYDAWN } from "@/lib/data";

export function ProductDetailHeader() {
  return (
    <header className="grid gap-10 border-b border-pa-border/25 pb-12 md:grid-cols-2 md:items-center md:gap-16 md:pb-20 lg:gap-24">
      <div>
        <p className="mb-3 text-[10px] tracking-[0.2em] text-pa-muted/55 uppercase md:text-[11px]">
          Product
        </p>
        <div className="mb-4 flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-4xl font-medium tracking-tight text-[#F3EDE3] md:text-5xl lg:text-6xl">
            {MYDAWN.title}
          </h1>
          <span className="text-[10px] tracking-[0.16em] text-pa-muted/60 uppercase">
            {MYDAWN.status}
          </span>
        </div>
        <p className="font-display text-lg text-[#F3EDE3]/85 md:text-xl lg:text-2xl">{MYDAWN.tagline}</p>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-pa-muted md:text-base lg:text-lg">{MYDAWN.about}</p>
      </div>
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[260px] overflow-hidden md:mx-0 md:max-w-[320px] lg:max-w-[360px]">
        <Image
          src={MYDAWN.screenshots[0].src}
          alt={MYDAWN.screenshots[0].alt}
          fill
          className="object-cover object-top"
          sizes="300px"
          priority
        />
      </div>
    </header>
  );
}
