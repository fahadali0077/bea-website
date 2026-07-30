"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { WAITLIST_PAGE_CONTENT } from "@/lib/waitlist-page-content";
import { validateWaitlistStep } from "@/lib/waitlist-validation";
import { useAppSelector } from "@/store/hooks";

import {
  WaitlistMarketFields,
  type WaitlistMarketFieldsHandle,
} from "./WaitlistMarketFields";

export function WaitlistMarketDesktop() {
  const content = WAITLIST_PAGE_CONTENT["3"];
  const router = useRouter();
  const form = useAppSelector(selectWaitlistForm);
  const [selectedCity, setSelectedCity] = useState<string | null>(form.marketId);
  const marketFieldsRef = useRef<WaitlistMarketFieldsHandle>(null);

  const handleContinue = () => {
    if (validateWaitlistStep("3", form)) {
      marketFieldsRef.current?.focusSearchInvalid();
      return;
    }

    router.push(content.cta.href);
  };

  return (
    <div className="wld-step3-container">
      <div className="wld-step3-left">
        <div className="wld-step3-top">
          <Link href="/waitlist" className="wld-step3-back">
            <ArrowLeft size={24} strokeWidth={2} />
          </Link>
          <div className="wld-step3-progress">
            <div className="wld-step3-progress-bar wld-step3-progress-bar--active" />
            <div className="wld-step3-progress-bar" />
            <div className="wld-step3-progress-bar" />
            <div className="wld-step3-progress-bar" />
          </div>
        </div>

        <div className="wld-step3-header">
          <h1 className="wld-step3-title">
            <span style={{ whiteSpace: "nowrap" }}>Which market do you want</span>
            <br />
            to join
          </h1>
          <p className="wld-step3-subtitle">{content.subtitle}</p>
        </div>

        <WaitlistMarketFields
          ref={marketFieldsRef}
          variant="desktop"
          selectedId={selectedCity}
          onSelectId={setSelectedCity}
        />

        <div className="wld-step3-actions">
          <button type="button" className="wld-step3-primary-btn" onClick={handleContinue}>
            {content.cta.label}
            <ArrowRight size={20} strokeWidth={2} style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
