import type { Metadata } from "next";
import { ReplyView } from "@/components/ReplyView";

export const metadata: Metadata = {
  title: "Reply",
  description: "??????????????????????",
};

export default function SnsPage() {
  return <ReplyView />;
}
