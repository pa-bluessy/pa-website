import Link from "next/link";
import type { Product } from "@/lib/data";

type Props = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: Props) {
  const comingSoon = product.status === "COMING SOON";

  const inner = (
    <>
      <p className="mb-6 text-[10px] tracking-[0.2em] text-pa-muted/60 uppercase">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="font-display text-2xl font-medium tracking-tight text-[#F3EDE3] md:text-[1.65rem]">
        {product.title}
      </h3>
      {!comingSoon ? (
        <p className="mt-4 text-sm leading-relaxed text-pa-muted">{product.description}</p>
      ) : (
        <p className="mt-4 text-sm text-pa-muted/50">{product.description}</p>
      )}
      {!comingSoon ? (
        <p className="mt-8 text-[10px] tracking-[0.18em] text-pa-muted/70 transition-opacity group-hover:text-[#F3EDE3]">
          Open →
        </p>
      ) : null}
    </>
  );

  const className =
    "group block h-full border border-pa-border/50 bg-[rgba(10,18,35,0.35)] p-6 transition-opacity duration-500 hover:border-pa-border md:p-7";

  if (comingSoon) {
    return <div className={`${className} opacity-70`}>{inner}</div>;
  }

  return (
    <Link href={product.href} className={className}>
      {inner}
    </Link>
  );
}
