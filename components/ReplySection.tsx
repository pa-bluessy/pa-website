import Link from "next/link";
import { SNS_ITEMS } from "@/lib/data";
import { FeedbackBlock } from "./FeedbackModal";
import { Reveal } from "./Reveal";

/** Reply — a letter answers back (not "SNS") */
export function ReplySection() {
  return (
    <section className="relative w-full">
      <div className="letter-pad mx-auto chapter-rail">
        <Reveal>
          <h2 className="font-display text-3xl font-medium tracking-tight text-[#F3EDE3] md:text-4xl lg:text-5xl">
            Reply
          </h2>
        </Reveal>

        <ul className="mt-16 space-y-10 md:mt-20">
          {SNS_ITEMS.map((item, i) => {
            const comingSoon = item.comingSoon || !item.href;

            return (
              <Reveal key={item.id} delay={i * 70}>
                <li className="border-b border-pa-border/25">
                  {comingSoon ? (
                    <div
                      className="pointer-events-none w-full select-none py-5"
                      aria-disabled="true"
                    >
                      <p className="text-[10px] tracking-[0.18em] text-pa-muted/50">
                        {item.badge ?? "準備中"}
                      </p>
                      <p className="mt-2 font-display text-xl text-[#F3EDE3]/40 md:text-2xl">
                        {item.name}
                      </p>
                    </div>
                  ) : (
                    <a
                      href={item.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-5 transition-opacity hover:opacity-80"
                    >
                      <span className="font-display text-xl text-[#F3EDE3] md:text-2xl">
                        {item.name}
                      </span>
                    </a>
                  )}
                </li>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={220}>
          <div className="mt-14">
            <FeedbackBlock />
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-8">
            <Link
              href="/sns"
              className="text-xs tracking-[0.18em] text-pa-muted/60 transition-opacity hover:text-[#F3EDE3]"
            >
              More
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
