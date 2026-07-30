import type { Metadata } from "next";

import { login as loginConfig } from "@/lib/config";
import "@/styles/login.css";

export const metadata: Metadata = {
  title: loginConfig.meta.title,
  description: loginConfig.meta.description,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
