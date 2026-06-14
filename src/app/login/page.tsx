import type { Metadata } from "next";
import { LoginPage } from "@/views/login/ui/login-page";

export const metadata: Metadata = {
  title: "Вход — TermCAT",
};

export default function Page() {
  return <LoginPage />;
}
