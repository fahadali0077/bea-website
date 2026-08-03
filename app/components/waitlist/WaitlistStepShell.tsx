import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { WAITLIST_ARTBOARDS, type WaitlistStepArtboardId } from "@/lib/waitlist";

import { WaitlistProgress } from "./WaitlistProgress";

type Props = {
  artboardId: WaitlistStepArtboardId;
  backHref: string;
  title: string;
  subtitle?: string;
  titleSerif?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  bottom?: React.ReactNode;
};

export function WaitlistStepShell({
  artboardId,
  backHref,
  title,
  subtitle,
  titleSerif = false,
  children,
  footer,
  bottom,
}: Props) {
  const filledCount = WAITLIST_ARTBOARDS[artboardId].progressIndex ?? 0;

  return (
    <div className="waitlist-root waitlist-coded">
      <div className="waitlist-step-shell">
        <div className="waitlist-step-top">
          <div className="waitlist-mobile-wordmark" aria-label="Bubba">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/4x/BubbaLogo.png" alt="Bubba" style={{ display: "block", width: "auto", height: 26 }} />
          </div>
          <Link href={backHref} className="waitlist-back" aria-label="Go back">
            <ArrowLeft size={24} strokeWidth={1.75} />
          </Link>
          <WaitlistProgress filledCount={filledCount} />
        </div>

        <div className="waitlist-step-body">
          {artboardId === "3" ? (
            <p style={{ color: "#5b6c9b", fontSize: "18px", fontWeight: 500, marginBottom: "30px" }}>SELECT CITY</p>
          ) : null}
          {artboardId === "5" ? (
            <p style={{ color: "#5b6c9b", fontSize: "18px", fontWeight: 500, marginBottom: "30px" }}>CAMPUS</p>
          ) : null}
          {artboardId === "6" ? (
            <p style={{ color: "#5b6c9b", fontSize: "18px", fontWeight: 500, marginBottom: "30px" }}>AMBASSADOR CREDIT</p>
          ) : null}
          {artboardId === "4" ? (
            <p style={{ color: "#5b6c9b", fontSize: "18px", fontWeight: 500, marginBottom: "30px" }}>BASICS</p>
          ) : null}
          {artboardId === "7" ? (
            <p style={{ color: "#5b6c9b", fontSize: "18px", fontWeight: 500, marginBottom: "30px" }}>CONFIRM EMAIL</p>
          ) : null}
          <h1 className={"waitlist-step-title font-canela!" + (titleSerif ? " waitlist-step-title--serif" : "")}>
            {title}
          </h1>
          {subtitle ? <p className="waitlist-step-subtitle">{subtitle}</p> : null}
          {children}
          {footer}
        </div>

        {bottom ? <div className="waitlist-step-bottom">{bottom}</div> : null}
      </div>
    </div>
  );
}
