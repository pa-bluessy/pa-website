import Image from "next/image";
import Link from "next/link";
import { ABOUT_ITEMS, ABOUT_LEAD } from "@/lib/data";
import { Reveal } from "./Reveal";

export function AboutSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 20% 40%, rgba(139,124,255,0.12), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:px-8">
        <Reveal>
          <div className="relative mx-auto h-[min(58svh,480px)] w-full max-w-md overflow-hidden md:mx-0 md:h-[min(68svh,560px)] md:max-w-none">
            <Image
              src="/images/profile.jpeg"
              alt="Pa.のポートレート写真"
              fill
              className="object-cover object-[center_18%] opacity-90"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, #03050B 0%, rgba(3,5,11,0.55) 28%, transparent 55%), linear-gradient(to right, rgba(3,5,11,0.55) 0%, transparent 18%, transparent 82%, rgba(3,5,11,0.55) 100%), linear-gradient(to bottom, rgba(3,5,11,0.35) 0%, transparent 20%)",
              }}
              aria-hidden
            />

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-pa-text md:text-4xl">
                Pa.
              </h2>
              <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-pa-muted md:max-w-[18rem] md:text-sm">
                {ABOUT_LEAD}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <ul className="flex flex-col gap-3">
              {ABOUT_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/about#${item.id}`}
                    className="group flex items-center gap-3 border border-pa-border bg-[rgba(10,18,35,0.45)] px-4 py-4 backdrop-blur-sm transition-all duration-300 hover:border-pa-cyan/40 hover:shadow-glow md:px-5 md:py-5"
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="absolute inset-0 rounded-full bg-pa-cyan/80 group-hover:shadow-[0_0_10px_rgba(101,217,255,0.7)]" />
                    </span>
                    <span className="font-sans text-xs tracking-[0.16em] text-pa-text transition-colors group-hover:text-pa-cyan md:text-sm">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-3 text-sm tracking-wide text-pa-text transition-colors hover:text-pa-cyan"
            >
              <span className="font-sans text-[10px] text-pa-cyan/70">VIEW MORE</span>
              <span className="h-px w-10 bg-pa-border" aria-hidden />
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
