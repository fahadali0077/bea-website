import type { ReactNode } from "react";

import { type BubbaNavKey } from "@/lib/bubba-content";

import { BubbaAnnouncement } from "./BubbaAnnouncement";
import { BubbaCookieBar } from "./BubbaCookieBar";
import { BubbaFooter } from "./BubbaFooter";
import { BubbaNav } from "./BubbaNav";

type Props = {
  children: ReactNode;
  active?: BubbaNavKey;
  /** Legal and contact pages aren't selling, so they skip the capture card. */
  showCapture?: boolean;
};

/**
 * Every page wears the same chrome: announcement strip, nav (with the mobile
 * drawer), footer and cookie sheet. Pages supply only their main content.
 */
export function BubbaShell({
  children,
  active = "home",
  showCapture = true,
}: Props) {
  return (
    <div className="bb-page">
      <BubbaAnnouncement />
      <BubbaNav active={active} />

      <main className="bb-main">{children}</main>

      <BubbaFooter showCapture={showCapture} />
      <BubbaCookieBar />
    </div>
  );
}
