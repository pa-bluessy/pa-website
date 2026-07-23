"use client";

import Link from "next/link";
import { LetterEndSensor } from "@/components/LetterEndSensor";
import { PRODUCTS, PRODUCTS_LEAD } from "@/lib/data";

function ProductChapter({
  index,
  product,
}: {
  index: number;
  product: (typeof PRODUCTS)[number];
}) {
  const comingSoon = product.status === "COMING SOON";

  return (
    <article
      id={product.id}
      className="scroll-mt-28 border-t border-[rgba(148,170,195,0.22)] py-14 first:border-t-0 first:pt-0 md:py-16"
    >
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <p className="w-10 shrink-0 font-display text-sm tracking-[0.16em] text-pa-muted/50 md:pt-1">
          {String(index + 1).padStart(2, "0")}
        </p>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.22em] text-pa-muted/55 uppercase">
            {product.label}
          </p>
          <h2
            className={`mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl ${
              comingSoon ? "text-[#F3EDE3]/45" : "text-[#F3EDE3]"
            }`}
          >
            {product.title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#F3EDE3]/70 md:text-base">
            {product.description}
          </p>
          {!comingSoon ? (
            <Link
              href={product.href}
              className="mt-8 inline-block text-sm tracking-wide text-pa-muted/70 transition-opacity hover:text-[#F3EDE3]"
            >
              {product.hrefLabel} →
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProductsView() {
  return (
    <div className="relative z-10">
      <section className="letter-pad flex min-h-[100svh] flex-col justify-end pb-20 pt-28 md:justify-center md:pb-24 md:pt-32">
        <div className="max-w-xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-[#F3EDE3] md:text-6xl">
            Products
          </h1>
          <p className="mt-8 max-w-md whitespace-pre-line text-base leading-relaxed text-[#F3EDE3]/85 md:mt-10 md:text-lg">
            {PRODUCTS_LEAD}
          </p>
          <p className="mt-10 text-[10px] tracking-[0.22em] text-pa-muted/60 uppercase">
            Scroll
          </p>
        </div>
      </section>

      <section className="relative min-h-[100svh]">
        <div className="pointer-events-none absolute inset-0 bg-[#03050B]/55" aria-hidden />
        <div className="letter-pad relative flex min-h-[100svh] flex-col justify-center py-20 md:py-28">
          <div className="max-w-2xl">
            {PRODUCTS.map((product, i) => (
              <ProductChapter key={product.id} index={i} product={product} />
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
