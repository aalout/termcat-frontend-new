import type { Metadata } from "next";
import { StandPage } from "@/views/stand/ui/stand-page";

export const metadata: Metadata = {
  title: "TermCAT — терминологический стенд",
  description: "Проверка точного соответствия терминов тексту",
};

export default function Page() {
  return <StandPage />;
}
