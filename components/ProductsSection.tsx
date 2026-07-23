import Link from "next/link";
import { PRODUCTS } from "@/lib/data";
import { Reveal } from "./Reveal";

/** Desk objects as chapters — not cards */
export function ProductsSection() {
  return (
    <section className="relative w-full">
      <div className="letter-pad mx-auto chapter-rail">
        <Reveal>
          <h2 className="font-display text-3xl font-medium tracking-tight text-[#F3EDE3] md:text-4xl lg:text-5xl">
            Products
          </h2>
        </Reveal>

        <ul className="mt-14 md:mt-20">
          {PRODUCTS.map((product, i) => {
            const comingSoon = product.status === "COMING SOON";
            const body = (
              <div className="flex flex-col gap-5 md:flex-row md:gap-14 lg:gap-16">
                <p className="w-10 shrink-0 font-display text-sm tracking-[0.16em] text-pa-muted/50 md:w-12 md:pt-1 md:text-base">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] tracking-[0.22em] text-pa-muted/55 uppercase md:text-[11px]">
                    {product.label}
                  </p>
                  <h3
                    className={`mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl lg:text-4xl ${
                      comingSoon ? "text-[#F3EDE3]/45" : "text-[#F3EDE3]"
                    }`}
                  >
                    {product.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F3EDE3]/70 md:max-w-lg md:text-base">
                    {product.description}
                  </p>
                  {!comingSoon ? (
                    <span className="mt-6 inline-block text-sm tracking-wide text-pa-muted/70">
                      {product.hrefLabel} →
                    </span>
                  ) : null}
                </div>
              </div>
            );

            return (
              <Reveal key={product.id} delay={i * 90}>
                <li className="border-t border-[rgba(148,170,195,0.22)] py-12 first:border-t-0 first:pt-0 md:py-14">
                  {comingSoon ? (
                    <div>{body}</div>
                  ) : (
                    <Link href={product.href} className="group block transition-opacity hover:opacity-80">
                      {body}
                    </Link>
                  )}
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
