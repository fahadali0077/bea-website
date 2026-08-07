import type { Metadata } from "next";

import "@/styles/login.css";

export const metadata: Metadata = {
  title: "Reset password — Bea Ambassador",
  description: "Choose a new password for your Bea ambassador account",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
