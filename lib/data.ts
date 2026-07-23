export const SITE = {
  name: "pa.",
  tagline: "the fusion of wisdom and instinct.",
  taglineLines: ["the fusion", "of wisdom", "and instinct"] as const,
  email: "pa.basement.b1@gmail.com",
  mailto: "mailto:pa.basement.b1@gmail.com",
} as const;

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/journal", label: "Journal" },
  { href: "/sns", label: "Reply" },
] as const;

export type Product = {
  id: string;
  title: string;
  label: string;
  status: "IN PROGRESS" | "COMING SOON" | "SHIPPED";
  description: string;
  hrefLabel: string;
  tags: string[];
  href: string;
  image: string;
  imageAlt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "mydawn",
    title: "MyDawn",
    label: "MYDAWN",
    status: "IN PROGRESS",
    description: "夢までの距離を、時間から設計し直す",
    hrefLabel: "View MyDawn",
    tags: ["iOS", "Productivity", "Time"],
    href: "/products/mydawn",
    image: "/images/mydawn-screenshot-1.png",
    imageAlt: "MyDawnアプリの入力画面スクリーンショット",
  },
  {
    id: "coming-soon-1",
    title: "Untitled",
    label: "UNWRITTEN",
    status: "COMING SOON",
    description: "まだ書かれていない章。",
    hrefLabel: "View",
    tags: [],
    href: "/products",
    image: "",
    imageAlt: "",
  },
  {
    id: "coming-soon-2",
    title: "Untitled",
    label: "UNWRITTEN",
    status: "COMING SOON",
    description: "まだ書かれていない章。",
    hrefLabel: "View",
    tags: [],
    href: "/products",
    image: "",
    imageAlt: "",
  },
];

export const PRODUCTS_LEAD =
  "机の上に置いたもの。\nまだ少ないが、確かなもの。";

export const JOURNAL_LEAD =
  "思考と記録。\n夜に残した断片。";

export const REPLY_LEAD =
  "手紙への返事。\n届いた声と、これから開く場所。";

export const NEXT_SIGNAL = {
  label: "Next",
  description: "未公開",
};

export const MYDAWN = {
  title: "MyDawn",
  status: "IN PROGRESS" as const,
  tagline: "夢までの距離を、時間から設計し直す",
  about:
    "MyDawnは、1日の時間を緊急度×重要度のマトリクスで可視化し、今やるべきことと未来への投資を区別するためのタイムマネジメントアプリです。入力・分析・振り返りを一つの流れにまとめ、思考を仕組みに変えます。",
  features: [
    {
      title: "緊急度×重要度マトリクス",
      description: "4象限で時間の消費・投資・錯覚・余白を可視化します。",
    },
    {
      title: "進行中タスクのトラッキング",
      description: "いま取り組んでいる作業をタイマー付きで記録できます。",
    },
    {
      title: "分析と振り返り",
      description: "日々の時間配分を振り返り、次の行動に活かせます。",
    },
    {
      title: "ダークテーマUI",
      description: "夜間でも見やすい、落ち着いたインターフェース。",
    },
  ],
  screenshots: [
    {
      src: "/images/mydawn-screenshot-1.png",
      alt: "MyDawn 入力画面 — 時間マトリクスと進行中タスク",
    },
    {
      src: "/images/mydawn-screenshot-2.png",
      alt: "MyDawn スクリーンショット 2",
    },
    {
      src: "/images/mydawn-screenshot-3.png",
      alt: "MyDawn スクリーンショット 3",
    },
  ],
  comingSoon: {
    title: "Coming Soon",
    description: "公開に向けて開発を進めています。アップデートはJournalやSNSでお知らせします。",
  },
};

export type SnsItem = {
  id: string;
  name: string;
  description: string;
  href: string | null;
  badge?: string;
  comingSoon?: boolean;
};

export const SNS_ITEMS: SnsItem[] = [
  {
    id: "x",
    name: "X",
    description: "日々の思考とAI活用Tipsを発信",
    href: "https://x.com/pa_basement",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "制作過程やプロダクトの解説動画",
    href: null,
    badge: "準備中",
    comingSoon: true,
  },
  {
    id: "threads",
    name: "Threads",
    description: "短文での日常と制作メモ",
    href: null,
    badge: "準備中",
    comingSoon: true,
  },
];

export const ABOUT_ITEMS = [
  {
    id: "story",
    title: "来歴",
    titleEn: "Story",
    label: "STORY",
    body: "これまでの選択と、現在に至るまでの記録。",
    hrefLabel: "View story",
  },
  {
    id: "favorite",
    title: "好きなもの",
    titleEn: "Favorites",
    label: "FAVORITES",
    body: "音楽、道具、空間。日常の解像度を上げるもの。",
    hrefLabel: "View favorites",
  },
  {
    id: "influence",
    title: "影響を受けたもの",
    titleEn: "Influences",
    label: "INFLUENCES",
    body: "人、作品、思想。判断の奥に残っているもの。",
    hrefLabel: "View influences",
  },
] as const;

export const ABOUT_LEAD =
  "知識と本能を、AIで統合する。\n弱さを武器に変え、摩擦を加速へ変える。";
// 本文は後で差し替え予定
export const ABOUT_UNWRITTEN = "まだ書かれていない章。";
