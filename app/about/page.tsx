import type { Metadata } from "next";
import { AboutView } from "@/components/AboutView";

export const metadata: Metadata = {
  title: "About",
  description: "Pa.の来歴、好きなもの、影響を受けたもの。",
};

export default function AboutPage() {
  return <AboutView />;
}
