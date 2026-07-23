import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { formatJournalDate, JOURNAL_ARTICLES } from "@/lib/journal";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = JOURNAL_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return { title: "Journal" };
  return {
    title: article.title,
    description: `${article.platform} — ${article.title}`,
  };
}

export default function JournalDetailPage({ params }: Props) {
  const article = JOURNAL_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  return (
    <PageShell>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-[10px] tracking-[0.16em] text-pa-muted/55">
        <span>{article.platform}</span>
        {article.category ? <span>{article.category}</span> : null}
      </div>
      <h1 className="font-display text-3xl font-medium tracking-tight text-[#F3EDE3] md:text-4xl">
        {article.title}
      </h1>
      <time dateTime={article.date} className="mt-4 block text-sm text-pa-muted">
        {formatJournalDate(article.date)}
      </time>

      {article.excerpt ? (
        <p className="mt-10 text-sm leading-relaxed text-pa-muted md:text-base">
          {article.excerpt}
        </p>
      ) : null}

      <p className="mt-8 text-sm leading-relaxed text-pa-muted md:text-base">
        本記事の全文は note で公開予定です。
      </p>

      <div className="mt-10 flex flex-wrap gap-6 text-sm">
        <a
          href={article.url}
          className="text-[#F3EDE3]/80 transition-opacity hover:opacity-100"
        >
          noteで読む →
        </a>
        <Link href="/journal" className="text-pa-muted transition-opacity hover:text-[#F3EDE3]">
          ← Journal
        </Link>
      </div>
    </PageShell>
  );
}
