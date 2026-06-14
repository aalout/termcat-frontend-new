import type { Metadata } from "next";
import { HomePageGate } from "@/views/home/ui/home-page-gate";

export const metadata: Metadata = {
  title: "TermCAT — анализ терминов",
  description: "TermCAT — выделение и перевод терминов в тексте",
};

export default function Page() {
  return <HomePageGate />;
}
