"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { WAITING_ROOM_HREF } from "@/lib/waitlist-errors";

type Props = {
  onClose: () => void;
};

export function JoinAlreadyOnWaitlistModal({ onClose }: Props) {
  const router = useRouter();
  const actionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    actionRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const goToWaitingRoom = () => {
    onClose();
    router.push(WAITING_ROOM_HREF);
  };

  return (
    <div className="jn-modal-overlay" onClick={onClose}>
      <div
        className="jn-modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="jn-already-waitlist-title"
        aria-describedby="jn-already-waitlist-message"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="jn-modal-icon" aria-hidden="true">
          <AlertCircle size={22} strokeWidth={2} />
        </span>

        <h2 className="jn-modal-title" id="jn-already-waitlist-title">
          You&apos;re already on the list
        </h2>

        <p className="jn-modal-message" id="jn-already-waitlist-message">
          This email is already on the waitlist. Head to the waiting room to
          check your place and keep earning rewards.
        </p>

        <div className="jn-modal-actions">
          <button
            ref={actionRef}
            type="button"
            className="jn-modal-cta"
            onClick={goToWaitingRoom}
          >
            Go to waiting room
          </button>
          <button type="button" className="jn-modal-dismiss" onClick={onClose}>
            Stay on this page
          </button>
        </div>
      </div>
    </div>
  );
}
