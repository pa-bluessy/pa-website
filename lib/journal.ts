import journalSample from "@/docs/content/journal-sample.json";

export type JournalArticle = {
  platform: string;
  title: string;
  date: string;
  thumbnail: string;
  url: string;
  slug?: string;
  excerpt?: string;
  category?: string;
};

const EXCERPTS: Record<string, { excerpt: string; category: string }> = {
  "AIとの壁打ちが人生を変えた話": {
    category: "Thinking",
    excerpt: "対話を重ねることで、曖昧な思考が軌道を持ち、行動可能な構造へ変わっていく記録。",
  },
  "MyDawn v0.2.0 リリース": {
    category: "Product",
    excerpt: "時間のマトリクスを磨き、観測精度を上げたアップデート。仕組み側の小さな前進。",
  },
  "XでAI活用Tipsを毎日発信中": {
    category: "Signal",
    excerpt: "断片的な気づきを連続信号として送出し、思考の周波数を保つ試み。",
  },
};

export const JOURNAL_ARTICLES: JournalArticle[] = journalSample.map(
  (article, index) => ({
    ...article,
    slug: `article-${index + 1}`,
    excerpt: EXCERPTS[article.title]?.excerpt,
    category: EXCERPTS[article.title]?.category ?? "Log",
  })
);

export function formatJournalDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
