import { EndingSection } from "@/components/EndingSection";
import { Hero } from "@/components/Hero";
import { JournalSection } from "@/components/JournalSection";
import { LetterBody } from "@/components/LetterExperience";
import { ProductsSection } from "@/components/ProductsSection";
import { ReplySection } from "@/components/ReplySection";

export default function HomePage() {
  return (
    <LetterBody>
      {/* 1 Hero */}
      <div className="section-veil scroll-stage !py-0">
        <Hero />
      </div>

      <div className="relative z-10">
        <div className="section-veil scroll-stage">
          <ProductsSection />
        </div>

        <div className="section-veil scroll-stage">
          <JournalSection />
        </div>

        <div className="section-veil scroll-stage">
          <ReplySection />
        </div>
      </div>

      <EndingSection />
    </LetterBody>
  );
}
