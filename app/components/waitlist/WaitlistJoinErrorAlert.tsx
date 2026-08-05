"use client";

import Link from "next/link";

import { resetWaitlistJoinState } from "@/features/waitlist/waitlist.slice";
import { useAppDispatch } from "@/store/hooks";

const ALREADY_ON_WAITLIST_MESSAGE = "This email is already on the waitlist.";

export function WaitlistJoinErrorAlert({ message }: { message: string }) {
  const dispatch = useAppDispatch();
  const isAlreadyOnWaitlist = message === ALREADY_ON_WAITLIST_MESSAGE;

  const handleClose = () => {
    dispatch(resetWaitlistJoinState());
  };

  return (
    <div className="waitlist-modal-overlay" onClick={handleClose}>
      <div
        className="waitlist-modal-card"
        role="alertdialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="waitlist-modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        <p className="waitlist-modal-body">{message}</p>
        {isAlreadyOnWaitlist ? (
          <Link href="/auth/login" className="waitlist-modal-cta">
            Log in instead
          </Link>
        ) : (
          <button type="button" className="waitlist-modal-cta" onClick={handleClose}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}