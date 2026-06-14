import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/shared/styles/global.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TermCAT",
  description: "TermCAT — анализ терминов в тексте",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
