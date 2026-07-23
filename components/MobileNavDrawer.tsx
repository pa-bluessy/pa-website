"use client";

import Link from "next/link";
import { SNS_ITEMS } from "@/lib/data";
import { FeedbackOpenButton } from "./FeedbackModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  { href: "/about", num: "01", label: "About", sub: "Paについて" },
  { href: "/products", num: "02", label: "Products", sub: "つくったもの" },
  { href: "/journal", num: "03", label: "Journal", sub: "思考と記録" },
  { href: "/sns", num: "04", label: "Reply", sub: "つながる" },
] as const;

export function MobileNavDrawer({ open, onClose }: Props) {
  return (
    <div
      id="mobile-nav-drawer"
      className={`fixed inset-0 z-40 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-[#03050B]/55 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-label="メニューを閉じる"
        onClick={onClose}
      />

      <div
        className={`absolute inset-y-0 right-0 flex w-[min(100%,19rem)] flex-col border-l border-pa-border/25 bg-[rgba(3,5,11,0.92)] transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
      >
        <div className="flex items-start justify-between px-7 pb-2 pt-6">
          <div>
            <p className="font-display text-2xl font-medium tracking-tight text-[#F3EDE3]">
              Menu
            </p>
            <p className="mt-1 text-sm text-pa-muted/70">メニュー</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center text-[#F3EDE3]/60 transition-opacity hover:text-[#F3EDE3]"
            aria-label="閉じる"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-7 py-6" aria-label="モバイルメニュー">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="group flex gap-4 py-3.5 transition-opacity hover:opacity-75"
            >
              <span className="w-7 shrink-0 pt-1 text-[10px] tracking-[0.14em] text-pa-muted/50">
                {item.num}
              </span>
              <span>
                <span className="block font-display text-xl font-medium tracking-tight text-[#F3EDE3]">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-sm text-pa-muted/65">{item.sub}</span>
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-pa-border/20 px-7 py-8">
          <p className="font-display text-lg font-medium text-[#F3EDE3]">Elsewhere</p>
          <p className="mt-1 text-sm text-pa-muted/65">外部リンク</p>

          <ul className="mt-5 space-y-4">
            {SNS_ITEMS.map((item) =>
              item.comingSoon || !item.href ? (
                <li
                  key={item.id}
                  className="pointer-events-none select-none"
                  aria-disabled="true"
                >
                  <p className="text-[10px] tracking-[0.14em] text-pa-muted/45">
                    {item.badge ?? "準備中"}
                  </p>
                  <p className="mt-1 font-display text-base text-[#F3EDE3]/35">
                    {item.name}
                  </p>
                </li>
              ) : (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="font-display text-base text-[#F3EDE3]/80 transition-opacity hover:opacity-100"
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.name}
                  </a>
                </li>
              )
            )}
          </ul>

          <div className="mt-8 border-t border-pa-border/20 pt-6">
            <FeedbackOpenButton
              onBeforeOpen={onClose}
              className="text-left transition-opacity hover:opacity-80"
            >
              <span className="block font-display text-lg font-medium text-[#F3EDE3]">
                Feedback / Contact
              </span>
              <span className="mt-1 block text-sm text-pa-muted/65">
                ご意見・お問い合わせ
              </span>
            </FeedbackOpenButton>
          </div>
        </div>
      </div>
    </div>
  );
}
