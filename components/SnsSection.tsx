import Link from "next/link";
import { SNS_ITEMS } from "@/lib/data";
import { FeedbackBlock } from "./FeedbackModal";
import { Reveal } from "./Reveal";
import { SnsCard } from "./SnsCard";

export function SnsSection() {
  return (
    <section className="relative w-full">
      <div className="mx-auto max-w-6xl px-[30px] md:px-[42px]">
        <Reveal>
          <div className="mb-12 flex items-end justify-between md:mb-14">
            <h2 className="font-display text-3xl font-medium tracking-tight text-[#F3EDE3] md:text-4xl">
              SNS
            </h2>
            <Link
              href="/sns"
              className="text-xs tracking-[0.18em] text-pa-muted/70 transition-opacity hover:text-[#F3EDE3]"
            >
              View all
            </Link>
          </div>
        </Reveal>

        <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
          {SNS_ITEMS.map((item, i) => (
            <Reveal key={item.id} delay={i * 70}>
              <SnsCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <FeedbackBlock />
        </Reveal>
      </div>
    </section>
  );
}
