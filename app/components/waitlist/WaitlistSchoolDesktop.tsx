"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { selectWaitlistForm } from "@/features/waitlist/waitlist.selectors";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { WAITLIST_PAGE_CONTENT } from "@/lib/waitlist-page-content";
import { WAITLIST_ARTBOARDS } from "@/lib/waitlist";
import { validateWaitlistStep } from "@/lib/waitlist-validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { WaitlistFieldError } from "./WaitlistFieldError";
import { WaitlistSchoolFields } from "./WaitlistSchoolFields";

export function WaitlistSchoolDesktop() {
  const content = WAITLIST_PAGE_CONTENT["5"];
  const meta = WAITLIST_ARTBOARDS["5"];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector(selectWaitlistForm);
  const [stepError, setStepError] = useState<string | null>(null);

  const handleContinue = () => {
    const validationError = validateWaitlistStep("5", form);
    if (validationError) {
      setStepError(validationError);
      return;
    }

    setStepError(null);
    router.push(content.cta.href);
  };

  return (
    <div className="wld-step5-container">
      <div className="wld-step5-left">
        <div className="wld-step5-top">
          <Link href={meta.backHref!} className="wld-step5-back">
            <ArrowLeft size={24} strokeWidth={2} />
          </Link>
          <div className="wld-step5-progress">
            <div className="wld-step5-progress-bar wld-step5-progress-bar--active" />
            <div className="wld-step5-progress-bar wld-step5-progress-bar--active" />
            <div className="wld-step5-progress-bar wld-step5-progress-bar--active" />
            <div className="wld-step5-progress-bar" />
          </div>
        </div>

        <div className="wld-step5-header">
          <h1 className="wld-step5-title">{content.title}</h1>
        </div>

        <WaitlistSchoolFields variant="desktop" error={stepError} />

        <div className="wld-step5-actions">
          <button type="button" className="wld-step5-primary-btn" onClick={handleContinue}>
            {content.cta.label}
            <ArrowRight size={20} strokeWidth={2} style={{ marginLeft: "8px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
