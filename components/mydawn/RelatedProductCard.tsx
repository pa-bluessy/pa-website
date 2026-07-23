import Link from "next/link";

export function RelatedProductCard() {
  return (
    <Link href="/products" className="block transition-opacity hover:opacity-80">
      <p className="text-[10px] tracking-[0.2em] text-pa-muted/55 uppercase">More</p>
      <p className="mt-2 font-display text-xl font-medium text-[#F3EDE3]">Products</p>
    </Link>
  );
}
