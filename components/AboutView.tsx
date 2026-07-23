"use client";

import Image from "next/image";
import Link from "next/link";
import { LetterEndSensor } from "@/components/LetterEndSensor";
import { ABOUT_ITEMS, ABOUT_LEAD } from "@/lib/data";

function AboutChapter({
  index,
  item,
}: {
  index: number;
  item: (typeof ABOUT_ITEMS)[number];
}) {
  return (
    <article
      id={item.id}
      className="scroll-mt-28 border-t border-[rgba(148,170,195,0.22)] py-14 first:border-t-0 first:pt-0 md:py-16"
    >
      <div className="flex flex-col gap-6 md:flex-row md:gap-14 lg:gap-16">
        <p className="w-10 shrink-0 font-display text-sm tracking-[0.16em] text-pa-muted/50 md:w-12 md:pt-1 md:text-base">
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.22em] text-pa-muted/55 uppercase md:text-[11px]">
            {item.label}
          </p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-[#F3EDE3] md:text-4xl lg:text-5xl">
            {item.title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#F3EDE3]/70 md:max-w-lg md:text-base lg:text-lg">
            {item.body}
          </p>
          <a
            href={`#${item.id}`}
            className="mt-8 inline-block text-sm tracking-wide text-pa-muted/70 transition-opacity hover:text-[#F3EDE3]"
          >
            {item.hrefLabel} →
          </a>
        </div>
      </div>
    </article>
  );
}

export function AboutView() {
  return (
    <div className="relative z-10">
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20 pt-28 md:justify-center md:pb-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/images/profile.jpeg"
            alt=""
            fill
            className="object-cover object-[center_18%] opacity-90 md:object-[center_22%]"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(3,5,11,0.72) 0%, rgba(3,5,11,0.35) 48%, rgba(3,5,11,0.18) 100%), linear-gradient(180deg, rgba(3,5,11,0.4) 0%, transparent 30%, rgba(3,5,11,0.35) 100%)",
            }}
          />
        </div>

        <div className="letter-pad relative max-w-xl md:max-w-2xl">
          <h1 className="font-signature text-5xl font-normal leading-none text-[#F3EDE3] md:text-6xl lg:text-7xl">
            Pa.
          </h1>
          <p className="mt-8 max-w-md whitespace-pre-line text-base leading-relaxed text-[#F3EDE3]/85 md:mt-10 md:max-w-lg md:text-lg lg:text-xl">
            {ABOUT_LEAD}
          </p>
          <p className="mt-10 text-[10px] tracking-[0.22em] text-pa-muted/60 uppercase">
            Scroll
          </p>
        </div>
      </section>

      <section className="relative min-h-[100svh]">
        <div className="pointer-events-none absolute inset-0 bg-[#03050B]/55" aria-hidden />
        <div className="letter-pad relative flex min-h-[100svh] flex-col justify-center py-20 md:py-28 lg:py-32">
          <div className="chapter-rail">
            {ABOUT_ITEMS.map((item, i) => (
              <AboutChapter key={item.id} index={i} item={item} />
            ))}

            <div className="border-t border-[rgba(148,170,195,0.22)] pt-14">
              <Link href="/" className="group inline-block transition-opacity hover:opacity-80">
                <span className="block font-display text-lg text-[#F3EDE3]">
                  Back to the letter
                </span>
                <span className="mt-1 block text-sm text-pa-muted/65">手紙へ戻る</span>
              </Link>
            </div>
          </div>
          <LetterEndSensor />
        </div>
      </section>
    </div>
  );
}
