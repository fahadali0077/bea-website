import type { Metadata } from "next";

import { adminLogin as adminConfig } from "@/lib/config";
import "@/styles/login.css";

export const metadata: Metadata = {
  title: adminConfig.meta.title,
  description: adminConfig.meta.description,
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
