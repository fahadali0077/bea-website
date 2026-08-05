"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";

import { joinWaitlist } from "@/features/waitlist/waitlist.slice";
import {
  selectWaitlistForm,
  selectWaitlistJoinError,
  selectWaitlistJoinStatus,
} from "@/features/waitlist/waitlist.selectors";
import { updateWaitlistForm } from "@/features/waitlist/waitlist.slice";
import { WAITLIST_PAGE_CONTENT } from "@/lib/waitlist-page-content";
import { WAITLIST_ARTBOARDS, type WaitlistStepArtboardId } from "@/lib/waitlist";
import { validateWaitlistStep } from "@/lib/waitlist-validation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useListPublicAmbassadorsQuery } from "@/features/api/apiSlice";

import { WaitlistContinueButton } from "./WaitlistContinueButton";
import { WaitlistFieldError } from "./WaitlistFieldError";
import { WaitlistStepImage } from "./WaitlistStepImage";
import { WaitlistJoinErrorAlert } from "./WaitlistJoinErrorAlert";
import {
  WaitlistMarketFields,
  type WaitlistMarketFieldsHandle,
} from "./WaitlistMarketFields";
import {
  WaitlistNameFields,
  type WaitlistNameFieldsHandle,
} from "./WaitlistNameFields";
import { WaitlistSchoolFields } from "./WaitlistSchoolFields";
import { WaitlistStepShell } from "./WaitlistStepShell";

const emptySubscribe = () => () => {};

type Props = {
  artboardId: WaitlistStepArtboardId;
};

export function WaitlistStepMobile({ artboardId }: Props) {
  const content = WAITLIST_PAGE_CONTENT[artboardId];
  const meta = WAITLIST_ARTBOARDS[artboardId];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useAppSelector(selectWaitlistForm);
  const joinStatus = useAppSelector(selectWaitlistJoinStatus);
  const joinError = useAppSelector(selectWaitlistJoinError);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(form.marketId);
  const [ambassadorChoice, setAmbassadorChoice] = useState<"selected" | "skipped" | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const marketFieldsRef = useRef<WaitlistMarketFieldsHandle>(null);
  const nameFieldsRef = useRef<WaitlistNameFieldsHandle>(null);
  const ambassadorQuery = useListPublicAmbassadorsQuery(
    {},
    { skip: artboardId !== "6" },
  );

  const handleContinue = async () => {
    if (artboardId === "6" && !ambassadorChoice) {
      setStepError("Select an ambassador or choose that you were not invited.");
      return;
    }

    const validationError = validateWaitlistStep(artboardId, form);
    if (validationError) {
      if (artboardId === "3") {
        marketFieldsRef.current?.focusSearchInvalid();
        return;
      }
      if (artboardId === "4") {
        nameFieldsRef.current?.focusInvalid();
        return;
      }
      setStepError(validationError);
      return;
    }

    setStepError(null);

    if (artboardId === "7") {
      const result = await dispatch(joinWaitlist());
      if (joinWaitlist.fulfilled.match(result)) {
        router.push(`/waitlist/8?position=${result.payload.waitlistPosition}`);
      }
      return;
    }

    router.push(content.cta.href);
  };

  return (
    <WaitlistStepShell
      artboardId={artboardId}
      backHref={meta.backHref!}
      title={content.title}
      subtitle={content.subtitle}
      titleSerif={content.titleSerif}
      bottom={
        <>
          {content.image ? <WaitlistStepImage image={content.image} /> : null}
          {artboardId === "3" ? (
            <Link href={content.cta.href} className="waitlist-skip-market-link font-sfpro!">
              Continue without a market
            </Link>
          ) : null}
          <WaitlistContinueButton
            label={content.cta.label}
            onContinue={handleContinue}
            loading={artboardId === "7" && joinStatus === "loading"}
          />
          <WaitlistFieldError message={stepError} />
          {joinError && artboardId === "7" ? <WaitlistJoinErrorAlert message={joinError} /> : null}
        </>
      }
    >
      {artboardId === "3" && (
        <WaitlistMarketFields
          ref={marketFieldsRef}
          variant="mobile"
          selectedId={selectedCity}
          onSelectId={setSelectedCity}
        />
      )}

      {artboardId === "4" && <WaitlistNameFields ref={nameFieldsRef} variant="mobile" />}

      {artboardId === "5" && (
        <WaitlistSchoolFields variant="mobile" error={stepError} />
      )}

      {artboardId === "6" && (
        <div className="waitlist-ambassador-list">
          {mounted && ambassadorQuery.isLoading ? <p className="waitlist-market-loading">Loading ambassadors…</p> : null}
          {mounted && ambassadorQuery.isError ? <p className="waitlist-market-error">Unable to load ambassadors. Please try again.</p> : null}
          {mounted && !ambassadorQuery.isLoading && !ambassadorQuery.isError && ambassadorQuery.data?.map((ambassador) => {
            const selected = form.referralCode === ambassador.referralCode;
            return (
              <button
                key={ambassador.id}
                type="button"
                className={"waitlist-ambassador-card" + (selected ? " waitlist-ambassador-card--selected" : "")}
                onClick={() => {
                  setAmbassadorChoice("selected");
                  setStepError(null);
                  dispatch(updateWaitlistForm({ referralCode: ambassador.referralCode }));
                }}
              >
                <span className="waitlist-ambassador-avatar">MC</span>
                <span>
                  <strong className="font-sfpro!">{ambassador.fullName}</strong>
                  <small className="font-sfpro!">{ambassador.schoolName ?? ambassador.marketName ?? "Bea Ambassador"}</small>
                </span>
                {selected ? <span className="waitlist-ambassador-check">✓</span> : null}
              </button>
            );
          })}
          {mounted && !ambassadorQuery.isLoading && !ambassadorQuery.isError && ambassadorQuery.data?.length === 0 ? <p className="waitlist-market-loading">No ambassadors are available for this area.</p> : null}
          <button type="button" className="waitlist-ambassador-skip" onClick={() => {
            setAmbassadorChoice("skipped");
            setStepError(null);
            dispatch(updateWaitlistForm({ referralCode: null }));
          }}>
            I wasn&apos;t invited by an ambassador
          </button>
        </div>
      )}

      {artboardId === "7" && (
        <>
          <div className="waitlist-search-block">
            <input
              id="email"
              type="email"
              className="waitlist-box-input"
              placeholder="you@email.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                dispatch(updateWaitlistForm({ email: event.target.value }))
              }
            />
          </div>
        </>
      )}
    </WaitlistStepShell>
  );
}
