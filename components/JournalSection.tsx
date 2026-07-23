import Link from "next/link";
import { JOURNAL_ARTICLES } from "@/lib/journal";
import { JournalCard } from "./JournalCard";
import { Reveal } from "./Reveal";

export function JournalSection() {
  return (
    <section className="relative w-full">
      <div className="letter-pad mx-auto chapter-rail">
        <Reveal>
          <div className="mb-14 flex items-end justify-between md:mb-20">
            <h2 className="font-display text-3xl font-medium tracking-tight text-[#F3EDE3] md:text-4xl lg:text-5xl">
              Journal
            </h2>
            <Link
              href="/journal"
              className="text-xs tracking-[0.18em] text-pa-muted/60 transition-opacity hover:text-[#F3EDE3]"
            >
              All
            </Link>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          {JOURNAL_ARTICLES.map((article, i) => (
            <Reveal key={article.slug} delay={i * 80}>
              <JournalCard article={article} href={`/journal/${article.slug}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
