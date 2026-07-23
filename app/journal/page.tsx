import type { Metadata } from "next";
import { JournalView } from "@/components/JournalView";

export const metadata: Metadata = {
  title: "Journal",
  description: "??????????????",
};

export default function JournalPage() {
  return <JournalView />;
}
