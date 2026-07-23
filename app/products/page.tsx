import type { Metadata } from "next";
import { ProductsView } from "@/components/ProductsView";

export const metadata: Metadata = {
  title: "Products",
  description: "Products by Pa.",
};

export default function ProductsPage() {
  return <ProductsView />;
}
