import Link from "next/link";
import { formatJournalDate, type JournalArticle } from "@/lib/journal";

type Props = {
  article: JournalArticle;
  href?: string;
};

function JournalCardBody({ article }: { article: JournalArticle }) {
  return (
    <>
      <div className="mb-2 flex items-center gap-4 text-[10px] tracking-[0.16em] text-pa-muted/55">
        <span>{article.platform}</span>
        <time dateTime={article.date}>{formatJournalDate(article.date)}</time>
      </div>
      <h3 className="font-display text-lg font-medium leading-snug text-[#F3EDE3] transition-opacity group-hover:opacity-80 md:text-xl">
        {article.title}
      </h3>
      {article.excerpt ? (
        <p className="mt-2 text-sm leading-relaxed text-pa-muted/80">{article.excerpt}</p>
      ) : null}
    </>
  );
}

const itemClass =
  "group block border-b border-pa-border/25 py-6 transition-opacity last:border-b-0";

export function JournalCard({ article, href }: Props) {
  if (href) {
    return (
      <Link href={href} className={itemClass}>
        <JournalCardBody article={article} />
      </Link>
    );
  }

  return (
    <div className={itemClass}>
      <JournalCardBody article={article} />
    </div>
  );
}
