"use client";

import Link from "next/link";
import { FeedbackBlock } from "@/components/FeedbackModal";
import { LetterEndSensor } from "@/components/LetterEndSensor";
import { REPLY_LEAD, SNS_ITEMS, type SnsItem } from "@/lib/data";

function ReplyChapter({
  index,
  item,
}: {
  index: number;
  item: SnsItem;
}) {
  const comingSoon = item.comingSoon || !item.href;

  const body = (
    <div className="flex w-full flex-col gap-6 md:flex-row md:gap-14 lg:gap-16">
      <p className="w-10 shrink-0 font-display text-sm tracking-[0.16em] text-pa-muted/50 md:w-12 md:pt-1 md:text-base">
        {String(index + 1).padStart(2, "0")}
      </p>
      <div className="min-w-0 flex-1">
        {comingSoon ? (
          <>
            <p className="text-[10px] tracking-[0.22em] text-pa-muted/50 md:text-[11px]">
              {item.badge ?? "準備中"}
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-[#F3EDE3]/40 md:text-4xl lg:text-5xl">
              {item.name}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#F3EDE3]/45 md:max-w-lg md:text-base lg:text-lg">
              まだ書かれていない章。
            </p>
          </>
        ) : (
          <>
            <p className="text-[10px] tracking-[0.22em] text-pa-muted/55 uppercase md:text-[11px]">
              Channel
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-[#F3EDE3] md:text-4xl lg:text-5xl">
              {item.name}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-[#F3EDE3]/70 md:max-w-lg md:text-base lg:text-lg">
              {item.description}
            </p>
          </>
        )}
      </div>
    </div>
  );

  if (comingSoon) {
    return (
      <article className="border-t border-[rgba(148,170,195,0.22)] first:border-t-0">
        <div
          className="pointer-events-none w-full select-none py-14 first:pt-0 md:py-16"
          aria-disabled="true"
        >
          {body}
        </div>
      </article>
    );
  }

  return (
    <article className="border-t border-[rgba(148,170,195,0.22)] first:border-t-0">
      <a
        href={item.href!}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-14 transition-opacity hover:opacity-80 md:py-16"
      >
        {body}
      </a>
    </article>
  );
}

export function ReplyView() {
  return (
    <div className="relative z-10">
      <section className="letter-pad flex min-h-[100svh] flex-col justify-end pb-20 pt-28 md:justify-center md:pb-28 md:pt-36">
        <div className="max-w-xl md:max-w-2xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-[#F3EDE3] md:text-6xl lg:text-7xl">
            Reply
          </h1>
          <p className="mt-8 max-w-md whitespace-pre-line text-base leading-relaxed text-[#F3EDE3]/85 md:mt-10 md:max-w-lg md:text-lg lg:text-xl">
            {REPLY_LEAD}
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
            {SNS_ITEMS.map((item, i) => (
              <ReplyChapter key={item.id} index={i} item={item} />
            ))}

            <div id="feedback" className="scroll-mt-28 border-t border-[rgba(148,170,195,0.22)] py-14 md:py-16">
              <p className="text-[10px] tracking-[0.22em] text-pa-muted/55 uppercase md:text-[11px]">
                Feedback
              </p>
              <p className="mt-2 font-display text-2xl font-medium tracking-tight text-[#F3EDE3] md:text-3xl lg:text-4xl">
                Write back
              </p>
              <div className="mt-8">
                <FeedbackBlock />
              </div>
            </div>

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
