import type { Metadata } from "next";
import { ComingSoonCard } from "@/components/mydawn/ComingSoonCard";
import { FeatureListItem } from "@/components/mydawn/FeatureListItem";
import { ProductDetailHeader } from "@/components/mydawn/ProductDetailHeader";
import { RelatedProductCard } from "@/components/mydawn/RelatedProductCard";
import { ScreenshotCarousel } from "@/components/mydawn/ScreenshotCarousel";
import { PageShell } from "@/components/PageShell";
import { MYDAWN } from "@/lib/data";

export const metadata: Metadata = {
  title: "MyDawn",
  description: MYDAWN.about,
};

export default function MyDawnPage() {
  return (
    <PageShell width="wide">
      <ProductDetailHeader />

      <section className="mt-16 border-t border-pa-border/25 pt-14 md:mt-20 md:pt-16">
        <h2 className="mb-8 font-display text-2xl font-medium tracking-tight text-[#F3EDE3] md:text-3xl">
          Features
        </h2>
        <ul>
          {MYDAWN.features.map((feature, index) => (
            <FeatureListItem
              key={feature.title}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-pa-border/25 pt-14 md:mt-20 md:pt-16">
        <h2 className="mb-8 font-display text-2xl font-medium tracking-tight text-[#F3EDE3] md:text-3xl">
          Screenshots
        </h2>
        <ScreenshotCarousel shots={MYDAWN.screenshots} />
      </section>

      <section className="mt-16 grid gap-12 border-t border-pa-border/25 pt-14 md:mt-20 md:grid-cols-[1.2fr_0.8fr] md:gap-14 md:pt-16">
        <ComingSoonCard
          title={MYDAWN.comingSoon.title}
          description={MYDAWN.comingSoon.description}
        />
        <div>
          <RelatedProductCard />
        </div>
      </section>
    </PageShell>
  );
}
