"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { WAITLIST_PAGE_CONTENT } from "@/lib/waitlist-page-content";
import { WAITLIST_ARTBOARDS } from "@/lib/waitlist";
import { validateWaitlistStep } from "@/lib/waitlist-validation";
import { useAppSelector } from "@/store/hooks";

import {
  WaitlistNameFields,
  type WaitlistNameFieldsHandle,
} from "./WaitlistNameFields";

export function WaitlistNameDesktop() {
  const content = WAITLIST_PAGE_CONTENT["4"];
  const meta = WAITLIST_ARTBOARDS["4"];
  const router = useRouter();
  const form = useAppSelector(selectWaitlistForm);
  const nameFieldsRef = useRef<WaitlistNameFieldsHandle>(null);

  const handleContinue = () => {
    if (validateWaitlistStep("4", form)) {
      nameFieldsRef.current?.focusInvalid();
      return;
    }

    router.push(content.cta.href);
  };

  return (
    <div className="wld-step4-container">
      <div className="wld-step4-left">
        <div className="wld-step4-top">
          <Link href={meta.backHref!} className="wld-step4-back">
            <ArrowLeft size={24} strokeWidth={2} />
          </Link>
          <div className="wld-step4-progress">
            <div className="wld-step4-progress-bar wld-step4-progress-bar--active" />
            <div className="wld-step4-progress-bar wld-step4-progress-bar--active" />
            <div className="wld-step4-progress-bar" />
            <div className="wld-step4-progress-bar" />
          </div>
        </div>

        <div className="wld-step4-header">
          <h1 className="wld-step4-title">{content.title}</h1>
        </div>

        <WaitlistNameFields ref={nameFieldsRef} variant="desktop" />

        <div className="wld-step4-actions">
          <button type="button" className="wld-step4-primary-btn" onClick={handleContinue}>
            {content.cta.label}
            <ArrowRight size={20} strokeWidth={2} style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
