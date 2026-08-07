import type { Metadata } from "next";

import "@/styles/login.css";

export const metadata: Metadata = {
  title: "Reset password — Bea Ambassador",
  description: "Request a password reset link for your Bea ambassador account",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
