import type { Metadata } from "next";
import { FixedSceneBackground } from "@/components/FixedSceneBackground";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LetterProvider } from "@/components/LetterExperience";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { cormorant, letterScript } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "pa. — A Letter at Midnight.",
    template: "%s | pa.",
  },
  description: "A letter at midnight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${letterScript.variable}`}>
      <body className="relative min-h-screen bg-transparent font-sans text-pa-text antialiased">
        <LetterProvider>
          <FixedSceneBackground />
          <Header />
          <main className="relative z-0">{children}</main>
          <Footer />
          <ScrollToTopButton />
        </LetterProvider>
      </body>
    </html>
  );
}
